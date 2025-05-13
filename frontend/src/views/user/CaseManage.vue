<template>
  <div style="margin: auto;">
    <h2 style="margin-bottom: 16px;">我的咨询记录</h2>

    <a-table
        :columns="columns"
        :data-source="caseList"
        rowKey="id"
        bordered
        :pagination="{ pageSize: 5 }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../utils/common.js';

const caseList = ref([])

const columns = [
  { title: '编号', dataIndex: 'id' },
  { title: '咨询问题', dataIndex: 'question' },
  { title: '当前状态', dataIndex: 'status' },
  { title: '律师姓名', dataIndex: ['lawyer', 'name'] },
  { title: '律师邮箱', dataIndex: ['lawyer', 'email'] },
  { title: '回复内容', dataIndex: 'reply' },
  { title: '时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) }
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
    caseList.value = data
  } catch (err) {
    message.error(err.message)
  }
})
</script>
