import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/MapView/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: HomeView,
    },
  ],
})

export default router
