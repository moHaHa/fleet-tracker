<script lang="ts" setup>
import { useVehiclesStore } from '@/stores/vehicles'

const store = useVehiclesStore()
const vehicles = store.vehicles
</script>

<template>
  <div class="fixed top-60px right-50px bg-white h-500px w-600px rounded-12px text-black">
    <div>
      <table class="text-12px">
        <thead>
          <tr>
            <th class="border-b border-gray-300 p-2 text-left">Vehicle name</th>
            <th class="border-b border-gray-300 p-2 text-left">Plate number</th>
            <th class="border-b border-gray-300 p-2 text-left">Type</th>
            <th class="border-b border-gray-300 p-2 text-left">Status</th>
            <th class="border-b border-gray-300 p-2 text-left">Last known address</th>
            <th class="border-b border-gray-300 p-2 text-left">Last updated time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.id">
            <td class="border-b border-gray-300 p-2">{{ vehicle.name }}</td>
            <td class="border-b border-gray-300 p-2">{{ vehicle.plate }}</td>
            <td class="border-b border-gray-300 p-2">{{ vehicle.type }}</td>
            <td class="border-b border-gray-300 p-2">{{ vehicle.status }}</td>
            <td class="border-b border-gray-300 p-2">
              {{ vehicle.location.lat.toFixed(4) }},{{ vehicle.location.lng.toFixed(4) }}
            </td>
            <td class="border-b border-gray-300 p-2">{{ vehicle.lastUpdated }}</td>
          </tr>
        </tbody>
      </table>
      <ul></ul>
    </div>
  </div>
</template>
