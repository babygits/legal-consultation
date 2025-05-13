<template>
  <div>
    <a-page-header title="案件详情" @back="$router.back()" />
    <a-descriptions bordered column="1">
      <a-descriptions-item label="标题">{{ detail.title }}</a-descriptions-item>
      <a-descriptions-item label="描述">{{ detail.description }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ detail.status }}</a-descriptions-item>
      <a-descriptions-item label="用户">{{ detail.user?.name }}（{{ detail.user?.email }}）</a-descriptions-item>
      <a-descriptions-item label="律师">{{ detail.lawyer?.name || '未指派' }}</a-descriptions-item>
      <a-descriptions-item label="文件">
        <ul v-if="detail.files?.length">
          <li v-for="(file, idx) in detail.files" :key="idx">
            <a :href="file" target="_blank">下载文件 {{ idx + 1 }}</a>
          </li>
        </ul>
        <span v-else>无文件</span>
      </a-descriptions-item>
    </a-descriptions>

    <h3 style="margin-top: 24px;">案件进展</h3>
    <a-timeline style="margin-top: 12px;">
      <a-timeline-item v-for="(p, i) in detail.progresses" :key="i">
        <p>{{ p.content }}</p>
        <small>{{ p.createdAt }}</small>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const detail = ref({})
const token = localStorage.getItem('token')

const fetchDetail = async () => {
  try {
    const res = await fetch(`/api/admin/cases/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    detail.value = data.case
  } catch (err) {
    message.error('获取详情失败')
  }
}

onMounted(fetchDetail)
</script>
