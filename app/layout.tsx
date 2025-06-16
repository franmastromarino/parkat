import type React from "react"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "Parkat - Keep moving!",
  description: "Encuentra y reserva espacios de aparcamiento fácilmente con Parkat",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
