export interface ParkingSpot {
  id: number
  zone: string
  spot: string
  maxTime: string
  type: "Exclusivo" | "Gratuito" | "Pago"
  probability: "low" | "medium" | "high"
  distance: string
  coords?: {
    lat: number
    lng: number
  }
}
