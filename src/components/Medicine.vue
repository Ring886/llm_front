<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">药品管理</h1>

      <!-- 搜索框 + 按钮 -->
      <div class="mb-6 flex space-x-2 items-center">
        <input
          v-model="tempKeyword"
          @keyup.enter="applySearch"
          type="text"
          placeholder="请输入药品名称 / 编码 / 厂家"
          class="flex-grow px-4 py-2 border rounded-xl shadow focus:outline-none"
        />
        <button
          @click="applySearch"
          class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          查找
        </button>
      </div>

      <!-- 药品表格 -->
      <div class="overflow-auto">
        <table class="min-w-full bg-white border rounded-xl overflow-hidden shadow">
          <thead class="bg-blue-100 text-gray-800 text-left">
            <tr>
              <th class="px-4 py-3">名称</th>
              <th class="px-4 py-3">编码</th>
              <th class="px-4 py-3">规格</th>
              <th class="px-4 py-3">厂家</th>
              <th class="px-4 py-3">类型</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedDrugs"
              :key="item.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ item.name }}</td>
              <td class="px-4 py-2">{{ item.drugCode }}</td>
              <td class="px-4 py-2">{{ item.specification }}</td>
              <td class="px-4 py-2">{{ item.manufacturer }}</td>
              <td class="px-4 py-2">{{ item.drugType }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页按钮 -->
      <div class="flex justify-center mt-6 space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          上一页
        </button>

        <span class="text-gray-700 pt-2">第 {{ currentPage }} / {{ totalPages }} 页</span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const drugList = ref([])
const tempKeyword = ref('')
const searchKeyword = ref('')

const currentPage = ref(1)
const pageSize = 10

const fetchDrugs = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/drugs')
    const data = await res.json()
    drugList.value = data
  } catch (error) {
    console.error('获取药品失败', error)
  }
}

// 监听搜索框内容变化（用户清空搜索框时自动恢复原始数据）
watch(tempKeyword, (newVal) => {
  if (newVal.trim() === '') {
    searchKeyword.value = ''
    currentPage.value = 1
  }
})

// 点击查找按钮或按回车时
const applySearch = () => {
  const keyword = tempKeyword.value.trim()
  searchKeyword.value = keyword
  currentPage.value = 1
}

// 过滤后的药品列表
const filteredDrugs = computed(() => {
  if (!searchKeyword.value) return drugList.value
  const keyword = searchKeyword.value.toLowerCase()
  return drugList.value.filter(item =>
    [item.name, item.drugCode, item.manufacturer].some(field =>
      field.toLowerCase().includes(keyword)
    )
  )
})

// 分页逻辑
const totalPages = computed(() =>
  Math.ceil(filteredDrugs.value.length / pageSize)
)

const paginatedDrugs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDrugs.value.slice(start, start + pageSize)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(() => {
  fetchDrugs()
})
</script>
