<template>
  <div class="container">
    <h2 style="margin-bottom: 16px;">支付记录</h2>

    <a-table
        :columns="columns"
        :data-source="records"
        rowKey="id"
        bordered
        :pagination="{ pageSize: 5 }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../../utils/common.js';

const records = ref([])

const columns = [
  { title: '支付编号', dataIndex: 'id' },
  { title: '时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) },
  { title: '金额（元）', dataIndex: 'price' },
  { title: '用途', dataIndex: 'desc' }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/consults/user', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')

    records.value = data
        .filter(r => r.status === 'paid')
        .map(r => ({
          id: r.id,
          createdAt: r.createdAt,
          price: r.price,
          desc: `预约 ${r.lawyer?.name || '律师'} 咨询`
        }))
  } catch (err) {
    message.error(err.message)
  }
})
</script>


<style scoped>
.container {
  background-color: white;
  padding: 20px;
}
</style>
