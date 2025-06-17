export interface ParkingSpot {
  id: number
  zone: string
  spot: string
  maxTime: string
  type: "Exclusivo" | "Gratuito" | "Pago"
  price: string
  distance: string
  coords?: {
    lat: number
    lng: number
  }
}
