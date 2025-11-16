import { useVehiclesStore } from '@/stores/vehicles'
import { randomNearbyLocation, randomSpeed, randomStatus } from './geo'

export function startSimulation() {
  const store = useVehiclesStore()

  setInterval(() => {
    const list = [...store.vehicles]
    const count = Math.floor(list.length * 0.25) // update 25%

    const toUpdate = [...list].sort(() => Math.random() - 0.5).slice(0, count)

    console.log('Simulating updates for', toUpdate.length, 'vehicles')

    toUpdate.forEach((v) => {
      const z = list.find((e) => e.id === v.id)
      if (!z) return

      const newStatus = randomStatus()
      const oldLocation = z.location

      // Only move if online
      const newLocation =
        newStatus === 'online' ? randomNearbyLocation(oldLocation, 0.04) : oldLocation

      if (newLocation.lat !== oldLocation.lat || newLocation.lng !== oldLocation.lng) {
        z.history.push({
          lat: newLocation.lat,
          lng: newLocation.lng,
          timestamp: new Date().toISOString(),
        })
      }

      Object.assign(z, {
        speed: randomSpeed(),
        status: newStatus,
        location: newLocation,
        lastUpdated: new Date().toISOString(),
      })
    })

    store.setVehicles(list)
  }, 3000)
}
