<template>
  <div>
    <a-page-header title="咨询详情" @back="$router.back()" />

    <a-descriptions bordered column="1">
      <a-descriptions-item label="问题">{{ detail.question }}</a-descriptions-item>
      <a-descriptions-item label="关联案件">
        {{ detail.case?.title || '无' }}
      </a-descriptions-item>
      <a-descriptions-item label="用户">
        {{ detail.user?.name }}（{{ detail.user?.email }}）
      </a-descriptions-item>
      <a-descriptions-item label="提交时间">{{ detail.createdAt }}</a-descriptions-item>
    </a-descriptions>

    <h3 style="margin-top: 24px;">对话记录</h3>
    <div v-if="detail.messages && detail.messages.length">
      <div v-for="(msg, idx) in detail.messages" :key="idx" style="margin-bottom: 12px;">
        <a-tag :color="msg.role === 'user' ? 'blue' : 'green'">
          {{ msg.role === 'user' ? '用户' : 'AI' }}
        </a-tag>
        <div style="margin-top: 4px; white-space: pre-wrap">{{ msg.content }}</div>
      </div>
    </div>
    <div v-else style="margin-top: 12px;">暂无对话</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const detail = ref({})
const token = localStorage.getItem('token')

const fetchDetail = async () => {
  try {
    const res = await fetch(`/api/admin/consults/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    detail.value = data.consult
  } catch (err) {
    message.error('获取详情失败')
  }
}

onMounted(fetchDetail)
</script>
