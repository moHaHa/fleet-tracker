<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '@/stores/vehicles'
import VehiclesList from './VehiclesList.vue'
import VehicleDetails from './VehicleDetails.vue'

const props = defineProps<{
  isOpenCarsList: boolean
}>()
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)

const vehiclesStore = useVehiclesStore()
const { filteredVehicles, selectedVehicleId } = storeToRefs(vehiclesStore)

const markers = new Map<string, any>()
const popups = new Map<string, any>()

onMounted(() => {
  map.value = new maplibregl.Map({
    container: mapContainer.value!,
    style: 'https://demotiles.maplibre.org/style.json',
    center: [55.41488701544728, 25.03782109385589], // default center

    zoom: 10,
  })

  map.value.on('load', () => {
    updateAllMarkers()
  })
})

onUnmounted(() => {
  map.value?.remove()
})

function animateMarker(marker: any, from: any, to: any) {
  let progress = 0
  const duration = 1000
  const startTime = performance.now()

  function step(now: number) {
    progress = Math.min((now - startTime) / duration, 1)
    const lat = from.lat + (to.lat - from.lat) * progress
    const lng = from.lng + (to.lng - from.lng) * progress
    marker.setLngLat([lng, lat])
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function updateAllMarkers() {
  if (!map.value) return

  const currentIds = new Set(filteredVehicles.value.map((v) => v.id))

  markers.forEach((marker, id) => {
    if (!currentIds.has(id)) {
      marker.remove()
      markers.delete(id)

      const popup = popups.get(id)
      if (popup) {
        popup.remove()
        popups.delete(id)
      }
    }
  })

  filteredVehicles.value.forEach((v) => {
    const lngLat = [v.location.lng, v.location.lat]

    if (markers.has(v.id)) {
      const marker = markers.get(v.id)
      const popup = popups.get(v.id)
      const current = marker.getLngLat()

      const el = marker.getElement()
      el.style.background = {
        online: '#18c964',
        offline: '#9ca3af',
        alert: '#f31260',
      }[v.status]

      animateMarker(marker, { lat: current.lat, lng: current.lng }, v.location)

      if (popup) popup.setLngLat([v.location.lng, v.location.lat] as any)
      return
    }

    // create marker
    const el = document.createElement('div')
    el.className = 'vehicle-marker'
    el.style.width = '22px'
    el.style.height = '22px'
    el.style.borderRadius = '50%'
    el.style.cursor = 'pointer'

    el.style.background = {
      online: '#18c964',
      offline: '#9ca3af',
      alert: '#f31260',
    }[v.status]

    const popup = new maplibregl.Popup({
      closeButton: false,
      offset: 15,
    }).setText(v.name)

    popups.set(v.id, popup)

    const marker = new maplibregl.Marker({ element: el }).setLngLat(lngLat as any).addTo(map.value)

    markers.set(v.id, marker)

    el.addEventListener('mouseenter', () => {
      popup.setLngLat(marker.getLngLat()).addTo(map.value)
    })

    el.addEventListener('mouseleave', () => popup.remove())

    el.addEventListener('click', () => vehiclesStore.selectVehicle(v.id))
  })
}

const handleOnRowClick = (payload: { vehicle: any }) => {
  const vehicle = payload.vehicle
  map.value?.flyTo({
    center: [vehicle.location.lng, vehicle.location.lat],
    zoom: 14,
    essential: true,
  })
  const popup = popups.get(vehicle.id)
  if (popup) {
    popup.setLngLat([vehicle.location.lng, vehicle.location.lat]).addTo(map.value)
    setTimeout(() => {
      popup.remove()
    }, 2000)
  }
}
const ROUTE_SOURCE_ID = 'vehicle-route-source'
const ROUTE_LAYER_ID = 'vehicle-route-layer'
const handleDrawRoute = (payload: { vehicleId: string }) => {
  const vehicle = filteredVehicles.value.find((v) => v.id === payload.vehicleId)
  if (!vehicle) return

  const routeCoords = vehicle.history.map((e) => [e.lng, e.lat])

  drawRouteOnMap(routeCoords)
}
function drawRouteOnMap(lineCoords: number[][]) {
  if (!map.value) return

  if (map.value.getLayer(ROUTE_LAYER_ID)) {
    map.value.removeLayer(ROUTE_LAYER_ID)
  }
  if (map.value.getSource(ROUTE_SOURCE_ID)) {
    map.value.removeSource(ROUTE_SOURCE_ID)
  }

  map.value.addSource(ROUTE_SOURCE_ID, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: lineCoords,
      },
    },
  })

  map.value.addLayer({
    id: ROUTE_LAYER_ID,
    type: 'line',
    source: ROUTE_SOURCE_ID,
    paint: {
      'line-width': 4,
      'line-color': '#007aff',
      'line-opacity': 0.9,
    },
  })
}

watch(filteredVehicles, () => {
  updateAllMarkers()
})
</script>

<template>
  <div class="h-90vh bg-black border-1px border-solid border-white">
    <div class="w-full h-full relative overflow-hidden">
      <div ref="mapContainer" class="w-full h-full text-black"></div>
    </div>
    <VehiclesList v-if="props.isOpenCarsList" v-on:onRowClick="handleOnRowClick"></VehiclesList>
    <VehicleDetails
      v-if="selectedVehicleId"
      v-on:onClickViewRoute="handleDrawRoute"
    ></VehicleDetails>
  </div>
</template>

<style>
.vehicle-marker {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
