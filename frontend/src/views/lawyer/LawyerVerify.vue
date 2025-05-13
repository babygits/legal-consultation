<template>
  <div style="max-width: 600px; margin: auto;">
    <h2 style="margin-bottom: 16px;">律师认证申请</h2>
    <a-card>
      <p><strong>当前认证状态：</strong>{{ statusText[user.lawyerStatus] || '未知' }}</p>
      <a-form layout="vertical">
        <a-form-item label="领域">
          <a-select
              v-model:value="major"
              mode="multiple"
              placeholder="请选择领域"
              :options="lawyerMajors"
          />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea v-model:value="bio" rows="3" placeholder="例如：擅长婚姻家事、合同纠纷等" />
        </a-form-item>
        <a-form-item label="上传执业证书">
          <a-upload
              name="certFile"
              :customRequest="uploadFile"
              :showUploadList="false"
          >
            <a-button type="default">上传认证材料</a-button>
          </a-upload>
          <p v-if="fileUrl" style="margin-top: 10px">已上传：{{ fileUrl }}</p>
        </a-form-item>
        <a-button type="primary" @click="submitVerify">提交认证申请</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { lawyerMajors } from '../utils/common.js'

const user = ref({})
const bio = ref('')
const fileUrl = ref('')
const major = ref([])

const statusText = {
  pending: '待审核',
  approved: '已认证',
  rejected: '未通过'
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/me', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    user.value = data
    bio.value = data.bio || ''
    fileUrl.value = data.certFile || ''
    major.value = data.major || []
  } catch (err) {
    message.error(err.message)
  }
})

const uploadFile = async ({ file, onSuccess, onError }) => {
  try {
    const formData = new FormData()
    formData.append('certFile', file)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/lawyers/verify/upload', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    fileUrl.value = data.url
    message.success('上传成功')
    onSuccess()
  } catch (err) {
    message.error(err.message)
    onError()
  }
}

const submitVerify = async () => {
  if (!fileUrl.value || !bio.value || !major.value) {
    return message.error('请上传认证文件并填写领域和简介')
  }
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/lawyers/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        certFile: fileUrl.value,
        bio: bio.value,
        major: major.value
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    message.success('已提交认证申请')
  } catch (err) {
    message.error(err.message)
  }
}

</script>
