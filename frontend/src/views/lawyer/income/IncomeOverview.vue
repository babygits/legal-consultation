<template>
  <div>
    <h2>当前余额</h2>
    <a-card>
      <p><strong>当前余额：</strong>￥{{ balance }}</p>
    </a-card>
    <h2 style="margin-top: 20px">设置咨询金额</h2>
    <a-card>
      <a-space>
        <a-input v-model:value="price" placeholder="咨询金额" type="number" step="1" min="1" />
        <a-button type="primary" @click="savePrice">保存</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const balance = ref(0)
const price = ref(0)

const savePrice = async () => {
  if (!price.value) return

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ price: price.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '更新失败')
    message.success('已保存咨询金额')
  } catch (err) {
    message.error(err.message)
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    price.value = data.price
    balance.value = data.balance
  } catch (err) {
    message.error(err.message)
  }
})
</script>
