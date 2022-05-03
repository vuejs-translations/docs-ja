<script setup>
let count = $ref(0)
</script>

<template>
  <p>現在のコンポーネント: A</p>
  <span style="margin-right:20px">カウント: {{ count }}</span>
  <button @click="count++">+</button>
</template>
