<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '@/stores/vehicles'
import VehiclesList from './VehiclesList.vue'

const props = defineProps<{
  isOpenCarsList: boolean
}>()
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)

const vehiclesStore = useVehiclesStore()
const { filteredVehicles } = storeToRefs(vehiclesStore)

const markers = new Map<string, any>()
const popups = new Map<string, any>()

// -----------------------------
// Init map
// -----------------------------
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

// -----------------------------
// Smooth Movement Utility
// -----------------------------
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

// -----------------------------
// Create / Update Markers
// -----------------------------
function updateAllMarkers() {
  if (!map.value) return

  const currentIds = new Set(filteredVehicles.value.map((v) => v.id))

  // -----------------------------
  // Remove markers not in filtered list
  // -----------------------------
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

  // -----------------------------
  // Create / Update remaining markers
  // -----------------------------
  filteredVehicles.value.forEach((v) => {
    const lngLat = [v.location.lng, v.location.lat]

    if (markers.has(v.id)) {
      const marker = markers.get(v.id)
      const popup = popups.get(v.id)
      const current = marker.getLngLat()

      // -----------------------------
      // UPDATE MARKER COLOR (FIX)
      // -----------------------------
      const el = marker.getElement()
      el.style.background = {
        online: '#18c964',
        offline: '#9ca3af',
        alert: '#f31260',
      }[v.status]

      // -----------------------------
      // ANIMATE POSITION
      // -----------------------------
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

// -----------------------------
// Watch store updates
// -----------------------------
watch(filteredVehicles, () => {
  updateAllMarkers()
})
</script>

<template>
  <div class="h-500px bg-black border-1px border-solid border-white">
    <div class="w-full h-full relative overflow-hidden">
      <div ref="mapContainer" class="w-full h-full text-black"></div>
    </div>
    <VehiclesList v-if="props.isOpenCarsList"></VehiclesList>
  </div>
</template>

<style>
.vehicle-marker {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
