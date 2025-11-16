<script setup lang="ts">
import { RouterView } from 'vue-router'
import { generateVehicles } from '@/services/generateData'
import { useVehiclesStore } from './stores/vehicles'
// import { startSimulation } from './services/simulator'
import { startSimulation } from './services/simulator'
const store = useVehiclesStore()
store.setVehicles(generateVehicles(10))
startSimulation()
</script>

<template>
  <RouterView />
</template>
