<template>
  <div class="container">
    <a-space style="margin-bottom: 16px;">
      <a-select v-model:value="selectedField" placeholder="按领域筛选" allowClear style="width: 160px;">
        <a-select-option v-for="field in fields" :key="field" :value="field">{{ field }}</a-select-option>
      </a-select>
      <a-select v-model:value="sortOption" style="width: 160px;">
        <a-select-option value="default">默认排序</a-select-option>
        <a-select-option value="rating">按评分排序</a-select-option>
      </a-select>
    </a-space>

    <a-list
        item-layout="vertical"
        :data-source="filteredLawyers"
        :grid="{ gutter: 16, column: 4 }"
        :pagination="{ pageSize: 8 }"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="item.name" :hoverable="true" @click="goToDetail(item.id)">
            <template #cover>
              <img :src="item.avatar || defaultAvatar" alt="avatar" style="height: 180px; object-fit: cover;" />
            </template>
            <p><strong>领域：</strong>{{ item.major ? getLawyerMajorLabels(item.major).join(',') : '无' }}</p>
            <p><strong>简介：</strong>{{ item.bio || '暂无简介' }}</p>
            <a-button type="primary" @click.stop="reserve(item)">发起咨询</a-button>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { getLawyerMajorLabels } from '../utils/common.js'

const router = useRouter();
const lawyers = ref([]);
const selectedField = ref(null);
const sortOption = ref('default');
const fields = ref(['民事', '刑事', '婚姻', '合同', '知识产权']);

const defaultAvatar = '/lawyer-ph.jpg';

onMounted(async () => {
  try {
    const res = await fetch('/api/lawyers');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '加载律师失败');
    lawyers.value = data
  } catch (err) {
    message.error(err.message);
  }
});

const filteredLawyers = computed(() => {
  let result = [...lawyers.value];
  if (selectedField.value) {
    result = result.filter(l => l.field === selectedField.value);
  }
  if (sortOption.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }
  return result;
});

const goToDetail = (id) => {
  router.push(`/user/lawyer/${id}`);
};

const reserve = (lawyer) => {
  router.push(`/user/reserve/${lawyer.id}`)
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: white;
}
.title {
  text-align: center;
  margin-bottom: 30px;
}
::v-deep(.ant-list-item) {
  padding: 0;
}
</style>
