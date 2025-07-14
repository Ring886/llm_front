<template>
  <!-- 整个聊天页（不含左侧导航） -->
  <div class="flex flex-col h-full bg-gray-100 relative">
    <!-- 顶部标题栏：仅在出现历史消息或正在回答时显示 -->
    <header
      v-if="messages.length !== 0 || response"
      class="py-4 px-6 border-b bg-white shadow-sm sticky top-0 z-10"
    >
      <h1 class="text-2xl font-bold text-gray-800">
        医院智能问答系统
      </h1>
    </header>

    <!-- 聊天区域 -->
    <div
      class="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative max-w-3xl mx-auto w-full"
    >
      <!-- 首次进入时的引导面板 -->
      <div
        v-if="!loadingSession && messages.length === 0 && !response"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="flex flex-col items-center text-center max-w-2xl mx-auto text-gray-700"
        >
          <img
            src="@/assets/tiktok.png"
            alt="头像"
            class="w-20 h-20 rounded-full mb-4"
          />
          <h1 class="text-3xl font-bold mb-2">医院智能问答系统</h1>
          <p class="text-lg mb-6">
            提供自然语言问答交流，展示 AI 回复与用户提问，多轮对话超便捷！
          </p>

          <!-- 推荐按钮组 -->
          <div class="flex flex-col space-y-3 w-full max-w-sm">
            <button class="py-2 px-4 border rounded hover:bg-gray-200">
              常见问题提示词
            </button>
            <button class="py-2 px-4 border rounded hover:bg-gray-200">
              热门问题示例
            </button>
            <button class="py-2 px-4 border rounded hover:bg-gray-200">
              常见问题与示例问答
            </button>
            <button class="py-2 px-4 border rounded hover:bg-gray-200">
              热门疾病问答精选
            </button>
            <a
              href="#"
              class="text-blue-600 text-center mt-1 hover:underline"
            >
              换一批
            </a>
          </div>
        </div>
      </div>

      <!-- 历史消息循环 -->
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="msg.from === 'user' ? 'text-right' : 'text-left'"
      >
        <div
          :class="
            msg.from === 'user'
              ? 'inline-block bg-blue-500 text-white px-4 py-2 rounded-xl'
              : 'inline-block bg-white border px-4 py-2 rounded-xl text-gray-800'
          "
        >
          {{ msg.text }}
        </div>
      </div>

      <!-- AI 流式回复（生成中） -->
      <div v-if="response" class="text-left max-w-3xl mx-auto">
        <div
          class="inline-block bg-white border px-4 py-2 rounded-xl text-gray-800 whitespace-pre-wrap"
        >
          {{ response }}
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <form
      @submit.prevent="sendQuestion"
      class="w-full max-w-3xl mx-auto mb-6 flex items-center px-4"
    >
      <button
        type="button"
        @click="clearInput"
        class="mr-2 w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
        title="清空"
      >
        ✕
      </button>

      <input
        v-model="input"
        type="text"
        placeholder="请输入您的问题..."
        class="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isResponding"
      />

      <button
        type="submit"
        :disabled="!input.trim() || isResponding"
        class="ml-2 bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
      >
        发送
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter} from 'vue-router'


const route = useRoute()
const router = useRouter()

const loadingSession = ref(false)


// 输入框、历史消息、AI 流式回复
const input = ref('')
const messages = ref([])
const response = ref('')
const isResponding = ref(false)
const session_id = ref('')

/** 发送问题到后端，大模型流式返回 */
const sendQuestion = async () => {
  const text = input.value.trim()
  if (!text) return

  // 1. 先把用户消息加入记录
  messages.value.push({ from: 'user', text })
  input.value = ''
  response.value = ''
  isResponding.value = true

  try {
    session_id.value = route.query.sessionId
    const user_id = ref()
    user_id.value = localStorage.getItem('user_id')

    // 新创建的会话
    if(!session_id.value) {
      const res = await fetch('/api/chat/sessions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user_id.value, initial_message: text})
      })
      const data = await res.json()
      goToSession(data.sessionId)
      session_id.value = data.sessionId
    }
    // 2. 调用后端 /api/chat/ask（流式 SSE 或 fetch 流）
    console.log('session_id:', session_id.value)
    const res = await fetch('/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, session_id: session_id.value})
    })

    // 3. 读取流式分片
    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunk = decoder.decode(value || new Uint8Array(), { stream: true })
      response.value += chunk
    }

    // 4. 完整 AI 回复加入消息记录
    messages.value.push({ from: 'ai', text: response.value })
    response.value = ''
  } catch (e) {
    response.value = 'AI: 出错了，请稍后再试。'
  } finally {
    isResponding.value = false
  }
}

// 清空输入框
const clearInput = () => {
  input.value = ''
}


const loadSessionMessages = async (sessionId) => {
  loadingSession.value = true // 🔁 标记正在加载
  messages.value = []
  response.value = ''

  const userId = localStorage.getItem('user_id')
  if (!userId || !sessionId) {
    loadingSession.value = false
    return
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/chat/sessions/${sessionId}/messages?user_id=${userId}`
    )
    const data = await res.json()
    messages.value = data.map(msg => ({
      from: msg.role === 'user' ? 'user' : 'ai',
      text: msg.content
    }))
  } catch (e) {
    console.error('加载历史消息失败', e)
  } finally {
    loadingSession.value = false // ✅ 加载完成
  }
}


const goToSession = (sessionId) => {
  router.push({ path: '/home/chat', query: { sessionId } })
}



// 监听 sessionId 变化
watch(() => route.query.sessionId, async (newSessionId) => {
  if (newSessionId) {
    // 加载指定 session 的历史消息
    await loadSessionMessages(newSessionId)
  } else {
    // 是新建会话，清空消息列表或重置状态
    messages.value = []     // 你实际的消息数组变量名
    response.value = ''     // 如果你还有流式回复状态
    session_id.value = ''   // 清空当前 session_id
    console.log('新建会话，消息已清空')
  }
})


// 页面首次加载
onMounted(() => {
  const sessionId = route.query.sessionId
  if (sessionId) {
    loadSessionMessages(sessionId)
  }
})


</script>

<style scoped>
/* 根据需要添加自定义样式 */
</style>
