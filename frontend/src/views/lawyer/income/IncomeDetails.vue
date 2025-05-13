<template>
  <div>
    <h2>收入明细</h2>
    <a-table :columns="columns" :data-source="records" rowKey="id" bordered />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../../utils/common.js';

const records = ref([])
const columns = [
  { title: '咨询内容', dataIndex: 'question' },
  { title: '用户', dataIndex: ['user', 'name'] },
  { title: '金额', dataIndex: 'price' },
  { title: '时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/lawyers/consults', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')

    records.value = data
  } catch (err) {
    message.error(err.message)
  }
})
</script>
