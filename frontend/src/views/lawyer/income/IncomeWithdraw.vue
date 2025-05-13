<template>
  <div>
    <h2>提现</h2>
    <a-form @submit.prevent>
      <a-form-item label="提现金额">
        <a-input-number v-model:value="amount" :min="1" />
      </a-form-item>
      <a-button type="primary" @click="submitWithdraw">确认提现</a-button>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const amount = ref(0)

const submitWithdraw = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/income/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ amount: amount.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    message.success('提现成功')
  } catch (err) {
    message.error(err.message)
  }
}
</script>
