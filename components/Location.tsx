'use client'
import { useEffect, useState } from "react"
import { Navigation, X, ExternalLink } from "lucide-react"

interface LocationMinimalProps {
  name: string
  address: string
  mapsUrl: string
}

const LocationMinimal = ({ name, address, mapsUrl }: LocationMinimalProps) => {
  const [open, setOpen] = useState(false)
  const embedSrc = `${mapsUrl}${mapsUrl.includes("?") ? "&" : "?"}output=embed`

  // Close on Escape + lock body scroll while the modal is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row">
          {/* Map preview */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto pointer-events-none">
            <iframe
              title={`Map showing ${name}`}
              src={embedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: "auto" }}
              loading="lazy"
              className="absolute inset-0 w-full h-full grayscale-[15%]"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white text-lg">{name}</h4>
              <p className="text-sm text-amber-200/80 mt-1">{address}</p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg w-full bg-white text-black font-medium px-4 py-2 text-sm hover:bg-zinc-200 transition-colors self-start"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </button>
          </div>
        </div>
      </div>

      {/* Iframe modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Directions to ${name}`}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl h-[80vh] rounded-xl overflow-hidden border border-white/10 bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
              <div className="min-w-0">
                <h5 className="font-semibold text-white truncate">{name}</h5>
                <p className="text-xs text-amber-200/80 truncate">{address}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Maps
                </a>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <iframe
              title={`Directions to ${name}`}
              src={embedSrc}
              className="w-full flex-1"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default LocationMinimal