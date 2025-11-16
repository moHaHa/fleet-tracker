import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '@/stores/vehicles'

export function useVehicleFilters() {
  const store = useVehiclesStore()
  const { vehicles } = storeToRefs(store)

  const search = ref('')
  const status = ref<'all' | 'online' | 'offline' | 'alert'>('all')
  const sortBy = ref<'name' | 'plate' | 'time'>('name')

  const filtered = computed(() => {
    let list = [...vehicles.value]

    if (search.value) {
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(search.value.toLowerCase()) ||
          v.plate.toLowerCase().includes(search.value.toLowerCase()),
      )
    }

    if (status.value !== 'all') {
      list = list.filter((v) => v.status === status.value)
    }

    if (sortBy.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy.value === 'plate') list.sort((a, b) => a.plate.localeCompare(b.plate))
    if (sortBy.value === 'time') list.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))

    return list
  })

  return { search, status, sortBy, filtered }
}
