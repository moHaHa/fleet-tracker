<script setup lang="ts">
import FleetTrackerLogo from '@/components/icons/FleetTrackerLogo.vue'
import DefaultLayoutLink from './components/DefaultLayoutLink.vue'

const navLinks = [
  { name: 'Map', link: '/' },
  { name: 'Cars List', link: '/cars' },
]
</script>

<template>
  <header fixed w-full p-4 text-white top-0 left-0 right-0 flex justify-center>
    <div class="border-1px border-white rounded-full px-8px py-8px flex items-center">
      <nav class="flex gap-12px">
        <FleetTrackerLogo></FleetTrackerLogo>
        <DefaultLayoutLink
          v-for="navLink in navLinks"
          :key="navLink.link"
          :name="navLink.name"
          :link="navLink.link"
        />
      </nav>
    </div>
  </header>
  <div class="pt-80px">
    <slot></slot>
  </div>
</template>
