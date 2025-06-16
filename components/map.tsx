"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import styles from "./map.module.css"
import type { ParkingSpot } from "@/types/spots"

interface MapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSpotSelect: (spot: ParkingSpot) => void
}

export default function Map({ spots, selectedSpot, onSpotSelect }: MapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<{ [key: number]: maplibregl.Marker }>({})
  const popupsRef = useRef<{ [key: number]: maplibregl.Popup }>({})
  const mapContainer = useRef<HTMLDivElement>(null)

  // Inicializar mapa y marcadores
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#f8fafc",
            },
          },
          {
            id: "osm",
            type: "raster",
            source: "osm",
            paint: {
              "raster-opacity": 0.7,
              "raster-saturation": -0.9,
              "raster-contrast": 0.2,
              "raster-brightness-min": 0.9,
              "raster-brightness-max": 1,
            },
          },
        ],
      },
      center: [spots[0].lng, spots[0].lat],
      zoom: 15,
    })

    const map = mapRef.current

    // Crear marcadores y popups
    spots.forEach((spot) => {
      // Crear el elemento del marcador
      const markerEl = document.createElement("div")
      markerEl.className = styles.marker

      if (selectedSpot?.id === spot.id) {
        markerEl.classList.add(styles.selected)
      }

      // Crear el popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: styles.popup,
        maxWidth: "300px",
      }).setHTML(`
        <div class="p-3">
          <div class="flex items-center gap-2 mb-1">
            <p class="font-semibold text-violet-900">Zone ${spot.zone} - Spot ${spot.spot}</p>
            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              spot.type === "Electric"
                ? "bg-green-100 text-green-700 border-green-200"
                : spot.type === "Premium"
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
            }">
              ${spot.type}
            </span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span class="text-violet-600">${spot.maxTime}</span>
            <span class="font-medium text-violet-900">${spot.price}</span>
            <span class="text-gray-500">${spot.distance}</span>
          </div>
        </div>
      `)

      // Crear el marcador
      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map)

      // Guardar referencias
      markersRef.current[spot.id] = marker
      popupsRef.current[spot.id] = popup

      // Eventos del marcador
      markerEl.addEventListener("click", (e) => {
        e.stopPropagation()
        onSpotSelect(spot)
      })

      markerEl.addEventListener("mouseenter", () => {
        marker.setPopup(popup)
        popup.addTo(map)
      })

      markerEl.addEventListener("mouseleave", () => {
        if (selectedSpot?.id !== spot.id) {
          popup.remove()
        }
      })
    })

    // Agregar controles de zoom
    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-right",
    )

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove())
      Object.values(popupsRef.current).forEach((popup) => popup.remove())
      markersRef.current = {}
      popupsRef.current = {}
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [spots, selectedSpot?.id, onSpotSelect]) // Solo se ejecuta al montar/desmontar

  // Actualizar estado visual de los marcadores cuando cambia la selección
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement()
      const isSelected = selectedSpot?.id === Number(id)

      markerEl.classList.toggle(styles.selected, isSelected)

      // Manejar popup
      const popup = popupsRef.current[Number(id)]
      if (isSelected) {
        marker.setPopup(popup)
        popup.addTo(mapRef.current!)
      } else {
        popup.remove()
      }
    })

    // Centrar mapa en el spot seleccionado
    if (selectedSpot && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedSpot.lng, selectedSpot.lat],
        zoom: 16,
        duration: 1000,
      })
    }
  }, [selectedSpot])

  return <div ref={mapContainer} className={styles.map} />
}

