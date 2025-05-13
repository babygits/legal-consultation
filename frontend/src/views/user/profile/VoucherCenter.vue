<template>
  <div class="recharge-container">
    <a-card style="margin-bottom: 10px">
      <p><strong>当前余额：</strong>￥{{ balance }}</p>
    </a-card>
    <a-card title="选择充值金额" bordered>
      <a-radio-group v-model:value="selectedAmount" class="amount-options">
        <a-radio-button
            v-for="amount in amounts"
            :key="amount"
            :value="amount"
        >
          {{ amount }} 元
        </a-radio-button>

        <a-radio-button :value="'custom'">
          自定义
          <a-input-number
              v-model:value="customAmount"
              :min="1"
              :max="10000"
              size="small"
              style="width: 100px; margin-left: 8px;"
              @click.stop
              @change="handleCustomChange"
              :disabled="selectedAmount !== 'custom'"
              placeholder="输入金额"
          />
          元
        </a-radio-button>
      </a-radio-group>

      <div class="recharge-footer">
        <a-button
            type="primary"
            @click="handleRecharge"
            :disabled="!finalAmount"
        >
          立即充值
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const amounts = [10, 20, 50, 100, 200, 500]

const balance = ref(0)
const selectedAmount = ref(null)
const customAmount = ref(null)

// 计算最终的充值金额
const finalAmount = computed(() => {
  if (selectedAmount.value === 'custom') {
    return customAmount.value
  } else {
    return selectedAmount.value
  }
})

function handleCustomChange(value) {
  if (value !== null && value !== undefined) {
    customAmount.value = value
  }
}

async function handleRecharge() {
  if (finalAmount.value) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ balance: balance.value + finalAmount.value })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || '充值失败')
      message.success(`充值 ${finalAmount.value} 元成功！`)
      getBalance()
    } catch (err) {
      message.error(err.message)
    }
  } else {
    message.warning('请选择或输入一个金额')
  }
}

const getBalance = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '加载失败')
    balance.value = data.balance
  } catch (err) {
    message.error(err.message)
  }
}


onMounted(() => {
  getBalance()
})
</script>

<style scoped>
.recharge-container {
  margin: 0 auto;
  padding: 20px;
}

.amount-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.recharge-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
