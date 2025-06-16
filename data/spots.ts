import type { ParkingSpot } from "@/types/spots"

// Coordenadas de Barcelona (41.3977081, 2.1938499)
const centerLat = 41.3977081
const centerLng = 2.1938499

// Función para generar coordenadas cercanas
const nearbyCoord = (base: number, range = 0.003) => {
  return base + (Math.random() * range * 2 - range)
}

export const parkingSpots: ParkingSpot[] = [
  {
    id: 1,
    zone: "A",
    spot: "12",
    type: "Pago",
    maxTime: "2h max",
    price: "€2.50/h",
    distance: "120m",
    lat: nearbyCoord(centerLat, 0.001),
    lng: nearbyCoord(centerLng, 0.001),
  },
  {
    id: 2,
    zone: "A",
    spot: "15",
    type: "Pago",
    maxTime: "2h max",
    price: "€2.50/h",
    distance: "150m",
    lat: nearbyCoord(centerLat, 0.001),
    lng: nearbyCoord(centerLng, 0.001),
  },
  {
    id: 3,
    zone: "B",
    spot: "04",
    type: "Exclusivo",
    maxTime: "4h max",
    price: "€3.00/h",
    distance: "200m",
    lat: nearbyCoord(centerLat, 0.002),
    lng: nearbyCoord(centerLng, 0.002),
  },
  {
    id: 4,
    zone: "B",
    spot: "08",
    type: "Gratuito",
    maxTime: "1h max",
    price: "Gratis",
    distance: "250m",
    lat: nearbyCoord(centerLat, 0.002),
    lng: nearbyCoord(centerLng, 0.002),
  },
  {
    id: 5,
    zone: "C",
    spot: "03",
    type: "Pago",
    maxTime: "3h max",
    price: "€2.00/h",
    distance: "300m",
    lat: nearbyCoord(centerLat, 0.0025),
    lng: nearbyCoord(centerLng, 0.0025),
  },
  {
    id: 6,
    zone: "C",
    spot: "07",
    type: "Exclusivo",
    maxTime: "2h max",
    price: "€4.00/h",
    distance: "320m",
    lat: nearbyCoord(centerLat, 0.0025),
    lng: nearbyCoord(centerLng, 0.0025),
  },
  {
    id: 7,
    zone: "D",
    spot: "01",
    type: "Gratuito",
    maxTime: "30min",
    price: "Gratis",
    distance: "400m",
    lat: nearbyCoord(centerLat, 0.003),
    lng: nearbyCoord(centerLng, 0.003),
  },
  {
    id: 8,
    zone: "D",
    spot: "09",
    type: "Pago",
    maxTime: "4h max",
    price: "€1.50/h",
    distance: "450m",
    lat: nearbyCoord(centerLat, 0.003),
    lng: nearbyCoord(centerLng, 0.003),
  },
]
