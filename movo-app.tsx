"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Clock, Menu, Plus } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState } from "react"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
})

// Sample parking spots data
const parkingSpots = [
  { id: 1, lat: 40.416775, lng: -3.70379, zone: "A", spot: "12", maxTime: "2h" },
  { id: 2, lat: 40.415875, lng: -3.70279, zone: "B", spot: "05", maxTime: "4h" },
  { id: 3, lat: 40.416975, lng: -3.70479, zone: "C", spot: "08", maxTime: "1h" },
]

export default function MovoApp() {
  const [selectedSpot, setSelectedSpot] = useState(null)

  return (
    <div className="min-h-screen bg-violet-50">
      {/* Header */}
      <header className="sticky top-0 z-[1000] bg-violet-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6" />
          <h1 className="text-2xl font-bold">movo</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm bg-violet-500 px-3 py-1 rounded-full">
            <span className="font-bold">12</span> spots available
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Map */}
        <div className="h-[40vh] md:h-[60vh] relative z-0">
          <MapContainer center={[40.416775, -3.70379]} zoom={15} className="h-full w-full" zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {parkingSpots.map((spot) => (
              <Marker
                key={spot.id}
                position={[spot.lat, spot.lng]}
                eventHandlers={{
                  click: () => setSelectedSpot(spot),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold">
                      Zone {spot.zone} - Spot {spot.spot}
                    </p>
                    <p className="text-sm text-violet-600">Max time: {spot.maxTime}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Spots List */}
        <div className="p-4 max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-violet-900">Nearby Spots</h2>
            <Button variant="ghost" className="text-violet-600 hover:text-violet-700">
              View all
            </Button>
          </div>

          {parkingSpots.map((spot) => (
            <Card
              key={spot.id}
              className={`border-violet-200 transition-all ${
                selectedSpot?.id === spot.id ? "ring-2 ring-violet-500" : ""
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Car className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-violet-900">
                      Zone {spot.zone} - Spot {spot.spot}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-violet-600">
                      <Clock className="w-4 h-4" />
                      <span>{spot.maxTime} max</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-violet-200 hover:bg-violet-100"
                  onClick={() => setSelectedSpot(spot)}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Park Now
        </Button>
      </div>
    </div>
  )
}

