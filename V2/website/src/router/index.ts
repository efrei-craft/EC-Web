import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import HomePage from '../pages/HomePage.vue'
import PlacePage from '../pages/PlacePage.vue'

// Define your routes
const routes = [
  { path: '/', component: HomePage },
  { path: '/place', component: PlacePage },
]

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
