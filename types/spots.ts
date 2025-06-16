export interface ParkingSpot {
  id: number
  lat: number
  lng: number
  zone: string
  spot: string
  maxTime: string
  type: "Exclusivo" | "Gratuito" | "Pago"
  price: string
  distance: string
}

