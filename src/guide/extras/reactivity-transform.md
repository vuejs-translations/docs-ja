# Reactivity Transform {#reactivity-transform}

:::danger 非推奨の実験的な機能
Reactivity Transform は実験的な機能でしたが、非推奨となりました。[理由についてはこちら](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)をお読みください。

最終的には、将来のマイナーリリースで Vue のコアから削除される予定です。まだ使用したい場合は、[Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) というプラグインで利用できるようになりました。
:::

:::tip Composition API 固有
Reactivity Transform は Composition API 固有の機能で、ビルド処理が必要です。
:::

## ref とリアクティブな変数との比較 {#refs-vs-reactive-variables}

Composition API が導入されてから、ref と reactive オブジェクトの使い分けは主要な未解決問題のひとつです。リアクティブなオブジェクトを分割代入するとリアクティビティーが失われやすく、一方、ref を使用する場合は `.value` をあらゆる場所で使用するのは面倒なことです。また、型システムを使用していない場合、`.value` を見落としがちです。

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) はコンパイル時に変換して、以下のようなコードを書けるようにします:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

ここでの `$ref()` メソッドは **コンパイルタイムマクロ** です。実行時に呼び出される実際のメソッドではなく、Vue のコンパイラーは、結果の `count` 変数を **リアクティブな変数** として扱うためのヒントとして使用します。

リアクティブな変数は通常の変数と同じようにアクセスしたり再代入できますが、これらの操作は `.value` つきの ref にコンパイルされます。例えば、上記コンポーネントの `<script>` 部分は以下のようにコンパイルされます:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

ref を返す各リアクティビティー API に `$` で始まるマクロに相当するものがあります。これらの API には次のものが含まれます:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

これらのマクロは Reactivity Transform が有効であればグローバルに利用可能でインポート不要ですが、より明示的にしたい場合は任意で `vue/macros` からインポートできます:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## `$()` を使った分割代入 {#destructuring-with}

composition 関数からは ref のオブジェクトを返し、その ref を取得するために分割代入を使うのが一般的です。この目的のために Reactivity Transform は **`$()`** マクロを提供します:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

コンパイル済みの出力:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

`x` がすでに ref の場合、`toRef(__temp, 'x')` は単に `x` をそのまま返し、追加の ref は作られないことに注意してください。分割代入された値が ref でない場合（例: 関数など）であっても動作します。その値は ref でラップされ、残りのコードは期待するように動作します。

`$()` での分割代入は、リアクティブなオブジェクトと ref を含むプレーンオブジェクトの **両方で** 動作します。

## `$()` を使って既存の ref をリアクティブな変数に変換 {#convert-existing-refs-to-reactive-variables-with}

ref を返すラップされた関数を扱う場合があります。しかし、Vue コンパイラーは関数が ref を返すことを事前に知ることができません。こういう場合は `$()` マクロを使って、既存の ref をリアクティブな変数に変換することもできます:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## リアクティブなプロパティの分割代入 {#reactive-props-destructure}

現在、`<script setup>` での `defineProps()` の使用には 2 つの難点があります:

1. `.value` と同様、リアクティビティーを維持するために常に `props.x` でプロパティにアクセスする必要があります。分割代入された変数はリアクティブではなく更新されないため、`defineProps` は分割代入できないのです。

2. [型のみのプロパティ宣言](/api/sfc-script-setup#typescript-only-features)を使う場合、プロパティのデフォルト値を宣言するための簡単な方法はありません。この目的のために `withDefaults()` を導入しましたが、まだ使い勝手が悪いです。

これまで見てきた `$()` の事例と同様に、`defineProps` が分割代入された場合にはコンパイル時の変換を適用することで、この問題を処理できます:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // デフォルト値は正しく機能します
    count = 1,
    // ローカルエイリアスも同様に正しく動作します
    // ここでは `props.foo` を `bar` にエイリアスしています
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // プロパティが変更されるたびにログに出力されます
    console.log(msg, count, bar)
  })
</script>
```

上記は、以下のような実行時宣言に相当するものにコンパイルされます:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## 関数の境界を超えてリアクティビティーを維持する {#retaining-reactivity-across-function-boundaries}

リアクティブな変数は、すべての箇所で `.value` を使う必要性から解放してくれますが、関数の境界を超えてリアクティブな変数を渡したときに「リアクティビティーの喪失」問題を起こします。これは 2 つのケースで起こります:

### 引数として関数に渡した時 {#passing-into-function-as-argument}

引数として ref を期待する関数があるとして、例えば:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // 動作しない！
```

上記は、以下のようにコンパイルされるので期待通りに動作しません:

```ts
let count = ref(0)
trackChange(count.value)
```

ここで `trackChange` は実際の ref を期待しているのに、`count.value` は number として渡されます。これは、渡す前に `count` を `$$()` でラップすることで解決できます:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

上記のコンパイル結果:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

ご覧のとおり、`$$()` は **エスケープのヒント** を提供するマクロで、`$$()` の中のリアクティブな変数は `.value` が付加されません。

### 関数スコープ内で return する時 {#returning-inside-function-scope}

return される式の中で直接リアクティブな変数を使用した場合も、リアクティビティーは失われます:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // mousemove を購読...

  // 動作しない！
  return {
    x,
    y
  }
}
```

上記 return 文のコンパイル結果:

```ts
return {
  x: x.value,
  y: y.value
}
```

リアクティビティーを維持するために、return する時点での値を返すのではなく実際の ref を返す必要があります。

ここでも解決のために `$$()` が使えます。このケースでは `$$()` は返されるオブジェクトに直接使用でき、`$$()` の呼び出しの中のリアクティブな変数への参照は、その基となる ref への参照が維持されます:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // mousemove を購読...

  // 解決
  return $$({
    x,
    y
  })
}
```

### 分割代入されたプロパティに `$$()` を使う {#using-on-destructured-props}

分割代入されたプロパティもリアクティブな変数なので `$$()` が動作します。コンパイラーは効率のため `toRef` に変換します:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

コンパイル結果:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## TypeScript 統合 <sup class="vt-badge ts" /> {#typescript-integration}

Vue はこれらのマクロの（グローバルに使える）型付けを提供しており、すべての型は期待通りに動作します。標準的な TypeScript のセマンティクスと完全に互換があるので、その構文はすべての既存のツールで動作します。

Vue の SFC 内だけでなく、有効な JS / TS を書くことのできるファイルであれば、これらのマクロが動作することを意味します。

マクロはグローバルに利用可能なので、それらの型を明示的に参照する必要があります（例: `env.d.ts` ファイル内）:

```ts
/// <reference types="vue/macros-global" />
```

マクロを `vue/macros` から明示的にインポートする場合、型をグローバルに宣言しなくても動作します。

## 明示的なオプトイン {#explicit-opt-in}

:::warning
下記は、Vue バージョン 3.3 以下のみに適用されます。コアのサポートは 3.4 以降では削除されます。引き続き transform を使用する場合は、代わりに [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) に移行してください。
:::

### Vite {#vite}

- `@vitejs/plugin-vue@>=2.0.0` が必要
- SFC と js(x)/ts(x) ファイルに適用されます。変換を適用する前に、ファイルの高速使用チェックが行われるので、マクロを使用していないファイルに対するパフォーマンスコストは発生しないはずです。
- `reactivityTransform` は SFC 以外にも作用するため、`script.refSugar` のようにネストされているのではなくプラグインのルートレベルのオプションになったことに注意してください。

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- 現在は SFC のみ
- `vue-loader@>=17.0.0` が必要

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### 素の `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- 現在は SFC のみ
- `vue-loader@>=17.0.0` が必要

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
