<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

interface Props {
  name: string
  link: string
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
  return route.path === props.link
})
</script>

<template>
  <RouterLink
    :to="link"
    class="py-4px px-8px rounded-full transition duration-200 select-none font-medium"
    :class="[
      isActive ? 'bg-[#4ade801a]  text-#44bd87' : 'bg-[#33333388] text-gray-300 hover:bg-[#404040]',
    ]"
  >
    {{ name }}
  </RouterLink>
</template>
