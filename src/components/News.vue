<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">医疗资讯</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in newsList"
          :key="index"
          class="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200"
        >
          <h2 class="text-xl font-semibold text-blue-700 mb-2">
            {{ item.title }}
          </h2>
          <p class="text-gray-600 text-sm mb-4">{{ item.date }}</p>
          <p class="text-gray-700 leading-relaxed">{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newsList = ref([
  {
    title: '夏季养生：如何防暑降温',
    date: '2025-07-03',
    content: '夏季天气炎热，保持室内通风，避免中午外出，多喝水，注意饮食清淡...'
  },
  {
    title: '高血压患者的日常注意事项',
    date: '2025-07-01',
    content: '坚持低盐饮食、规律用药、定期监测血压，保持心情平稳，避免剧烈运动...'
  },
  {
    title: '儿童疫苗接种时间表详解',
    date: '2025-06-28',
    content: '儿童常规疫苗包括乙肝、卡介苗、百白破等，应根据年龄按时接种，确保免疫效果...'
  },
  {
    title: '肠胃炎高发季，预防指南请查收',
    date: '2025-06-25',
    content: '注意饮食卫生，生熟分开，勤洗手，尽量避免食用生冷不洁食物...'
  }
])
</script>

<style scoped>
/* 可添加动画、样式增强 */
</style>
