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

[Playground で試す](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

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

### リアクティブな状態を受け取る {#accepting-reactive-state}

`useFetch()` は入力として静的な URL 文字列をとり、一度だけ取得してそれで完了です。URL が変更されるたびに再取得したい場合はどうでしょうか？　これを実現するためには、リアクティブな状態をコンポーザブル関数に渡し、渡された状態を使ってアクションを実行するウォッチャーをコンポーザブルに作らせる必要があります:

例えば、`useFetch()` は ref を受け取れるようにする必要があります:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// 再取得のトリガーになります
url.value = '/new-url'
```

もしくは、[getter 関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/get#%E8%A7%A3%E8%AA%AC)を受け取ります:

```js
// props.id が変更されたときに再取得する
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

[`watchEffect()`](/api/reactivity-core.html#watcheffect) と [`toValue()`](/api/reactivity-utilities.html#tovalue) API を使用して、既存の実装をリファクタリングできます:

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // 取得前に状態をリセット..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` は、3.3 で追加された API です。これは、ref や getter を値に正規化するためのものです。引数が ref であれば、ref の値を返し、引数が関数であれば、関数を呼び出してその戻り値を返します。それ以外の場合は、引数をそのまま返します。これは [`unref()`](/api/reactivity-utilities.html#unref) と同様に動作しますが、関数に対しては特別な扱いをします。

`toValue(url)` は `watchEffect` コールバックの **内部** で呼び出されていることに注意してください。これにより、`toValue()` の正規化中にアクセスされたすべてのリアクティブな依存関係が、ウォッチャーによって追跡されることが保証されます。

このバージョンの `useFetch()` は、静的な URL 文字列、ref、getter を受け取れるようになり、より柔軟になりました。watchEffect はすぐに実行され、`toValue(url)` の間にアクセスされた依存関係をすべて追跡することになります。依存関係が追跡されない場合（例えば、url が既に文字列である場合）、エフェクトは一度だけ実行されます。それ以外の場合は、追跡された依存関係が変化するたびに再実行されます。

これが [`useFetch()` の更新バージョン](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=)で、デモ用に人工的な遅延とランダムなエラーが発生します。

## 慣例とベストプラクティス {#conventions-and-best-practices}

### 命名 {#naming}

コンポーザブル関数には "use" で始まるキャメルケースの名前をつけるのが慣例です。

### 入力引数 {#input-arguments}

コンポーザブルはリアクティビティーに依存しない場合でも ref や getter の引数を受け取れます。もし他の開発者が使うかも知れないコンポーザブルを書くのなら、入力引数が生の値ではなく ref や getter である場合にも対応するとよいでしょう。[`toValue()`](/api/reactivity-utilities#tovalue) ユーティリティー関数はその用途に便利です:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // maybeRefOrGetter が ref か getter なら、
  // その正規化された値が返されます。
  // そうでなければ、そのまま返されます。
  const value = toValue(maybeRefOrGetter)
}
```

もしコンポーザブルの入力が ref や getter の場合にリアクティブエフェクトを起こすなら、`watch()` で明示的に ref / getter を監視するか、`watchEffect()` 内で `toValue()` を呼び出して適切に追跡できるようにしてください。

前に説明した [useFetch()の実装](#accepting-reactive-state)は、入力引数として ref、getter、プレーンな値を受け付けるコンポーザブルの具体例を示しています。

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

- [サーバーサイドレンダリング](/guide/scaling-up/ssr)（SSR）を利用したアプリケーションで作業している場合、DOM 固有の副作用は必ず `onMounted()` のようなマウント後のライフサイクルフック内で実行するようにしてください。これらのフックはブラウザーでしか呼び出されないので、そのコード内では DOM にアクセスできることが保証されます。

- `onUnmounted()` で副作用をクリーンアップすることを忘れないでください。例えば、コンポーザブルが DOM イベントリスナーを登録したなら、`useMouse()` の例で見てきたように `onUnmounted()` でそのリスナーを削除しないといけません。`useEventListener()` の例のように、自動的にそれをやってくれるコンポーザブルを使うのもよいでしょう。

### 使用上の制限 {#usage-restrictions}

コンポーザブルは `<script setup>` か `setup()` フックの中で呼び出さなければいけません。また、コンテキスト内で**同期的に**呼び出す必要があります。場合によっては `onMounted()` のようなライフサイクルフック内でも呼び出せます。

これらの制限は、Vue が現在のアクティブなコンポーネントインスタンスを特定できるコンテキストなので重要です。アクティブなコンポーネントインスタンスへのアクセスは次のために必要です:

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
