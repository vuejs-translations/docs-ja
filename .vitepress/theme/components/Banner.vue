<script setup>
/**
 * Adding a new banner:
 * 1. uncomment the banner slot in ../index.ts
 * 2. uncomment and update BANNER_ID in ../../inlined-scripts/restorePreferences.ts
 * 3. update --vt-banner-height if necessary
 */
import { ref } from 'vue'
import { VTIconPlus } from '@vue/theme'

const open = ref(true)

/**
 * Call this if the banner is dismissible
 */
function dismiss() {
  open.value = false
  document.documentElement.classList.add('banner-dismissed')
  localStorage.setItem(`vue-docs-banner-${__VUE_BANNER_ID__}`, 'true')
}
</script>

<template>
  <div class="banner" v-if="open">
    <a href="https://note.com/moe6811/n/n813c1da8cad7" target="_blank">
      Vue Fes Japan 2024 チケット発売開始！ <span>8/25（日）までのご購入で 1,000円 OFF!</span>
    </a>
  </div>
</template>

<style>
html:not(.banner-dismissed) {
  --vt-banner-height: 60px;
  --vt-banner-height: 30px; /* Vue Fes */
}
</style>

<style scoped>
.banner {
  position: fixed;
  z-index: var(--vp-z-index-banner);
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  height: var(--vt-banner-height);
  line-height: var(--vt-banner-height);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background-color: var(--vt-c-green);
}

.banner-dismissed .banner {
  display: none;
}

a:hover {
  text-decoration: underline;
}

button {
  position: absolute;
  right: 0;
  top: 0;
  padding: 20px 10px;
}

.close {
  width: 20px;
  height: 20px;
  fill: #fff;
  transform: rotate(45deg);
}
</style>
