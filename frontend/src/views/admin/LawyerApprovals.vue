<template>
  <div>
    <h2>律师认证审核</h2>

    <a-table
        :columns="columns"
        :data-source="lawyers"
        row-key="id"
        :expandedRowRender="expandedRowRender"
        :pagination="{ pageSize: 8 }"
    >
      <template #actions="{ record }">
        <a-space>
          <a-popconfirm
              title="确认通过该认证？"
              @confirm="verifyLawyer(record.id, 'approved')"
          >
            <a-button type="primary">通过</a-button>
          </a-popconfirm>
          <a-popconfirm
              title="确认拒绝该认证？"
              @confirm="verifyLawyer(record.id, 'rejected')"
          >
            <a-button danger>拒绝</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { getLawyerMajorLabels } from '../utils/common.js'

const lawyers = ref([])
const token = localStorage.getItem('token')

console.log(lawyers.value)

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
  {
    title: '操作',
    key: 'actions',
    slots: { customRender: 'actions' }
  }
]

const expandedRowRender = (row) => {
  console.log(row)
  const record = row.record
  return h('div', [
    h('p', `执业证号：${record.idNumber || '未填写'}`),
    h('p', `简介：${record.bio || '无'}`),
    h('p', `领域：${record.major ? getLawyerMajorLabels(record.major).join(',') : '无'}`),
    record.avatar
        ? h('img', {
          src: record.avatar,
          alt: '头像',
          style: 'width: 80px; height: 80px; border-radius: 50%; margin-top: 8px;'
        })
        : null,
    record.certFile
        ? h(
            'p',
            {},
            [
              '认证材料：',
              h(
                  'a',
                  { href: record.certFile, target: '_blank', style: 'margin-left: 8px;' },
                  '点击查看文件'
              )
            ]
        )
        : h('p', '未上传认证文件')
  ])
}

const fetchLawyers = async () => {
  try {
    const res = await fetch('/api/admin/lawyers/pending', {
      headers: { Authorization: 'Bearer ' + token }
    })

    const data = await res.json()
    lawyers.value = data.lawyers
  } catch (err) {
    message.error('获取认证申请失败')
  }
}

const verifyLawyer = async (id, status) => {
  try {
    await fetch(`/api/admin/lawyers/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ status })
    })
    message.success(`认证${status === 'approved' ? '通过' : '已拒绝'}`)
    fetchLawyers()
  } catch (err) {
    message.error('操作失败')
  }
}

onMounted(fetchLawyers)
</script>
