import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: HomeView,
    },
    {
      path: '/cars',
      name: 'cars-list',
      component: () => import('../views/CarsListView.vue'),
    },
  ],
})

export default router
