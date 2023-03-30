<template>
  <button
    class="pt-4 text-blue-600"
    :class="[showCommentBox ? 'pb-2' : 'pb-10']"
    @click="toggleShowCommentBox"
  >
    回复
  </button>
  <CommentBox v-if="showCommentBox" class="mb-4" @submit="handleSubmit" />
</template>

<script setup>
import { ref } from 'vue'
import CommentBox from './CommentBox.vue'

const emit = defineEmits(['submit'])
const showCommentBox = ref(false)

const toggleShowCommentBox = () => {
  showCommentBox.value = !showCommentBox.value
}

const handleSubmit = (e) => {
  emit('submit', e)
  showCommentBox.value = false
}
</script>