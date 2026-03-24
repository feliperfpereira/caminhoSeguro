import { useEffect, useRef } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.pitch-root {
  font-family: 'Inter', sans-serif;
  background: #F4F6F5;
  color: #1C1C1E;
  font-size: 15px;
  line-height: 1.7;
}
.pitch-root * { margin:0; padding:0; box-sizing:border-box; }

.pitch-root .slide {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 72px 80px;
  position: relative;
  overflow: hidden;
}

.pitch-root .slide-cover { background: #1A1A2E; color: white; }
.pitch-root .slide-cover::before {
  content: '';
  position: absolute;
  top: -160px; right: -160px;
  width: 560px; height: 560px;
  border-radius: 50%;
  border: 1px solid rgba(46,196,182,0.12);
}
.pitch-root .slide-cover::after {
  content: '';
  position: absolute;
  bottom: -100px; left: 30%;
  width: 380px; height: 380px;
  border-radius: 50%;
  border: 1px solid rgba(46,196,182,0.07);
}

.pitch-root .app-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(46,196,182,0.12);
  border: 1px solid rgba(46,196,182,0.3);
  border-radius: 40px;
  padding: 6px 16px 6px 8px;
  margin-bottom: 36px;
  width: fit-content;
}
.pitch-root .app-icon {
  width: 28px; height: 28px;
  background: #2EC4B6;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.pitch-root .app-icon svg { width: 16px; height: 16px; }
.pitch-root .app-badge span {
  font-size: 12px;
  font-weight: 500;
  color: #2EC4B6;
  letter-spacing: 0.04em;
}

.pitch-root .cover-title {
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  color: white;
}
.pitch-root .cover-title strong { font-weight: 600; color: #2EC4B6; }
.pitch-root .cover-sub {
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255,255,255,0.45);
  font-weight: 300;
  margin-bottom: 56px;
  max-width: 540px;
}
.pitch-root .cover-pills { display: flex; gap: 10px; flex-wrap: wrap; }
.pitch-root .pill {
  font-size: 12px;
  font-weight: 400;
  padding: 6px 16px;
  border-radius: 40px;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.5);
}

.pitch-root .slide-num {
  position: absolute;
  bottom: 40px; right: 80px;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.2);
  font-weight: 500;
}
.pitch-root .slide-num-dark {
  position: absolute;
  bottom: 40px; right: 80px;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(0,0,0,0.18);
  font-weight: 500;
}

.pitch-root .slide-light   { background: #FFFFFF; }
.pitch-root .slide-surface { background: #F4F6F5; }

.pitch-root .stag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #22A99D;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.pitch-root .stag::before {
  content: '';
  display: block;
  width: 20px; height: 2px;
  background: #2EC4B6;
  border-radius: 1px;
}

.pitch-root .slide-title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  color: #1A1A2E;
}
.pitch-root .slide-title strong { font-weight: 600; color: #1A1A2E; }
.pitch-root .slide-title em    { font-style: italic; font-weight: 300; color: #22A99D; }

.pitch-root .slide-lead {
  font-size: 16px;
  color: #6E7B7A;
  max-width: 560px;
  margin-bottom: 40px;
  font-weight: 300;
  line-height: 1.75;
}

.pitch-root .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pitch-root .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.pitch-root .grid4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

.pitch-root .card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(46,196,182,0.15);
}
.pitch-root .card-dark {
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(46,196,182,0.1);
}
.pitch-root .card h4        { font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 8px; }
.pitch-root .card-dark h4   { font-size: 15px; font-weight: 600; color: white;   margin-bottom: 8px; }
.pitch-root .card p         { font-size: 13px; color: #6E7B7A; line-height: 1.6; }
.pitch-root .card-dark p    { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; }
.pitch-root .card-accent    { width: 32px; height: 3px; border-radius: 2px; margin-bottom: 14px; }

.pitch-root .reddit-frame {
  background: #F4F6F5;
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(46,196,182,0.15);
  margin-bottom: 16px;
}
.pitch-root .reddit-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6E7B7A;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.pitch-root .reddit-dot { width: 14px; height: 14px; background: #FF4500; border-radius: 50%; display: inline-block; }
.pitch-root .reddit-post-title { font-size: 15px; font-weight: 500; color: #1A1A2E; margin-bottom: 6px; }
.pitch-root .reddit-post-body  { font-size: 13px; color: #6E7B7A; line-height: 1.6; margin-bottom: 10px; }
.pitch-root .reddit-insight {
  font-size: 12px;
  color: #22A99D;
  font-style: italic;
  border-left: 2px solid #2EC4B6;
  padding-left: 12px;
  line-height: 1.55;
}

.pitch-root .flow { display: flex; align-items: stretch; gap: 0; margin: 32px 0; }
.pitch-root .flow-step {
  flex: 1;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 20px 16px;
  text-align: center;
  border: 1px solid rgba(46,196,182,0.15);
  position: relative;
}
.pitch-root .flow-step .fi { font-size: 22px; margin-bottom: 8px; }
.pitch-root .flow-step .fn {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #22A99D; margin-bottom: 4px;
}
.pitch-root .flow-step .fl { font-size: 13px; font-weight: 500; color: #1A1A2E; }
.pitch-root .flow-step .fs { font-size: 11px; color: #6E7B7A; margin-top: 4px; line-height: 1.4; }
.pitch-root .flow-arr { display: flex; align-items: center; padding: 0 8px; color: #2EC4B6; font-size: 18px; flex-shrink: 0; }

.pitch-root .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
.pitch-root .compare-col { border-radius: 16px; padding: 24px; }
.pitch-root .compare-bad  { background: rgba(232,72,85,0.05); border: 1px solid rgba(232,72,85,0.15); }
.pitch-root .compare-good { background: rgba(46,196,182,0.06); border: 1px solid rgba(46,196,182,0.2); }
.pitch-root .compare-label {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 16px; display: flex; align-items: center; gap: 6px;
}
.pitch-root .compare-bad  .compare-label { color: #A32020; }
.pitch-root .compare-good .compare-label { color: #22A99D; }
.pitch-root .compare-dot { width: 8px; height: 8px; border-radius: 50%; }
.pitch-root .compare-bad  .compare-dot { background: #E84855; }
.pitch-root .compare-good .compare-dot { background: #2EC4B6; }
.pitch-root .compare-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; font-size: 13px; color: #6E7B7A; line-height: 1.5; }
.pitch-root .compare-item:last-child { margin-bottom: 0; }
.pitch-root .ci { font-size: 12px; flex-shrink: 0; margin-top: 1px; }

.pitch-root .principle-list { display: flex; flex-direction: column; gap: 14px; margin-top: 32px; }
.pitch-root .principle {
  display: flex; gap: 20px; align-items: flex-start;
  padding: 18px 20px; background: #FFFFFF;
  border-radius: 14px; border: 1px solid rgba(46,196,182,0.15);
}
.pitch-root .pnum { font-size: 22px; font-weight: 300; color: #2EC4B6; line-height: 1; flex-shrink: 0; width: 32px; margin-top: 2px; }
.pitch-root .principle h4 { font-size: 14px; font-weight: 600; color: #1A1A2E; margin-bottom: 3px; }
.pitch-root .principle p  { font-size: 13px; color: #6E7B7A; margin: 0; line-height: 1.5; }

.pitch-root .stat-row { display: flex; gap: 16px; margin-top: 32px; }
.pitch-root .stat { flex: 1; background: #1A1A2E; border-radius: 16px; padding: 24px; text-align: center; }
.pitch-root .stat .sn { font-size: 38px; font-weight: 300; color: white; line-height: 1; margin-bottom: 6px; }
.pitch-root .stat .sn em { color: #2EC4B6; font-style: normal; font-size: 20px; }
.pitch-root .stat .sd { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }

.pitch-root .roadmap { margin-top: 36px; }
.pitch-root .rm-item { display: flex; gap: 20px; padding-bottom: 28px; position: relative; }
.pitch-root .rm-item::before {
  content: ''; position: absolute;
  left: 19px; top: 42px; bottom: 0;
  width: 1px; background: rgba(46,196,182,0.15);
}
.pitch-root .rm-item:last-child::before { display: none; }
.pitch-root .rm-dot {
  width: 40px; height: 40px; border-radius: 50%;
  background: #1A1A2E; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: white; flex-shrink: 0;
}
.pitch-root .rm-dot.teal  { background: #2EC4B6; color: #1A1A2E; }
.pitch-root .rm-dot.coral { background: #E84855; }
.pitch-root .rm-dot.muted { background: #6E7B7A; }
.pitch-root .rm-body h4 { font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 4px; padding-top: 8px; }
.pitch-root .rm-body p  { font-size: 13px; color: #6E7B7A; line-height: 1.55; }

.pitch-root .blockquote { background: #1A1A2E; border-radius: 20px; padding: 36px 40px; margin: 36px 0 0; }
.pitch-root .blockquote p {
  font-size: clamp(16px, 2vw, 20px); font-weight: 300;
  color: rgba(255,255,255,0.85); line-height: 1.65;
  font-style: italic; margin: 0;
}
.pitch-root .blockquote p em { color: #2EC4B6; font-style: normal; font-weight: 500; }

.pitch-root .tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.pitch-root .tag { font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: 500; }
.pitch-root .tag-teal  { background: rgba(46,196,182,0.1); color: #22A99D; border: 1px solid rgba(46,196,182,0.2); }
.pitch-root .tag-coral { background: rgba(232,72,85,0.08); color: #A32020; border: 1px solid rgba(232,72,85,0.15); }
.pitch-root .tag-amber { background: rgba(255,159,28,0.1);  color: #854F0B; border: 1px solid rgba(255,159,28,0.2); }
.pitch-root .tag-gray  { background: #E8EDEC; color: #6E7B7A; border: 1px solid rgba(0,0,0,0.08); }

.pitch-root .slide-final { background: #1A1A2E; color: white; }
.pitch-root .final-title { font-size: clamp(32px, 5vw, 60px); font-weight: 300; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
.pitch-root .final-title strong { font-weight: 600; color: #2EC4B6; }

.pitch-root hr { border: none; border-top: 1px solid rgba(46,196,182,0.15); margin: 36px 0; }
.pitch-root hr.dark { border-top-color: rgba(255,255,255,0.07); }

.pitch-progress { position: fixed; bottom: 0; left: 0; width: 100%; height: 2px; background: rgba(0,0,0,0.06); z-index: 100; }
.pitch-progress-bar { height: 100%; background: #2EC4B6; transition: width 0.4s ease; }

.pitch-nav { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 8px; z-index: 100; }
.pitch-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.18); cursor: pointer; transition: all 0.2s; border: none; padding: 0; }
.pitch-nav-dot.active { background: #2EC4B6; transform: scale(1.5); }
.pitch-nav-dot.light  { background: rgba(255,255,255,0.25); }
.pitch-nav-dot.light.active { background: #2EC4B6; }

@media (max-width: 700px) {
  .pitch-root .slide { padding: 48px 28px; min-height: auto; }
  .pitch-root .grid2, .pitch-root .grid3, .pitch-root .grid4, .pitch-root .compare { grid-template-columns: 1fr; }
  .pitch-root .flow { flex-direction: column; }
  .pitch-root .flow-arr { transform: rotate(90deg); align-self: center; }
  .pitch-root .stat-row { flex-direction: column; }
  .pitch-nav { display: none; }
}
`

const AppIcon = () => (
  <div className="app-icon">
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5C5 1.5 2.5 4 2.5 7c0 3.5 5.5 7.5 5.5 7.5s5.5-4 5.5-7.5c0-3-2.5-5.5-5.5-5.5z" fill="white" opacity="0.9"/>
      <circle cx="8" cy="7" r="2" fill="#2EC4B6"/>
    </svg>
  </div>
)

export default function PitchPage() {
  const rootRef   = useRef<HTMLDivElement>(null)
  const navRef    = useRef<HTMLDivElement>(null)
  const progRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const nav  = navRef.current
    const prog = progRef.current
    if (!root || !nav || !prog) return

    const slides = root.querySelectorAll<HTMLElement>('.slide')
    const dots: HTMLButtonElement[] = []

    slides.forEach((s, i) => {
      const dot = document.createElement('button')
      const theme = s.dataset.theme
      dot.className = 'pitch-nav-dot' + (theme === 'dark' ? ' light' : '')
      dot.setAttribute('aria-label', `Slide ${i + 1}`)
      dot.onclick = () => s.scrollIntoView({ behavior: 'smooth' })
      nav.appendChild(dot)
      dots.push(dot)
    })

    function update() {
      const wh    = window.innerHeight
      const total = document.body.scrollHeight - wh
      const pct   = total > 0 ? Math.round((window.scrollY / total) * 100) : 0
      if (prog) prog.style.width = pct + '%'

      let active = 0
      slides.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= wh / 2) active = i
      })
      dots.forEach((d, i) => {
        const theme = slides[i].dataset.theme
        d.className = 'pitch-nav-dot' +
          (theme === 'dark' ? ' light' : '') +
          (i === active ? ' active' : '')
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      dots.forEach(d => d.remove())
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>

      {/* Nav dots */}
      <div ref={navRef} className="pitch-nav" />

      {/* Progress bar */}
      <div className="pitch-progress">
        <div ref={progRef} className="pitch-progress-bar" style={{ width: '0%' }} />
      </div>

      <div ref={rootRef} className="pitch-root">

        {/* ── SLIDE 1 — CAPA ── */}
        <section className="slide slide-cover" data-theme="dark">
          <div className="app-badge">
            <AppIcon />
            <span>Caminho Seguro</span>
          </div>
          <h1 className="cover-title">Sua cidade,<br />seu trajeto,<br /><strong>mais segurança.</strong></h1>
          <p className="cover-sub">App que cruza sua rota com dados reais da SSP-SP — para informar, não amedrontar.</p>
          <div className="cover-pills">
            <span className="pill">iOS + Android</span>
            <span className="pill">Dados SSP-SP</span>
            <span className="pill">São Paulo · 2026</span>
            <span className="pill">PRD v1.0</span>
          </div>
          <span className="slide-num">01 / 09</span>
        </section>

        {/* ── SLIDE 2 — O PROBLEMA ── */}
        <section className="slide slide-light" data-theme="light">
          <div className="stag">O problema</div>
          <h2 className="slide-title">A pergunta que todo<br />paulistano já fez — <em>sem resposta de qualidade</em></h2>
          <p className="slide-lead">No r/saopaulo, moradores publicam diariamente prints de rotas no Google Maps perguntando se aquele caminho é seguro. A resposta: opiniões sem nenhum dado.</p>

          <div className="grid2">
            <div>
              <div className="reddit-frame">
                <div className="reddit-label"><span className="reddit-dot" /> r/saopaulo · há 4 dias</div>
                <div className="reddit-post-title">"Esse caminho no Brás é seguro?"</div>
                <div className="reddit-post-body">Preciso ir ao SENAI. Fiz esse trajeto saindo do metrô. O que acham? <em>De sábado é pior?</em></div>
                <div className="reddit-insight">O usuário já traçou a rota. Só faltava a camada de dados.</div>
              </div>
            </div>
            <div>
              <div className="reddit-frame">
                <div className="reddit-label"><span className="reddit-dot" /> r/saopaulo · 9 meses atrás</div>
                <div className="reddit-post-title">"É um local perigoso atualmente AINDA?"</div>
                <div className="reddit-post-body">R. Pedro Vicente, 625 — Canindé. Penso em estudar aqui no turno noturno, sou de outra cidade.</div>
                <div className="reddit-insight">"AINDA" em maiúsculo: sabe que o cenário muda, mas não tem como verificar. Conta foi deletada depois.</div>
              </div>
            </div>
          </div>
          <span className="slide-num-dark">02 / 09</span>
        </section>

        {/* ── SLIDE 3 — A OPORTUNIDADE ── */}
        <section className="slide slide-surface" data-theme="light">
          <div className="stag">A oportunidade</div>
          <h2 className="slide-title">Os dados existem.<br /><strong>Só não chegam às pessoas.</strong></h2>
          <p className="slide-lead">A SSP-SP publica mensalmente todos os boletins de ocorrência por tipo, bairro e período. São dados públicos — mas estão em PDFs e tabelas que ninguém consulta antes de sair de casa.</p>

          <div className="grid3">
            <div className="card">
              <div className="card-accent" style={{ background: '#E84855' }} />
              <h4>Informação de qualidade não chega ao cidadão</h4>
              <p>Tabelas da SSP-SP são públicas mas inacessíveis. O cidadão recorre a opiniões de estranhos no Reddit.</p>
            </div>
            <div className="card">
              <div className="card-accent" style={{ background: '#FF9F1C' }} />
              <h4>Apps existentes amplificam o medo</h4>
              <p>Waze Alerts e grupos de WhatsApp funcionam por relatos anedóticos — sem contexto estatístico.</p>
            </div>
            <div className="card">
              <div className="card-accent" style={{ background: '#2EC4B6' }} />
              <h4>Outros riscos são completamente ignorados</h4>
              <p>Alagamentos, acidentes e iluminação precária afetam tanto quanto o crime — mas nunca aparecem juntos.</p>
            </div>
          </div>

          <div className="blockquote">
            <p>A demanda já existe e é ativa. O problema não é criar um novo hábito — é substituir uma solução ruim (<em>opiniões anedóticas</em>) por uma melhor (<em>dados contextualizados da SSP-SP</em>).</p>
          </div>
          <span className="slide-num-dark">03 / 09</span>
        </section>

        {/* ── SLIDE 4 — A SOLUÇÃO ── */}
        <section className="slide slide-light" data-theme="light">
          <div className="stag">A solução</div>
          <h2 className="slide-title">Você traça a rota.<br /><em>A gente traz o contexto.</em></h2>
          <p className="slide-lead">Em 4 passos, você sai de casa com informação real — não com ansiedade de desconhecidos.</p>

          <div className="flow">
            <div className="flow-step">
              <div className="fi">📍</div>
              <div className="fn">Passo 1</div>
              <div className="fl">Origem &amp; destino</div>
              <div className="fs">Com horário — agora ou programado</div>
            </div>
            <div className="flow-arr">→</div>
            <div className="flow-step">
              <div className="fi">📊</div>
              <div className="fn">Passo 2</div>
              <div className="fl">Análise SSP-SP</div>
              <div className="fs">Por tipo, período e dia da semana</div>
            </div>
            <div className="flow-arr">→</div>
            <div className="flow-step">
              <div className="fi">🗺️</div>
              <div className="fn">Passo 3</div>
              <div className="fl">Rotas com contexto</div>
              <div className="fs">Até 3 alternativas com pontos de atenção e apoio</div>
            </div>
            <div className="flow-arr">→</div>
            <div className="flow-step" style={{ borderColor: 'rgba(46,196,182,0.35)' }}>
              <div className="fi">✓</div>
              <div className="fn">Passo 4</div>
              <div className="fl">Decisão sua</div>
              <div className="fs">O app informa — nunca decide por você</div>
            </div>
          </div>

          <div className="compare">
            <div className="compare-col compare-bad">
              <div className="compare-label"><span className="compare-dot" />Hoje, no Reddit</div>
              <div className="compare-item"><span className="ci">✕</span> Opiniões sem base em dados</div>
              <div className="compare-item"><span className="ci">✕</span> Informação potencialmente desatualizada</div>
              <div className="compare-item"><span className="ci">✕</span> Sem filtro por horário ou dia</div>
              <div className="compare-item"><span className="ci">✕</span> Amplifica casos extremos</div>
            </div>
            <div className="compare-col compare-good">
              <div className="compare-label"><span className="compare-dot" />Com o Caminho Seguro</div>
              <div className="compare-item"><span className="ci">✓</span> Dados reais da SSP-SP</div>
              <div className="compare-item"><span className="ci">✓</span> Atualizado mensalmente</div>
              <div className="compare-item"><span className="ci">✓</span> Filtrado por horário e dia da semana</div>
              <div className="compare-item"><span className="ci">✓</span> Contexto comparativo, não alarmismo</div>
            </div>
          </div>
          <span className="slide-num-dark">04 / 09</span>
        </section>

        {/* ── SLIDE 5 — ALÉM DO CRIME ── */}
        <section className="slide slide-surface" data-theme="light">
          <div className="stag">Diferencial</div>
          <h2 className="slide-title">Segurança é mais<br /><strong>do que crime.</strong></h2>
          <p className="slide-lead">O app integra múltiplas fontes de risco para dar uma visão completa do seu percurso — seja você pedestre, ciclista ou motorista.</p>

          <div className="grid4">
            <div className="card">
              <div className="card-accent" style={{ background: '#E84855' }} />
              <h4>Segurança pública</h4>
              <p>Ocorrências por tipo, bairro e período do dia via SSP-SP.</p>
              <div className="tag-row"><span className="tag tag-coral">SSP-SP</span></div>
            </div>
            <div className="card">
              <div className="card-accent" style={{ background: '#378ADD' }} />
              <h4>Alagamentos</h4>
              <p>Pontos históricos de inundação e alertas em tempo real.</p>
              <div className="tag-row"><span className="tag tag-gray">CGE · Defesa Civil</span></div>
            </div>
            <div className="card">
              <div className="card-accent" style={{ background: '#FF9F1C' }} />
              <h4>Trânsito &amp; obras</h4>
              <p>Cruzamentos críticos, trechos perigosos e obras em andamento.</p>
              <div className="tag-row"><span className="tag tag-amber">CET-SP · SIURB</span></div>
            </div>
            <div className="card">
              <div className="card-accent" style={{ background: '#2EC4B6' }} />
              <h4>Pontos de apoio</h4>
              <p>UPAs, delegacias, farmácias 24h e iluminação ao longo da rota.</p>
              <div className="tag-row"><span className="tag tag-teal">ILUME · PMSP</span></div>
            </div>
          </div>
          <span className="slide-num-dark">05 / 09</span>
        </section>

        {/* ── SLIDE 6 — PRINCÍPIOS ── */}
        <section className="slide slide-light" data-theme="light">
          <div className="stag">Design ético</div>
          <h2 className="slide-title">Construído para<br /><em>não gerar medo.</em></h2>
          <p className="slide-lead">A principal decisão de design não é técnica — é ética. Cada funcionalidade é avaliada contra o risco de produzir isolamento ou paralisia.</p>

          <div className="principle-list">
            <div className="principle">
              <div className="pnum">01</div>
              <div>
                <h4>Contexto, não alarme</h4>
                <p>Todo dado vem com referência: variação temporal, comparativo geográfico, tipo de ocorrência. Nunca um número isolado.</p>
              </div>
            </div>
            <div className="principle">
              <div className="pnum">02</div>
              <div>
                <h4>Silêncio como default</h4>
                <p>O app fala quando tem algo relevante para aquela rota específica. Sem bombardear com notificações desnecessárias.</p>
              </div>
            </div>
            <div className="principle">
              <div className="pnum">03</div>
              <div>
                <h4>Informar, não decidir</h4>
                <p>O app nunca diz "vá por aqui" ou "evite aquele bairro". Apresenta dados e opções — a decisão é sempre do usuário.</p>
              </div>
            </div>
            <div className="principle">
              <div className="pnum">04</div>
              <div>
                <h4>Mostrar o positivo também</h4>
                <p>Trechos bem iluminados, áreas movimentadas, pontos de apoio — o app celebra o que funciona na cidade.</p>
              </div>
            </div>
          </div>
          <span className="slide-num-dark">06 / 09</span>
        </section>

        {/* ── SLIDE 7 — MÉTRICAS ── */}
        <section className="slide slide-surface" data-theme="light">
          <div className="stag">Sucesso</div>
          <h2 className="slide-title">Medimos bem-estar,<br /><strong>não engajamento.</strong></h2>
          <p className="slide-lead">Tempo de sessão longo pode indicar ansiedade, não valor. Volume de alertas alto pode significar ruído, não utilidade.</p>

          <div className="stat-row">
            <div className="stat">
              <div className="sn">70<em>%</em></div>
              <div className="sd">Usuários que se sentem "mais informados, não mais ansiosos" após usar o app</div>
            </div>
            <div className="stat">
              <div className="sn">&lt;15<em>%</em></div>
              <div className="sd">Taxa máxima de abandono após ver dados de ocorrências — sinal de reação de pânico</div>
            </div>
            <div className="stat">
              <div className="sn">4.2<em>★</em></div>
              <div className="sd">Nota mínima nas lojas, avaliada em reviews que mencionam "medo" ou "ansiedade"</div>
            </div>
            <div className="stat" style={{ background: '#2EC4B6' }}>
              <div className="sn" style={{ color: '#1A1A2E' }}>3<em style={{ color: '#1A1A2E', opacity: 0.5 }}>x</em></div>
              <div className="sd" style={{ color: 'rgba(26,26,46,0.6)' }}>Rotas por usuário ativo semanal — uso regular, não compulsivo</div>
            </div>
          </div>
          <span className="slide-num-dark">07 / 09</span>
        </section>

        {/* ── SLIDE 8 — ROADMAP ── */}
        <section className="slide slide-light" data-theme="light">
          <div className="stag">Roadmap</div>
          <h2 className="slide-title">12 meses para<br /><strong>chegar ao mercado.</strong></h2>
          <p className="slide-lead">Começamos pela validação ética — antes de qualquer linha de código.</p>

          <div className="roadmap">
            <div className="rm-item">
              <div className="rm-dot">M0</div>
              <div className="rm-body">
                <h4>Meses 0–2 · Validação e fundação ética</h4>
                <p>Pesquisa qualitativa com 30 usuários. Política de privacidade com especialistas em LGPD. Mapeamento das APIs públicas. Formação do comitê ético — incluindo vozes da periferia.</p>
              </div>
            </div>
            <div className="rm-item">
              <div className="rm-dot coral">M1</div>
              <div className="rm-body">
                <h4>Meses 2–5 · MVP fechado</h4>
                <p>Pipeline SSP-SP. Interface de rota com contexto. Rotas alternativas por dados. Teste fechado com 200 usuários — acompanhamento de impacto na percepção de segurança.</p>
              </div>
            </div>
            <div className="rm-item">
              <div className="rm-dot teal">M2</div>
              <div className="rm-body">
                <h4>Meses 5–8 · Expansão de riscos</h4>
                <p>Integração CET, Defesa Civil e SIURB. Modo navegação turn-by-turn. Diferenciação por modal. Lançamento público.</p>
              </div>
            </div>
            <div className="rm-item">
              <div className="rm-dot muted">M3</div>
              <div className="rm-body">
                <h4>Meses 8–12 · Maturidade</h4>
                <p>Modo Tranquilidade. Integração SPTrans e CPTM. Expansão para Grande SP. Relatório público anual de impacto ético.</p>
              </div>
            </div>
          </div>
          <span className="slide-num-dark">08 / 09</span>
        </section>

        {/* ── SLIDE 9 — ENCERRAMENTO ── */}
        <section className="slide slide-final" data-theme="dark">
          <div className="app-badge" style={{ marginBottom: '48px' }}>
            <AppIcon />
            <span>Caminho Seguro</span>
          </div>

          <h2 className="final-title">Sua cidade,<br />seu trajeto,<br /><strong>mais segurança.</strong></h2>

          <hr className="dark" style={{ maxWidth: '400px', margin: '32px 0' }} />

          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 300, maxWidth: '500px', lineHeight: 1.7 }}>
            App mobile que substitui o "alguém sabe se essa rua é perigosa?" do Reddit por dados reais da SSP-SP — contextualizados, comparativos e entregues sem alarmismo.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span className="pill" style={{ borderColor: 'rgba(46,196,182,0.3)', color: '#2EC4B6' }}>ssp.sp.gov.br/estatistica</span>
            <span className="pill">PRD v1.0 · Março 2026</span>
          </div>

          <span className="slide-num">09 / 09</span>
        </section>

      </div>
    </>
  )
}
