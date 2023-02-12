# 状態管理 {#state-management}

## 状態の管理とは何か ? {#what-is-state-management}

表向きには、全ての Vue コンポーネントインスタンスは、すでに自身のリアクティブな状態 (state) を "管理" しています。以下のシンプルなカウンターのコンポーネントを例にとってみましょう:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// 状態
const count = ref(0)

// アクション
function increment() {
  count.value++
}
</script>

<!-- ビュー -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // 状態
  data() {
    return {
      count: 0
    }
  },
  // アクション
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- ビュー -->
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

1 の場合については、"lifting" (共有する状態を共通の祖先のコンポーネントに持ち上げること) および、持ち上げた状態をプロパティとして子に渡す回避策が取れるかもしれません。しかし、この方法は深い階層構造を持つ場合にはすぐに手間になり、[prop のバケツリレー (Prop Drilling)](/guide/components/provide-inject.html#prop-drilling) で知られる問題につながります。

2 の場合については、テンプレート参照によって直接の親 / 子インスタンスを探したり、発行されたイベントで複数の状態を更新したり、同期したりといった解決策に頼らざるを得ないことがしばしばあります。これらのパターンはいずれも脆弱で、すぐにコードのメンテナンス性の低下を導きます。

より単純でわかりやすい解決策は、コンポーネントから共有されている状態を抽出し、グローバルなシングルトンで管理することです。そうすることで、コンポーネントツリーが大きな "ビュー" になり、どのコンポーネントもツリーのどこにいても状態にアクセスしたりアクションを発行したりすることができるようになります！

## リアクティビティー API によるシンプルな状態の管理 {#simple-state-management-with-reactivity-api}

<div class="options-api">

Options API では、リアクティブなデータは `data()` オプションによって宣言されます。内部的には、`data()` で返されたオブジェクトは、公開されている API として利用できる [`reactive()`](/api/reactivity-core.html#reactive) 関数によってリアクティブになります。

</div>

もし状態の一部を複数のインスタンスで共有する必要が有る場合、[`reactive()`](/api/reactivity-core.html#reactive) でリアクティブなオブジェクトを作成し、それを複数のコンポーネントにインポートすることができます:

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

これで `store` オブジェクトが更新された場合に、`<ComponentA>` と `<ComponentB>` は自動的にビューを更新します - 私達は信頼できる唯一の情報源（a single source of truth）を手にしています。

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
    store.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eNrNUktuwjAQvYrlDSAg7joKVUmlnsIbMENrij+ynbQSyt07tkP4RG0X3XQVz+T5fcZzomtri7YBWtLKCydtIB5CYx+5lsoaF8izwa8GHdZk74wik4JdWvHqZAytx9C6h1Ysy6AAFgGUPW4CYEVIdSXF7jp16lRsuEAXNKsu1cYWB280RjjFS7z/4TktSerEHqrHmtO3EKwvGfN7ES0dfGHcK8NT4RodpIICvFpunfnw4JCY08UVB8NmC27pQO/AgfuJ8w464o20HdcdRrmd6PePcSI+GAekGwacaqT7ZbQ72aYDHrdNCEaTJ3GU4n3FaWaQWjhQ6IDTHkjIS9RY4xB72UIYHBHp0HRiYpkqK7AscftEt8//r3LVf8l1doeJhgQONiLI9hIiLzzX8JkQwmiPwVPO1YCepg1NBkrykFZtsDydnff3yuZ8ft6bGe2+ABpRS4Q=)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eNrdU91qgzAUfpVDbtbS1uxa7Fgd7ClyY+PpZlcTSaIbFN99x0TTX8ZgdwPBnOPxy/eTHNmmaZKuRZayzEpTNe5JqKputHHwoumtULkN7Iyu4SHhp9bw08PtaH47mo+jAELhlx8vcVe0BwfHoSunQZuGBpztvLxq5EPdC0VPxiNhKhzWzaFwSBVAdkadX3Vy38l4/IEtWVCxqosm2VutyAxPRIwfrGCRmmCkZqgFe3eusSnndicHiXubaPPGaZWYVrmqxgRtvdoa/WnRELBgoxqPwanZoVkZVCUaND9hXo3e4E6mkJTLhO7FegTrtEHoY1S+JiAK6X5EZeGK2XyywKBrjZoqCHChIBK/iaesOr+g5bZ1Tit4lodKfqwFC1wqJQ3WpEKwcRDgdWC7oSBGAYnUZDP0fk9C4gEq7MDDFpcxXx7Jf+dN/hdvJp3kSvTCYCFd1Z3sCBc5+iC1sm50bB2nZ+OtJgIpPPojHymfjDqjuVhMzsxZ/w00F5Cx)

</div>

ここでは 1 つのリアクティブオブジェクトを store として使っていますが、`ref()` や `computed()` のような他の [リアクティビティー API](/api/reactivity-core.html) で作られたリアクティブな状態を共有することができますし、[コンポーザブル](/guide/reusability/composables.html) からグローバルな状態を返すこともできます:

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

Vue のリアクティビティーシステムは、コンポーネントモデルから切り離されているため、非常に柔軟性があります。

## SSR の考慮 {#ssr-considerations}

[サーバーサイドレンダリング (SSR)](./ssr) を使用したアプリケーションを構築している場合、上記のパターンでは複数のリクエストで共有されるシングルトンであるストアに起因する問題が発生する可能性があります。これについては SSR ガイドの [詳細](./ssr#cross-request-state-pollution) で説明されています。

## Pinia {#pinia}

シンプルなシナリオであれば、自前の状態管理ソリューションで十分ですが、大規模なプロダクションアプリケーションでは、もっと多くのことを考慮しなければなりません:

- チームコラボレーションのための強い規約
- タイムライン、コンポーネントインスペクション、タイムトラベルデバッグなどの Vue DevTools との統合
- Hot Module Replacement
- サーバーサイドレンダリングのサポート

[Pinia](https://pinia.vuejs.org) は、上記のすべてを実装した状態管理ライブラリーです。Vue のコアチームによってメンテナンスされており、Vue 2 と Vue 3 の両方で動作します。

既存のユーザーは、Vue の以前の公式の状態管理ライブラリーである [Vuex](https://vuex.vuejs.org/) に馴染みがあるかもしれません。Pinia がエコシステムで同じ役割を果たすようになり、Vuex は現在メンテナンスモードになっています。Vuex はまだ動きますが、新しい機能は提供されません。新しいアプリケーションには Pinia を使用することをお勧めします。

Pinia は、Vuex の次のイテレーションがどのようなものかを探るために始まり、Vuex 5 のコアチームの議論から多くのアイデアを取り込みました。最終的に、Pinia が Vuex 5 で私たちが望んでいたことのほとんどをすでに実装していることに気づき、代わりにこれを新しい推奨とすることにしました。

Vuex と比較して、Pinia はシンプルな API および、Composition API スタイルの API を提供しますし、最も重要な点として TypeScript と併用した場合の型推論のサポートがしっかりとしています。
