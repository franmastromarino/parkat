"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Car, Clock, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { ParkingSpot } from "@/types/spots"

interface SpotCardProps {
  spot: ParkingSpot
  onSelect: (spot: ParkingSpot) => void
  isSelected: boolean
}

function SpotCard({ spot, onSelect, isSelected }: SpotCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all ${
        isSelected ? "border-primary bg-secondary shadow-lg" : "border-border hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
            isSelected ? "bg-primary text-white" : "bg-secondary text-primary"
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
                <span className="text-sm font-medium text-primary">{spot.price}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`shrink-0 ${
                spot.type === "Electric"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : spot.type === "Premium"
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    : "bg-secondary text-secondary-foreground"
              }`}
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
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SpotMenuProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot) => void
}

export function SpotsMenu({ spots, selectedSpot, onSpotSelect }: SpotMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative pl-4 pr-10 h-11 border-2 hover:border-primary/30 hover:bg-secondary"
        >
          <span className="font-semibold text-primary mr-1">{spots.length}</span>
          spots available
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-[540px] p-6">
        <SheetHeader className="space-y-1">
          <SheetTitle>Available Parking Spots</SheetTitle>
          <p className="text-sm text-muted-foreground">Find and select your perfect parking spot</p>
        </SheetHeader>

        {/* Search and Filter */}
        <div className="flex gap-2 my-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search spots..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Spots List */}
        <ScrollArea className="h-[calc(100vh-220px)] pr-4 -mr-4">
          <div className="space-y-3">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} onSelect={onSpotSelect} isSelected={selectedSpot?.id === spot.id} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

