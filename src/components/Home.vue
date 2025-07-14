<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 左侧导航栏 -->
    <nav class="w-64 bg-white border-r flex flex-col">
      <div class="p-4 font-semibold text-lg border-b">系统导航</div>

      <!-- 新建会话 -->
      <li
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-green-600 font-medium border-t mt-4"
        @click="startNewSession"
      >
        + 新建会话
      </li>


      <ul class="flex-1 overflow-auto">
        <!-- 功能菜单 -->
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="$router.push('/home/chat')"
        >
          功能菜单
        </li>

        <!-- 历史会话折叠区域 -->
        <li class="px-4 py-2 hover:bg-gray-50 cursor-pointer" @click="toggleHistory">
          <div class="flex justify-between items-center">
            <span>历史会话</span>
            <span>{{ isHistoryOpen ? '▲' : '▼' }}</span>
          </div>
        </li>

        <!-- 会话卡片区域 -->
        <transition name="fade">
          <ul v-if="isHistoryOpen" class="px-2 space-y-2">
            <li
              v-for="(session, index) in historySessions"
              :key="index"
              class="bg-gray-100 p-2 rounded shadow hover:bg-gray-200 text-sm cursor-pointer"
              @click="goToSession(session.sessionId)"
            >
              {{ truncate(session.title, 15) }}
            </li>



          </ul>
        </transition>

        <!-- 医疗资讯 -->
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="$router.push('/home/news')"
        >
          医疗资讯
        </li>

        <!-- 其他菜单 -->
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">药品管理</li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          @click="$router.push('/home/map')"
        >
          医院导航和科室分布
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">帮助中心</li>


       

      </ul>
    </nav>

    <!-- 主内容区域 -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  
  const router = useRouter()

  const isHistoryOpen = ref(true)
  const historySessions = ref([]) // 动态数组

  const toggleHistory = () => {
    isHistoryOpen.value = !isHistoryOpen.value
  }

  // 截断函数
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  // ✅ 获取用户历史对话
  const fetchSessions = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      console.warn('未登录，无法获取对话记录')
      return
    }

    try {
      const res = await fetch(`http://localhost:8080/api/chat/sessions?user_id=${userId}`)
      const data = await res.json()
      historySessions.value = data // 直接替换整个数组
      // console.log(historySessions.value)
    } catch (err) {
      console.error('获取会话失败：', err)
    }
  }

  const goToSession = (sessionId) => {
    router.push({ path: '/home/chat', query: { sessionId } })
  }

  const startNewSession = () => {
    router.push('/home/chat')
  }



  // ✅ 页面加载时发起请求
  onMounted(() => {
    fetchSessions()
  })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.9);
}
</style>
