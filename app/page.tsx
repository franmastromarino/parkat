"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Clock, ChevronLeft, ChevronRight, Plus, Navigation } from "lucide-react"
import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { UserMenu } from "@/components/user-menu"
import { SpotsMenu } from "@/components/spots-menu"
import { parkingSpots } from "@/data/spots"
import type { ParkingSpot } from "@/types/spots"
import { NavigationModal } from "@/components/navigation-modal"
import { toast } from "sonner"

// Importar el mapa simplificado en lugar del mapa con maplibre-gl
const SimpleMapWithNoSSR = dynamic(() => import("@/components/simple-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
          <div className="w-8 h-8 text-[#17A9A6]/50">🗺️</div>
        </div>
        <p className="text-[#17A9A6] font-medium">Loading map...</p>
      </div>
    </div>
  ),
})

// Función para ordenar spots por distancia
const sortSpotsByDistance = (spots: ParkingSpot[]) => {
  return [...spots].sort((a, b) => {
    const distA = Number.parseInt(a.distance.replace("m", ""))
    const distB = Number.parseInt(b.distance.replace("m", ""))
    return distA - distB
  })
}

export default function MovoApp() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sortedSpots = sortSpotsByDistance(parkingSpots)

  const handleParkNow = () => {
    if (!selectedSpot) {
      toast.error("Please select a parking spot first")
      return
    }
    setIsNavigationOpen(true)
  }

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot)
    toast.success(`Selected Zone ${spot.zone} - Spot ${spot.spot}`)

    // Scroll al spot seleccionado
    const spotIndex = sortedSpots.findIndex((s) => s.id === spot.id)
    if (scrollContainerRef.current && spotIndex !== -1) {
      const cardHeight = scrollContainerRef.current.scrollHeight / sortedSpots.length
      const scrollPosition = Math.max(0, spotIndex * cardHeight)
      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  const scroll = (direction: "up" | "down") => {
    if (scrollContainerRef.current) {
      const cardHeight = scrollContainerRef.current.scrollHeight / sortedSpots.length
      const currentScroll = scrollContainerRef.current.scrollTop
      const newScroll = direction === "up" ? currentScroll - cardHeight : currentScroll + cardHeight

      scrollContainerRef.current.scrollTo({
        top: newScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F5F4]">
      {/* Header */}
      <header className="sticky top-0 z-[1000] bg-[#17A9A6] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <UserMenu />
              <div className="flex flex-col gap-1">
                <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
              </div>
            </div>
            <SpotsMenu spots={sortedSpots} selectedSpot={selectedSpot} onSpotSelect={handleSpotSelect} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto">
        {/* Map Container */}
        <div className="h-[50vh] md:h-[60vh] relative overflow-hidden shadow-lg">
          <SimpleMapWithNoSSR spots={sortedSpots} selectedSpot={selectedSpot} onSpotSelect={handleSpotSelect} />
        </div>

        {/* Spots List */}
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#022222]">Available Parking Spots</h2>
              <p className="text-sm text-[#022222]/70">Quick access to closest parking spots</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("up")}
                className="rounded-full hover:bg-[#17A9A6]/10 hover:text-[#17A9A6] border-2 border-[#95DBD5]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("down")}
                className="rounded-full hover:bg-[#17A9A6]/10 hover:text-[#17A9A6] border-2 border-[#95DBD5]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lista vertical */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex flex-col overflow-y-auto gap-4 pb-4 snap-y snap-mandatory scrollbar-hide max-h-96"
            >
              {sortedSpots.map((spot) => (
                <Card
                  key={spot.id}
                  className={`flex-none w-full snap-center border-2 transition-all hover:shadow-md cursor-pointer ${
                    selectedSpot?.id === spot.id
                      ? "border-[#17A9A6] shadow-lg shadow-[#17A9A6]/10"
                      : "border-[#95DBD5]/30 hover:border-[#17A9A6]/20"
                  }`}
                  onClick={() => handleSpotSelect(spot)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedSpot?.id === spot.id ? "bg-[#17A9A6] text-white" : "bg-[#95DBD5]/20 text-[#17A9A6]"
                      }`}
                    >
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="font-medium truncate text-[#022222]">
                            Zone {spot.zone} - Spot {spot.spot}
                          </p>
                          <span
                            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              spot.type === "Pago"
                                ? "bg-[#17A9A6]/10 text-[#17A9A6]"
                                : spot.type === "Exclusivo"
                                  ? "bg-[#95DBD5]/30 text-[#022222]"
                                  : spot.type === "Gratuito"
                                    ? "bg-[#F2F5F4] text-[#022222]"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {spot.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-[#022222]/70">
                          <Clock className="w-4 h-4" />
                          <span>{spot.maxTime}</span>
                        </div>
                        <span className="text-sm font-medium text-[#17A9A6]">{spot.price}</span>
                        <span className="text-sm text-[#022222]/70 ml-auto">{spot.distance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Button */}
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
              <Navigation className="w-5 h-5 mr-2" />
              Navigate Now
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Select Spot
            </>
          )}
        </Button>
      </div>

      {/* Navigation Modal */}
      {selectedSpot && (
        <NavigationModal isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} spot={selectedSpot} />
      )}
    </div>
  )
}
