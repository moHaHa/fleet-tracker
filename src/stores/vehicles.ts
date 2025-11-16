/* eslint-disable prefer-const */
import { defineStore } from 'pinia'

export interface VehicleLocation {
  lat: number
  lng: number
}

export interface VehicleHistoryEntry {
  lat: number
  lng: number
  timestamp: string
}

export interface Vehicle {
  id: string
  name: string
  plate: string
  type: string
  status: 'online' | 'offline' | 'alert'
  speed: number
  location: VehicleLocation
  lastUpdated: string
  history: VehicleHistoryEntry[]
}

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    vehicles: [] as Vehicle[],
    selectedVehicleId: null as string | null,
    searchQuery: '',
    statusFilter: 'all' as 'all' | 'online' | 'offline' | 'alert',
    sortBy: 'name' as 'name' | 'plate' | 'lastUpdated',
    sortOrder: 'asc' as 'asc' | 'desc',
  }),

  getters: {
    selectedVehicle(state) {
      return state.vehicles.find((v) => v.id === state.selectedVehicleId) || null
    },

    filteredVehicles(state) {
      let filtered = state.vehicles.filter((vehicle) => {
        // Search filter
        const matchesSearch =
          vehicle.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(state.searchQuery.toLowerCase())

        // Status filter
        const matchesStatus = state.statusFilter === 'all' || vehicle.status === state.statusFilter

        return matchesSearch && matchesStatus
      })

      // Sorting
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        switch (state.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case 'plate':
            aValue = a.plate.toLowerCase()
            bValue = b.plate.toLowerCase()
            break
          case 'lastUpdated':
            aValue = new Date(a.lastUpdated)
            bValue = new Date(b.lastUpdated)
            break
          default:
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
        }

        if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1
        return 0
      })

      return filtered
    },
  },

  actions: {
    setVehicles(list: Vehicle[]) {
      this.vehicles = list
    },

    selectVehicle(id: string) {
      this.selectedVehicleId = id
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setStatusFilter(status: 'all' | 'online' | 'offline' | 'alert') {
      this.statusFilter = status
    },

    setSort(sortBy: 'name' | 'plate' | 'lastUpdated', order?: 'asc' | 'desc') {
      // If clicking the same sort column, toggle order
      if (this.sortBy === sortBy) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = sortBy
        this.sortOrder = order || 'asc'
      }
    },
  },
})
