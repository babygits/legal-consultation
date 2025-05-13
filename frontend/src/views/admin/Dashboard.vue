<template>
  <div>
    <h2>管理员首页</h2>
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="6">
        <a-card bordered>
          <template #title>
            <user-outlined style="margin-right: 8px" /> 用户总数
          </template>
          <h1>{{ stats.userCount }}</h1>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card bordered>
          <template #title>
            <idcard-outlined style="margin-right: 8px" /> 待认证律师
          </template>
          <h1>{{ stats.pendingLawyers }}</h1>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card bordered>
          <template #title>
            <file-text-outlined style="margin-right: 8px" /> 案件总数
          </template>
          <h1>{{ stats.caseCount }}</h1>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card bordered>
          <template #title>
            <message-outlined style="margin-right: 8px" /> 咨询总数
          </template>
          <h1>{{ stats.consultCount }}</h1>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 24px">
      <a-col :span="6">
        <a-card bordered>
          <template #title>
            <star-outlined style="margin-right: 8px" /> 平均评分
          </template>
          <h1>{{ stats.avgRating }}</h1>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区 -->
    <a-row :gutter="16" style="margin-top: 40px">
      <a-col :span="12">
        <a-card title="近6个月用户增长趋势">
          <div ref="growthChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="用户角色占比">
          <div ref="roleChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>
    <a-row style="margin-top: 32px">
      <a-col :span="24">
        <a-card title="案件状态分布">
          <div ref="caseChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16" style="margin-top: 40px">
      <a-col :span="24">
        <a-card title="案件状态趋势（近6个月）">
          <div ref="caseTrendChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <a-row style="margin-top: 32px">
      <a-col :span="24">
        <a-card title="每日咨询热力图（近60天）">
          <div ref="consultHeatmapRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, IdcardOutlined, FileTextOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import 'echarts/lib/component/calendar'
import 'echarts/lib/component/visualMap'

const stats = ref({ userCount: 0, pendingLawyers: 0, caseCount: 0, consultCount: 0, avgRating: '无' })
const token = localStorage.getItem('token')

const growthChartRef = ref(null)
const roleChartRef = ref(null)
const caseChartRef = ref(null)
const caseTrendChartRef = ref(null)
const consultHeatmapRef = ref(null)

const fetchStats = async () => {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: 'Bearer ' + token }
    })
    stats.value = await res.json()
  } catch (err) {
    message.error('获取统计失败')
  }
}

const initCharts = async () => {
  const [growthRes, roleRes, caseRes, trendRes, heatmapRes] = await Promise.all([
    fetch('/api/admin/stats/growth', { headers: { Authorization: 'Bearer ' + token } }),
    fetch('/api/admin/stats/roles', { headers: { Authorization: 'Bearer ' + token } }),
    fetch('/api/admin/stats/cases', { headers: { Authorization: 'Bearer ' + token } }),
    fetch('/api/admin/stats/case-trend', { headers: { Authorization: 'Bearer ' + token } }),
    fetch('/api/admin/stats/consult-daily', { headers: { Authorization: 'Bearer ' + token } })
  ])

  const growth = (await growthRes.json()).growth
  const roles = (await roleRes.json()).roles
  const cases = (await caseRes.json()).cases
  const trend = (await trendRes.json()).trend
  const daily = (await heatmapRes.json()).daily

  echarts.init(growthChartRef.value).setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: growth.map(i => i.label) },
    yAxis: { type: 'value' },
    series: [{ name: '新增用户', type: 'line', smooth: true, data: growth.map(i => i.value) }]
  })

  echarts.init(roleChartRef.value).setOption({
    tooltip: { trigger: 'item' },
    legend: { top: 'top' },
    series: [{ type: 'pie', radius: '50%', data: roles, label: { formatter: '{b}: {d}%' } }]
  })

  echarts.init(caseChartRef.value).setOption({
    tooltip: {},
    xAxis: { type: 'category', data: cases.map(i => i.name) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: cases.map(i => i.value), name: '案件数量' }]
  })

  echarts.init(caseTrendChartRef.value).setOption({
    tooltip: { trigger: 'axis' },
    legend: { top: 'top' },
    xAxis: { type: 'category', data: trend.map(i => i.month) },
    yAxis: { type: 'value' },
    series: [
      { name: 'open', type: 'line', stack: 'total', data: trend.map(i => i.open) },
      { name: 'in-progress', type: 'line', stack: 'total', data: trend.map(i => i.inProgress) },
      { name: 'resolved', type: 'line', stack: 'total', data: trend.map(i => i.resolved) },
      { name: 'closed', type: 'line', stack: 'total', data: trend.map(i => i.closed) }
    ]
  })

  echarts.init(consultHeatmapRef.value).setOption({
    visualMap: {
      min: 0,
      max: Math.max(...daily.map(d => d.count)) || 10,
      orient: 'horizontal',
      left: 'center',
      bottom: 20
    },
    calendar: {
      range: [daily[0]?.date || '2024-01-01', daily[daily.length - 1]?.date || '2024-01-01']
    },
    tooltip: {
      formatter: p => `${p.data[0]}：${p.data[1]} 次咨询`
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: daily.map(d => [d.date, d.count])
    }]
  })
}

onMounted(async () => {
  await fetchStats()
  await nextTick()
  initCharts()
})
</script>

