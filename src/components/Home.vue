<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 左侧导航 -->
    <nav class="w-64 bg-white border-r flex flex-col">
      <div class="p-4 font-semibold text-lg border-b">系统导航</div>
      <ul class="flex-1 overflow-auto">
        <li class="px-4 py-2 bg-blue-100 text-blue-700 font-medium cursor-pointer">功能菜单</li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">医疗资讯</li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">药品管理</li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">医院导航和科室分布</li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">系统设置</li>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">帮助中心</li>
      </ul>
    </nav>

    <!-- 右侧主区域 -->
    <main class="flex-1 flex flex-col bg-gray-100 relative">
      <!-- 顶部标题栏 -->
      <header
        v-if="messages.length !== 0"
        class="py-4 px-6 border-b bg-white shadow-sm sticky top-0 z-10"
      >
        <h1 class="text-2xl font-bold text-gray-800">医院智能问答系统</h1>
      </header>

      <!-- 聊天区域 -->
      <div class="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative">
        <!-- 首次引导展示（居中） -->
        <div
          v-if="messages.length === 0"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div
            class="flex flex-col items-center text-center max-w-2xl mx-auto text-gray-700"
          >
            <img
              src="../assets/tiktok.png"
              alt="头像"
              class="w-20 h-20 rounded-full mb-4"
            />
            <h1 class="text-3xl font-bold mb-2">医院智能问答系统</h1>
            <p class="text-lg mb-6">
              提供自然语言问答交流，展示AI回复与用户提问，多轮对话超便捷！
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

        <!-- 聊天消息展示 -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.from === 'user' ? 'text-right' : 'text-left'"
          class="max-w-3xl mx-auto"
        >
          <div
            :class="msg.from === 'user'
              ? 'inline-block bg-blue-500 text-white px-4 py-2 rounded-xl'
              : 'inline-block bg-white border px-4 py-2 rounded-xl text-gray-800'"
          >
            {{ msg.text }}
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
        />
        <button
          type="submit"
          :disabled="!input.trim()"
          class="ml-2 bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          发送
        </button>
      </form>
    </main>
  </div>
</template>




<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([])

const sendQuestion = async () => {
  const text = input.value.trim()
  if (!text) return

  // 添加用户消息
  messages.value.push({ from: 'user', text })
  input.value = ''

  // 添加“思考中……”提示
  messages.value.push({ from: 'ai', text: '思考中……' })

  try {
    const res = await fetch('/api/chat/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: text })
    })

    const replyText = await res.text()

    console.log(replyText)

    // 替换“思考中……”为真实回复
    const lastIndex = messages.value.findLastIndex(msg => msg.from === 'ai' && msg.text === '思考中……')
    if (lastIndex !== -1) {
      messages.value[lastIndex].text = replyText.startsWith('AI：') ? replyText : 'AI：' + replyText
    } else {
      messages.value.push({ from: 'ai', text: 'AI：' + replyText })
    }

  } catch (e) {
    // 网络或接口错误
    const lastIndex = messages.value.findLastIndex(msg => msg.from === 'ai' && msg.text === '思考中……')
    if (lastIndex !== -1) {
      messages.value[lastIndex].text = 'AI：出错了，请稍后再试。'
    } else {
      messages.value.push({ from: 'ai', text: 'AI：出错了，请稍后再试。' })
    }
  }
}

const clearInput = () => {
  input.value = ''
}
</script>




<style scoped>
/* 可选：添加滚动优化、动画效果 */
</style>
