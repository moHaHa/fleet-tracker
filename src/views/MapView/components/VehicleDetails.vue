<script lang="ts" setup>
import { useVehiclesStore } from '@/stores/vehicles'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
const emit = defineEmits<{
  onClickViewRoute: [payload: { vehicleId: string }]
}>()
const onClickViewRoute = (vehicleId: string) => {
  emit('onClickViewRoute', { vehicleId })
}
const vehiclesStore = useVehiclesStore()
const { selectedVehicle, selectedVehicleId } = storeToRefs(vehiclesStore)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-[#44bd87]'
    case 'offline':
      return 'bg-gray-400'
    case 'alert':
      return 'bg-[#fe4f4f]'
    default:
      return 'bg-gray-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'online':
      return 'Online'
    case 'offline':
      return 'Offline'
    case 'alert':
      return 'Alert'
    default:
      return 'Unknown'
  }
}

const formatSpeed = (speed: number) => {
  return `${speed} km/h`
}

const formatCoordinates = (lat: number, lng: number) => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}
</script>

<template>
  <div
    v-if="selectedVehicle"
    class="fixed top-90px left-10px bg-black h-[calc(100vh-100px)] w-300px rounded-12px text-white overflow-hidden flex flex-col border border-gray-700"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-700 bg-[#111111]">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Vehicle Details</h2>
        <div class="flex items-center">
          <span
            class="inline-block w-2 h-2 rounded-full mr-2"
            :class="getStatusColor(selectedVehicle.status)"
          ></span>
          <span class="text-12px">{{ getStatusText(selectedVehicle.status) }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-4 bg-black">
      <!-- Vehicle Info -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-300 mb-3">Vehicle Information</h3>
        <div class="space-y-3">
          <div>
            <p class="text-12px text-gray-400">Name</p>
            <p class="text-sm">{{ selectedVehicle.name }}</p>
          </div>
          <div>
            <p class="text-12px text-gray-400">Plate Number</p>
            <p class="text-sm">{{ selectedVehicle.plate }}</p>
          </div>
          <div>
            <p class="text-12px text-gray-400">Type</p>
            <p class="text-sm">{{ selectedVehicle.type }}</p>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-300 mb-3">Current Status</h3>
        <div class="space-y-3">
          <div>
            <p class="text-12px text-gray-400">Speed</p>
            <p class="text-sm">{{ formatSpeed(selectedVehicle.speed) }}</p>
          </div>
          <div>
            <p class="text-12px text-gray-400">Location</p>
            <p class="text-sm">
              {{ formatCoordinates(selectedVehicle.location.lat, selectedVehicle.location.lng) }}
            </p>
          </div>
          <div>
            <p class="text-12px text-gray-400">Last Updated</p>
            <p class="text-sm">
              {{ dayjs(selectedVehicle.lastUpdated).format('MMM D, YYYY H:mm:ss A') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Recent History -->
      <div>
        <h3 class="text-sm font-medium text-gray-300 mb-3">Recent History</h3>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div
            v-for="(entry, index) in selectedVehicle.history.slice(-5)"
            :key="index"
            class="p-2 rounded-lg bg-[#111111] border border-gray-800"
          >
            <div class="flex justify-between text-12px">
              <span>{{ dayjs(entry.timestamp).format('H:mm A') }}</span>
            </div>
            <p class="text-11px text-gray-400 mt-1">
              {{ formatCoordinates(entry.lat, entry.lng) }}
            </p>
          </div>
          <p
            v-if="selectedVehicle.history.length === 0"
            class="text-12px text-gray-400 text-center py-2"
          >
            No history available
          </p>
        </div>
      </div>
    </div>

    <!-- Footer with action buttons -->
    <div class="p-3 border-t border-gray-700 bg-[#111111]">
      <div class="flex justify-between">
        <button
          v-on:click="selectedVehicleId && onClickViewRoute(selectedVehicleId)"
          class="px-3 py-1.5 text-12px bg-[#222222] border border-gray-600 rounded-lg hover:bg-[#333333] transition-colors"
        >
          View Route
        </button>
        <button
          v-on:click="selectedVehicleId = null"
          class="px-3 py-1.5 text-12px bg-[#222222] border border-gray-600 rounded-lg hover:bg-[#333333] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Empty state when no vehicle is selected -->
  <div
    v-else
    class="fixed top-80px left-0px bg-black h-500px w-300px rounded-12px text-white overflow-hidden flex flex-col border border-gray-700 items-center justify-center p-4"
  >
    <div class="i-carbon-information text-4xl text-gray-500 mb-3"></div>
    <p class="text-center text-gray-400">Select a vehicle to view details</p>
  </div>
</template>
