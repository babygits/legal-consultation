<template>
  <div class="container">
    <h1 class="title">智能法律咨询系统</h1>
    <a-card title="登录" style="width: 400px; margin: 50px auto 100px;">
      <a-form layout="vertical">
        <a-form-item label="邮箱">
          <a-input v-model:value="email" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="password" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block @click="handleLogin">登录</a-button>
        </a-form-item>
        <a-typography-text type="secondary">
          还没有账号？<a @click="goRegister">点击注册</a>
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
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return message.error('请填写邮箱和密码')
  }

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '登录失败');

    localStorage.setItem('token', data.token);
    message.success('登录成功');

    const payload = JSON.parse(atob(data.token.split('.')[1]));
    if (payload.role === 'lawyer') {
      router.push('/lawyer');
    } else if (payload.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  } catch (err) {
    message.error(err.message);
  }
}

const goRegister = () => {
  router.push('/register')
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
