<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout.vue'
import MapFrame from './components/MapFrame.vue'
import FleetTrackerLogo from '@/components/icons/FleetTrackerLogo.vue'
import VehiclesList from './components/VehiclesList.vue'
import { ref } from 'vue'

const isOpenCarsList = ref(true)

const toggleCarsList = () => {
  isOpenCarsList.value = !isOpenCarsList.value
}
</script>

<template>
  <DefaultLayout>
    <header fixed w-full p-4 text-white top-0 left-0 right-0 flex justify-center>
      <div class="border-1px border-white rounded-full px-8px py-8px flex items-center">
        <nav class="flex gap-12px ic">
          <FleetTrackerLogo></FleetTrackerLogo>
          <div class="relative h-30px"></div>
          <button
            @click="toggleCarsList"
            class="py-4px px-8px rounded-full transition duration-200 select-none font-medium"
            :class="[
              isOpenCarsList
                ? 'bg-[#4ade801a]  text-#44bd87'
                : 'bg-[#33333388] text-gray-300 hover:bg-[#404040]',
            ]"
          >
            Cars List
          </button>
        </nav>
      </div>
    </header>
    <div class="relative">
      <MapFrame></MapFrame>
      <VehiclesList v-if="isOpenCarsList"></VehiclesList>
    </div>
  </DefaultLayout>
</template>
