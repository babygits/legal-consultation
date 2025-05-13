<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider collapsible v-model:collapsed="collapsed">
      <div class="logo">
        <img class="logo-img" src="../assets/images/logo.png" />
        <span>智能法律咨询</span>
      </div>
      <a-menu theme="dark" mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
        <a-menu-item key="dashboard" icon="📊">首页</a-menu-item>
        <a-menu-item key="users" icon="👤">用户管理</a-menu-item>
        <a-menu-item key="lawyers" icon="📝">律师认证管理</a-menu-item>
        <a-menu-item key="cases" icon="📁">案件管理</a-menu-item>
        <a-menu-item key="consults" icon="💬">咨询管理</a-menu-item>
        <a-menu-item key="feedback" icon="⭐">评分与反馈</a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主体内容 -->
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; display: flex; justify-content: space-between; align-items: center;">
        <span>管理员中心</span>
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
      const match = val.match(/^\/admin\/(\w+)/)
      selectedKey.value = match ? match[1] : 'dashboard'
    },
    { immediate: true }
)

const handleMenuClick = ({ key }) => {
  router.push(`/admin/${key}`)
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
