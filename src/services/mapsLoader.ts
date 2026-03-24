const GET_GOOGLE_MAPS_KEY_URL = 'https://getgooglemapskey-pqkfck5nsa-uc.a.run.app';

let state: 'idle' | 'loading' | 'loaded' = 'idle'
const queue: (() => void)[] = []

export async function loadMapsScript(cb: () => void) {
  if (state === 'loaded') { cb(); return }
  queue.push(cb)
  if (state === 'loading') return
  state = 'loading'

  try {
    const res = await fetch(GET_GOOGLE_MAPS_KEY_URL);
    if (!res.ok) throw new Error('Erro ao buscar a chave do Google Maps');
    const data = await res.json();
    const API_KEY = data.key;

    const script = document.createElement('script')
    // Carrega com a biblioteca Places para autocomplete
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
    script.async = true
    script.onload = () => {
      state = 'loaded'
      queue.forEach(fn => fn())
      queue.length = 0
    }
    document.head.appendChild(script)
  } catch (error) {
    console.error("Falha ao carregar a chave da API do Maps:", error);
    state = 'idle'; // Reset state so it can be retried
  }
}


