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

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-secondary/50 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary animate-pulse" />
        <p className="text-secondary-foreground font-medium">Loading map...</p>
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

    // Scroll al spot seleccionado
    const spotIndex = sortedSpots.findIndex((s) => s.id === spot.id)
    if (scrollContainerRef.current && spotIndex !== -1) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 3
      const scrollPosition = Math.max(0, (spotIndex - 1) * cardWidth)
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 3
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-[1000] bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <UserMenu />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                  movo
                </h1>
                <p className="text-xs text-muted-foreground">Smart Parking</p>
              </div>
            </div>
            <SpotsMenu spots={sortedSpots} selectedSpot={selectedSpot} onSpotSelect={handleSpotSelect} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto">
        {/* Map Container */}
        <div className="h-[50vh] md:h-[60vh] relative rounded-b-3xl overflow-hidden shadow-lg">
          <MapWithNoSSR spots={sortedSpots} selectedSpot={selectedSpot} onSpotSelect={handleSpotSelect} />
        </div>

        {/* Spots List */}
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Available Parking Spots</h2>
              <p className="text-sm text-muted-foreground">Quick access to closest parking spots</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                className="rounded-full hover:bg-primary/10 hover:text-primary border-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                className="rounded-full hover:bg-primary/10 hover:text-primary border-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Carrusel horizontal */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
              {sortedSpots.map((spot) => (
                <Card
                  key={spot.id}
                  className={`flex-none w-[calc(33.333%-8px)] snap-center border-2 transition-all hover:shadow-md cursor-pointer ${
                    selectedSpot?.id === spot.id
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/20"
                  }`}
                  onClick={() => handleSpotSelect(spot)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedSpot?.id === spot.id ? "bg-primary text-white" : "bg-secondary text-primary"
                      }`}
                    >
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="font-medium truncate">
                            Zone {spot.zone} - Spot {spot.spot}
                          </p>
                          <span
                            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              spot.type === "Electric"
                                ? "bg-green-100 text-green-700"
                                : spot.type === "Premium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {spot.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{spot.maxTime}</span>
                        </div>
                        <span className="text-sm font-medium text-primary">{spot.price}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{spot.distance}</span>
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
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <Button variant="default" size="xl" onClick={handleParkNow} disabled={!selectedSpot} className="min-w-[200px]">
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

