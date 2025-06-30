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

    <!-- 右侧主内容 -->
    <main class="flex-1 flex flex-col items-center justify-center p-8 relative">
      <img
        src="../assets/tiktok.png"
        alt="头像"
        class="w-20 h-20 rounded-full mb-4"
      />
      <h1 class="text-3xl font-bold mb-2">医院智能问答系统</h1>
      <p class="mb-8 text-center max-w-md text-gray-700">
        提供自然语言问答交流，展示AI回复与用户提问，多轮对话超便捷！
      </p>

      <!-- 按钮组 -->
      <div class="flex flex-col space-y-3 mb-6 w-full max-w-sm">
        <button class="py-2 px-4 border rounded hover:bg-gray-200">常见问题提示词</button>
        <button class="py-2 px-4 border rounded hover:bg-gray-200">热门问题示例</button>
        <button class="py-2 px-4 border rounded hover:bg-gray-200">常见问题与示例问答</button>
        <button class="py-2 px-4 border rounded hover:bg-gray-200">热门疾病问答精选</button>
        <a href="#" class="text-blue-600 text-center mt-1 hover:underline">换一批</a>
      </div>

      <!-- 底部输入框 -->
      <form
        @submit.prevent="sendQuestion"
        class="absolute bottom-8 flex items-center w-full max-w-xl"
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
          placeholder="登录后，可向我发送问题"
          class="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          :disabled="!input.trim()"
          class="ml-2 bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
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

const sendQuestion = () => {
  if (!input.value.trim()) return
  alert(`提交问题: ${input.value}`)
  input.value = ''
}

const clearInput = () => {
  input.value = ''
}
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
