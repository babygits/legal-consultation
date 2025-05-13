<template>
  <div class="container">
    <h1 class="title">智能法律咨询系统</h1>
    <a-card title="注册" style="width: 400px; margin: 50px auto 100px;">
      <a-form layout="vertical">
        <a-form-item label="邮箱">
          <a-input v-model:value="email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="phone" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="name" />
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input v-model:value="idNumber" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="password" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select v-model:value="role" placeholder="请选择角色">
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="lawyer">律师</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block @click="handleRegister">注册</a-button>
        </a-form-item>
        <a-typography-text type="secondary">
          已有账号？<a @click="goLogin">返回登录</a>
        </a-typography-text>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const email = ref('')
const phone = ref('')
const password = ref('')
const name = ref('')
const idNumber = ref('')
const role = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (!email.value || !password.value || !name.value || !idNumber.value || !role.value) {
    return message.error('请填写完整信息');
  }

  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      phone: phone.value,
      password: password.value,
      name: name.value,
      idNumber: idNumber.value,
      role: role.value
    })
  });
  const data = await res.json();
  if (res.ok) {
    message.success('注册成功');
    router.push('/login');
  } else {
    message.error(data.message || '注册失败');
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>


<style scoped>
.title {
  color: white;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("../assets/images/bg.jpg") no-repeat center / cover;
  min-height: 100vh;
}
</style>
