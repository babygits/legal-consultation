<template>
  <div>
    <h2>评分与反馈管理</h2>

    <!-- 操作栏 -->
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-input-search
          v-model:value="search"
          placeholder="搜索反馈内容或邮箱"
          style="width: 300px"
      />
      <a-checkbox v-model:checked="filterLowScore">只看低评分（≤3）</a-checkbox>
    </div>

    <!-- 表格 -->
    <a-table
        :columns="columns"
        :data-source="filteredFeedbacks"
        row-key="id"
        :pagination="{ pageSize: 8 }"
    >
      <template #rating="{ record }">
        <a-rate :value="record.rating" disabled allow-half />
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../utils/common.js';

const token = localStorage.getItem('token')
const feedbacks = ref([])
const search = ref('')
const filterLowScore = ref(false)

const columns = [
  { title: '用户', dataIndex: ['user', 'email'] },
  {
    title: '评分',
    key: 'rating',
    slots: { customRender: 'rating' }
  },
  { title: '反馈内容', dataIndex: 'feedback' },
  { title: '提交时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) }
]

const filteredFeedbacks = computed(() => {
  return feedbacks.value.filter(f => {
    const matchText =
        f.feedback?.toLowerCase().includes(search.value.toLowerCase()) ||
        f.user?.email?.toLowerCase().includes(search.value.toLowerCase())
    const matchRating = filterLowScore.value ? f.rating <= 3 : true
    return matchText && matchRating
  })
})

const fetchFeedbacks = async () => {
  try {
    const res = await fetch('/api/admin/feedbacks', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    feedbacks.value = data.feedbacks
  } catch (err) {
    message.error('获取反馈失败')
  }
}

onMounted(fetchFeedbacks)
</script>
