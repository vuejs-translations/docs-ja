<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Vue Partners' }}</template>
    <template #lead>
      <p>
        Vue パートナーは、一流の Vue コンサルティングおよび開発サービスを提供する、Vue
        チームが承認した代理店です。
        貴社がパートナーとしてリストに掲載されることにご興味がある場合は、
        <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
          >こちらからご登録ください</a
        >。
      </p>
    </template>
  </PageHero>
</template>
