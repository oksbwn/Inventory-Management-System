import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Stocks from '@/views/Stocks.vue'
import Categories from '@/views/Categories.vue'
import Boxes from '@/views/Boxes.vue'
import Projects from '@/views/Projects.vue'
import Vendors from '@/views/Vendors.vue'
import Settings from '@/views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: Stocks
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/boxes',
    name: 'Boxes',
    component: Boxes
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/vendors',
    name: 'Vendors',
    component: Vendors
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
