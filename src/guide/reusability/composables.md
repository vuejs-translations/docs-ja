# コンポーザブル {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
このセクションは Composition API の基本的な知識があることを前提としています。もし Vue を Options API のみで学んできた場合は、（左サイドバーの上部にあるトグルを使って）API 選択を Composition API に設定し、[リアクティビティーの基礎](/guide/essentials/reactivity-fundamentals)と[ライフサイクルフック](/guide/essentials/lifecycle)の章を読み直すとよいでしょう。
:::

## 「コンポーザブル」とは？ {#what-is-a-composable}

Vue アプリケーションの文脈で「コンポーザブル（composable）」とは、Vue の Composition API を活用して**状態を持つロジック**をカプセル化して再利用するための関数です。

フロントエンドアプリケーションを構築するとき、共通のタスクのためにロジックを再利用しないといけないことがよくあります。例えば、多くの箇所で日付をフォーマットする必要があるので、そのための再利用可能な関数を抽出します。このフォーマッターは**状態のないロジック**をカプセル化し、ある入力を受け取ったら即座に期待される出力を返します。状態のないロジックを再利用するためのライブラリーはたくさんあります。例えば [lodash](https://lodash.com/) や [date-fns](https://date-fns.org/) などは聞いたことがあるかも知れません。

対照的に、状態のあるロジックは時間とともに変化する状態の管理が伴います。ページ上のマウスの現在位置をトラッキングするようなものがシンプルな例といえます。実際のシナリオでは、タッチジェスチャーやデータベースへの接続状態など、より複雑なロジックになる場合もあります。

## マウストラッカーの例 {#mouse-tracker-example}

コンポーネント内で直接 Composition API を使ってマウストラッキング機能を実装すると、次のようになります:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

しかし、複数のコンポーネントで同じロジックを再利用したい場合はどうでしょうか？　コンポーザブル関数として外部ファイルにロジックを抽出できます:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 慣習として、コンポーザブル関数の名前は "use" で始めます
export function useMouse() {
  // コンポーザブルによってカプセル化および管理される状態
  const x = ref(0)
  const y = ref(0)

  // コンポーザブルは管理している状態を時間の経過とともに更新できます。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // コンポーザブルは所有コンポーネントのライフライクルにフックして
  // 副作用のセットアップや破棄することもできます。
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 管理された状態を戻り値として公開
  return { x, y }
}
```

そしてこれがコンポーネント内での使い方です:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1vdXNlIH0gZnJvbSAnLi9tb3VzZS5qcydcblxuY29uc3QgeyB4LCB5IH0gPSB1c2VNb3VzZSgpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICBNb3VzZSBwb3NpdGlvbiBpcyBhdDoge3sgeCB9fSwge3sgeSB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwibW91c2UuanMiOiJpbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNb3VzZSgpIHtcbiAgY29uc3QgeCA9IHJlZigwKVxuICBjb25zdCB5ID0gcmVmKDApXG5cbiAgZnVuY3Rpb24gdXBkYXRlKGV2ZW50KSB7XG4gICAgeC52YWx1ZSA9IGV2ZW50LnBhZ2VYXG4gICAgeS52YWx1ZSA9IGV2ZW50LnBhZ2VZXG4gIH1cblxuICBvbk1vdW50ZWQoKCkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHVwZGF0ZSkpXG4gIG9uVW5tb3VudGVkKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB1cGRhdGUpKVxuXG4gIHJldHVybiB7IHgsIHkgfVxufSJ9)

ご覧の通りコアロジックは同一で、外部の関数に移動して公開する状態を返しただけです。コンポーネント内と同じように、コンポーザブルでも [Composition API の関数](/api/#composition-api)をすべて使うことができます。これで同じ `useMouse()` 機能はどのコンポーネントでも使えるようになりました。

コンポーザブルのさらにすごいところは、ネストできることです。あるコンポーザブル関数は 1 つ以上の他のコンポーザブル関数を呼ぶことができます。これにより、コンポーネントを使用してアプリケーション全体を構成するのと同じように、小さくて独立したユニットを使用して複雑なロジックを構成できるようになります。実際、このパターンを可能にする API の集合を Composition（構成）API と呼ぶことにしたのはこのためなのです。

例えば、DOM イベントリスナーを追加・削除するロジックを独自のコンポーザブルに抽出できます:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 必要であれば、 セレクター文字列を target として
  // 扱えるようにもできます
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

これで `useMouse()` コンポーザブルは次のように簡略化できます:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
`useMouse()` を呼び出すコンポーネントの各インスタンスは、`x` と `y` の状態のコピーを独自に作成するので、互いに干渉することはありません。もしコンポーネント間で共有する状態を管理したい場合は、[状態管理](/guide/scaling-up/state-management)の章を読んでください。
:::

## 非同期の状態の例 {#async-state-example}

`useMouse()` コンポーザブルは引数をとりませんでしたので、引数を使用する別の例を見てみましょう。非同期データ取得の際には、ローディング、成功、エラーといった異なる状態を扱う必要があります:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

データを取得する必要があるすべてのコンポーネントでこのパターンを繰り返さなければならないのは面倒です。コンポーザブルに抽出してみましょう:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

そうすると、コンポーネントの中はこうするだけです:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

`useFetch()` は入力として静的な URL 文字列をとり、一度だけ取得してそれで完了です。URL が変更されるたびに再取得したい場合はどうでしょうか？　引数に ref も受け付けるようにすれば実現できます:

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 取得前に状態をリセット..
    data.value = null
    error.value = null
    // unref() は潜在的な ref をアンラップします
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // 入力された URL が ref の場合、リアクティブな再取得をセットアップ
    watchEffect(doFetch)
  } else {
    // それ以外の場合は、ただ一度だけ取得し
    // ウォッチャーのオーバーヘッドを避ける
    doFetch()
  }

  return { data, error }
}
```

このバージョンの `useFetch()` は静的な URL 文字列と、URL 文字列の ref のどちらも受け付けるようになりました。[`isRef()`](/api/reactivity-utilities#isref) を使って URL が動的な ref だと判別した場合、[`watchEffect()`](/api/reactivity-core.html#watcheffect) を使ってリアクティブな副作用をセットアップします。この副作用は即時に実行され、URL の ref を依存関係として追跡します。URL の ref が変更されるたび、データをリセットし再度取得します。

これが [`useFetch()` の更新バージョン](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJ1c2VGZXRjaC5qcyI6ImltcG9ydCB7IHJlZiwgaXNSZWYsIHVucmVmLCB3YXRjaEVmZmVjdCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZldGNoKHVybCkge1xuICBjb25zdCBkYXRhID0gcmVmKG51bGwpXG4gIGNvbnN0IGVycm9yID0gcmVmKG51bGwpXG5cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaCgpIHtcbiAgICAvLyByZXNldCBzdGF0ZSBiZWZvcmUgZmV0Y2hpbmcuLlxuICAgIGRhdGEudmFsdWUgPSBudWxsXG4gICAgZXJyb3IudmFsdWUgPSBudWxsXG4gICAgXG4gICAgLy8gcmVzb2x2ZSB0aGUgdXJsIHZhbHVlIHN5bmNocm9ub3VzbHkgc28gaXQncyB0cmFja2VkIGFzIGFcbiAgICAvLyBkZXBlbmRlbmN5IGJ5IHdhdGNoRWZmZWN0KClcbiAgICBjb25zdCB1cmxWYWx1ZSA9IHVucmVmKHVybClcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gYXJ0aWZpY2lhbCBkZWxheSAvIHJhbmRvbSBlcnJvclxuICBcdCAgYXdhaXQgdGltZW91dCgpXG4gIFx0ICAvLyB1bnJlZigpIHdpbGwgcmV0dXJuIHRoZSByZWYgdmFsdWUgaWYgaXQncyBhIHJlZlxuXHQgICAgLy8gb3RoZXJ3aXNlIHRoZSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGFzLWlzXG4gICAgXHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmxWYWx1ZSlcblx0ICAgIGRhdGEudmFsdWUgPSBhd2FpdCByZXMuanNvbigpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IudmFsdWUgPSBlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzUmVmKHVybCkpIHtcbiAgICAvLyBzZXR1cCByZWFjdGl2ZSByZS1mZXRjaCBpZiBpbnB1dCBVUkwgaXMgYSByZWZcbiAgICB3YXRjaEVmZmVjdChkb0ZldGNoKVxuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSwganVzdCBmZXRjaCBvbmNlXG4gICAgZG9GZXRjaCgpXG4gIH1cblxuICByZXR1cm4geyBkYXRhLCBlcnJvciwgcmV0cnk6IGRvRmV0Y2ggfVxufVxuXG4vLyBhcnRpZmljaWFsIGRlbGF5XG5mdW5jdGlvbiB0aW1lb3V0KCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdSYW5kb20gRXJyb3InKSlcbiAgICAgIH1cbiAgICB9LCAzMDApXG4gIH0pXG59In0=)で、デモ用に人工的な遅延とランダムなエラーが発生します。

## 慣例とベストプラクティス {#conventions-and-best-practices}

### 命名 {#naming}

コンポーザブル関数には "use" で始まるキャメルケースの名前をつけるのが慣例です。

### 入力引数 {#input-arguments}

コンポーザブルはリアクティビティーに依存しない場合でも ref の引数を受け取れます。もし他の開発者が使うかも知れないコンポーザブルを書くのなら、入力引数が生の値ではなく ref である場合にも対応するとよいでしょう。[`unref()`](/api/reactivity-utilities#unref) ユーティリティー関数はその用途に便利です:

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // maybeRef が実際に ref なら、その .value が返されます
  // そうでなければ、maybeRef がそのまま返されます
  const value = unref(maybeRef)
}
```

もしコンポーザブルの入力が ref の場合にリアクティブな副作用を起こすなら、`watch()` で明示的に ref を監視するか、`watchEffect()` 内で `unref()` を呼び出して適切に追跡できるようにしてください。

### 戻り値 {#return-values}

ここまで、コンポーザブル内で `reactive()` ではなく `ref()` だけを使っていることに気づいたでしょうか。コンポーザブルは常に複数の ref を含むプレーンでリアクティブでないオブジェクトを返すのが推奨される慣例です。これによりコンポーネントでリアクティビティーを保ったまま分割代入できます:

```js
// x と y は ref
const { x, y } = useMouse()
```

コンポーザブルから reactive のオブジェクトを返してしまうと、このような分割代入をしたときにコンポーザブル内部の状態とのリアクティブな結合が失われますが、ref であれば結合は保たれます。

コンポーザブルから返された状態をオブジェクトのプロパティとして扱いたい場合は、戻り値のオブジェクトを `reactive()` で包むことで ref をアンラップできます。例えば:

```js
const mouse = reactive(useMouse())
// mouse.x は元の ref とリンクされる
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### 副作用 {#side-effects}

コンポーザブルで副作用（例: DOM イベントリスナーの登録やデータの取得）を起こすことは問題ありませんが、次のルールに注意してください:

- [サーバーサイドレンダリング](/guide/scaling-up/ssr) (SSR) を利用したアプリケーションで作業している場合、DOM 固有の副作用は必ず `onMounted()` のようなマウント後のライフサイクルフック内で実行するようにしてください。これらのフックはブラウザーでしか呼び出されないので、そのコード内では DOM にアクセスできることが保証されます。

- `onUnmounted()` で副作用をクリーンアップすることを忘れないでください。例えば、コンポーザブルが DOM イベントリスナーを登録したなら、`useMouse()` の例で見てきたように `onUnmounted()` でそのリスナーを削除しないといけません。`useEventListener()` の例のように、自動的にそれをやってくれるコンポーザブルを使うのもよいでしょう。

### 使用上の制限 {#usage-restrictions}

コンポーザブルは `<script setup>` か `setup()` フックの中で **同期的に** 呼び出さなければいけません。場合によっては `onMounted()` のようなライフサイクルフックでも呼び出せます。

これらは、Vue が現在のアクティブなコンポーネントインスタンスを特定できるコンテキストです。アクティブなコンポーネントインスタンスへのアクセスは次のために必要です:

1. ライフサイクルフックを登録できる。

2. 算出プロパティやウォッチャーをリンクできるため、コンポーネントのアンマウント時に破棄してメモリーリークを防げます。

:::tip
`await`　を使用した **後に** コンポーザブルを呼び出せるのは `<script setup>` だけです。コンパイラーは非同期操作の後、アクティブインスタンスのコンテキストを自動的に復元してくれます。
:::

## コード整理のためのコンポーザブル抽出 {#extracting-composables-for-code-organization}

コンポーザブルは再利用だけでなくコード整理のために抽出することもできます。コンポーネントの複雑さが増していくと、取り扱ったり理解するには大きすぎるコンポーネントになってしまう可能性があります。コンポーネントのコードを論理的な関心に基づいて、より小さな関数に整理するための完全な柔軟性を Composition API は提供します:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

ある程度、これらの抽出されたコンポーザブルは、互いにやり取り可能なコンポーネントスコープのサービスであると考えることができます。

## Options API でコンポーザブルを使う {#using-composables-in-options-api}

もし Options API を使っている場合、コンポーザブルは `setup()` の中で呼び出す必要があり、その戻り値を `setup()` から返して `this` やテンプレートに公開する必要があります:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() で公開したプロパティは `this` でアクセスできる
    console.log(this.x)
  }
  // ...他のオプション
}
```

## 他の手法との比較 {#comparisons-with-other-techniques}

### vs. ミックスイン {#vs-mixins}

Vue 2 からのユーザーは、[mixins](/api/options-composition#mixins) オプションに慣れ親しんでいるかも知れません。これもコンポーネントのロジックを再利用可能なユニットに抽出することができます。ミックスインには 3 つの主要な欠点があります:

1. **プロパティの発生元が不明確**: 多くのミックスインを使うと、インスタンスのプロパティがどのミックスインから注入されたのが不明確になり、実装を追ったりコンポーネントの動作を理解するのが難しくなります。このことはコンポーザブルに ref + 分割代入のパターンをおすすめする理由でもあり、利用するコンポーネント内でプロパティの発生元が明確になります。

2. **ネームスペースの衝突**: 異なる作成者による複数のミックスインは、同じプロパティキーを登録する可能性を含んでおり、ネームスペースの衝突を引き起こします。コンポーザブルを使えば、異なるコンポーザブルで競合するキーがあった場合でも、分割代入の変数をリネームできます。

3. **暗黙的なミックスイン間でのやり取り**: 相互作用が必要な複数のミックスインは共有のプロパティキーに依存しなければならず、暗黙的に結合されてしまいます。コンポーザブルを使えば通常の関数と同じように、あるコンポーザブルの戻り値を別のコンポーザブルの引数として渡せます。

以上の理由から、Vue 3 ではミックスインを使うことをおすすめしません。この機能はマイグレーションのためと馴染みであるという理由だけで残されています。

### vs. レンダーレスコンポーネント {#vs-renderless-components}

コンポーネントスロットの章で、スコープ付きスロットに基づく[レンダーレスコンポーネント](/guide/components/slots#renderless-components)パターンについて検討しました。またレンダーレスコンポーネントを使って、同じマウストラッキングのデモを実装しました。

レンダーレスコンポーネントに対するコンポーザブルの利点は、余分なコンポーネントインスタンスのオーバーヘッドがないことです。アプリケーション全体に渡って使われる場合、レンダーレスコンポーネントのパターンで余計に作られるコンポーネントインスタンスの量は、顕著なパフォーマンスのオーバーヘッドになりえます。

純粋なロジックを再利用する場合はコンポーザブルを使い、ロジックとビジュアルレイアウトの両方を再利用する場合にコンポーネントを使うのがおすすめです。

### vs. React Hooks {#vs-react-hooks}

もし React の経験があるなら、React のカスタムフックによく似ていると気づくかも知れません。Composition API は React Hooks にインスパイアされた部分があり、Vue のコンポーザブルは、ロジックの合成機能という点では React Hooks と似ています。しかし、Vue のコンポーザブルは、React Hooks の実行モデルとは根本的に異なる Vue のきめ細やかなリアクティビティーシステムに基づいています。詳細は [Composition API の FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks) で説明しています。

## 参考文献 {#further-reading}

- [リアクティビティーの探求](/guide/extras/reactivity-in-depth): Vue のリアクティビティーシステムがどのように動作をするのかを、より具体的に理解する。
- [状態管理](/guide/scaling-up/state-management): 複数コンポーネントで共有する状態を管理するためのパターン。
- [コンポーザブルのテスト](/guide/scaling-up/testing#testing-composables): コンポーザブルをユニットテストするためのコツ。
- [VueUse](https://vueuse.org/): 発展し続ける Vue コンポーザブル集。このソースコードも素晴らしい学習資料です。
