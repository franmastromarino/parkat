"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, CreditCard, LogOut, Menu, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  {
    icon: User,
    label: "Profile Settings",
    description: "Manage your account information",
  },
  {
    icon: CreditCard,
    label: "Subscription",
    description: "View your subscription details",
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Configure your notifications",
  },
  {
    icon: Settings,
    label: "Preferences",
    description: "Customize your experience",
  },
]

export function UserMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 py-6">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-secondary text-primary font-medium">JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">john@example.com</p>
            <div className="mt-1.5">
              <Badge variant="premium">Premium Plan</Badge>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Menu Items */}
        <div className="space-y-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Button key={index} variant="ghost" className="w-full justify-start gap-4 h-auto p-4 hover:bg-secondary">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-secondary text-primary ${
                    index === 0 ? "bg-primary text-white" : ""
                  }`}
                >
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
            <LogOut className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Log out</span>
            <span className="text-sm text-red-400">Sign out of your account</span>
          </div>
        </Button>
      </SheetContent>
    </Sheet>
  )
}

function Badge({ variant, children }: { variant: "premium"; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gradient-to-r from-primary to-violet-400 text-white">
      {children}
    </div>
  )
}

