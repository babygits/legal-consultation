<template>
  <div style="margin: auto;">
    <h2 style="margin-bottom: 16px;">我的案件</h2>

    <a-table
        :columns="columns"
        :data-source="caseList"
        rowKey="id"
        bordered
        :pagination="{ pageSize: 5 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="goToDetail(record.id)">查看详情</a-button>
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
const caseList = ref([])

const columns = [
  { title: '案件标题', dataIndex: 'title' },
  { title: '用户姓名', dataIndex: ['user', 'name'] },
  { title: '状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) },
  { title: '操作', key: 'action' }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/cases/lawyer', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    caseList.value = data
  } catch (err) {
    message.error(err.message)
  }
})

const goToDetail = (id) => {
  router.push(`/lawyer/cases/${id}`)
}
</script>
