<template>
  <div class="container">
    <div class="content">
      <h2 style="margin-bottom: 16px;">修改密码</h2>
      <a-card>
        <a-form layout="vertical">
          <a-form-item label="原密码">
            <a-input-password v-model:value="oldPassword" />
          </a-form-item>
          <a-form-item label="新密码">
            <a-input-password v-model:value="newPassword" />
          </a-form-item>
          <a-form-item label="确认新密码">
            <a-input-password v-model:value="confirmPassword" />
          </a-form-item>
          <a-button type="primary" @click="handleChange">确认修改</a-button>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handleChange = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    return message.error('请填写所有字段')
  }
  if (newPassword.value !== confirmPassword.value) {
    return message.error('两次密码不一致')
  }

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '修改失败')
    message.success('密码修改成功')
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    message.error(err.message)
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
