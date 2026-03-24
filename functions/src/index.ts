/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Limites de instâncias para evitar picos de faturamento (DDoS/Abuso)
setGlobalOptions({ 
  maxInstances: 10,
  concurrency: 80,
  timeoutSeconds: 60
});

// Replace this with your actual secure handling (e.g. Secret Manager)
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  logger.error('Google Maps API key is not configured');
}

const ALLOWED_ORIGINS = [
  'https://caminhosegurobr.web.app',
  'http://localhost:5173', // Para desenvolvimento local
  'http://localhost:4173'
];

// Helper para verificar a origem e bloquear chamadas diretas (cURL, Postman)
function checkOrigin(req: any, res: any): boolean {
  const origin = req.headers.origin;
  
  // Se não houver Origin (chamadas de servidor/Postman/cURL não enviam por padrão)
  // ou se a origem não estiver na lista permitida, bloqueamos.
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    logger.warn(`Acesso negado para a origem: ${origin || 'Sem Origin (Chamada direta)'}`);
    res.status(403).json({ error: 'Forbidden: Acesso negado.' });
    return false;
  }
  return true;
}

export const getGoogleMapsKey = onRequest({ cors: ALLOWED_ORIGINS }, (req, res) => {
  if (!checkOrigin(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.json({ key: API_KEY });
});


// --- Types ---
type TravelMode = 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteStep {
  index: number;
  lat: number;
  lng: number;
  instruction: string;
}

interface RouteInfo {
  index: number;
  label: string;
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
  polylineCoords: LatLng[];
}

// --- Helpers ---
function decodePolyline(encoded: string): LatLng[] {
  const coords: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let result = 0, shift = 0, b: number;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;
    result = 0; shift = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;
    coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coords;
}

async function geocodeQuery(query: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&region=br&components=country:BR&key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

async function geocode(address: string): Promise<LatLng> {
  let data = await geocodeQuery(address);

  if (data.status !== 'OK') {
    const temCidade = /são paulo|rio de janeiro|belo horizonte|curitiba|salvador|, sp|, rj|, mg/i.test(address);
    if (!temCidade) {
      data = await geocodeQuery(`${address}, São Paulo, SP`);
    }
  }

  if (data.status !== 'OK') {
    throw new Error(
      `Endereço não encontrado: "${address}".\nTente incluir o bairro ou cidade — ex: "Infinity Tower, São Paulo".`
    );
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

const FIELD_MASK =
  'routes.description,routes.distanceMeters,routes.duration,routes.legs.steps.navigationInstruction,routes.legs.steps.startLocation,routes.polyline.encodedPolyline';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseRoute(route: any, index: number, labelOverride?: string): RouteInfo {
  const raw = labelOverride ?? (route.description as string | undefined) ?? '';
  const label = raw
    ? (raw.toLowerCase().startsWith('via') ? raw : `Via ${raw}`)
    : (index === 0 ? 'Rota Principal' : `Rota Alternativa ${String.fromCharCode(64 + index)}`);

  const steps: RouteStep[] = [];
  for (const leg of route.legs ?? []) {
    for (let j = 0; j < (leg.steps ?? []).length; j++) {
      const step = leg.steps[j];
      steps.push({
        index: j + 1,
        lat: step.startLocation?.latLng?.latitude ?? 0,
        lng: step.startLocation?.latLng?.longitude ?? 0,
        instruction: step.navigationInstruction?.instructions ?? 'Siga em frente',
      });
    }
  }

  const encoded = route.polyline?.encodedPolyline ?? '';
  const durationStr: string = route.duration ?? '0s';

  return {
    index,
    label: label.charAt(0).toUpperCase() + label.slice(1),
    distanceMeters: route.distanceMeters ?? 0,
    durationSeconds: parseInt(durationStr.replace('s', ''), 10),
    steps,
    polylineCoords: encoded ? decodePolyline(encoded) : [],
  };
}

async function fetchRoutes(
  originLoc: LatLng,
  destLoc: LatLng,
  travelMode: TravelMode,
  routeModifiers: Record<string, unknown> = {},
  labelOverride?: string
): Promise<RouteInfo[]> {
  const isTransit = travelMode === 'TRANSIT';

  const body: Record<string, unknown> = {
    origin: { location: { latLng: { latitude: originLoc.lat, longitude: originLoc.lng } } },
    destination: { location: { latLng: { latitude: destLoc.lat, longitude: destLoc.lng } } },
    travelMode,
    ...(!isTransit ? { computeAlternativeRoutes: true } : {}),
    ...(travelMode === 'DRIVE' ? { routingPreference: 'TRAFFIC_AWARE' } : {}),
    ...(travelMode === 'DRIVE' && Object.keys(routeModifiers).length > 0 ? { routeModifiers } : {}),
  };

  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY || '',
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.routes?.length) return [];

  return (data.routes as any[]).map((r, i) =>
    parseRoute(r, i, i === 0 && labelOverride ? labelOverride : undefined)
  );
}

function deduplicate(routes: RouteInfo[]): RouteInfo[] {
  const seen = new Set<string>();
  return routes.filter(r => {
    const pts = r.polylineCoords;
    if (pts.length === 0) return false;
    const mid1 = pts[Math.floor(pts.length * 0.25)];
    const mid2 = pts[Math.floor(pts.length * 0.5)];
    const mid3 = pts[Math.floor(pts.length * 0.75)];
    const key = `${mid1.lat.toFixed(3)},${mid2.lat.toFixed(3)},${mid3.lat.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const getMultipleRoutes = onRequest({ cors: ALLOWED_ORIGINS }, async (req, res) => {
  if (!checkOrigin(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { originAddr, destAddr, travelMode = 'DRIVE' } = req.body;

    if (!originAddr || !destAddr) {
      res.status(400).json({ error: 'originAddr and destAddr are required' });
      return;
    }

    const [originLoc, destLoc] = await Promise.all([geocode(originAddr), geocode(destAddr)]);

    const calls: Promise<RouteInfo[]>[] =
      travelMode === 'DRIVE'
        ? [
            fetchRoutes(originLoc, destLoc, travelMode as TravelMode),
            fetchRoutes(originLoc, destLoc, travelMode as TravelMode, { avoidHighways: true }, 'Sem rodovias'),
            fetchRoutes(originLoc, destLoc, travelMode as TravelMode, { avoidTolls: true }, 'Sem pedágios'),
          ]
        : [fetchRoutes(originLoc, destLoc, travelMode as TravelMode)];

    const results = await Promise.allSettled(calls);

    const candidates: RouteInfo[] = [];
    results.forEach((r, callIndex) => {
      if (r.status === 'fulfilled' && r.value.length > 0) {
        const toAdd = callIndex === 0 ? r.value : [r.value[0]];
        toAdd.forEach(route => candidates.push(route));
      }
    });

    if (candidates.length === 0) {
      res.status(404).json({ error: 'Nenhuma rota encontrada.' });
      return;
    }

    const unique = deduplicate(candidates).slice(0, 3);
    const finalRoutes = unique.map((r, i) => ({ ...r, index: i }));

    res.json({ routes: finalRoutes });
  } catch (error: any) {
    logger.error("Error getting routes", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

