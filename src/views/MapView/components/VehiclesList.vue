<script lang="ts" setup>
import { useVehiclesStore } from '@/stores/vehicles'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = useVehiclesStore()
// Use storeToRefs to maintain reactivity for getters
const { filteredVehicles } = storeToRefs(store)

// Local state for search input
const localSearchQuery = ref('')

const handleSearch = () => {
  store.setSearchQuery(localSearchQuery.value)
}

const handleStatusFilter = (status: 'all' | 'online' | 'offline' | 'alert') => {
  store.setStatusFilter(status)
}

const handleSort = (sortBy: 'name' | 'plate' | 'lastUpdated') => {
  store.setSort(sortBy)
}

const getSortIndicator = (column: 'name' | 'plate' | 'lastUpdated') => {
  if (store.sortBy !== column) return ''
  return store.sortOrder === 'asc' ? '↑' : '↓'
}
</script>

<template>
  <div
    class="fixed top-80px right-20px bg-black h-500px w-700px rounded-12px text-white overflow-hidden flex flex-col border border-gray-700"
  >
    <!-- Header with controls -->
    <div class="p-4 border-b border-gray-700 bg-[#111111]">
      <!-- Search Input -->
      <div class="relative mb-3">
        <input
          v-model="localSearchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by vehicle name or plate..."
          class="w-full p-2 pl-8 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44bd87] focus:border-transparent text-14px bg-[#222222] text-white placeholder-gray-400"
        />
        <div
          class="i-carbon-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></div>
      </div>

      <!-- Filter and Sort Controls -->
      <div class="flex gap-4">
        <!-- Status Filter -->
        <div class="flex-1">
          <label class="block text-12px text-gray-300 mb-1">Status</label>
          <select
            :value="store.statusFilter"
            @change="handleStatusFilter($event.target.value as any)"
            class="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44bd87] text-12px bg-[#222222] text-white"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="alert">Alert</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div class="flex-1">
          <label class="block text-12px text-gray-300 mb-1">Sort By</label>
          <select
            :value="store.sortBy"
            @change="handleSort($event.target.value as any)"
            class="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#44bd87] text-12px bg-[#222222] text-white"
          >
            <option value="name">Name {{ getSortIndicator('name') }}</option>
            <option value="plate">Plate {{ getSortIndicator('plate') }}</option>
            <option value="lastUpdated">Last Update {{ getSortIndicator('lastUpdated') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Vehicles Table -->
    <div class="flex-1 overflow-auto bg-black">
      <table class="w-full text-12px">
        <thead class="sticky top-0 bg-[#111111]">
          <tr>
            <th
              class="border-b border-gray-700 p-2 text-left cursor-pointer hover:bg-[#222222] transition-colors"
              @click="handleSort('name')"
            >
              Vehicle name {{ getSortIndicator('name') }}
            </th>
            <th
              class="border-b border-gray-700 p-2 text-left cursor-pointer hover:bg-[#222222] transition-colors"
              @click="handleSort('plate')"
            >
              Plate number {{ getSortIndicator('plate') }}
            </th>
            <th class="border-b border-gray-700 p-2 text-left">Type</th>
            <th class="border-b border-gray-700 p-2 text-left">Status</th>
            <th class="border-b border-gray-700 p-2 text-left">Last known address</th>
            <th
              class="border-b border-gray-700 p-2 text-left cursor-pointer hover:bg-[#222222] transition-colors"
              @click="handleSort('lastUpdated')"
            >
              Last updated time {{ getSortIndicator('lastUpdated') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="hover:bg-[#111111] cursor-pointer transition-colors"
            @click="store.selectVehicle(vehicle.id)"
          >
            <td class="border-b border-gray-700 p-2">{{ vehicle.name }}</td>
            <td class="border-b border-gray-700 p-2">{{ vehicle.plate }}</td>
            <td class="border-b border-gray-700 p-2">{{ vehicle.type }}</td>
            <td class="border-b border-gray-700 p-2">
              <span
                class="inline-block w-2 h-2 rounded-full mr-1"
                :class="{
                  'bg-[#44bd87]': vehicle.status === 'online',
                  'bg-gray-400': vehicle.status === 'offline',
                  'bg-[#fe4f4f]': vehicle.status === 'alert',
                }"
              ></span>
              {{ vehicle.status }}
            </td>
            <td class="border-b border-gray-700 p-2">
              {{ vehicle.location.lat.toFixed(4) }},{{ vehicle.location.lng.toFixed(4) }}
            </td>
            <td class="border-b border-gray-700 p-2">
              {{ dayjs(vehicle.lastUpdated).format('H:mm:ss A') }}
            </td>
          </tr>
          <tr v-if="filteredVehicles.length === 0">
            <td colspan="6" class="border-b border-gray-700 p-4 text-center text-gray-400">
              No vehicles found matching your criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
