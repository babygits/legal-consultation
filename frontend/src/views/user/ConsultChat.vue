<template>
  <div style="margin: auto; display: flex; flex-direction: column; height: 80vh; background-color: white; padding: 20px">
    <h2 style="margin-bottom: 16px;">与{{consultDetail?.lawyer?.name}}对话</h2>

    <!-- 消息区域 -->
    <div class="chat-window" ref="chatWindow">
      <div v-for="msg in messages" :key="msg.id" :class="['chat-bubble', msg.senderRole === meRole ? 'mine' : 'theirs']">
        <div class="sender">{{ msg.sender?.name || msg.senderRole }}</div>
        <div v-if="msg.content.startsWith('[case]')" class="case">
          <img src="../../assets/images/case.png" alt="Case" style="width: 100px" />
          <div class="case-desc">
            <div>案件编号：{{msg.content.split('-')[1]}}</div>
            <div>案件名称：{{msg.content.split('-')[2]}}</div>
            <span style="color: #686868">已为您创建案件，请关注案件后续的进展</span>
            <a @click="goCaseDetail(msg.content.split('-')[1])">详情</a>
          </div>
        </div>
        <div v-else>{{ msg.content }}</div>
        <div class="time">{{ formatTime(msg.createdAt) }}</div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div style="margin-top: auto;">
      <a-textarea v-model:value="newMessage" rows="2" placeholder="输入消息..."  @keydown.enter.prevent="sendMessage" />
      <a-button type="primary" style="margin-top: 8px;" @click="sendMessage">发送</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const messages = ref([])
const consultDetail = ref(null)
const newMessage = ref('')
const chatWindow = ref(null)

const meRole = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role

const loadDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/consults/${route.params.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    consultDetail.value = data
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

const goCaseDetail = (id) => {
  router.push(`/user/cases/${id}`)
}

const formatTime = (t) => new Date(t).toLocaleString()

onMounted(() => {
  loadDetail()
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

.case {
  display: flex;
  justify-content: flex-start;
}

.case-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
</style>
