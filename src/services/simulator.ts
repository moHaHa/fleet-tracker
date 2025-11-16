import { useVehiclesStore } from '@/stores/vehicles'
import { randomNearbyLocation, randomSpeed, randomStatus } from './geo'

export function startSimulation() {
  const store = useVehiclesStore()

  setInterval(() => {
    const list = [...store.vehicles]
    const count = list.length ?? Math.floor(list.length * 0.25) // update 25%

    const toUpdate = [...list].sort(() => Math.random() - 0.5).slice(0, count)
    console.log('Simulating updates for', toUpdate.length, 'vehicles')
    toUpdate.forEach((v) => {
      const z = list.find((e) => e.id === v.id)
      const newStatus = randomStatus()
      if (z)
        Object.assign(v, {
          speed: randomSpeed(),
          status: newStatus,
          location: newStatus == 'online' ? randomNearbyLocation(v.location, 0.04) : v.location,
          lastUpdated: new Date().toISOString(),
        })
    })
    store.setVehicles(list)
  }, 3000)
}
