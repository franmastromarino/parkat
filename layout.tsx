import type React from "react"
import "./globals.css"

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
      <body>{children}</body>
    </html>
  )
}
