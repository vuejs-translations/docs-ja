<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>テーマ</template>
      <template #lead>テーマ、UI キット、プラグインをチェック。パートナーによる、Vue を使った実際のアプリケーション構築方法をご覧いただけます。</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      あなたのテーマをここで紹介したいですか？ <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">ご連絡ください！</a>
    </ThemeContact>
  </div>
</template>
