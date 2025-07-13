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
        <h2 class="text-3xl font-bold mb-2">登录 MedMagi医童</h2>
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

        <!-- 验证码 -->
        <input
          v-model="code"
          type="password"
          placeholder="密码"
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
          :disabled="!agree"
          @click="register"
          class="w-full bg-blue-500 text-white font-medium py-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          登录
        </button>

        <!-- 已有账号 -->
        <p class="text-sm text-center mt-6 text-gray-600">
          没有账号？
          <a href="/register" class="text-blue-500 hover:underline" >去注册</a>
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
const code = ref('')
const agree = ref(false)
const isModalVisible = ref(false)
const router = useRouter()

const showTerms = () => {
  isModalVisible.value = true
}

const register = async () => {
  try {
    // 假设后端API是 /api/register
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone.value, code: code.value }),
    })

    const result = await response.json()

    // 暂时将验证结果设为true
    const isValid = result.isValid
    const user_id = result.user_id

    if (isValid) {
      console.log('succuss,前后端连通')
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user_id', user_id)
      // 如果验证成功，跳转到首页
      router.push('/home')
    } else {
      alert('手机号或密码错误')
    }
  } catch (error) {
    console.error('验证失败', error)
  }
}
</script>

<style scoped>
/* 可选样式 */
</style>
