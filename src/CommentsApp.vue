<template>
  <main class="p-8 bg-gray-50 min-h-screen">
    <h2 class="text-3xl my-6">评论</h2>
    <CommentBox @submit="addNewCommentData($event)" />
    <DividerHorizontal />
    <div v-for="comment in comments" :key="comment.id">
      <CommentItem
        :user="comment.user"
        :avatar="comment.avatar"
        :time="comment.time"
        :content="comment.content"
      />
      <ReplyContainer>
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :user="reply.user"
          :avatar="reply.avatar"
          :time="reply.time"
          :content="reply.content"
        />
        <ReplyBox @submit="addNewCommentData($event, comment.id)" />
      </ReplyContainer>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CommentBox from './components/CommentBox.vue'
import DividerHorizontal from './components/DividerHorizontal.vue'
import CommentItem from './components/CommentItem.vue'
import ReplyContainer from './components/ReplyContainer.vue'
import ReplyBox from './components/ReplyBox.vue'

const comments = ref([])

onMounted(() => {
  getAllCommentsData()
})

const getAllCommentsData = async () => {
  try {
    const res = await fetch('/api/comments')
    comments.value = await res.json()
  } catch (error) {
    console.log('getAllCommentsData', error)
  }
}

const addNewCommentData = async (content, replyTo) => {
  try {
    await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        content,
        ...(replyTo && { replyTo })
      })
    })
    setTimeout(async () => {
      await getAllCommentsData()
    }, 1000)
  } catch (error) {
    console.log('addNewCommentData', error)
  }
}
</script>
