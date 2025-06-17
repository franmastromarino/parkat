"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetHeader, SheetTitle, SheetTrigger, SheetPortal, SheetOverlay } from "@/components/ui/sheet"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Bell, CreditCard, LogOut, Menu, Settings, User, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    icon: User,
    label: "Perfil",
    description: "Información de tu cuenta",
  },
  {
    icon: CreditCard,
    label: "Suscripción",
    description: "Detalles de tu suscripción",
  },
  {
    icon: Bell,
    label: "Notificaciones",
    description: "Configura tus notificaciones",
  },
  {
    icon: Settings,
    label: "Preferencias",
    description: "Personaliza tu experiencia",
  },
]

// Add state to track if sheet is open (add this after the menuItems array)
export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-secondary"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="fixed inset-0 top-[76px] z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 top-[76px] left-0 h-[calc(100vh-76px)] w-[300px] sm:w-[400px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <SheetHeader>
            {/* User Profile Section */}
            <div className="flex items-center gap-4 py-6">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/placeholder.jpeg" />
                <AvatarFallback className="bg-secondary text-primary font-medium">JD</AvatarFallback>
              </Avatar>
              <div>

                <SheetTitle>John Doe</SheetTitle>
                <p className="text-sm text-muted-foreground">john@example.com</p>
                <div className="mt-1.5">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary to-violet-400 text-white">
                    Subscripcion
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Separator className="my-4" />

          {/* Menu Items */}
          <div className="space-y-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button key={index} variant="ghost" className="w-full justify-start gap-4 h-auto p-4 hover:bg-secondary">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-white flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </div>
                </Button>
              )
            })}
          </div>

          <Separator className="my-4" />

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 h-auto p-4 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Cerrar sesión</span>
              <span className="text-sm text-red-400">Salir de tu cuenta</span>
            </div>
          </Button>
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  )
}
