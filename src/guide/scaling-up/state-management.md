# 状態 (state) の管理

## 状態の管理とは何か ?

表向きには、全ての Vue コンポーネントインスタンスは、すでに自身のリアクティブな状態 (state) を "管理" しています。以下のシンプルなカウンターのコンポーネントを例にとってみましょう:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// state
const count = ref(0)

// actions
function increment() {
  count.value++
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // state
  data() {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>

この例は、以下のパーツで構成される自己完結型のユニットです:

- **state (状態)** は、アプリケーション駆動する信頼できる情報源 (the source of truth) です
- **view (ビュー)**　は、**state (状態)** の宣言的な写像 (declarative mapping) です
- **actions (アクション)**　は、**view (ビュー)** からのユーザー入力に反応して state を変更するための方法を提供します

これは、"単一方向のデータフロー" のコンセプトをシンプルに表現しています:

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

しかし、このシンプルさは **複数のコンポーネントが状態を共有すると** 崩壊を始めます:

1. 複数のビューが同じ状態の一部に依存する場合があります。
2. 異なるビューからのアクションが、同じ状態の一部を更新する場合があります。

1 の場合については、"lifting" (共有する状態を共通の祖先のコンポーネントに持ち上げること) および、持ち上げた状態をプロパティとして子に渡す回避策が取れるかもしれません。しかし、この方法は深い階層構造を持つ場合にはすぐに手間になり、[prop のバケツリレー (Prop Drilling)](/guide/components/provide-inject.html#prop-のバケツリレー（prop-drilling）) で知られる問題につながります。

2 の場合については、テンプレート参照によって直接の親 / 子インスタンスを探したり、発行されたイベントで複数の状態を更新したり、同期したりといった解決策に頼らざるを得ないことがしばしばあります。これらのパターンはいずれも脆弱で、すぐにコードのメンテナンス性の低下を導きます。

より単純でわかりやすい解決策は、コンポーネントから共有されている状態を抽出し、グローバルなシングルトンで管理することです。そうすることで、コンポーネントツリーが大きな "ビュー" になり、どのコンポーネントもツリーのどこにいても状態にアクセスしたりアクションを発行したりすることができるようになります！

## リアクティブ API によるシンプルな状態の管理

<div class="options-api">

オプション API では、リアクティブなデータは `data()` オプションによって宣言されます。内部的には、`data()` で返されたオブジェクトは、公開されている API として利用できる [`reactive()`](/api/reactivity-core.html#reactive) 関数によってリアクティブになります。

</div>

もし状態の一部を複数のインスタンスで共有する必要が有る場合、[`reactive()`](/api/reactivity-core.html#reactive) でリアクティブなオブジェクトを作成し、複数のコンポーネントからそれをインポートすることができます:

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

これで `store` オブジェクトが更新された場合に、`<ComponentA>` と `<ComponentB>` は自動的にビューを更新します - 私達は a single source of truth (信頼できる唯一の情報源) を手にしています。

しかし、これは `store` をインポートしているどんなコンポーネントでも好きなように `store` を変更できることを意味します:

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

シンプルなケースではこれは有効ですが、どんなコンポーネントでも任意に変更が可能なグローバルな状態は、長期的にはメンテナンスしづらくなるでしょう。状態を更新する処理を状態と同様に一箇所にまとめるために、アクションの意図を表現する名前を持つメソッドをストアに定義することが推奨されます:

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPENvbXBvbmVudEEgLz5cbiAgPENvbXBvbmVudEIgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBvbmVudEEudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCJzdG9yZS5pbmNyZW1lbnQoKVwiPlxuICAgICAgRnJvbSBBOiB7eyBzdG9yZS5jb3VudCB9fVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQ29tcG9uZW50Qi52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>
<div class="options-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wb25lbnRBIGZyb20gJy4vQ29tcG9uZW50QS52dWUnXG5pbXBvcnQgQ29tcG9uZW50QiBmcm9tICcuL0NvbXBvbmVudEIudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIENvbXBvbmVudEEsXG4gICAgQ29tcG9uZW50QlxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8Q29tcG9uZW50QSAvPlxuICA8Q29tcG9uZW50QiAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ29tcG9uZW50QS52dWUiOiI8c2NyaXB0PlxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuL3N0b3JlLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0b3JlXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIDxidXR0b24gQGNsaWNrPVwic3RvcmUuaW5jcmVtZW50KClcIj5cbiAgICAgIEZyb20gQToge3sgc3RvcmUuY291bnQgfX1cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIkNvbXBvbmVudEIudnVlIjoiPHNjcmlwdD5cbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZS5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdG9yZVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIEBjbGljaz1cInN0b3JlLmluY3JlbWVudCgpXCI+XG4gICAgICBGcm9tIEI6IHt7IHN0b3JlLmNvdW50IH19XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJzdG9yZS5qcyI6ImltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgY29uc3Qgc3RvcmUgPSByZWFjdGl2ZSh7XG4gIGNvdW50OiAwLFxuICBpbmNyZW1lbnQoKSB7XG4gICAgdGhpcy5jb3VudCsrXG4gIH1cbn0pIn0=)

</div>

:::tip
クリックハンドラーは `store.increment()` をカッコ付きで使用していることに注意してください - これはコンポーネントメソッドではないので、適切な `this` コンテキストでメソッドを呼び出すために必要です。
:::

ここでは 1 つのリアクティブオブジェクトを store として使っていますが、`ref()` や `computed()` のような他の [Reactivity APIs](/api/reactivity-core.html) で作られたリアクティブな状態を共有することができますし、[コンポーザブル](/guide/reusability/composables.html) からグローバルな状態を返すこともできます:

```js
import { ref } from 'vue'

// モジュールスコープで生成されたグローバルな状態
const globalCount = ref(1)

export function useCount() {
  // コンポーネント毎に生成されたローカルな状態
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Vue のリアクティビティシステムは、コンポーネントモデルから切り離されているため、非常に柔軟性があります。

## SSR の考慮

[サーバーサイドレンダリング (SSR)](./ssr) を使用したアプリケーションを構築している場合、上記のパターンでは複数のリクエストで共有されるシングルトンであるストアに起因する問題が発生する可能性があります。これについては SSR ガイドの [詳細](./ssr#クロスリクエスト状態汚染) で説明されています。

## Pinia

シンプルなシナリオであれば、自前の状態管理ソリューションで十分ですが、大規模なプロダクションアプリケーションでは、もっと多くのことを考慮しなければなりません:

- チームコラボレーションのための強い規約
- タイムライン、コンポーネントインスペクション、タイムとトラベルデバッグなどの Vue DevTools との統合
- Hot Module Replacement
- サーバサイドレンダリングのサポート

[Pinia](https://pinia.vuejs.org) は、上記のすべてを実装した状態管理ライブラリーです。Vue のコアチームによってメンテナンスされており、Vue 2 と Vue 3 の両方で動作します。

既存のユーザーは、Vue の以前の公式の状態管理ライブラリーである [Vuex](https://vuex.vuejs.org/) に馴染みがあるかもしれません。Pinia がエコシステムで同じ役割を果たすようになり、Vuex は現在メンテナンスモードになっています。Vuex はまだ動きますが、新しい機能は提供されません。新しいアプリケーションには Pinia を使用することをお勧めします。

Pinia は、Vuex の次のイテレーションがどのようなものかを探るために始まり、Vuex 5 のコアチームの議論から多くのアイデアを取り込みました。最終的に、Pinia が Vuex 5 で私たちが望んでいたことのほとんどをすでに実装していることに気づき、代わりにこれを新しい推奨とすることにしました。

Vuex と比較して、Pinia はシンプルな API および、Composition API スタイルの API を提供しますし、最も重要な点として TypeScript と併用した場合の型推論のサポートがしっかりとしています。
