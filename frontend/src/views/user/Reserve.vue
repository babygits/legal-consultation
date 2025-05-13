<template>
  <a-card style="margin: auto;">
    <template #title>预约咨询</template>
    <p><strong>预约律师：</strong>{{ lawyer?.name }}</p>
    <p><strong>费用：</strong>{{ lawyer?.price }} 元</p>

    <a-form layout="vertical" @submit.prevent="submitForm">
      <a-form-item label="您的问题">
        <a-textarea v-model:value="problem" rows="4" />
      </a-form-item>

      <a-button type="primary" @click="submitForm">支付并提交</a-button>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()

const problem = ref('')
const lawyer = ref(null)

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`/api/lawyers/${id}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '获取律师信息失败')
    lawyer.value = data
  } catch (err) {
    message.error(err.message)
  }
})

const submitForm = async () => {
  if (!problem.value) {
    return message.error('请填写您的问题')
  }

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/consults', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        lawyerId: lawyer.value.id,
        question: problem.value,
        price: lawyer.value.price,
        status: 'paid'
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '提交失败')

    message.success('提交成功，律师将尽快回复')
    router.push(`/user/consult-list/${data.consultId}`)
  } catch (err) {
    message.error(err.message)
  }
}
</script>
