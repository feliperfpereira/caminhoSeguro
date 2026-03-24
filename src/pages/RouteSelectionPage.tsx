import { useEffect, useState } from 'react'
import { getMultipleRoutes } from '../services/googleRoutes'
import type { RouteInfo, TravelMode } from '../services/googleRoutes'
import { cruzarComOcorrencias } from '../services/routeSafety'
import type { SafetyResult } from '../services/routeSafety'

interface SearchParams {
  origin: string
  destination: string
  travelMode: TravelMode
}

interface Props {
  params: SearchParams
  onBack: () => void
  onSelect: (route: RouteWithSafety) => void
}

interface RouteWithSafety extends RouteInfo {
  safety: SafetyResult
}

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`
}

function formatDuration(s: number) {
  if (s < 60) return `${s}s`
  const mins = Math.round(s / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`
}

export default function RouteSelectionPage({ params, onBack, onSelect }: Props) {
  const [routes, setRoutes] = useState<RouteWithSafety[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const fetched = await getMultipleRoutes(params.origin, params.destination, params.travelMode)
        const withSafety: RouteWithSafety[] = fetched.map(r => ({
          ...r,
          safety: cruzarComOcorrencias(r.polylineCoords),
        }))
        // Ordena: menor número de ocorrências = mais segura = primeira
        withSafety.sort((a, b) => a.safety.totalOcorrencias - b.safety.totalOcorrencias)
        setRoutes(withSafety)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar rotas')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params])

  return (
    <div className="min-h-dvh flex flex-col pb-24 bg-[#f9f9fb] font-body">

      {/* Top App Bar */}
      <header className="bg-[#f9f9fb] fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hover:opacity-70 transition-opacity mr-1">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="material-symbols-outlined text-primary text-xl">accessibility_new</span>
            <h1 className="font-headline text-2xl font-semibold italic text-primary tracking-tight">Caminho Seguro</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-400 cursor-pointer">search</span>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_vert</span>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">

        {/* Map decoration */}
        <section className="relative h-[300px] w-full overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA95RKueYdTFpiZfdyBs1WggH3fCE3jgJDOeohNxN7Dm9fU3tavJWUvueMO9a2rGm5zWBuecGg-Ay8zpe-6Ep0CbC5-QU6TlOoAcgEPXynd2p2MOeien9WSQH62CDKd_DK7PnjyU0dOWNNby_5tre8Xow_zAPy8jRCpVJDO6T25PNlQIJG7cUpEKR27719wNFAThLAc926cuQqaPiNWBGqryPubE3309dal8mqtnnG-t5MkwkyQGe4CaY-utAj9PzTOqDNm1dN-gz4O"
            alt="Mapa"
            className="w-full h-full object-cover grayscale invert contrast-125 brightness-50"
          />
          <div className="absolute inset-0 map-gradient" />
          {/* SVG route visualizer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-20">
            <svg viewBox="0 0 400 100" className="w-full h-full drop-shadow-2xl">
              <path d="M10,50 Q100,20 200,50 T390,50" fill="none" stroke="#70f8e8" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
              <circle cx="10" cy="50" r="6" fill="#70f8e8" />
              <circle cx="390" cy="50" r="8" fill="#ff5964" />
            </svg>
          </div>
        </section>

        {/* Route cards */}
        <section className="px-6 -mt-10 relative z-10 max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-semibold text-primary mb-1">Selecione seu trajeto</h2>
            <p className="font-body text-on-primary-container text-sm">
              {params.origin} → {params.destination}
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-tertiary-fixed rounded-full animate-spin" />
              <p className="text-on-surface-variant text-sm font-medium">Analisando segurança das rotas…</p>
            </div>
          )}

          {error && (
            <div className="bg-error-container text-error rounded-xl p-6 text-sm font-medium">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              {routes.map((route, i) => {
                const isRecommended = i === 0
                const isWarning = i === routes.length - 1 && routes.length > 1 && route.safety.totalOcorrencias > routes[0].safety.totalOcorrencias

                return (
                  <div
                    key={route.index}
                    className={`bg-surface-container-lowest rounded-xl p-6 editorial-shadow transition-all hover:scale-[1.01] active:scale-95 duration-150 ${
                      isRecommended ? 'border-l-4 border-tertiary-fixed-dim' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {isRecommended && (
                          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container bg-tertiary-fixed px-3 py-1 rounded-full">
                            Recomendado
                          </span>
                        )}
                        <h3 className={`font-body text-xl font-extrabold text-primary-container ${isRecommended ? 'mt-3' : ''}`}>
                          {route.label}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-body font-bold text-lg text-primary">
                          {formatDuration(route.durationSeconds)}
                        </span>
                        <p className="font-label text-xs text-on-primary-container">
                          {formatDistance(route.distanceMeters)}
                        </p>
                      </div>
                    </div>

                    {/* Safety info */}
                    <div className={`flex items-center gap-2 mb-5 ${isWarning ? 'text-secondary' : 'text-on-tertiary-container'}`}>
                      <span className="material-symbols-outlined text-lg">
                        {isWarning ? 'warning' : isRecommended ? 'verified_user' : 'history'}
                      </span>
                      <span className="font-body text-sm font-medium italic">
                        {isRecommended
                          ? route.safety.totalOcorrencias === 0
                            ? 'Nenhuma ocorrência registrada no caminho'
                            : `${route.safety.totalOcorrencias} ocorrências — menor histórico disponível`
                          : isWarning
                          ? `Atenção: ${route.safety.totalOcorrencias} ocorrências registradas`
                          : `${route.safety.totalOcorrencias} ocorrências — histórico habitual`}
                      </span>
                    </div>

                    {/* Occurrences detail */}
                    {route.safety.ocorrenciasEncontradas.length > 0 && (
                      <details className="mb-5">
                        <summary className="text-xs font-bold uppercase tracking-widest text-on-surface-variant cursor-pointer mb-2">
                          Ver ocorrências por rua ({route.safety.ocorrenciasEncontradas.length} ruas)
                        </summary>
                        <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                          {route.safety.ocorrenciasEncontradas.map((o, j) => (
                            <div key={j} className="flex justify-between text-xs py-1 border-b border-outline-variant/40">
                              <span className="text-on-surface font-medium truncate max-w-[70%]">{o.logradouro}</span>
                              <span className="font-bold text-primary-container ml-2">{o.totalOcorrencias}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <button
                      onClick={() => onSelect(route)}
                      className={`w-full py-4 rounded-xl font-body font-bold text-sm tracking-wide uppercase transition-all ${
                        isRecommended
                          ? 'border-2 border-primary-container text-primary-container hover:bg-primary-container hover:text-white'
                          : 'border-2 border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container'
                      }`}
                    >
                      Selecionar
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <footer className="mt-16 mb-8 text-center">
            <p className="font-label text-[10px] text-on-primary-container uppercase tracking-widest opacity-60">
              Fonte de dados: SSP-SP · Atualização Mensal
            </p>
          </footer>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-12px_40px_0_rgba(26,28,29,0.06)]">
        <a href="#" onClick={onBack} className="flex flex-col items-center bg-primary text-white rounded-full px-5 py-2">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Salvos</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">warning</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Alertas</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Perfil</span>
        </a>
      </nav>
    </div>
  )
}
