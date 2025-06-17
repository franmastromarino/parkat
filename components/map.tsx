"use client"

import { useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import styles from "./map.module.css"
import type { ParkingSpot } from "@/types/spots"
import { PAYMENT_STATE_COLORS } from "@/lib/constants"

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

  // Inicializar mapa una sola vez
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
      center: [2.1938499, 41.3977081],
      zoom: 15,
    })

    const map = mapRef.current

    // Agregar marcador en la posición por defecto
    new maplibregl.Marker({
      color: "#17A9A6"
    })
      .setLngLat([2.1938499, 41.3977081])
      .addTo(map)

    // Agregar controles de zoom
    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-right",
    )

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // Solo se ejecuta al montar/desmontar

  // Crear marcadores cuando el mapa esté listo
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Esperar a que el mapa esté completamente cargado
    if (!map.isStyleLoaded()) {
      map.on('styledata', () => {
        if (Object.keys(markersRef.current).length > 0) return

        createMarkers()
      })
    } else {
      if (Object.keys(markersRef.current).length === 0) {
        createMarkers()
      }
    }

    function createMarkers() {
      // Crear marcadores y popups
      spots.forEach((spot) => {
        // Crear el elemento del marcador
        const markerEl = document.createElement("div")
        markerEl.className = styles.marker

        // Crear el popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          className: styles.popup,
          maxWidth: "300px",
        }).setHTML(`
          <div class="p-3">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-semibold text-parkat-dark">Zone ${spot.zone} - Spot ${spot.spot}</p>
              <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" style="background-color: ${PAYMENT_STATE_COLORS[spot.type]}20; color: ${PAYMENT_STATE_COLORS[spot.type]}; border-color: ${PAYMENT_STATE_COLORS[spot.type]}40;">
                ${spot.type}
              </span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-parkat-primary">${spot.maxTime}</span>
              <span class="font-medium text-parkat-dark">${spot.price}</span>
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
    }
  }, [spots, onSpotSelect, selectedSpot?.id])

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
