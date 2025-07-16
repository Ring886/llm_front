<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">医疗资讯</h1>

      <!-- 内容卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in paginatedNews"
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

      <!-- 分页按钮 -->
      <div class="flex justify-center items-center space-x-4 mt-8">
        <button
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <span class="text-gray-600">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 全部资讯列表
const newsList = ref([
  {
    title: '糖尿病患者夏季饮食指南',
    date: '2025-07-02',
    content: '注意控制碳水摄入，多吃高纤维蔬菜，避免冰镇饮料和高糖水果，防止血糖波动...'
  },
  {
    title: '预防中暑的五个实用技巧',
    date: '2025-07-04',
    content: '及时补水、避免高温时段外出、穿浅色衣物、携带防暑药品、保持作息规律...'
  },
  {
    title: '老人防跌倒，家庭环境怎么改造？',
    date: '2025-06-29',
    content: '去除地面障碍物、浴室加装扶手、保持地面干燥、使用防滑拖鞋、防止夜间摸黑起身...'
  },
  {
    title: '夏季易腹泻，该如何预防？',
    date: '2025-07-05',
    content: '食物应烧熟煮透，剩饭菜及时冷藏，不喝生水，勤洗手，特别是饭前便后...'
  },
  {
    title: '慢性胃炎患者的饮食建议',
    date: '2025-06-30',
    content: '忌辛辣、烟酒和生冷食物，三餐定时定量，细嚼慢咽，避免暴饮暴食...'
  },
  {
    title: '宝宝发烧怎么办？家庭护理要点来了',
    date: '2025-07-06',
    content: '保持室内通风，多喝水物理降温，观察精神状态，体温持续超过38.5℃应就医...'
  },
  {
    title: '过敏性鼻炎高发，如何有效缓解？',
    date: '2025-06-27',
    content: '远离过敏原、保持鼻腔清洁、使用鼻喷剂、注意空调滤网清洁，必要时用药控制...'
  },
  {
    title: '肝功能不好，这些食物别碰',
    date: '2025-07-07',
    content: '忌饮酒、少吃油炸辛辣、动物内脏和高脂肪食物，建议多吃绿色蔬菜、豆制品和水果...'
  },
  {
    title: '儿童暑假期间如何防范意外伤害？',
    date: '2025-07-08',
    content: '远离危险区域、教导交通规则、不单独游泳、家中药品刀具放妥，定期进行安全教育...'
  },
  {
    title: '睡眠质量差可能影响免疫力',
    date: '2025-06-26',
    content: '每天保持7-9小时睡眠，避免熬夜、睡前远离电子产品，建议午休不超过30分钟...'
  },
  {
    title: '三伏天养生，这些“禁忌”要知道',
    date: '2025-07-09',
    content: '不贪凉、不过食生冷、不剧烈运动、不暴晒，宜清淡饮食、适度午休...'
  },
  {
    title: '哮喘患者夏季注意事项',
    date: '2025-07-10',
    content: '注意室内通风、防止冷空气刺激、遵医嘱规范用药，远离过敏源和空气污染...'
  },
  {
    title: '食物中毒的急救处理方法',
    date: '2025-07-11',
    content: '出现呕吐、腹泻等症状应立即停止进食，补水电解质，严重者应及时送医治疗...'
  },
  {
    title: '口腔溃疡频发，是不是上火了？',
    date: '2025-07-12',
    content: '可能与免疫力低下、缺乏维生素或压力有关，可适当补充B族维生素、保持口腔清洁...'
  },
  {
    title: '新生儿黄疸常识及护理方法',
    date: '2025-06-24',
    content: '生理性黄疸多可自愈，注意喂养频率，保持大便通畅，病理性黄疸应及时就医...'
  },
  {
    title: '防蚊虫叮咬，这几点别忽视',
    date: '2025-07-13',
    content: '安装纱窗、使用蚊香驱蚊液、避免香味浓郁用品，叮咬后避免抓挠，可涂药缓解...'
  },
  {
    title: '肾结石饮食宜忌一览',
    date: '2025-07-14',
    content: '少吃高草酸食物（如菠菜、坚果）、多喝水、控制蛋白质和钠摄入，避免浓茶可乐等饮料...'
  },
  {
    title: '儿童用药误区，这些你中招了吗？',
    date: '2025-07-15',
    content: '避免擅自加减药量、不滥用成人药、严格按医嘱服药，避免联合用药导致不良反应...'
  },
  {
    title: '甲亢与甲减，你分得清吗？',
    date: '2025-07-16',
    content: '甲亢表现为易怒多汗心慌，甲减则是怕冷嗜睡体重增加，需通过血检确诊后规范治疗...'
  },
  {
    title: '夏季感冒频发，和空调有关吗？',
    date: '2025-07-17',
    content: '长时间待空调房易导致温差刺激，建议空调温度不低于26℃，定期清洁滤网避免细菌滋生...'
  },
  {
    title: '夏季皮肤瘙痒怎么办？',
    date: '2025-07-18',
    content: '注意个人清洁，避免频繁抓挠，可使用温和润肤剂和止痒药膏，穿宽松透气衣物...'
  },
  {
    title: '女性经期护理小贴士',
    date: '2025-07-19',
    content: '保持清洁、避免受凉、适当休息、饮食清淡，尽量避免剧烈运动和情绪波动...'
  },
  {
    title: '体检报告怎么看？关键指标一文读懂',
    date: '2025-07-20',
    content: '关注血压、血糖、血脂、肝肾功能、心电图等项目，异常指标建议进一步检查...'
  },
  {
    title: '食道反流的日常管理建议',
    date: '2025-07-21',
    content: '避免咖啡、巧克力、辛辣油腻食物，少食多餐，饭后不立即躺下，抬高床头有帮助...'
  },
  {
    title: '骨质疏松的早期信号有哪些？',
    date: '2025-07-22',
    content: '腰背疼痛、身高变矮、驼背、轻微碰撞即骨折，应早期补钙并合理运动...'
  },
  {
    title: '夏季眼部护理指南',
    date: '2025-07-23',
    content: '避免长时间暴露在强光下，减少用眼疲劳，保持手部清洁避免揉眼，可适当滴用润眼液...'
  },
  {
    title: '肠道菌群失调的表现和调理方式',
    date: '2025-07-24',
    content: '腹胀、便秘或腹泻、免疫力下降等，可通过合理膳食、益生菌摄入进行调节...'
  },
  {
    title: '久坐上班族如何护颈护腰？',
    date: '2025-07-25',
    content: '每小时起身活动5分钟，调整坐姿，使用腰靠，配合拉伸和颈肩放松练习...'
  },
  {
    title: '青少年近视防控关键点',
    date: '2025-07-26',
    content: '控制用眼时长、多做户外运动、保持良好照明、定期视力检查，合理配镜非常重要...'
  },
  {
    title: '感冒后咳嗽久不愈？可能是咳嗽变异性哮喘',
    date: '2025-07-27',
    content: '如果感冒后咳嗽持续超过三周，尤其夜间严重，需警惕该病，及早就医对症治疗...'
  }
])

// 每页显示数量
const itemsPerPage = 6

// 当前页码
const currentPage = ref(1)

// 总页数
const totalPages = computed(() =>
  Math.ceil(newsList.value.length / itemsPerPage)
)

// 当前页的数据
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return newsList.value.slice(start, end)
})
</script>

<style scoped>
/* 可加动画或样式细化 */
</style>
