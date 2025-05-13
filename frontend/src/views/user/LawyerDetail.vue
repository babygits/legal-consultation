<template>
  <div class="container">
    <a-card :title="lawyer.name" style="width: 500px;margin: auto;">
      <template #cover>
        <img :src="lawyer.avatar || defaultAvatar" style="height: 240px; object-fit: cover;" />
      </template>
      <p><strong>邮箱：</strong>{{ lawyer.email }}</p>
      <p><strong>手机号：</strong>{{ lawyer.phone }}</p>
      <p><strong>专业领域：</strong>{{ lawyer.major ? getLawyerMajorLabels(lawyer.major).join(',') : '无' }}</p>
      <p><strong>评分：</strong>{{ lawyer.rating || '暂无' }}</p>
      <p><strong>简介：</strong>{{ lawyer.bio || '暂无简介' }}</p>
      <a-button type="primary" @click="consult">发起咨询</a-button>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getLawyerMajorLabels } from '../utils/common.js'

const route = useRoute()
const router = useRouter()
const lawyer = ref({})
const defaultAvatar = '/lawyer-ph.jpg'

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`/api/lawyers/${id}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    lawyer.value = {
      ...data,
      field: data.field || '民事',
      rating: data.rating || (Math.random() * 2 + 3).toFixed(1)
    }
  } catch (err) {
    message.error(err.message)
  }
})

const consult = () => {
  router.push(`/user/reserve/${lawyer.value.id}`)
}
</script>

<style scoped>
.container {

}
</style>
