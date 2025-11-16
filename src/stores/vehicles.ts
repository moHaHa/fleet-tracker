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
  }),

  getters: {
    selectedVehicle(state) {
      return state.vehicles.find((v) => v.id === state.selectedVehicleId) || null
    },
  },

  actions: {
    setVehicles(list: Vehicle[]) {
      this.vehicles = list
    },

    selectVehicle(id: string) {
      this.selectedVehicleId = id
    },
  },
})
