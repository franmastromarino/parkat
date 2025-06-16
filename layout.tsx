import type React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Movo - Smart Parking</title>
        <meta name="description" content="Find and book parking spots easily with Movo" />
      </head>
      <body>{children}</body>
    </html>
  )
}

