"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Clock, ChevronLeft, ChevronRight, Plus, Navigation } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { SpotsMenu } from "@/components/spots-menu"
import { parkingSpots } from "@/data/spots"
import type { ParkingSpot } from "@/types/spots"
import { NavigationModal } from "@/components/navigation-modal"

const SimpleMapWithNoSSR = dynamic(() => import("@/components/simple-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
          <div className="w-8 h-8 text-[#17A9A6]/50">🗺️</div>
        </div>
        <p className="text-[#17A9A6] font-medium">Cargando mapa...</p>
      </div>
    </div>
  )
})

const sortSpotsByDistance = (spots: ParkingSpot[]) =>
  [...spots].sort((a, b) => parseInt(a.distance) - parseInt(b.distance))

export default function MovoApp() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sortedSpots = sortSpotsByDistance(parkingSpots)

  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollToIndex = (index: number) => {
    const el = itemRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSpotSelect = (spot: ParkingSpot, index: number) => {
    setSelectedSpot(spot)
    setCurrentIndex(index)
    scrollToIndex(index)
    toast.success(`Seleccionado Zona ${spot.zone} - Espacio ${spot.spot}`)
  }

  const scrollNext = () => {
    if (currentIndex < sortedSpots.length - 1) {
      const nextIndex = currentIndex + 1
      setSelectedSpot(sortedSpots[nextIndex])
      setCurrentIndex(nextIndex)
      scrollToIndex(nextIndex)
    }
  }

  const scrollPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setSelectedSpot(sortedSpots[prevIndex])
      setCurrentIndex(prevIndex)
      scrollToIndex(prevIndex)
    }
  }

  const handleParkNow = () => {
    if (!selectedSpot) {
      toast.error("Por favor selecciona un espacio de aparcamiento primero")
      return
    }
    setIsNavigationOpen(true)
  }

  return (
    <div className="h-screen flex flex-col bg-[#F2F5F4]">
      <header className="flex-shrink-0 z-[1000] bg-[#e0f5f2] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMenu />
            <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
          </div>
          <SpotsMenu
            spots={sortedSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={(spot) => handleSpotSelect(spot, sortedSpots.findIndex((s) => s.id === spot.id))}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto" style={{ height: "calc(100vh - 76px)" }}>
        <div className="h-[50vh] relative overflow-hidden shadow-lg">
          <SimpleMapWithNoSSR
            spots={sortedSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={(spot) => handleSpotSelect(spot, sortedSpots.findIndex((s) => s.id === spot.id))}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="px-6 sticky top-0 z-30 pt-2 pb-4 flex items-center justify-between before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-16 before:bg-gradient-to-b before:from-[#F2F5F4]/100 before:to-transparent before:pointer-events-none before:-z-10">
              <h2 className="text-lg font-semibold text-[#022222]">Espacios Disponibles</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full border-2 border-[#95DBD5]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={currentIndex >= sortedSpots.length - 1}
                  className="rounded-full border-2 border-[#95DBD5]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="px-6 flex flex-col gap-4" style={{ paddingBottom: "96px" }}>
              {sortedSpots.map((spot, index) => (
                <div key={spot.id} ref={(el) => (itemRefs.current[index] = el)}>
                  <Card
                    onClick={() => handleSpotSelect(spot, index)}
                    className={`w-full border-2 cursor-pointer ${selectedSpot?.id === spot.id
                      ? "border-[#17A9A6] shadow-lg shadow-[#17A9A6]/10"
                      : "border-[#95DBD5]/30 hover:border-[#17A9A6]/20"
                      }`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedSpot?.id === spot.id
                          ? "bg-[#17A9A6] text-white"
                          : "bg-[#95DBD5]/20 text-[#17A9A6]"
                          }`}
                      >
                        <Car className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate text-[#022222]">
                            Zona {spot.zone} - Espacio {spot.spot}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${spot.type === "Pago"
                              ? "bg-[#17A9A6]/10 text-[#17A9A6]"
                              : spot.type === "Exclusivo"
                                ? "bg-[#95DBD5]/30 text-[#022222]"
                                : "bg-[#F2F5F4] text-[#022222]"
                              }`}
                          >
                            {spot.type}
                          </span>
                        </div>
                        <div className="text-sm text-[#022222]/70 flex gap-4 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{spot.maxTime}</span>
                          </div>
                          <span className="font-medium text-[#17A9A6]">{spot.price}</span>
                          <span className="ml-auto">{spot.distance}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 p-6 left-0 right-0 flex justify-center z-50 before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-24 before:bg-gradient-to-t before:from-[#F2F5F4]/100 before:to-transparent before:pointer-events-none before:-z-10">
        <Button
          variant="default"
          size="xl"
          onClick={handleParkNow}
          disabled={!selectedSpot}
          className="min-w-[200px] bg-[#17A9A6] hover:bg-[#17A9A6]/90 text-white"
        >
          {selectedSpot ? (
            <>
              <Navigation className="w-5 h-5 mr-2" /> Navegar Ahora
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" /> Seleccionar Espacio
            </>
          )}
        </Button>
      </div>

      {selectedSpot && (
        <NavigationModal
          isOpen={isNavigationOpen}
          onClose={() => setIsNavigationOpen(false)}
          spot={selectedSpot}
        />
      )}
    </div>
  )
}