<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 class="text-3xl font-bold text-center text-blue-700 mb-8">意见反馈</h1>

      <form @submit.prevent="submitFeedback" class="space-y-6">
        <!-- 反馈内容 -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">反馈内容</label>
          <textarea
            id="content"
            v-model="content"
            rows="5"
            placeholder="请输入您的反馈内容..."
            class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            required
          ></textarea>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!content.trim() || loading"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {{ loading ? '提交中...' : '提交反馈' }}
          </button>
        </div>
      </form>

      <!-- 成功提示 -->
      <div v-if="successMessage" class="mt-6 text-green-600 text-center font-semibold">
        {{ successMessage }}
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="mt-6 text-red-600 text-center font-semibold">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const content = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const userId = ref(null)

onMounted(() => {
  const storedId = localStorage.getItem('user_id')
  if (storedId) {
    userId.value = parseInt(storedId)
  } else {
    errorMessage.value = '未找到用户ID，请先登录。'
  }
})

const submitFeedback = async () => {
  if (!userId.value || !content.value.trim()) {
    errorMessage.value = '请填写反馈内容'
    return
  }

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await fetch('http://localhost:8080/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId.value,
        content: content.value.trim()
      })
    })

    const data = await res.json()

    if (res.ok) {
      successMessage.value = data.message || '反馈提交成功！'
      content.value = ''
    } else {
      errorMessage.value = data.message || '提交失败，请稍后再试'
    }
  } catch (error) {
    errorMessage.value = '提交过程中发生错误'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
