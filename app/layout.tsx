import type React from "react"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "Movo - Smart Parking",
  description: "Find and book parking spots easily with Movo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

