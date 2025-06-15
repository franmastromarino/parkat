"use client"

import { useState } from "react"
import { MapPin, Car } from "lucide-react"
import type { ParkingSpot } from "@/types/spots"

interface SimpleMapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot) => void
}

export default function SimpleMap({ spots, selectedSpot, onSpotSelect }: SimpleMapProps) {
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null)

  // Convertir coordenadas a posiciones relativas en el mapa
  const getRelativePosition = (spot: ParkingSpot) => {
    // Usar las coordenadas para calcular posiciones relativas
    // Estas son coordenadas de Madrid, las normalizamos para el contenedor
    const minLat = 40.415
    const maxLat = 40.418
    const minLng = -3.705
    const maxLng = -3.702

    const x = ((spot.lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - spot.lat) / (maxLat - minLat)) * 100

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Streets */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-8 bg-slate-300 opacity-60" />
        <div className="absolute top-3/4 left-0 right-0 h-6 bg-slate-300 opacity-60" />
        <div className="absolute left-1/3 top-0 bottom-0 w-6 bg-slate-300 opacity-60" />
        <div className="absolute left-2/3 top-0 bottom-0 w-8 bg-slate-300 opacity-60" />
      </div>

      {/* Buildings */}
      <div className="absolute top-[10%] left-[10%] w-16 h-12 bg-slate-400 opacity-40 rounded" />
      <div className="absolute top-[15%] right-[15%] w-20 h-16 bg-slate-400 opacity-40 rounded" />
      <div className="absolute bottom-[20%] left-[20%] w-14 h-10 bg-slate-400 opacity-40 rounded" />
      <div className="absolute bottom-[15%] right-[25%] w-18 h-14 bg-slate-400 opacity-40 rounded" />

      {/* Parking Spots */}
      {spots.map((spot) => {
        const position = getRelativePosition(spot)
        const isSelected = selectedSpot?.id === spot.id
        const isHovered = hoveredSpot?.id === spot.id

        return (
          <div key={spot.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={position}>
            {/* Spot Marker */}
            <button
              onClick={() => onSpotSelect(spot)}
              onMouseEnter={() => setHoveredSpot(spot)}
              onMouseLeave={() => setHoveredSpot(null)}
              className={`relative w-8 h-8 rounded-full border-3 transition-all duration-200 ${
                isSelected
                  ? "bg-primary border-white shadow-lg shadow-primary/30 scale-125"
                  : "bg-white border-primary/60 hover:border-primary hover:scale-110"
              }`}
            >
              <Car className="w-4 h-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

              {/* Pulse animation for selected spot */}
              {isSelected && <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />}
            </button>

            {/* Tooltip */}
            {(isHovered || isSelected) && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                <div className="bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">
                      Zone {spot.zone} - Spot {spot.spot}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        spot.type === "Electric"
                          ? "bg-green-100 text-green-700"
                          : spot.type === "Premium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {spot.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>{spot.maxTime}</span>
                    <span className="font-medium text-primary">{spot.price}</span>
                    <span>{spot.distance}</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-600">+</span>
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold text-gray-600">−</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Available Parking Spots</span>
        </div>
      </div>

      {/* Selected Spot Info */}
      {selectedSpot && (
        <div className="absolute bottom-4 right-4 bg-primary text-white rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium">Selected Spot</div>
          <div className="text-xs opacity-90">
            Zone {selectedSpot.zone} - Spot {selectedSpot.spot}
          </div>
        </div>
      )}
    </div>
  )
}
