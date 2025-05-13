<template>
  <div class="container">
    <h2 style="margin-bottom: 16px;">我的咨询记录</h2>

    <a-table
        :columns="columns"
        :data-source="consultList"
        rowKey="id"
        bordered
        :pagination="{ pageSize: 5 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="goToConsultDetail(record.id)">查看详情</a-button>
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
const consultList = ref([])

const columns = [
  { title: '编号', dataIndex: 'id' },
  { title: '咨询问题', dataIndex: 'question' },
  { title: '当前状态', dataIndex: 'status' },
  { title: '律师姓名', dataIndex: ['lawyer', 'name'] },
  { title: '时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) },
  { title: '操作', key: 'action' }
]

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/consults/user', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    consultList.value = data
  } catch (err) {
    message.error(err.message)
  }
})

const goToConsultDetail = (id) => {
  router.push(`/user/consult-list/${id}`)
}
</script>

<style scoped>
.container {
  background-color: white;
  padding: 20px;
}
</style>
