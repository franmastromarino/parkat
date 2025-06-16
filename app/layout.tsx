import type React from "react"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "Parkat - Keep moving!",
  description: "Find and book parking spots easily with Parkat",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

