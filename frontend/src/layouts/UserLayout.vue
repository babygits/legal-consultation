<template>
  <a-layout style="min-height: 100vh">
    <!-- 左侧导航栏 -->
    <a-layout-sider collapsible>
      <div class="logo">
        <img class="logo-img" src="../assets/images/logo.png" />
        <span>智能法律咨询</span>
      </div>
      <a-menu theme="dark" mode="inline" :selectedKeys="[activeKey]" @click="handleMenuClick">
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="consult">AI 法律咨询</a-menu-item>
        <a-menu-item key="lawyer">在线找律师</a-menu-item>
        <a-menu-item key="consult-list">我的咨询</a-menu-item>
        <a-menu-item key="cases">案件管理</a-menu-item>
        <a-sub-menu key="profile" title="个人中心">
          <a-menu-item key="info">个人信息</a-menu-item>
          <a-menu-item key="change-password">修改密码</a-menu-item>
          <a-menu-item key="records">支付记录</a-menu-item>
          <a-menu-item key="voucher-center">充值中心</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout>
      <!-- 顶部栏 -->
      <a-layout-header style="background: #fff; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
        <span>用户中心</span>
        <a-button type="link" danger @click="logout">退出登录</a-button>
      </a-layout-header>

      <!-- 页面内容 -->
      <a-layout-content style="margin: 24px;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const activeKey = computed(() => {
  const segments = route.path.split('/')
  return segments[2] || 'home'
})

const handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    logout()
  } else if (['info', 'records', 'change-password', 'voucher-center'].includes(key)) {
    router.push(`/user/profile/${key}`)
  } else {
    router.push(`/user/${key}`)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
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

