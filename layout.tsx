import type React from "react"
import "./globals.css"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Parkat - Keep moving!</title>
        <meta name="description" content="Encuentra y reserva espacios de aparcamiento fácilmente con Parkat" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
