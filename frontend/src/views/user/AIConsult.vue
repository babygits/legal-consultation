<template>
  <a-row :gutter="24" style="height: 100%;margin: auto;">
    <!-- 左侧历史记录 -->
    <a-col :span="6" style="height: 100%">
      <a-card title="历史提问" bordered style="height: 100%">
        <a-list :data-source="history" bordered>
          <template #renderItem="{ item, index }">
            <a-list-item style="cursor: pointer;" @click="selectMessage(item)" :class="{ selected: currentMessage?.id === item.id }">
              {{ item.messages.find(m => m.role === 'user').content }}
            </a-list-item>
          </template>
        </a-list>

        <a-button class="new-chat-btn" type="primary" @click="newChat">
          新的对话
        </a-button>
      </a-card>
    </a-col>

    <!-- 右侧主内容 -->
    <a-col :span="18" style="height: 100%">
      <a-card title="AI 法律咨询" class="chat-container">
        <!-- 对话展示 -->
        <div ref="chatBoxRef" style="margin-bottom: 24px;" class="chat-box">
          <div v-for="(msg, index) in messages" :key="index" style="margin-bottom: 12px;">
            <div :class="msg.role === 'user' ? 'chat-right' : 'chat-left'">
              <a-tag :color="msg.role === 'user' ? 'blue' : 'green'" style="margin-right: 0;margin-left: 0">
                {{ msg.role === 'user' ? '我' : 'AI' }}
              </a-tag>
              <div v-if="!(index === messages.length - 1 && msg.role === 'assistant')" v-html="renderMarkdown(msg.content)"></div>
              <Typewriter
                  v-else
                  :text="renderMarkdown(msg.content)"
                  :speed="30"
              />
            </div>
          </div>
          <div v-if="loading" class="chat-left">
            <a-tag color="green" style="margin-right: 0;margin-left: 0">AI</a-tag>
            <a-spin></a-spin>
          </div>
        </div>

        <a-textarea
            v-model:value="question"
            placeholder="请输入您的法律问题"
            auto-size
            @keydown.enter.prevent="handleSubmit"
            style="margin-bottom: 16px;"
        />
        <a-space>
          <a-button type="primary" @click="handleSubmit" :loading="loading" :disabled="!question.trim()">
            提交咨询
          </a-button>
          <a-button type="default" @click="saveChat" :disabled="!messages.length">
            保存对话
          </a-button>
        </a-space>

        <div v-if="currentMessage" style="margin-top: 24px;">
          <h4>对本次对话的评分与反馈：</h4>
          <a-rate v-model:value="rating" allow-clear />
          <a-textarea
              v-model:value="feedback"
              placeholder="欢迎留下文字反馈（可选）"
              rows="3"
              style="margin-top: 12px;"
          />
          <a-button
              type="primary"
              style="margin-top: 8px;"
              @click="submitFeedback"
              :disabled="!rating"
          >
            提交反馈
          </a-button>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import Typewriter from './Typewriter.vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
})

const renderMarkdown = (content) => {
  return md.render(content)
}

const question = ref('')
const loading = ref(false)

const history = ref([])
const messages = ref([{ role: 'assistant', content: '你好！😊我是你的虚拟法律顾问，请问有什么我可以帮您的吗？' }])
const currentMessage = ref(null)

const rating = ref(null)
const feedback = ref('')

const chatBoxRef = ref(null)
const route = useRoute()

watch(currentMessage, (msg) => {
  if (msg) {
    rating.value = msg.rating || null
    feedback.value = msg.feedback || ''
  }
})

const scrollToBottom = () => {
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}

watch(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

const newChat = () => {
  question.value = ''
  messages.value = []
  currentMessage.value = null
  rating.value = null
  feedback.value = ''
}

const selectMessage = (messageItem) => {
  currentMessage.value = messageItem
  messages.value = messageItem.messages
}

const handleSubmit = async () => {
  const userInput = question.value.trim()
  if (!userInput) return

  messages.value.push({ role: 'user', content: userInput })
  question.value = ''

  try {
    loading.value = true
    let res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8479045ea5689721c8fdfb8057853574e81f46fbe6cdc2fe08d7eafcb59a07fc'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [{ role: 'system', content: '你是一个虚拟法律顾问，需要为用户解答法律相关的问题' }, ...messages.value],
        stream: false
      }),
    })
    res = await res.json()
    const message = res.choices[0].message;
    message.content = message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    messages.value.push(message)
    loading.value = false
  } catch (e) {
    console.log(e)
  }
}

const fetchChatHistory = async (isNew) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/chat/list`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    history.value = data.chats;
    if (isNew) {
      currentMessage.value = data.chats[0];
    }
  } catch (err) {
    message.error('获取聊天记录失败', err);
  }
};


const saveChat = async () => {
  try {
    const token = localStorage.getItem('token');
    const isUpdate = !!currentMessage.value?.id;
    const url = isUpdate
        ? `/api/chat/update/${currentMessage.value.id}`
        : `/api/chat/save`;

    const method = isUpdate ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        messages: messages.value,
      }),
    });

    message.success(isUpdate ? '对话已更新！' : '对话保存成功！');
    fetchChatHistory(!isUpdate);
  } catch (err) {
    console.error(err);
    message.error('保存失败');
  }
};

const submitFeedback = async () => {
  if (!currentMessage.value?.id || !rating.value) return

  try {
    const token = localStorage.getItem('token')
    await fetch(`/api/chat/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        chatId: currentMessage.value.id,
        rating: rating.value,
        feedback: feedback.value
      })
    })

    message.success('反馈提交成功！')
    fetchChatHistory()
  } catch (err) {
    console.error(err)
    message.error('反馈提交失败')
  }
}


onMounted(() => {
  fetchChatHistory()

  const q = route.query.q
  if (q) {
    question.value = q
    handleSubmit()
  }
})

</script>

<style scoped>
.selected {
  background-color: #e6f7ff;
  font-weight: bold;
}

.chat-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.chat-right {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row-reverse;
  gap: 10px;
}

.new-chat-btn {
  width: 100%;
  margin-top: 20px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-box {
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 24px;
  overflow-y: auto;
  height: 600px;
}

::v-deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
