<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider collapsible v-model:collapsed="collapsed">
      <div class="logo">
        <img class="logo-img" src="../assets/images/logo.png" />
        <span>智能法律咨询</span>
      </div>
      <a-menu theme="dark" mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
        <a-menu-item key="home">工作台</a-menu-item>
        <a-menu-item key="cases">案件管理</a-menu-item>
        <a-menu-item key="consults">咨询管理</a-menu-item>
        <a-sub-menu key="income" title="收入管理">
          <a-menu-item key="income/overview">金额设置</a-menu-item>
          <a-menu-item key="income/details">收入明细</a-menu-item>
          <a-menu-item key="income/withdraw">提现功能</a-menu-item>
          <a-menu-item key="income/withdrawals">提现记录</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="personal" title="个人中心">
          <a-menu-item key="profile">我的信息</a-menu-item>
          <a-menu-item key="change-pwd">修改密码</a-menu-item>
          <a-menu-item key="verify">律师认证</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 主体内容 -->
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; display: flex; justify-content: space-between; align-items: center;">
        <span>律师中心</span>
        <a-button type="link" @click="logout">退出登录</a-button>
      </a-layout-header>

      <a-layout-content style="margin: 24px; background: #fff; padding: 24px;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const selectedKey = ref('dashboard')

watch(
    () => route.path,
    (val) => {
      const match = val.match(/^\/lawyer\/(\w+)/)
      selectedKey.value = match ? match[1] : 'dashboard'
    },
    { immediate: true }
)

const handleMenuClick = ({ key }) => {
  router.push(`/lawyer/${key}`)
}

const logout = () => {
  localStorage.removeItem('token')
  message.success('已退出登录')
  window.location.href = '/login'
}
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}

.logo-img {
  width: 30px;
  height: 30px;
}
</style>
