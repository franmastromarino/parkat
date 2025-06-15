export interface ParkingSpot {
  id: number
  lat: number
  lng: number
  zone: string
  spot: string
  maxTime: string
  type: "Standard" | "Electric" | "Premium"
  price: string
  distance: string
}
