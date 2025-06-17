"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetPortal, SheetOverlay } from "@/components/ui/sheet"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Car, Clock, Filter, Search, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { ParkingSpot } from "@/types/spots"
import { PAYMENT_STATE_COLORS } from "@/lib/constants"
import { useState } from "react"

interface SpotCardProps {
  spot: ParkingSpot
  onSelect: (spot: ParkingSpot) => void
  isSelected: boolean
}

// Add state to track if sheet is open (add this after the interface)
interface SpotMenuProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot) => void
}

function SpotCard({ spot, onSelect, isSelected }: SpotCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all ${isSelected ? "border-primary bg-secondary shadow-lg" : "border-border hover:border-primary/20 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary text-white" : "bg-secondary text-primary"
            }`}
        >
          <Car className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium truncate">
                Zone {spot.zone} - Spot {spot.spot}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{spot.maxTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span>{spot.probability}</span>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0"
              style={{
                backgroundColor: `${PAYMENT_STATE_COLORS[spot.type]}20`,
                color: PAYMENT_STATE_COLORS[spot.type]
              }}
            >
              {spot.type}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-4 mt-4">
            <span className="text-sm text-muted-foreground">{spot.distance}</span>
            <Button
              onClick={() => onSelect(spot)}
              variant={isSelected ? "default" : "outline"}
              className={isSelected ? "" : "border-primary/20 text-primary hover:bg-primary/10"}
            >
              {isSelected ? "Seleccionado" : "Seleccionar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SpotsMenu({ spots, selectedSpot, onSpotSelect }: SpotMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative pl-4 pr-10 h-11 border-2 hover:border-primary/30 hover:bg-secondary bg-secondary/50 backdrop-blur-sm"
          onClick={toggleMenu}
        >
          <span className="font-semibold text-primary mr-1">{spots.length}</span>
          espacios disponibles
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="fixed inset-0 top-[76px] z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 top-[76px] right-0 h-[calc(100vh-76px)] w-[90vw] sm:w-[540px] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <SheetHeader>

            {/* Search and Filter */}
            <div className="flex gap-2 my-6">
              <div className="relative flex-1">
                <SheetTitle style={{ display: 'none' }}>Spots</SheetTitle>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar espacios..." className="pl-10" />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <Separator className="my-4" />

          {/* Spots List */}
          <ScrollArea className="h-[calc(100vh-220px)] pr-4 -mr-4">
            <div className="space-y-3">
              {spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} onSelect={onSpotSelect} isSelected={selectedSpot?.id === spot.id} />
              ))}
            </div>
          </ScrollArea>
          {/* <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close> */}
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  )
}
