/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VehicleLocation } from '@/stores/vehicles'

export function randomNearbyLocation(loc: VehicleLocation, delta = 0.0005) {
  return {
    lat: loc.lat + (Math.random() - 0.5) * delta,
    lng: loc.lng + (Math.random() - 0.5) * delta,
  }
}

export function randomStatus(): 'online' | 'offline' | 'alert' {
  return ['online', 'offline', 'alert'][Math.floor(Math.random() * 3)] as
    | 'online'
    | 'offline'
    | 'alert'
}

export function randomSpeed() {
  return Math.floor(Math.random() * 120)
}

export function isInRadius(p: any, center: any, radiusMeters: any) {
  const R = 6371e3
  const φ1 = p.lat * (Math.PI / 180)
  const φ2 = center.lat * (Math.PI / 180)
  const Δφ = (center.lat - p.lat) * (Math.PI / 180)
  const Δλ = (center.lng - p.lng) * (Math.PI / 180)

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c <= radiusMeters
}

export function getDistanceMeters(a: any, b: any) {
  const R = 6371e3
  const φ1 = a.lat * (Math.PI / 180)
  const φ2 = b.lat * (Math.PI / 180)
  const Δφ = (b.lat - a.lat) * (Math.PI / 180)
  const Δλ = (b.lng - a.lng) * (Math.PI / 180)

  const c =
    2 *
    Math.atan2(
      Math.sqrt(Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2),
      Math.sqrt(1 - (Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2)),
    )

  return R * c
}
