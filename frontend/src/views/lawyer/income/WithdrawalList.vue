<template>
  <div>
    <h2>提现记录</h2>
    <a-table :columns="columns" :data-source="records" rowKey="id" bordered />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../../utils/common.js';

const records = ref([])
const columns = [
  { title: '金额', dataIndex: 'amount' },
  { title: '提现到', dataIndex: 'for', customRender: () => '银行卡' },
  { title: '时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/income/withdrawals', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    records.value = data
  } catch (err) {
    message.error(err.message)
  }
})
</script>
