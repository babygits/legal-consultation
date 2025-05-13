<template>
  <div style="margin: auto;">
    <h2>案件详情</h2>

    <!-- 案件基本信息 -->
    <a-card>
      <p><strong>案件标题：</strong>{{ caseDetails.title }}</p>
      <p><strong>案件描述：</strong>{{ caseDetails.description }}</p>
      <p><strong>律师：</strong>{{ caseDetails.lawyer?.name }}</p>
      <p><strong>用户：</strong>{{ caseDetails.user?.name }}</p>
    </a-card>

    <!-- 进展记录 -->
    <a-divider>案件进展</a-divider>
    <a-list
        :data-source="progressList"
        bordered
        item-layout="horizontal"
    >
      <a-list-item v-for="item in progressList" :key="item.id">
        <a-list-item-meta
            :title="item.content"
            description="进展描述"
        />
        <div>{{ formatTime(item.createdAt) }}</div>
      </a-list-item>
    </a-list>

    <div class="case-files" v-if="caseDetails.files?.length">
      <h4>已上传文件：</h4>
      <ul>
        <li v-for="(file, index) in caseDetails.files" :key="index">
          <a :href="getDownloadUrl(file)" target="_blank" download>下载 {{ extractFileName(file) }}</a>
        </li>
      </ul>
    </div>

    <!-- 添加进展记录 -->
    <a-space style="margin-top: 20px">
      <a-button type="primary" @click="showProgressModal">添加进展</a-button>
      <!-- 上传文件按钮 -->
      <a-upload
          :customRequest="handleUpload"
          :showUploadList="false"
          accept=".pdf,.docx,.jpg,.png"
      >
        <a-button>上传法律文件</a-button>
      </a-upload>
    </a-space>

    <!-- 添加进展记录弹窗 -->
    <a-modal
        v-model:visible="isProgressModalVisible"
        title="添加案件进展"
        @ok="handleProgressSubmit"
        @cancel="handleProgressCancel"
        ok-text="确认"
        cancel-text="取消"
    >
      <a-form layout="vertical">
        <a-form-item label="进展描述">
          <a-textarea v-model:value="progressContent" rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const caseDetails = ref({})
const progressList = ref([])
const progressContent = ref('')
const isProgressModalVisible = ref(false)
const fileUrl = ref('')

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

// 格式化时间
const formatTime = (time) => new Date(time).toLocaleString()

// 获取案件详情
const loadCaseDetails = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/cases/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    caseDetails.value = data
  } catch (err) {
    message.error(err.message)
  }
}

// 获取案件进展记录
const loadProgressList = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/cases/${route.params.id}/progress`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    progressList.value = data
  } catch (err) {
    message.error(err.message)
  }
}

const extractFileName = (filePath) => {
  return filePath.split('/').pop();
};

const getDownloadUrl = (filePath) => {
  return `${BASE_API_URL}${filePath}`;
};

// 显示添加进展记录弹窗
const showProgressModal = () => {
  isProgressModalVisible.value = true
}

// 取消添加进展记录
const handleProgressCancel = () => {
  isProgressModalVisible.value = false
}

// 提交进展记录
const handleProgressSubmit = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/cases/${route.params.id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ content: progressContent.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    message.success('进展记录添加成功')
    loadProgressList() // 重新加载进展记录
    isProgressModalVisible.value = false
    progressContent.value = ''
  } catch (err) {
    message.error(err.message)
  }
}

// 处理上传文件
const handleUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/cases/${route.params.id}/files`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    fileUrl.value = data.fileUrl
    message.success('文件上传成功')
    onSuccess()
    loadCaseDetails()
  } catch (err) {
    message.error(err.message)
    onError()
  }
}

onMounted(() => {
  loadCaseDetails()
  loadProgressList()
})
</script>

<style scoped>
.chat-window {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 12px;
  background-color: #f9f9f9;
  margin-bottom: 12px;
}
.chat-bubble {
  max-width: 70%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  position: relative;
  word-wrap: break-word;
}
.mine {
  align-self: flex-end;
  background-color: #d1eaff;
  text-align: right;
  margin-left: auto;
}
.theirs {
  align-self: flex-start;
  background-color: #e4e4e4;
  margin-right: auto;
}
.sender {
  font-size: 12px;
  color: #555;
}
.time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.case-files {
  margin: 20px 0;
}
</style>
