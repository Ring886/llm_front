<template>
  <div class="flex min-h-screen">
    <!-- 左侧图 -->
    <div class="w-1/2 hidden md:flex items-center justify-center p-4">
      <img
        src="@/assets/signup-image.png"
        alt="注册插图"
        class="max-h-[80vh] max-w-full object-contain rounded-lg shadow-lg"
      />
    </div>

    <!-- 右侧注册区域 -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <div class="w-full max-w-md p-8">
        <!-- 标题 -->
        <h2 class="text-3xl font-bold mb-2">注册 MedMagi医童</h2>
        <p class="text-sm text-gray-500 mb-6 leading-relaxed">
          支持自然语言提问，按时间展示多轮对话，让医患交流更高效便捷
        </p>

        <!-- 手机号 -->
        <input
          v-model="phone"
          type="text"
          placeholder="手机号"
          class="w-full mb-4 px-4 py-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />

        <!-- 密码 -->
        <input
          v-model="password"
          type="password"
          placeholder="设置密码"
          class="w-full mb-4 px-4 py-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />

        <!-- 确认密码 -->
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="确认密码"
          class="w-full mb-4 px-4 py-3 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />

        <!-- 协议 -->
        <div class="flex items-center mb-4 text-sm text-gray-600">
          <input
            type="checkbox"
            v-model="agree"
            id="agree"
            class="mr-2 accent-blue-500"
          />
          <label for="agree">
            注册即表示同意墨刀
            <a href="#" @click.prevent="showTerms" class="text-blue-500 hover:underline">《使用条款》</a>
          </label>
        </div>

        <!-- 注册按钮 -->
        <button
          :disabled="!agree || !phone || !password || password !== confirmPassword"
          @click="register"
          class="w-full bg-blue-500 text-white font-medium py-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          免费注册
        </button>

        <!-- 已有账号 -->
        <p class="text-sm text-center mt-6 text-gray-600">
          已有账号？
          <router-link to="/login" class="text-blue-500 hover:underline">登录</router-link>
        </p>
      </div>
    </div>

    <!-- 使用条款模态框 -->
    <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h3 class="text-xl font-bold mb-4">使用条款</h3>
        <p class="text-sm text-gray-600 mb-4">
          这里是使用条款的内容。您可以在此处详细描述条款。
        </p>
        <button @click="isModalVisible = false" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const agree = ref(false)
const isModalVisible = ref(false)
const router = useRouter()

const showTerms = () => {
  isModalVisible.value = true
}

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('两次密码不一致')
    return
  }

  try {
    // 假设后端注册接口为 /api/register
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone.value, password: password.value }),
    })

    const result = await response.json()

    if (result.success) {
      alert('注册成功，请登录')
      router.push('/login')
    } else {
      alert(result.message || '注册失败')
    }
  } catch (error) {
    console.error('注册请求失败', error)
    alert('请求异常')
  }
}
</script>

<style scoped>
/* 可选样式 */
</style>
