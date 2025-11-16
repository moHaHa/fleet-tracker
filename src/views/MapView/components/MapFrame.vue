<script setup lang="ts">
// import { useVehiclesStore } from '@/stores/vehicles'
import VehicleMap from './VehicleMap.vue'

// const store = useVehiclesStore()
</script>

<template>
  <div class="h-500px bg-black border-1px border-solid border-white">
    <VehicleMap></VehicleMap>
    <!-- <div>
      <div>
        Map Frame - Total Vehicles: {{ store.vehicles.length }}

        List

        <ul>
          <li v-for="vehicle in store.vehicles" :key="vehicle.id">
            ID: {{ vehicle.id }}, Lat: {{ vehicle.location.lat }}, Lng: {{ vehicle.location.lng }},
            Speed: {{ vehicle.speed }}, Status: {{ vehicle.status }}
          </li>
        </ul>
      </div>
    </div> -->
  </div>
</template>
