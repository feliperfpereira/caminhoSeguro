import { useEffect, useRef } from 'react'
import type { LatLng } from '../services/googleRoutes'
import type { OcorrenciaNoPath } from '../services/routeSafety'
import { loadMapsScript } from '../services/mapsLoader'

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

interface Props {
  polylineCoords: LatLng[]
  occurrences?: OcorrenciaNoPath[]
  className?: string
}

export default function RouteMap({ polylineCoords, occurrences = [], className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!polylineCoords.length || !containerRef.current) return
    const container = containerRef.current

    loadMapsScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const google = (window as any).google

      const map = new google.maps.Map(container, {
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_STYLES,
      })

      const path = polylineCoords.map(p => ({ lat: p.lat, lng: p.lng }))

      // Rota principal
      new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#2EC4B6',
        strokeOpacity: 1,
        strokeWeight: 5,
        map,
      })

      // Marcador de origem
      new google.maps.Marker({
        position: path[0],
        map,
        title: 'Origem',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#2EC4B6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
      })

      // Marcador de destino
      new google.maps.Marker({
        position: path[path.length - 1],
        map,
        title: 'Destino',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#ff5964',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
      })

      // Ocorrências: círculo de perigo + marcador clicável
      const infoWindow = new google.maps.InfoWindow()

      occurrences.forEach(occ => {
        const pos = { lat: occ.lat, lng: occ.lng }

        // Círculo de perigo — raio proporcional ao número de ocorrências
        const radius = Math.min(40 + occ.totalOcorrencias * 3, 250)
        new google.maps.Circle({
          center: pos,
          radius,
          fillColor: '#ff5964',
          fillOpacity: 0.18,
          strokeColor: '#ff5964',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          map,
        })

        // Ponto central clicável
        const marker = new google.maps.Marker({
          position: pos,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: '#ff5964',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
          },
        })

        marker.addListener('click', () => {
          infoWindow.setContent(`
            <div style="font-family: Manrope, sans-serif; padding: 4px 2px; min-width: 160px;">
              <div style="font-weight: 700; font-size: 13px; color: #1a1a2e; margin-bottom: 4px;">
                ${occ.logradouro}
              </div>
              <div style="font-size: 12px; color: #ff5964; font-weight: 600;">
                ⚠️ ${occ.totalOcorrencias} ocorrência${occ.totalOcorrencias > 1 ? 's' : ''} registrada${occ.totalOcorrencias > 1 ? 's' : ''}
              </div>
            </div>
          `)
          infoWindow.open(map, marker)
        })
      })

      // Ajusta zoom para caber a rota
      const bounds = new google.maps.LatLngBounds()
      path.forEach(p => bounds.extend(p))
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 })
    })
  }, [polylineCoords, occurrences])

  return <div ref={containerRef} className={className} />
}
