<template>
  <div>
    <h2>案件管理</h2>

    <div style="margin-bottom: 16px; display: flex; justify-content: space-between;">
      <a-input-search v-model:value="search" placeholder="搜索案件标题" style="width: 300px" />
    </div>

    <a-table
        :columns="columns"
        :data-source="filteredCases"
        row-key="id"
        :pagination="{ pageSize: 8 }"
    >
      <template #status="{ record }">
        <a-select
            v-model:value="record.status"
            style="width: 130px"
            @change="val => updateStatus(record.id, val)"
        >
          <a-select-option value="open">open</a-select-option>
          <a-select-option value="in-progress">in-progress</a-select-option>
          <a-select-option value="resolved">resolved</a-select-option>
          <a-select-option value="closed">closed</a-select-option>
        </a-select>
      </template>
      <template #actions="{ record }">
        <a-space>
          <a-button type="link" @click="goToDetail(record.id)">查看</a-button>
          <a-popconfirm title="确认删除该案件？" @confirm="deleteCase(record.id)" ok-text="确定" cancel-text="取消">
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

const cases = ref([])
const search = ref('')
const token = localStorage.getItem('token')
const router = useRouter()

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '标题', dataIndex: 'title' },
  {
    title: '状态',
    key: 'status',
    slots: { customRender: 'status' }
  },
  {
    title: '用户',
    dataIndex: ['user', 'name']
  },
  {
    title: '律师',
    dataIndex: ['lawyer', 'name']
  },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

const filteredCases = computed(() =>
    cases.value.filter(item =>
        item.title?.toLowerCase().includes(search.value.toLowerCase())
    )
)

const fetchCases = async () => {
  try {
    const res = await fetch('/api/admin/cases', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    cases.value = data.cases
  } catch (err) {
    message.error('获取案件失败')
  }
}

const updateStatus = async (id, status) => {
  try {
    await fetch(`/api/admin/cases/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    message.success('状态更新成功')
  } catch (err) {
    message.error('状态更新失败')
  }
}

const deleteCase = async (id) => {
  try {
    let res = await fetch(`/api/admin/cases/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
    res = await res.json()
    if (res.error) {
      message.error('删除失败，该案件有其他关联数据')
    } else {
      message.success('案件已删除')
      fetchCases()
    }
  } catch (err) {
    message.error('删除失败')
  }
}

const goToDetail = (id) => {
  router.push(`/admin/cases/${id}`)
}

onMounted(fetchCases)
</script>
