<template>
  <div style="margin: auto;">
    <h2 style="margin-bottom: 16px;">律师工作台</h2>

    <!-- 收入统计 -->
    <a-card title="收入统计概览" style="margin-bottom: 24px;">
      <p>累计收入：<strong>{{ stats.totalIncome }} 元</strong></p>
      <p>接单数：<strong>{{ stats.totalCases }}</strong></p>
      <p>待处理咨询：<strong>{{ stats.pending }}</strong></p>
    </a-card>

    <!-- 案件管理按钮 -->
    <a-card style="margin-bottom: 24px;">
      <a-button type="primary" @click="router.push('/lawyer/cases')">进入案件管理</a-button>
    </a-card>

    <!-- 待处理咨询列表 -->
    <a-card title="待处理咨询" v-if="pendingCases.length">
      <a-list :data-source="pendingCases" :pagination="{ pageSize: 5 }">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
                :title="'来自 ' + item.user?.name"
                :description="item.question"
            />
            <a-button type="link" @click="goToReply(item.id)">回复</a-button>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const pendingCases = ref([])
const stats = ref({
  totalIncome: 0,
  totalCases: 0,
  pending: 0
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/lawyers/cases', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')

    stats.value.totalCases = data.length
  } catch (err) {
    message.error(err.message)
  }


  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/lawyers/consults', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')

    const paidConsults = data.filter(c => c.status === 'paid')
    pendingCases.value = paidConsults.slice(0, 5)

    stats.value.totalIncome = data.reduce((sum, c) => sum + parseFloat(c.price || 0), 0).toFixed(2)
    stats.value.pending = paidConsults.length
  } catch (err) {
    message.error(err.message)
  }
})

const goToReply = (id) => {
  router.push(`/lawyer/consults/${id}`)
}
</script>
