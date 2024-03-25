# ルーティング {#routing}

## クライアントサイドとサーバーサイドのルーティングの比較 {#client-side-vs-server-side-routing}

サーバーサイドのルーティングとは、ユーザーがアクセスしている URL のパスに基づいて、サーバーがレスポンスを送信することを意味します。従来のサーバーレンダリングの Web アプリでリンクをクリックすると、ブラウザーはサーバーから HTML レスポンスを受け取り、新しい HTML でページ全体を再読み込みします。

しかし [Single-Page Application](https://developer.mozilla.org/ja/docs/Glossary/SPA)（SPA）では、クライアントサイドの JavaScript がナビゲーションを横取りし、動的に新しいデータを取得し、ページを完全に再読み込みすることなく現在のページを更新します。これは一般的に、ユーザーが長期間にわたって多くのインタラクションを実行することが期待される実際の「アプリケーション」のようなユースケースで特に、より迅速なユーザーエクスペリエンスにつながります。

このような SPA では「ルーティング」はクライアントサイド、つまりブラウザーで行われます。クライアントサイドのルーターは、[History API](https://developer.mozilla.org/ja/docs/Web/API/History) や [`hashchange` イベント](https://developer.mozilla.org/ja/docs/Web/API/Window/hashchange_event)などのブラウザー API を使用して、アプリケーションのレンダリングビューを管理する責任を負っています。

## 公式ルーター {#official-router}

<!-- TODO update links -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="Free Vue Router Course">
    Watch a Free Video Course on Vue School
  </VueSchoolLink>
</div>

Vue は SPA の構築に適しています。ほとんどの SPA では、公式がサポートする [Vue Router ライブラリー](https://github.com/vuejs/router) を使うことを推奨します。詳細は、Vue Router の [ドキュメント](https://router.vuejs.org/) を参照してください。

## スクラッチでのシンプルなルーティング {#simple-routing-from-scratch}

もしシンプルなルーティングのみ必要で、フル機能のルーターライブラリーを含めたくない場合は、[動的コンポーネント](/guide/essentials/component-basics#dynamic-components)を使って、ブラウザーの [`hashchange` イベント](https://developer.mozilla.org/ja/docs/Web/API/Window/hashchange_event) を購読したり、 [History API](https://developer.mozilla.org/ja/docs/Web/API/History) を使うことで、現在のコンポーネントの状態を変更することができます。

以下は、最小構成の例です:

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
