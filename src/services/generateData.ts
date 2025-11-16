/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vehicle } from '@/stores/vehicles'

const TYPES = ['Car', 'Truck', 'Van', 'Bike']
const STATUS = ['online', 'offline', 'alert']

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomPlate() {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  ).join('')

  const numbers = Math.floor(Math.random() * 900 + 100).toString()

  return `${letters}-${numbers}`
}

function randomLocation(center = { lat: 25.276987, lng: 55.296249 }, r = 0.3) {
  return {
    lat: center.lat + randomBetween(-r, r),
    lng: center.lng + randomBetween(-r, r),
  }
}

function generateHistory(startLoc: any) {
  const entries = []
  let prev = startLoc

  const pointsCount = Math.floor(randomBetween(10, 15))

  for (let i = 0; i < pointsCount; i++) {
    const next = {
      lat: prev.lat + randomBetween(-0.002, 0.002),
      lng: prev.lng + randomBetween(-0.002, 0.002),
      timestamp: new Date(Date.now() - (pointsCount - i) * 60_000).toISOString(),
    }
    entries.push(next)
    prev = next
  }

  return entries
}

export function generateVehicles(count = 200): Vehicle[] {
  const items: Vehicle[] = []

  for (let i = 1; i <= count; i++) {
    const id = `v-${String(i).padStart(3, '0')}`
    const type = TYPES[Math.floor(Math.random() * TYPES.length)] as string
    const status = STATUS[Math.floor(Math.random() * STATUS.length)] as
      | 'online'
      | 'offline'
      | 'alert'

    const startLocation = randomLocation()

    items.push({
      id,
      name: `${type} ${i}`,
      plate: randomPlate(),
      type,
      status,
      speed: Math.floor(Math.random() * 120),
      location: startLocation,
      lastUpdated: new Date().toISOString(),
      history: generateHistory(startLocation),
    })
  }

  return items
}
