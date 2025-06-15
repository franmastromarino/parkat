import { Car } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <Car className="w-3 h-3 text-white absolute -bottom-1 -right-1" />
      </div>
      <span className="font-bold text-xl">arkat</span>
    </div>
  )
}
