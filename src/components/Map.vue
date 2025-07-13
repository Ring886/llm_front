<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <h1 class="text-2xl font-semibold text-gray-800">医院导航及科室分布</h1>

    <!-- 图片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 医院导航图 -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-lg font-medium text-gray-700 mb-2">导航总览</h2>
        <img
          src="@/assets/navigation.png"
          alt="医院导航图"
          class="w-full h-auto rounded-md border"
        />
      </div>

      <!-- 医院地图 -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-lg font-medium text-gray-700 mb-2">医院平面图</h2>
        <img
          src="@/assets/map.png"
          alt="医院地图"
          class="w-full h-auto rounded-md border"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需逻辑处理，纯展示页面
</script>

<style scoped>
/* 可选的样式增强 */
</style>
