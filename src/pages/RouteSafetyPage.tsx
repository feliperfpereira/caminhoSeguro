import { useState } from 'react'
import type { RouteInfo, TravelMode } from '../services/googleRoutes'
import type { SafetyResult } from '../services/routeSafety'
import RouteMap from '../components/RouteMap'

interface Props {
  route: RouteInfo
  safety: SafetyResult
  origin: string
  destination: string
  travelMode: TravelMode
  onBack: () => void
  onHome: () => void
}

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`
}
function formatDuration(s: number) {
  const mins = Math.round(s / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`
}

export default function RouteSafetyPage({ route, safety, origin, destination, travelMode, onBack, onHome }: Props) {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const isSafe = safety.totalOcorrencias === 0
  const isModerate = safety.totalOcorrencias > 0 && safety.totalOcorrencias <= 30
  const isDangerous = safety.totalOcorrencias > 30

  // URL com encoding correto para clipboard
  const shareUrl = `${window.location.origin}${window.location.pathname}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${travelMode}`
  // URL sem encoding para embutir no texto do WhatsApp (encodeURIComponent(shareText) já cuida disso)
  const shareUrlRaw = `${window.location.origin}${window.location.pathname}?origin=${origin}&destination=${destination}&mode=${travelMode}`

  const shareText = [
    `🛡️ Estou indo pelo Caminho Seguro`,
    `📍 De: ${origin}`,
    `📍 Para: ${destination}`,
    `🗺️ Rota: ${route.label}`,
    `🕐 ${formatDuration(route.durationSeconds)} · ${formatDistance(route.distanceMeters)}`,
    isSafe
      ? `✅ Rota sem ocorrências registradas`
      : `⚠️ ${safety.totalOcorrencias} ocorrências registradas no caminho`,
    `\n${shareUrlRaw}`,
  ].join('\n')

  function handleSendToFriend() {
    const digits = phone.replace(/\D/g, '')
    const number = digits.startsWith('55') ? digits : `55${digits}`
    const url = `https://wa.me/${number}?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-dvh flex flex-col">

      {/* Top App Bar */}
      <header className="bg-[#f9f9fb] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="hover:opacity-70 transition-opacity mr-1">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="material-symbols-outlined text-[#1A1A2E] text-xl">accessibility_new</span>
            <h1 className="font-headline text-2xl font-semibold italic text-[#1A1A2E] tracking-tight">Caminho Seguro</h1>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" onClick={e => { e.preventDefault(); onHome() }} className="font-label text-sm font-bold uppercase tracking-wider text-[#1A1A2E] hover:opacity-80 transition-opacity">Início</a>
            <a href="#" className="font-label text-sm font-bold uppercase tracking-wider text-slate-400 hover:opacity-80 transition-opacity">Salvos</a>
            <a href="#" className="font-label text-sm font-bold uppercase tracking-wider text-slate-400 hover:opacity-80 transition-opacity">Alertas</a>
            <a href="#" className="font-label text-sm font-bold uppercase tracking-wider text-slate-400 hover:opacity-80 transition-opacity">Perfil</a>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="w-full space-y-8">

          {/* Mapa com rota + marcadores de ocorrências */}
          <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden editorial-shadow">
            <RouteMap
              polylineCoords={route.polylineCoords}
              occurrences={safety.ocorrenciasEncontradas}
              className="w-full h-full"
            />
            {/* Badge de segurança */}
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full editorial-shadow font-label text-xs font-bold uppercase tracking-widest ${
              isDangerous ? 'bg-[#ff5964] text-white' : 'bg-[#2EC4B6] text-white'
            }`}>
              <span className="material-symbols-outlined fill-icon text-sm">
                {isDangerous ? 'warning' : 'verified_user'}
              </span>
              {isSafe ? 'Sem ocorrências' : `${safety.totalOcorrencias} ocorrências`}
            </div>
            {/* Legenda */}
            {safety.ocorrenciasEncontradas.length > 0 && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 rounded-full bg-[#2EC4B6] inline-block" /> Rota
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#ff5964]/60 border border-[#ff5964] inline-block" /> Ocorrências
                </span>
              </div>
            )}
          </div>

          {/* Route info strip */}
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low rounded-xl">
            <div className="text-sm text-on-surface-variant font-medium truncate max-w-[60%]">
              <span className="font-bold text-primary-container">{origin}</span>
              <span className="mx-2">→</span>
              <span className="font-bold text-primary-container">{destination}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-primary-container shrink-0">
              <span>{formatDuration(route.durationSeconds)}</span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
              <span>{formatDistance(route.distanceMeters)}</span>
            </div>
          </div>

          {/* Typography */}
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-headline text-4xl md:text-5xl font-semibold italic text-primary leading-tight">
              {isSafe
                ? 'Percurso sem histórico relevante'
                : isModerate
                ? `${safety.totalOcorrencias} ocorrências no percurso`
                : `Atenção: ${safety.totalOcorrencias} ocorrências`}
            </h2>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              {isSafe
                ? 'Nossa análise não detectou recorrências significativas nesta rota. O ambiente permanece estável com base no histórico disponível.'
                : isModerate
                ? `Identificamos ${safety.ocorrenciasEncontradas.length} logradouros com ocorrências registradas ao longo deste percurso. Os pontos estão marcados no mapa.`
                : `Esta rota apresenta um histórico elevado de ocorrências. Os pontos de risco estão marcados no mapa acima.`}
            </p>

            <div className="inline-flex items-center gap-3 bg-surface-container-high px-6 py-3 rounded-full">
              <span className="material-symbols-outlined text-secondary text-xl">info</span>
              <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant text-left">
                {isSafe
                  ? 'Isso não significa ausência de risco — significa ausência de padrão registrado'
                  : 'Dados baseados no histórico SSP-SP — situações podem mudar'}
              </span>
            </div>

            {/* Lista de ocorrências */}
            {safety.ocorrenciasEncontradas.length > 0 && (
              <div className="text-left bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
                  <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Ocorrências por rua — na ordem do percurso
                  </span>
                </div>
                <div className="max-h-52 overflow-y-auto divide-y divide-outline-variant/20">
                  {safety.ocorrenciasEncontradas.map((o, i) => (
                    <div key={i} className="flex justify-between items-center px-6 py-3">
                      <span className="text-sm text-on-surface font-medium truncate max-w-[70%]">{o.logradouro}</span>
                      <span className="text-sm font-bold text-secondary ml-2 shrink-0">{o.totalOcorrencias}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compartilhar com amigo */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-lg">group</span>
              <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Compartilhar rota com amigo
              </span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-on-surface-variant">
                Avise alguém de confiança sobre o seu percurso. Eles saberão onde você está.
              </p>

              {/* Copiar link */}
              <div className="flex items-center gap-3 bg-slate-50 border border-outline-variant/20 rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">link</span>
                <span className="flex-1 text-xs text-on-surface-variant truncate font-mono">{shareUrl}</span>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label font-bold text-xs transition-all active:scale-95 shrink-0 ${
                    copied ? 'bg-[#2EC4B6] text-white' : 'bg-surface-container-high text-primary hover:opacity-80'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-3">
                <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-4 gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Nº do WhatsApp (com DDD)"
                    className="flex-1 bg-transparent border-none outline-none text-primary font-medium py-3 text-sm placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={handleSendToFriend}
                  disabled={phone.replace(/\D/g, '').length < 10}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-label font-bold text-sm transition-all active:scale-95 shrink-0 ${
                    sent
                      ? 'bg-[#2EC4B6] text-white'
                      : 'bg-primary text-white hover:opacity-90 disabled:opacity-40'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {sent ? 'check' : 'send'}
                  </span>
                  {sent ? 'Enviado!' : 'Enviar'}
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">
                Copie o link ou envie via WhatsApp — quem abrir verá a mesma rota automaticamente.
              </p>
            </div>
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group flex items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant/15 rounded-xl editorial-shadow hover:bg-surface-container transition-all text-left">
              <div className="space-y-1">
                <span className="font-headline text-xl font-semibold italic block text-primary">Ver pontos de apoio</span>
                <span className="font-body text-sm text-on-surface-variant">Delegacias, totens e locais iluminados</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
            </button>
            <button className="group flex items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant/15 rounded-xl editorial-shadow hover:bg-surface-container transition-all text-left">
              <div className="space-y-1">
                <span className="font-headline text-xl font-semibold italic block text-primary">Ver dados do bairro</span>
                <span className="font-body text-sm text-on-surface-variant">Estatísticas de segurança local</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined">analytics</span>
              </div>
            </button>
          </div>

          {/* CTA */}
          <div className="flex justify-center pt-4 pb-4">
            <button
              onClick={onHome}
              className="text-white font-label font-bold text-sm uppercase tracking-widest px-10 py-5 rounded-xl editorial-shadow active:scale-95 transition-transform flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #00000b 0%, #1a1a2e 100%)' }}
            >
              Confirmar Percurso
              <span className="material-symbols-outlined text-tertiary-fixed">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-12px_40px_0_rgba(26,28,29,0.06)]">
        <a href="#" onClick={e => { e.preventDefault(); onHome() }} className="flex flex-col items-center bg-[#1A1A2E] text-white rounded-full px-5 py-2">
          <span className="material-symbols-outlined fill-icon mb-1">home</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined mb-1">bookmark</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Salvos</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined mb-1">warning</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Alertas</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400 px-5 py-2">
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Perfil</span>
        </a>
      </nav>
    </div>
  )
}
