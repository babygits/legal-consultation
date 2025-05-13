<template>
  <div style="margin: auto;">
    <!-- 欢迎语 & 登录状态判断 -->
    <a-card style="margin-bottom: 24px;">
      <template #title>
        欢迎使用智能法律咨询系统
      </template>
      <p>您可以通过 AI 或专业律师，快速获取法律建议。</p>
    </a-card>

    <!-- 快捷入口 -->
    <a-card style="margin-bottom: 24px;">
      <template #title>快速入口</template>
      <a-space>
        <a-button type="primary" @click="goConsult">AI 法律咨询</a-button>
        <a-button @click="goLawyer">在线找律师</a-button>
      </a-space>
    </a-card>

    <!-- 热门问题推荐 -->
    <a-card>
      <template #title>热门法律问题</template>
      <a-list :data-source="hotQuestions" bordered>
        <template #renderItem="{ item }">
          <a-list-item>
            <a @click="askQuestion(item)">{{ item }}</a>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(!!localStorage.getItem('token'))

const goLogin = () => router.push('/login')
const goRegister = () => router.push('/register')
const goConsult = () => router.push('/user/consult')
const goLawyer = () => router.push('/user/lawyer')

// 热门问题模拟数据
const hotQuestions = ref([
  '我被拖欠工资该怎么办？',
  '离婚需要准备什么材料？',
  '租房纠纷如何维权？',
  '交通事故责任怎么划分？',
  '公司拖延发放年终奖合法吗？'
])

const askQuestion = (question) => {
  // 跳转到 AI 咨询并预填问题（你可以扩展这个功能）
  router.push({ path: '/user/consult', query: { q: question } })
}
</script>
