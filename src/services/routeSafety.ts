import ocorrencias from '../../data/ocorrencias_agrupadas.json'
import type { LatLng } from './googleRoutes'

export interface Ocorrencia {
  LOGRADOURO: string
  LATITUDE: number
  LONGITUDE: number
  QTD_OCORRENCIAS: number
}

export interface OcorrenciaNoPath {
  logradouro: string
  totalOcorrencias: number
  distanciaMetros: number
  ordemNaRota: number
  lat: number
  lng: number
}

export interface SafetyResult {
  totalOcorrencias: number
  ocorrenciasEncontradas: OcorrenciaNoPath[]
}

function haversineMetros(a: LatLng, b: { LATITUDE: number; LONGITUDE: number }): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.LATITUDE - a.lat)
  const dLng = toRad(b.LONGITUDE - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const c = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.LATITUDE)) * sinDLng * sinDLng
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

export function cruzarComOcorrencias(polylineCoords: LatLng[], raioMetros = 100): SafetyResult {
  if (polylineCoords.length === 0) return { totalOcorrencias: 0, ocorrenciasEncontradas: [] }

  // Bounding box da rota com buffer de ~1.5km para pré-filtrar o dataset de 56k entradas
  const buf = 0.015
  const lats = polylineCoords.map(p => p.lat)
  const lngs = polylineCoords.map(p => p.lng)
  const minLat = Math.min(...lats) - buf
  const maxLat = Math.max(...lats) + buf
  const minLng = Math.min(...lngs) - buf
  const maxLng = Math.max(...lngs) + buf

  const candidates = (ocorrencias as Ocorrencia[]).filter(
    o => o.LATITUDE >= minLat && o.LATITUDE <= maxLat && o.LONGITUDE >= minLng && o.LONGITUDE <= maxLng
  )

  // Agrupa por logradouro, mantém ponto mais cedo da rota
  const porRua = new Map<string, { totalOcorrencias: number; distanciaMetros: number; ordemNaRota: number; lat: number; lng: number }>()

  for (const ocorrencia of candidates) {
    let menorDistancia = Infinity
    let indiceMaisProximo = -1

    for (let i = 0; i < polylineCoords.length; i++) {
      const dist = haversineMetros(polylineCoords[i], ocorrencia)
      if (dist < menorDistancia) {
        menorDistancia = dist
        indiceMaisProximo = i
      }
      if (menorDistancia <= raioMetros) break // encontrou — para cedo
    }

    if (menorDistancia <= raioMetros) {
      const rua = ocorrencia.LOGRADOURO
      const existente = porRua.get(rua)
      if (!existente) {
        porRua.set(rua, {
          totalOcorrencias: ocorrencia.QTD_OCORRENCIAS,
          distanciaMetros: Math.round(menorDistancia),
          ordemNaRota: indiceMaisProximo,
          lat: ocorrencia.LATITUDE,
          lng: ocorrencia.LONGITUDE,
        })
      } else {
        // Mantém a posição da ocorrência com mais registros
        const keepPos = ocorrencia.QTD_OCORRENCIAS > existente.totalOcorrencias
        porRua.set(rua, {
          totalOcorrencias: existente.totalOcorrencias + ocorrencia.QTD_OCORRENCIAS,
          distanciaMetros: Math.min(existente.distanciaMetros, Math.round(menorDistancia)),
          ordemNaRota: Math.min(existente.ordemNaRota, indiceMaisProximo),
          lat: keepPos ? ocorrencia.LATITUDE : existente.lat,
          lng: keepPos ? ocorrencia.LONGITUDE : existente.lng,
        })
      }
    }
  }

  const ocorrenciasEncontradas: OcorrenciaNoPath[] = Array.from(porRua.entries())
    .map(([logradouro, dados]) => ({ logradouro, ...dados }))
    .sort((a, b) => a.ordemNaRota - b.ordemNaRota)

  const totalOcorrencias = ocorrenciasEncontradas.reduce((s, o) => s + o.totalOcorrencias, 0)
  return { totalOcorrencias, ocorrenciasEncontradas }
}
