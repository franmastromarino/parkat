"use client"

import { useEffect, useRef, useState } from "react"
import type { ParkingSpot } from "@/types/spots"
import { PAYMENT_STATE_COLORS } from "@/lib/constants"

interface MapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot) => void
}

export default function SimpleMap({ spots, selectedSpot, onSpotSelect }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 41.3977081, lng: 2.1938499 })
  const [mapZoom, setMapZoom] = useState(16)
  const [mapBounds, setMapBounds] = useState({
    north: 41.4027081,
    south: 41.3927081,
    east: 2.1988499,
    west: 2.1888499,
  })
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null)
  const animationRef = useRef<number>()

  // Función para convertir coordenadas geográficas a píxeles
  const coordToPixel = (lat: number, lng: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 }

    const container = mapContainerRef.current
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    // Calcular la posición relativa basada en los bounds del mapa
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * containerWidth
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * containerHeight

    return { x, y }
  }

  // Función de animación suave
  const animateToPosition = (targetLat: number, targetLng: number) => {
    // Cancelar animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startLat = mapCenter.lat
    const startLng = mapCenter.lng
    const startTime = Date.now()
    const duration = 600 // 600ms para una animación más rápida

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Función de easing suave
      const easeOutCubic = (t: number) => {
        return 1 - Math.pow(1 - t, 3)
      }

      const easedProgress = easeOutCubic(progress)

      const currentLat = startLat + (targetLat - startLat) * easedProgress
      const currentLng = startLng + (targetLng - startLng) * easedProgress

      setMapCenter({ lat: currentLat, lng: currentLng })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Actualizar bounds del mapa basado en el centro y zoom
  useEffect(() => {
    const latRange = 0.005 / Math.pow(2, mapZoom - 15)
    const lngRange = 0.005 / Math.pow(2, mapZoom - 15)

    setMapBounds({
      north: mapCenter.lat + latRange,
      south: mapCenter.lat - latRange,
      east: mapCenter.lng + lngRange,
      west: mapCenter.lng - lngRange,
    })
  }, [mapCenter, mapZoom])

  // Centrar automáticamente en el spot seleccionado con animación suave
  useEffect(() => {
    if (selectedSpot) {
      animateToPosition(selectedSpot.lat, selectedSpot.lng)
    }
  }, [selectedSpot])

  // Limpiar animación al desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Manejar el movimiento del mapa
  const handleMapMove = (direction: "up" | "down" | "left" | "right") => {
    // Cancelar animación si está en curso
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const moveAmount = 0.001 / Math.pow(2, mapZoom - 15)

    setMapCenter((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, lat: prev.lat + moveAmount }
        case "down":
          return { ...prev, lat: prev.lat - moveAmount }
        case "left":
          return { ...prev, lng: prev.lng - moveAmount }
        case "right":
          return { ...prev, lng: prev.lng + moveAmount }
        default:
          return prev
      }
    })
  }

  // Manejar zoom
  const handleZoom = (zoomIn: boolean) => {
    setMapZoom((prev) => {
      const newZoom = zoomIn ? Math.min(prev + 1, 19) : Math.max(prev - 1, 10)
      return newZoom
    })
  }

  // Función para centrar manualmente en un spot con animación
  const centerOnSpot = (spot: ParkingSpot) => {
    animateToPosition(spot.lat, spot.lng)
  }

  return (
    <div ref={mapContainerRef} className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Mapa base con iframe */}
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.west},${mapBounds.south},${mapBounds.east},${mapBounds.north}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
        className="w-full h-full border-0"
        style={{ pointerEvents: "none" }}
        title="OpenStreetMap"
      />

      {/* Overlay para capturar eventos */}
      <div className="absolute inset-0 bg-transparent" style={{ pointerEvents: "auto" }}>
        {/* Controles de navegación */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {/* Zoom controls */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <button
              onClick={() => handleZoom(true)}
              className="block w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-t-lg border-b border-gray-200 transition-colors"
            >
              +
            </button>
            <button
              onClick={() => handleZoom(false)}
              className="block w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-b-lg transition-colors"
            >
              −
            </button>
          </div>

          {/* Navigation controls */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <button
                onClick={() => handleMapMove("up")}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded text-xs transition-colors"
              >
                ↑
              </button>
              <div></div>
              <button
                onClick={() => handleMapMove("left")}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded text-xs transition-colors"
              >
                ←
              </button>
              <div className="w-6 h-6 bg-gray-100 rounded"></div>
              <button
                onClick={() => handleMapMove("right")}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded text-xs transition-colors"
              >
                →
              </button>
              <div></div>
              <button
                onClick={() => handleMapMove("down")}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded text-xs transition-colors"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        </div>

        {/* Marcador de ubicación actual */}
        <div
          className="absolute w-4 h-4 bg-[#17A9A6] rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${coordToPixel(41.3977081, 2.1938499).x}px`,
            top: `${coordToPixel(41.3977081, 2.1938499).y}px`,
          }}
        >
          <div className="absolute inset-0 bg-[#17A9A6] rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Marcadores de parking spots */}
        {spots.map((spot) => {
          const { x, y } = coordToPixel(spot.lat, spot.lng)
          const isSelected = selectedSpot?.id === spot.id
          const isHovered = hoveredSpot?.id === spot.id
          const showTooltip = isSelected || isHovered
          const isVisible =
            x >= -20 &&
            x <= (mapContainerRef.current?.offsetWidth || 0) + 20 &&
            y >= -20 &&
            y <= (mapContainerRef.current?.offsetHeight || 0) + 20

          if (!isVisible) return null

          return (
            <div key={spot.id} className="absolute z-30">
              {/* Marcador */}
              <div
                className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  isSelected ? "bg-[#17A9A6] scale-125 z-40" : isHovered ? "scale-110 z-35" : ""
                } hover:scale-110`}
                style={{
                  backgroundColor: PAYMENT_STATE_COLORS[spot.type],
                }}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
                onClick={() => onSpotSelect(spot)}
                onMouseEnter={() => setHoveredSpot(spot)}
                onMouseLeave={() => setHoveredSpot(null)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-[#17A9A6] rounded-full animate-ping opacity-75"></div>
                )}
              </div>

              {/* Tooltip - se muestra al hacer hover o cuando está seleccionado */}
              {showTooltip && (
                <div
                  className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px] z-50 transition-all duration-200 ${
                    isSelected ? "shadow-xl border-[#17A9A6]/20" : ""
                  }`}
                  style={{
                    left: `${x + 20}px`,
                    top: `${y - 40}px`,
                    transform:
                      x > (mapContainerRef.current?.offsetWidth || 0) - 220
                        ? "translateX(-100%) translateX(-20px)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold ${isSelected ? "text-[#17A9A6]" : "text-[#022222]"}`}>
                      Zone {spot.zone} - Spot {spot.spot}
                    </p>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: `${PAYMENT_STATE_COLORS[spot.type]}20`,
                        color: PAYMENT_STATE_COLORS[spot.type]
                      }}
                    >
                      {spot.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-2">
                    <span className="text-[#17A9A6]">{spot.maxTime}</span>
                    <span className="font-medium text-[#022222]">{spot.price}</span>
                    <span className="text-gray-500">{spot.distance}</span>
                  </div>
                  {!isSelected && (
                    <button
                      onClick={() => onSpotSelect(spot)}
                      className="w-full text-xs bg-[#17A9A6] text-white px-2 py-1 rounded hover:bg-[#17A9A6]/90 transition-colors"
                    >
                      Select this spot
                    </button>
                  )}
                  {isSelected && (
                    <button
                      onClick={() => centerOnSpot(spot)}
                      className="w-full text-xs bg-[#17A9A6] text-white px-2 py-1 rounded hover:bg-[#17A9A6]/90 transition-colors"
                    >
                      Center on map
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Información del mapa */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600">
          <div>Zoom: {mapZoom}</div>
          <div>Lat: {mapCenter.lat.toFixed(6)}</div>
          <div>Lng: {mapCenter.lng.toFixed(6)}</div>
        </div>
      </div>
    </div>
  )
}
