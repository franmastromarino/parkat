"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Car, Navigation, Clock, MapPin, AlertCircle } from "lucide-react"
import type { ParkingSpot } from "@/types/spots"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { GoogleMapsIcon, WazeIcon, AppleMapsIcon } from "./icons"

interface NavigationModalProps {
  isOpen: boolean
  onClose: () => void
  spot: ParkingSpot
}

export function NavigationModal({ isOpen, onClose, spot }: NavigationModalProps) {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [distance, setDistance] = useState<string>("")
  const [duration, setDuration] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      setLocationError("")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position)
          // Aquí podrías calcular la distancia y duración reales usando un servicio de rutas
          setDistance("1.2 km")
          setDuration("5 min")
        },
        (error) => {
          setLocationError("Por favor habilita los servicios de ubicación para usar la navegación")
          console.error("Error getting location:", error)
        },
      )
    }
  }, [isOpen])

  const handleNavigate = (app: "google" | "waze" | "apple") => {
    if (!userLocation) return

    const { latitude, longitude } = userLocation.coords
    const destination = `${spot.lat},${spot.lng}`

    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}&travelmode=driving`,
      waze: `https://www.waze.com/ul?ll=${spot.lat},${spot.lng}&navigate=yes`,
      apple: `maps://maps.apple.com/?saddr=${latitude},${longitude}&daddr=${spot.lat},${spot.lng}&dirflg=d`,
    }

    window.open(urls[app], "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Navegar al Aparcamiento</DialogTitle>
          </DialogHeader>

          {/* Spot Info */}
          <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-white shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg">
                Zone {spot.zone} - Spot {spot.spot}
              </h3>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{spot.maxTime}</span>
                </div>
                <span className="text-sm font-medium text-primary">{spot.price}</span>
              </div>
            </div>
            <Badge variant={spot.type === "Gratuito" ? "success" : spot.type === "Pago" ? "premium" : "secondary"}>
              {spot.type}
            </Badge>
          </div>

          {locationError ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{locationError}</p>
            </div>
          ) : (
            userLocation && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <Navigation className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{distance}</span>
                  <span className="text-xs text-muted-foreground">Distancia</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{duration}</span>
                  <span className="text-xs text-muted-foreground">Duración</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{spot.distance}</span>
                  <span className="text-xs text-muted-foreground">Desde ti</span>
                </div>
              </div>
            )
          )}

          {/* Navigation Options */}
          <div className="space-y-3">
            <Button
              variant="navigation"
              className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
              onClick={() => handleNavigate("google")}
              disabled={!userLocation}
            >
              <GoogleMapsIcon className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span>Abrir en Google Maps</span>
                <span className="text-xs text-white/70">Opción más popular</span>
              </div>
            </Button>
            <Button
              variant="navigation"
              className="bg-[#33CCFF] hover:bg-[#00AAE7] text-white"
              onClick={() => handleNavigate("waze")}
              disabled={!userLocation}
            >
              <WazeIcon className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span>Abrir en Waze</span>
                <span className="text-xs text-white/70">Actualizaciones de tráfico en tiempo real</span>
              </div>
            </Button>
            <Button
              variant="navigation"
              className="bg-black hover:bg-black/90 text-white"
              onClick={() => handleNavigate("apple")}
              disabled={!userLocation}
            >
              <AppleMapsIcon className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span>Abrir en Apple Maps</span>
                <span className="text-xs text-white/70">Mejor para dispositivos iOS</span>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
