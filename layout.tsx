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
        <title>Parkat - Keep moving!</title>
        <meta name="description" content="Find and book parking spots easily with Parkat" />
      </head>
      <body>{children}</body>
    </html>
  )
}
