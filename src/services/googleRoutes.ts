
const GET_MULTIPLE_ROUTES_URL = 'https://getmultipleroutes-pqkfck5nsa-uc.a.run.app';

export type TravelMode = 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT'

export interface LatLng {
  lat: number
  lng: number
}

export interface RouteStep {
  index: number
  lat: number
  lng: number
  instruction: string
}

export interface RouteInfo {
  index: number
  label: string
  distanceMeters: number
  durationSeconds: number
  steps: RouteStep[]
  polylineCoords: LatLng[]
}

export async function getMultipleRoutes(
  originAddr: string,
  destAddr: string,
  travelMode: TravelMode = 'DRIVE'
): Promise<RouteInfo[]> {
  try {
    const res = await fetch(GET_MULTIPLE_ROUTES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originAddr, destAddr, travelMode }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erro ao buscar rotas');
    }

    const data = await res.json();
    return data.routes;
  } catch (error) {
    console.error("Erro ao buscar rotas via Firebase Functions:", error);
    throw error;
  }
}


