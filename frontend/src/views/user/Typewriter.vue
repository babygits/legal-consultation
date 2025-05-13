<template>
  <span v-html="displayText"></span>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: String,
  speed: {
    type: Number,
    default: 30
  }
})

const displayText = ref('')
let intervalId = null

const startTyping = () => {
  displayText.value = ''
  clearInterval(intervalId)

  let index = 0
  intervalId = setInterval(() => {
    if (index < props.text.length) {
      displayText.value += props.text[index++]
    } else {
      clearInterval(intervalId)
    }
  }, props.speed)
}

watch(() => props.text, () => {
  startTyping()
}, { immediate: true })

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>
