"use client"

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo
} from "react"
import {
  GoogleMap,
  useLoadScript,
  OverlayView,
  DirectionsRenderer
} from "@react-google-maps/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Car,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Navigation,
  TrendingUp,
  Locate
} from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { SpotsMenu } from "@/components/spots-menu"
import { parkingSpots } from "@/data/spots"
import type { ParkingSpot } from "@/types/spots"
import { NavigationModal } from "@/components/navigation-modal"
import { PAYMENT_STATE_COLORS } from "@/lib/constants"

const containerStyle = { width: "100%", height: "100%" }
const defaultCenter = { lat: 41.3851, lng: 2.1734 }
const LIBRARIES: ("places")[] = ["places"]

const sortSpotsByDistance = (spots: ParkingSpot[]) =>
  [...spots].sort((a, b) => parseInt(a.distance) - parseInt(b.distance))

const SpotMarker = memo(
  ({
    spot,
    isSelected,
    onClick
  }: {
    spot: ParkingSpot
    isSelected: boolean
    onClick: () => void
  }) => (
    <OverlayView
      position={spot.coords}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={onClick}
        className="cursor-pointer relative w-8 h-8 flex items-center justify-center"
      >
        {isSelected && (
          <div
            className="absolute animate-ping-fast w-full h-full rounded-full opacity-75"
            style={{ backgroundColor: PAYMENT_STATE_COLORS[spot.type] }}
          />
        )}
        <div
          className="w-6 h-6 rounded-full z-10 flex items-center justify-center border-2 border-white"
          style={{ backgroundColor: PAYMENT_STATE_COLORS[spot.type] }}
        >
          <Car className="w-3 h-3 text-white" />
        </div>
      </div>
    </OverlayView>
  )
)

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

  const sortedSpots = useMemo(() => sortSpotsByDistance(parkingSpots), [])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const mapRef = useRef<google.maps.Map | null>(null)
  const zoomRef = useRef<number | undefined>(undefined)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    map.setCenter(defaultCenter)
    zoomRef.current = map.getZoom()
    map.addListener("zoom_changed", () => {
      zoomRef.current = map.getZoom()
    })
  }, [])

  const scrollToIndex = (index: number) => {
    const el = itemRefs.current[index]
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const moveCenter = (coords: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.panTo(coords)
    }
  }

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation)
      toast.success("Centrado en tu ubicación")
    } else {
      toast.error("Ubicación no disponible")
    }
  }

  const handleSpotSelect = (spot: ParkingSpot, index: number) => {
    setSelectedSpot(spot)
    setCurrentIndex(index)
    scrollToIndex(index)
    toast.success(`Seleccionado Zona ${spot.zone} - Espacio ${spot.spot}`)
    if (spot.coords) moveCenter(spot.coords)
  }

  const scrollNext = () => {
    if (currentIndex < sortedSpots.length - 1) {
      handleSpotSelect(sortedSpots[currentIndex + 1], currentIndex + 1)
    }
  }

  const scrollPrev = () => {
    if (currentIndex > 0) {
      handleSpotSelect(sortedSpots[currentIndex - 1], currentIndex - 1)
    }
  }

  const handleParkNow = () => {
    if (!selectedSpot) {
      toast.error("Por favor selecciona un espacio de aparcamiento primero")
      return
    }
    setIsNavigationOpen(true)
  }

  const calculateRoute = useCallback(() => {
    if (!userLocation || !selectedSpot?.coords) return
    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedSpot.coords,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result)
        } else {
          toast.error("No se pudo calcular la ruta")
        }
      }
    )
  }, [userLocation, selectedSpot])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          if (mapRef.current) {
            mapRef.current.setCenter(coords)
          }
        },
        () => toast.error("No se pudo obtener tu ubicación actual"),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  useEffect(() => {
    if (userLocation && selectedSpot) {
      calculateRoute()
    }
  }, [userLocation, selectedSpot, calculateRoute])

  const isSelected = (spot: ParkingSpot) => selectedSpot?.id === spot.id

  return (
    <div className="h-dvh flex flex-col bg-[#F2F5F4] overflow-hidden">
      <header className="flex-shrink-0 z-40 bg-[#e0f5f2] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMenu />
            <img src="/logo.png" alt="Parkat" className="h-8 object-contain" />
          </div>
          <SpotsMenu
            spots={sortedSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={(spot) =>
              handleSpotSelect(spot, sortedSpots.findIndex((s) => s.id === spot.id))
            }
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto min-h-0">
        <div className="flex-[2] relative overflow-hidden shadow-lg">
          {!isLoaded ? (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation || defaultCenter}
              zoom={14}
              onLoad={onLoad}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: "greedy",
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              {sortedSpots.map((spot, index) => (
                <SpotMarker
                  key={spot.id}
                  spot={spot}
                  isSelected={isSelected(spot)}
                  onClick={() => handleSpotSelect(spot, index)}
                />
              ))}

              {userLocation && (
                <OverlayView position={userLocation} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div
                    onClick={() => {
                      toast.success("Ubicación actual seleccionada como punto de partida")
                      if (selectedSpot) calculateRoute()
                    }}
                    className="cursor-pointer relative w-6 h-6 flex items-center justify-center"
                  >
                    <div className="absolute animate-ping-fast w-full h-full bg-blue-400 rounded-full opacity-75" />
                    <div className="w-3 h-3 bg-blue-600 rounded-full z-10" />
                  </div>
                </OverlayView>
              )}

              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    preserveViewport: true,     // mantiene el zoom
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: "#17A9A6",
                      strokeOpacity: 0.9,
                      strokeWeight: 5
                    }
                  }}
                />
              )}
            </GoogleMap>
          )}
          
          {/* Center on user location button */}
          <div className="absolute top-4 right-2 z-10">
            <Button
              onClick={centerOnUser}
              disabled={!userLocation}
              className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-lg border border-gray-200 disabled:opacity-50"
            >
              <Locate className="w-6 h-6" />
            </Button>
          </div>
        </div>

            <div className="px-6 py-4 flex items-center justify-between relative before:content-[''] before:absolute before:inset-x-0 before:-bottom-5 before:h-5 before:bg-gradient-to-b before:from-[#F2F5F4]/100 before:to-transparent before:pointer-events-none before:z-10">
              <h2 className="text-lg font-semibold text-[#022222]">Espacios Disponibles</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full border-2 border-[#95DBD5] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={currentIndex >= sortedSpots.length - 1}
                  className="rounded-full border-2 border-[#95DBD5] disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

        <div className="flex-[3] min-h-0 overflow-hidden">
          <div className="h-full overflow-y-auto">

            <div className="px-6 flex flex-col gap-4 py-4">
              {sortedSpots.map((spot, index) => (
                <div key={spot.id} ref={(el) => { itemRefs.current[index] = el }}>
                  <Card
                    onClick={() => handleSpotSelect(spot, index)}
                    className={`w-full border-2 cursor-pointer ${isSelected(spot)
                      ? "border-[#17A9A6] shadow-lg shadow-[#17A9A6]/10"
                      : "border-[#95DBD5]/30 hover:border-[#17A9A6]/20"
                      }`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected(spot)
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
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${PAYMENT_STATE_COLORS[spot.type]}20`,
                              color: PAYMENT_STATE_COLORS[spot.type]
                            }}
                          >
                            {spot.type}
                          </span>
                        </div>
                        <div className="text-sm text-[#022222]/70 flex gap-4 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{spot.maxTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                            <TrendingUp className="w-4 h-4" />
                            <span>{spot.probability}</span>
                          </div>
                          <span className="ml-auto">{spot.distance}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 sticky bottom-0 p-6 pt-12 flex justify-center z-50 bg-gradient-to-t from-[#F2F5F4] to-transparent">
              <Button
                variant="default"
                size="xl"
                onClick={handleParkNow}
                disabled={!selectedSpot}
                className="h-12 min-w-[240px] rounded-full px-8 text-base bg-[#17A9A6] hover:bg-[#17A9A6]/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
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
          </div>
        </div>
      </main>

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
