<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Vue Partners' }}</template>
    <template #lead>
      Vue パートナーは、一流の Vue コンサルティングおよび
      開発サービスを提供する、Vue チーム推奨の代理店です。
      パートナーとしての掲載にご興味のある企業様は、
      <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
        >こちらからご登録をお願いします</a
      >。
    </template>
  </PageHero>
</template>
