import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/home', component: Home },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
