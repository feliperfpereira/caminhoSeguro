interface Props {
  onStart: () => void
}

export default function WelcomePage({ onStart }: Props) {
  return (
    <div className="welcome-bg min-h-dvh flex flex-col items-center justify-between overflow-hidden">

      {/* Shield icon */}
      <header className="w-full flex justify-center pt-16 pb-4 px-8 z-10">
        <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shadow-xl">
          <span className="material-symbols-outlined fill-icon text-3xl text-tertiary-fixed">shield</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 w-full max-w-2xl text-center space-y-12 z-10">
        <section className="space-y-4">
          <h1 className="font-headline italic text-7xl md:text-8xl text-primary-container tracking-tight leading-tight">
            Caminho Seguro
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-tertiary-fixed" />
            <p className="font-body text-lg md:text-xl text-primary-container font-medium">
              Sua cidade, seu trajeto, mais segurança.
            </p>
            <div className="h-px w-8 bg-tertiary-fixed" />
          </div>
        </section>

        <div className="w-full space-y-8 pt-4">
          <button
            onClick={onStart}
            className="w-full md:w-80 h-16 bg-primary-container text-on-primary rounded-xl font-body font-bold text-lg tracking-wide hover:opacity-95 active:scale-95 transition-all editorial-shadow"
          >
            Começar
          </button>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#" className="font-label text-sm font-bold text-primary-container/80 hover:text-primary transition-colors border-b-2 border-transparent hover:border-tertiary-fixed pb-1">
              Sobre o projeto
            </a>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-tertiary-fixed" />
            <a href="#" className="font-label text-sm font-bold text-primary-container/80 hover:text-primary transition-colors border-b-2 border-transparent hover:border-tertiary-fixed pb-1">
              Privacidade
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col items-center z-10">
        <div className="h-1 w-16 bg-tertiary-fixed/30 rounded-full mb-6" />
        <p className="font-label text-[11px] font-bold uppercase tracking-[0.25em] text-primary-container/60 text-center max-w-xs leading-relaxed">
          Dados da SSP-SP atualizados mensalmente para sua proteção
        </p>
      </footer>
    </div>
  )
}
