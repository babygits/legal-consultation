<template>
  <!-- 头部状态显示 -->
  <div style="margin-bottom: 16px;">
    <p><strong>当前状态：</strong>{{ statusText[status] }}</p>
    <a-space>
      <a-button type="primary" @click="updateStatus('resolved')">标记为已解决</a-button>
      <a-button danger @click="updateStatus('unresolved')">标记为未解决</a-button>
    </a-space>
  </div>
  <p><strong>用户：</strong>{{ consult.user?.name }}</p>
  <p><strong>当前状态：</strong>{{ statusText[consult.status] }}</p>
  <a-divider>用户提问</a-divider>
  <p style="white-space: pre-wrap;">{{ consult.question }}</p>
  <div style="margin: auto; display: flex; flex-direction: column; height: 80vh;">
    <h2 style="margin-bottom: 16px;">咨询对话</h2>

    <!-- 消息区域 -->
    <div class="chat-window" ref="chatWindow">
      <div v-for="msg in messages" :key="msg.id" :class="['chat-bubble', msg.senderRole === meRole ? 'mine' : 'theirs']">
        <div class="sender">{{ msg.sender?.name || msg.senderRole }}</div>
        <div class="content">
          <div v-if="msg.content.startsWith('[case]')" class="case">
            <img src="../../assets/images/case.png" alt="Case" style="width: 100px" />
            <div class="case-desc">
              <div>案件编号：{{msg.content.split('-')[1]}}</div>
              <div>案件名称：{{msg.content.split('-')[2]}}</div>
              <span style="color: #686868">已为您创建案件，请关注案件后续的进展</span>
              <a @click="goCaseDetail(msg.content.split('-')[1])">详情</a>
            </div>
          </div>
          <div v-else>{{ msg.content }}</div></div>
        <div class="time">{{ formatTime(msg.createdAt) }}</div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div style="margin-top: auto;">
      <a-textarea v-model:value="newMessage" rows="2" placeholder="输入消息..." />
      <a-space>
        <a-button type="primary" style="margin-top: 8px;" @click="sendMessage">发送</a-button>
        <a-button type="primary" style="margin-top: 12px;" @click="showCreateCaseModal">创建案件</a-button>
      </a-space>
    </div>
  </div>

  <!-- 创建案件弹窗 -->
  <a-modal
      v-model:visible="isModalVisible"
      title="创建案件"
      @ok="handleCreateCase"
      @cancel="handleCancel"
      ok-text="确认"
      cancel-text="取消"
  >
    <a-form layout="vertical">
      <a-form-item label="案件标题">
        <a-input v-model:value="caseTitle" />
      </a-form-item>
      <a-form-item label="案件描述">
        <a-textarea v-model:value="caseDescription" rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const consult = ref({})
const messages = ref([])
const newMessage = ref('')
const chatWindow = ref(null)
const status = ref('')
const statusText = {
  pending: '待回复',
  resolved: '已解决',
  unresolved: '未解决'
}

const caseTitle = ref('')
const caseDescription = ref('')
const isModalVisible = ref(false)

const meRole = 'lawyer'

// 获取咨询详情
const loadConsultDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/consults/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    consult.value = data
  } catch (err) {
    message.error(err.message)
  }
}

const loadMessages = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/consults/${route.params.id}/messages`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    messages.value = data
    await nextTick()
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight
  } catch (err) {
    message.error(err.message)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/consults/${route.params.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ content: newMessage.value.trim() })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    newMessage.value = ''
    loadMessages()
  } catch (err) {
    message.error(err.message)
  }
}

const updateStatus = async (newStatus) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/consults/${route.params.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ status: newStatus })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    message.success('状态已更新')
    status.value = newStatus
  } catch (err) {
    message.error(err.message)
  }
}

const showCreateCaseModal = () => {
  isModalVisible.value = true
}

const handleCancel = () => {
  isModalVisible.value = false
}

const handleCreateCase = async () => {
  try {
    const userId = consult.value.user.id;
    const token = localStorage.getItem('token')
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        title: caseTitle.value,
        description: caseDescription.value,
        userId,
        consultId: route.params.id
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    message.success('案件创建成功')
    newMessage.value = `[case]-${data.case.id}-${caseTitle.value}`
    sendMessage()
    isModalVisible.value = false
  } catch (err) {
    message.error(err.message)
  }
}

const formatTime = (t) => new Date(t).toLocaleString()

const goCaseDetail = (id) => {
  router.push(`/lawyer/cases/${id}`)
}

onMounted(() => {
  loadConsultDetail()
  loadMessages()
})
</script>

<style scoped>
.chat-window {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
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

.content {
}

.case {
  display: flex;
  justify-content: flex-end;
}

.case-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
</style>
