import { useState } from 'react'
import type { TravelMode } from '../services/googleRoutes'

interface SearchParams {
  origin: string
  destination: string
  travelMode: TravelMode
}

interface Props {
  onSearch: (params: SearchParams) => void
}

type TransportOption = {
  id: TravelMode
  icon: string
  label: string
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  { id: 'WALK',    icon: 'directions_walk', label: 'Andar'     },
  { id: 'BICYCLE', icon: 'directions_bike', label: 'Bicicleta' },
  { id: 'TRANSIT', icon: 'directions_bus',  label: 'Ônibus'    },
  { id: 'DRIVE',   icon: 'directions_car',  label: 'Carro'     },
]

export default function HomePage({ onSearch }: Props) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [activeModeIndex, setActiveModeIndex] = useState(3) // Carro por padrão

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    onSearch({
      origin,
      destination,
      travelMode: TRANSPORT_OPTIONS[activeModeIndex].id,
    })
  }

  return (
    <div className="min-h-dvh bg-[#f9f9fb] font-body">

      {/* Top App Bar */}
      <header className="bg-[#f9f9fb] fixed top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">accessibility_new</span>
            <h1 className="font-headline text-2xl font-semibold italic text-primary tracking-tight">Caminho Seguro</h1>
          </div>
          <button className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-slate-400">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">

        {/* Hero */}
        <section className="mb-10">
          <h2 className="font-headline text-4xl md:text-5xl text-primary-container leading-tight mb-8">
            Para onde vamos agora?
          </h2>

          {/* Search card */}
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl editorial-shadow mb-6 space-y-4">
            <div className="flex items-center bg-slate-100 rounded-xl px-4 py-1">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-xl">my_location</span>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider pt-2">De:</p>
                <input
                  type="text"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  placeholder="Ex: Infinity Tower, São Paulo"
                  className="w-full bg-transparent border-none outline-none text-primary font-medium pb-2 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex items-center bg-slate-100 rounded-xl px-4 py-1">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-xl">location_on</span>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider pt-2">Para:</p>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Ex: Aeroporto de Guarulhos"
                  className="w-full bg-transparent border-none outline-none text-primary font-medium pb-2 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!origin.trim() || !destination.trim()}
              className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold text-base flex justify-center items-center gap-2 hover:opacity-90 transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-xl">route</span>
              Traçar Rota
            </button>
          </form>

          {/* Transport selector */}
          <div className="grid grid-cols-4 gap-3">
            {TRANSPORT_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => setActiveModeIndex(i)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                  activeModeIndex === i
                    ? 'bg-[#2EC4B6] text-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-3xl mb-1">{opt.icon}</span>
                <span className="font-bold text-[10px] uppercase tracking-widest">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Map preview */}
        <section className="mb-10">
          <div className="relative w-full h-52 rounded-xl overflow-hidden editorial-shadow">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhGfKzIFJ4G08eLzx23rEmbd9CJcoOJ7RW2q8G1ArSHfeJt_a9B0iegObKDX24Hks_zVl5yssdk8u3g0P3kLZMiNgAGZd_Zb-koCGjLIBZvVdmmkUHk_w4XRh-R58gLjiufrhEzBwtTjqUHEosDDj1SszYE_-4cwdRpliOYYN-P6IHplSo2q544HlLWWlTCNwTC9n26MB--jfqI_s3ShMiMYsTiG_5pyqQTTDf1SyxaMMMZbpcbdURhvghGi5RscJbu51c6rNUcIkY"
              alt="Mapa de São Paulo"
              className="w-full h-full object-cover grayscale opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-tertiary-fixed rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-tighter text-primary">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent routes */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-headline text-2xl text-primary-container italic">Rotas Recentes</h3>
              <p className="text-on-surface-variant text-sm font-medium">Histórico de deslocamentos protegidos</p>
            </div>
            <button className="text-primary-container font-bold text-xs uppercase border-b-2 border-primary-container pb-1">
              Ver Tudo
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl editorial-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface-container-highest rounded-full text-primary-container">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-primary-container">Casa → Trabalho</h4>
                  <p className="text-on-surface-variant text-sm">Fluxo habitual</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2EC4B6]/10 text-[#2EC4B6] rounded-full">
                <span className="material-symbols-outlined fill-icon text-sm">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Segura</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl editorial-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface-container-highest rounded-full text-primary-container">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-primary-container">Faculdade → Metrô</h4>
                  <p className="text-on-surface-variant text-sm">Atenção em 1 trecho</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E84855]/10 text-[#E84855] rounded-full">
                <span className="material-symbols-outlined fill-icon text-sm">warning</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Alerta</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center">
          <p className="text-primary/50 text-[10px] font-bold uppercase tracking-[0.2em]">
            Dados da SSP-SP com atualização mensal
          </p>
        </footer>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-12px_40px_0_rgba(26,28,29,0.06)]">
        <a href="#" className="flex flex-col items-center bg-primary text-white rounded-full px-5 py-2">
          <span className="material-symbols-outlined fill-icon">home</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Salvos</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">warning</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Alertas</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Perfil</span>
        </a>
      </nav>
    </div>
  )
}
