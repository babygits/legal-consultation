<template>
  <div>
    <h2>用户管理</h2>

    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between;">
      <a-input-search
          v-model:value="search"
          placeholder="搜索姓名或邮箱"
          style="width: 300px;"
      />
      <a-button type="primary" @click="openAddModal">添加用户</a-button>
    </div>

    <!-- 用户表格 -->
    <a-table :columns="columns" :data-source="filteredUsers" row-key="id">
      <template #role="{ record }">
        <a-tag :color="roleColors[record.role] || 'default'">{{ getRoleName(record.role) }}</a-tag>
      </template>
      <template #lawyerStatus="{ record }">
        <a-tag :color="statusColors[record.lawyerStatus] || 'default'">{{ getStatusName(record.lawyerStatus) }}</a-tag>
      </template>
      <template #actions="{ record }">
        <a-space>
          <a-button type="link" @click="openEditModal(record)">编辑</a-button>
          <a-popconfirm title="确定删除该用户？" @confirm="deleteUser(record.id)" ok-text="确定" cancel-text="取消">
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal
        v-model:visible="isModalVisible"
        :title="modalMode === 'add' ? '添加用户' : '编辑用户'"
        @ok="submitForm"
    >
      <a-form :model="form">
        <a-form-item label="姓名" required>
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="邮箱" required>
          <a-input v-model:value="form.email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="form.phone" />
        </a-form-item>
        <a-form-item label="角色" required>
          <a-select v-model:value="form.role">
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="lawyer">律师</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="modalMode === 'add'" label="密码" required>
          <a-input-password v-model:value="form.password" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '../utils/common.js';

const users = ref([])
const search = ref('')
const isModalVisible = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const form = ref({ name: '', email: '', phone: '', role: 'user', password: '' })
const editingUserId = ref(null)

const roleColors = {
  user: 'blue',
  lawyer: 'green',
  admin: 'volcano'
}
const statusColors = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red'
}

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    slots: { customRender: 'role' }
  },
  {
    title: '认证状态',
    dataIndex: 'lawyerStatus',
    key: 'lawyerStatus',
    slots: { customRender: 'lawyerStatus' }
  },
  { title: '注册时间', dataIndex: 'createdAt', customRender: (createdAt) => formatDate(createdAt.value) },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    return (
        u.name?.toLowerCase().includes(search.value.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.value.toLowerCase())
    )
  })
})

const fetchUsers = async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch('/api/admin/users', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    const data = await res.json()
    users.value = data.users
  } catch (err) {
    message.error('获取用户失败')
  }
}

const openAddModal = () => {
  modalMode.value = 'add'
  form.value = { name: '', email: '', phone: '', role: 'user', password: '' }
  editingUserId.value = null
  isModalVisible.value = true
}

const openEditModal = (record) => {
  modalMode.value = 'edit'
  form.value = { ...record }
  editingUserId.value = record.id
  isModalVisible.value = true
}

const submitForm = async () => {
  const token = localStorage.getItem('token')
  try {
    if (modalMode.value === 'add') {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(form.value)
      })
      message.success('添加成功')
    } else {
      await fetch(`/api/admin/users/${editingUserId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(form.value)
      })
      message.success('修改成功')
    }

    isModalVisible.value = false
    fetchUsers()
  } catch (err) {
    message.error('操作失败')
  }
}

const deleteUser = async (id) => {
  const token = localStorage.getItem('token')
  try {
    let res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    res = await res.json()
    if (res.error) {
      message.error('删除失败，该用户有关联的案件/咨询/评分反馈等')
    } else {
      message.success('删除成功')
      fetchUsers()
    }
  } catch (err) {
    message.error('删除失败')
  }
}

const getRoleName = (role) => {
  if (role === 'admin') {
    return '管理员'
  } else if (role === 'lawyer') {
    return '律师'
  } else {
    return '用户'
  }
}

const getStatusName = (status) => {
  if (status === 'pending') {
    return '提交中'
  } else if (status === 'approved') {
    return '已审核'
  }  else if (status === 'rejected') {
    return '已拒绝'
  } else {
    return '普通用户'
  }
}

onMounted(fetchUsers)
</script>
