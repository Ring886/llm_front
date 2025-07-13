import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import News from '@/components/News.vue'
import Chat from '@/components/Chat.vue'
import Map from '@/components/Map.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/home', 
    component: Home,
    children: [
      {
        path: 'chat',
        component: Chat
      },
      {
        path: 'news',
        component: News
      },
      {
        path: 'map',
        component: Map
      },
      {
        path: '',
        redirect: '/home/chat' // 默认跳转到聊天页
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  // 如果要访问的是 /home 或其子路由，但用户未登录
  if (to.path.startsWith('/home') && !isLoggedIn) {
    alert('请先登录')
    next('/login')  // 重定向到登录页
  } else {
    next()  // 允许访问
  }
})


export default router
