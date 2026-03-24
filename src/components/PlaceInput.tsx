import { useEffect, useRef } from 'react'
import { loadMapsScript } from '../services/mapsLoader'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  icon: string
}

export default function PlaceInput({ value, onChange, placeholder, label, icon }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) return
    const input = inputRef.current

    loadMapsScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const google = (window as any).google

      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'br' },  // restringe ao Brasil
        fields: ['formatted_address', 'name', 'geometry'],
        // Bias para a região de São Paulo
        bounds: new google.maps.LatLngBounds(
          { lat: -24.0, lng: -46.9 }, // SW
          { lat: -23.3, lng: -46.3 }  // NE
        ),
        strictBounds: false, // bias, não restrição rígida
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        // Prefere o endereço formatado; se não tiver, usa o nome do local
        const resolved = place.formatted_address ?? place.name ?? input.value
        onChange(resolved)
      })
    })
  }, [onChange])

  return (
    <div className="flex items-center bg-slate-100 rounded-xl px-4 py-1">
      <span className="material-symbols-outlined text-slate-400 mr-3 text-xl">{icon}</span>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider pt-2">{label}</p>
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onBlur={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-primary font-medium pb-2 text-sm placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}
