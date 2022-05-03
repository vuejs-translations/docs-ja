<script setup>
let msg = $ref('')
</script>

<template>
  <p>現在のコンポーネント: B</p>
  <span style="margin-right:20px;">メッセージ: {{ msg }}</span>
  <input v-model="msg">
</template>
