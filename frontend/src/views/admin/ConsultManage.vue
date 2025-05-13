<template>
  <div>
    <h2>咨询管理</h2>

    <!-- 搜索栏 -->
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between;">
      <a-input-search v-model:value="search" placeholder="搜索问题" style="width: 300px" />
    </div>

    <!-- 表格 -->
    <a-table
        :columns="columns"
        :data-source="filteredConsults"
        row-key="id"
        :pagination="{ pageSize: 8 }"
    >
      <template #actions="{ record }">
        <a-space>
          <a-button type="link" @click="goToDetail(record.id)">详情</a-button>
          <a-popconfirm title="确认删除该咨询？" @confirm="deleteConsult(record.id)" ok-text="确定" cancel-text="取消">
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { formatDate } from '../utils/common.js';

const token = localStorage.getItem('token')
const consults = ref([])
const search = ref('')
const router = useRouter()

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '问题', dataIndex: 'question' },
  {
    title: '用户',
    dataIndex: ['user', 'name']
  },
  {
    title: '案件',
    dataIndex: ['case', 'title']
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    customRender: (createdAt) => formatDate(createdAt.value)
  },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

const filteredConsults = computed(() =>
    consults.value.filter(c =>
        c.question?.toLowerCase().includes(search.value.toLowerCase())
    )
)

const fetchConsults = async () => {
  try {
    const res = await fetch('/api/admin/consults', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    consults.value = data.consults
  } catch (err) {
    message.error('获取咨询失败')
  }
}

const deleteConsult = async (id) => {
  try {
    let res = await fetch(`/api/admin/consults/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
    res = await res.json()
    if (res.error) {
      message.error('删除失败，该咨询有关联的其他数据')
    } else {
      message.success('删除成功')
      fetchConsults()
    }
  } catch (err) {
    message.error('删除失败')
  }
}

const goToDetail = (id) => {
  router.push(`/admin/consults/${id}`)
}

onMounted(fetchConsults)
</script>
