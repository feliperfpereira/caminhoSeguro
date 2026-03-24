import { useState } from 'react'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import RouteSelectionPage from './pages/RouteSelectionPage'
import RouteSafetyPage from './pages/RouteSafetyPage'
import PitchPage from './pages/PitchPage'
import type { RouteInfo, TravelMode } from './services/googleRoutes'
import type { SafetyResult } from './services/routeSafety'

type Page = 'welcome' | 'home' | 'routes' | 'safety'

interface SearchParams {
  origin: string
  destination: string
  travelMode: TravelMode
}

interface SelectedRoute {
  route: RouteInfo
  safety: SafetyResult
}

function parseUrlParams(): SearchParams | null {
  const p = new URLSearchParams(window.location.search)
  const origin = p.get('origin')
  const destination = p.get('destination')
  const mode = p.get('mode') as TravelMode | null
  if (!origin || !destination) return null
  return { origin, destination, travelMode: mode ?? 'DRIVE' }
}

export default function App() {
  if (window.location.pathname === '/pitch') return <PitchPage />

  const urlParams = parseUrlParams()

  const [page, setPage] = useState<Page>(urlParams ? 'routes' : 'welcome')
  const [searchParams, setSearchParams] = useState<SearchParams | null>(urlParams)
  const [selected, setSelected] = useState<SelectedRoute | null>(null)

  function handleSearch(params: SearchParams) {
    setSearchParams(params)
    setPage('routes')
  }

  function handleSelect(routeWithSafety: RouteInfo & { safety: SafetyResult }) {
    setSelected({ route: routeWithSafety, safety: routeWithSafety.safety })
    setPage('safety')
  }

  if (page === 'welcome')
    return <WelcomePage onStart={() => setPage('home')} />

  if (page === 'home')
    return <HomePage onSearch={handleSearch} />

  if (page === 'routes' && searchParams)
    return (
      <RouteSelectionPage
        params={searchParams}
        onBack={() => setPage('home')}
        onSelect={handleSelect}
      />
    )

  if (page === 'safety' && selected && searchParams)
    return (
      <RouteSafetyPage
        route={selected.route}
        safety={selected.safety}
        origin={searchParams.origin}
        destination={searchParams.destination}
        travelMode={searchParams.travelMode}
        onBack={() => setPage('routes')}
        onHome={() => setPage('home')}
      />
    )

  return <WelcomePage onStart={() => setPage('home')} />
}
