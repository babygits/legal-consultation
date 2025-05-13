<template>
  <div class="container">
    <h2>案件详情</h2>
    <a-card v-if="caseInfo">
      <p><strong>案件标题：</strong>{{ caseInfo.title }}</p>
      <p><strong>案件描述：</strong>{{ caseInfo.description }}</p>
      <p><strong>所属咨询：</strong>{{ caseInfo.consult?.question }}</p>
      <p><strong>律师姓名：</strong>{{ caseInfo.lawyer?.name }}</p>
      <p><strong>案件状态：</strong>{{ caseInfo.status }}</p>
      <p><strong>创建时间：</strong>{{ formatTime(caseInfo.createdAt) }}</p>
    </a-card>

    <a-divider v-if="caseInfo?.progresses?.length">案件进展</a-divider>
    <a-timeline v-if="caseInfo?.progresses?.length">
      <a-timeline-item v-for="item in caseInfo.progresses" :key="item.id">
        {{ item.content }}（{{ formatTime(item.createdAt) }}）
      </a-timeline-item>
    </a-timeline>

    <p v-else style="margin-top: 20px">暂无进展记录</p>

    <a-divider v-if="caseInfo?.files?.length">法律文件</a-divider>
    <div v-if="caseInfo?.files?.length">
      <ul>
        <li v-for="(file, index) in caseInfo?.files" :key="index">
          <a :href="getDownloadUrl(file)" target="_blank" download>下载 {{ extractFileName(file) }}</a>
        </li>
      </ul>
    </div>
    <p v-else>暂无法律文件</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute()
const caseInfo = ref(null)

const extractFileName = (filePath) => {
  return filePath.split('/').pop();
};

const getDownloadUrl = (filePath) => {
  return `${BASE_API_URL}${filePath}`;
};

const formatTime = (t) => new Date(t).toLocaleString()

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/cases/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    caseInfo.value = data
  } catch (err) {
    message.error(err.message)
  }
})
</script>

<style scoped>
.container {
  background-color: white;
  padding: 20px;
}
</style>
