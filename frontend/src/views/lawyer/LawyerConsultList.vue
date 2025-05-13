<template>
  <div style="margin: auto;">
    <h2 style="margin-bottom: 16px;">收到的咨询</h2>

    <a-table
        :columns="columns"
        :data-source="consults"
        rowKey="id"
        bordered
        :pagination="{ pageSize: 5 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="goToChat(record.id)">查看详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { formatDate } from '../utils/common.js';

const router = useRouter()
const consults = ref([])

const columns = [
  { title: '用户', dataIndex: ['user', 'name'] },
  { title: '咨询问题', dataIndex: 'question' },
  { title: '当前状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) },
  { title: '操作', key: 'action' }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/consults/lawyer', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    consults.value = data
  } catch (err) {
    message.error(err.message)
  }
})

const goToChat = (id) => {
  router.push(`/lawyer/consults/${id}`)
}
</script>
