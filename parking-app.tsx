import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Clock, MapPin, Menu, Plus } from "lucide-react"

export default function ParkingApp() {
  return (
    <div className="min-h-screen bg-violet-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-violet-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-bold">ParkSpot</h1>
        </div>
        <Button variant="ghost" className="text-white hover:text-violet-200">
          <MapPin className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-violet-600 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-violet-200">Available Spots</p>
            </CardContent>
          </Card>
          <Card className="bg-violet-600 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-2xl font-bold">45m</p>
              <p className="text-sm text-violet-200">Time Left</p>
            </CardContent>
          </Card>
        </div>

        {/* Parking Spots */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-violet-900">Nearby Spots</h2>

          <Card className="border-violet-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-violet-900">Zone A - Spot 12</p>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Clock className="w-4 h-4" />
                    <span>2h max</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-violet-200 hover:bg-violet-100">
                Select
              </Button>
            </CardContent>
          </Card>

          <Card className="border-violet-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-violet-900">Zone B - Spot 05</p>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Clock className="w-4 h-4" />
                    <span>4h max</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-violet-200 hover:bg-violet-100">
                Select
              </Button>
            </CardContent>
          </Card>

          <Card className="border-violet-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-violet-900">Zone C - Spot 08</p>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Clock className="w-4 h-4" />
                    <span>1h max</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-violet-200 hover:bg-violet-100">
                Select
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Park
        </Button>
      </div>
    </div>
  )
}

