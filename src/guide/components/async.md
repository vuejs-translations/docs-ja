# 非同期コンポーネント {#async-components}

## 基本的な使い方 {#basic-usage}

大規模なアプリケーションでは、アプリを小さなチャンクに分割し、必要なときにのみサーバーからコンポーネントを読み込む必要があるかもしれません。これを実現するために、Vue には [`defineAsyncComponent`](/api/general#defineasynccomponent) 関数があります:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...サーバーからコンポーネントを読み込む
    resolve(/* 読み込まれたコンポーネント */)
  })
})
// ... `AsyncComp` を普通のコンポーネントと同じように使用する
```

このように、`defineAsyncComponent` は Promise を返すローダー関数を受け取ります。Promise の `resolve` コールバックは、コンポーネントの定義をサーバーから取得したときに呼ばれます。読み込みが失敗したことを示すために、`reject(reason)` を呼ぶこともできます。

[ES モジュールの動的インポート](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)<!-- TODO: 日本語版のページが出来たら URL 差し替え -->も Promise を返すため、ほとんどの場合には `defineAsyncComponent` と合わせて使用します。Vite や webpack などのバンドラーもこの構文をサポートしているため（バンドル分割ポイントとして使用されます）、Vue SFC をインポートするためにも使用できます。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

結果的に得られる `AsyncComp` は、実際にページ上にレンダリングされるときにローダー関数を呼ぶだけのラッパーコンポーネントです。さらに、内側のコンポーネントに任意の props やスロットを渡せるため、非同期ラッパーを使用すると、コンポーネントをシームレスに置換するとともに、遅延読み込みも実現できます。

通常のコンポーネントと同様に、非同期コンポーネントも `app.component()` を用いて[グローバルに登録](/guide/components/registration#global-registration)できます:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

[コンポーネントをローカルに登録する](/guide/components/registration#local-registration)ときには、`defineAsyncComponent` も利用できます:

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

また、親コンポーネント内で直接定義できます:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## ローディングとエラーの状態 {#loading-and-error-states}

非同期の操作は必然的にローディングとエラーの状態に関係してきます。そのため、`defineAsyncComponent()` ではこれらの状態のハンドリングを高度なオプションによりサポートしています。

```js
const AsyncComp = defineAsyncComponent({
  // ローダー関数
  loader: () => import('./Foo.vue'),

  // 非同期コンポーネントの読み込み中に使用するコンポーネント
  loadingComponent: LoadingComponent,
  // ローディングコンポーネント表示前の遅延。デフォルト: 200ms。
  delay: 200,

  // 読み込みに失敗した場合に使用するコンポーネント
  errorComponent: ErrorComponent,
  // エラーコンポーネントは timeout が与えられて
  // その時間を超えた場合に表示される。デフォルト: Infinity。
  timeout: 3000
})
```

ローディングコンポーネントが与えられた場合、内側のコンポーネントが読み込まれている間に表示されます。ローディングコンポーネントが表示されるまでに、デフォルトで 200ms の遅延があります。このようになっているのは、高速なネットワークではローディング状態が短く、置き換えが速すぎて、ちらつきのように見えてしまう恐れがあるためです。

エラーコンポーネントが与えられた場合、ローダー関数から返された Promise が reject されたときに表示されます。リクエストが長すぎる場合にエラーコンポーネントを表示するために、timeout を指定することもできます。

## 遅延ハイドレーション <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> このセクションは[サーバーサイドレンダリング](/guide/scaling-up/ssr)を使用している場合のみ適用されます。

Vue 3.5 以降では、非同期コンポーネントはハイドレーション戦略を提供することでいつハイドレートされるかを制御できます。

- Vue は複数のビルトインのハイドレーション戦略を提供しています。これらのビルトイン戦略は使用されていない場合にツリーシェイキングするために個別にインポートする必要があります。

- 柔軟性を持たせるために設計は意図的に低レベルになっています。将来的にコアまたは高レベルのソリューション（例： Nuxt）で、コンパイラーのシンタックスシュガー（糖衣構文）がこれに基づいて構築される可能性があります。

### アイドル状態でハイドレート

`requestIdleCallback` を使用してハイドレートします:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* タイムアウトの上限を渡すこともできます（省略可能） */)
})
```

### 表示時にハイドレート

`IntersectionObserver` を使用して要素が表示されたときにハイドレートします。

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

オブザーバーに対してオプションのオブジェクト値を渡すことができます:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### メディアクエリーでハイドレート

指定されたメディアクエリーに一致したときにハイドレートします。

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### インタラクションでハイドレート

コンポーネント要素に指定されたイベントがトリガーされたときにハイドレートします。ハイドレーションがトリガーされたイベントもハイドレーションが一度完了すると再生されます。

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

複数のイベントタイプをリストにすることもできます:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### カスタム戦略

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement はコンポーネントのハイドレートされていない DOM の中にある
  // 全てのルート要素を反復処理するためのヘルパーです。ルート要素は単一の要素ではなく
  // フラグメントである可能性があるためです
  forEachElement(el => {
    // ...
  })
  // 準備が整ったときに `hydrate` を呼び出します
  hydrate()
  return () => {
    // 必要であれば、後処理（teardown）の関数を返します
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Suspense での使用 {#using-with-suspense}

非同期コンポーネントは、ビルトインコンポーネント `<Suspense>` と使用することもできます。`<Suspense>` と非同期コンポーネント間のインタラクションについては、[`<Suspense>` のページ](/guide/built-ins/suspense) にドキュメントがあります。
