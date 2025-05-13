<template>
  <div class="container">
    <div class="content">
      <h2 style="margin-bottom: 16px;">个人信息</h2>
      <a-card>
        <a-form layout="vertical">
          <a-form-item label="姓名">
            <a-input v-model:value="form.name" />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-model:value="form.email" />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input v-model:value="form.phone" />
          </a-form-item>
          <a-form-item label="头像">
            <a-upload
                name="avatar"
                :customRequest="uploadAvatar"
                :showUploadList="false"
            >
              <img
                  v-if="form.avatar"
                  :src="form.avatar"
                  alt="avatar"
                  style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; cursor: pointer"
              />
              <div v-else style="width: 100px; height: 100px; background: #eee; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                上传头像
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="个人简介">
            <a-textarea v-model:value="form.bio" rows="3" />
          </a-form-item>
          <a-button type="primary" @click="save">保存</a-button>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  avatar: '',
  bio: ''
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    form.value = { ...form.value, ...data }
  } catch (err) {
    message.error(err.message)
  }
})

const save = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '更新失败')
    message.success('信息已保存')
  } catch (err) {
    message.error(err.message)
  }
}

const uploadAvatar = async ({ file, onSuccess, onError }) => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/avatar', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '上传失败')
    form.value.avatar = data.url
    message.success('头像上传成功')
    onSuccess()
  } catch (err) {
    message.error(err.message)
    onError()
  }
}
</script>

<style scoped>
.container {
  background-color: white;
  padding: 20px;
}
.content {
  width: 500px;
  margin: 0 auto;
}
</style>
