<template>
  <form class="grid" @submit="handleSubmit">
    <textarea
      v-model="content"
      name="comment"
      id=""
      placeholder="请输入你的评论"
      class=" bg-gray-50 p-2 rounded"
    />
    <fieldset class="py-4">
      <input
        type="submit"
        value="评论"
        class="px-4 py-1 bg-blue-600 rounded text-white hover:cursor-pointer"
      />
      <input
        type="reset"
        value="取消"
        class="px-4 py-1 bg-white rounded border ml-3 hover:cursor-pointer"
      />
    </fieldset>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['submit'])
const content = ref('')
const handleSubmit = (e) => {
  e.preventDefault()
  emit('submit', content.value)
  content.value = ''
}
</script>
