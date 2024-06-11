---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# リアクティビティーの探求 {#reactivity-in-depth}

Vue の最も特徴的な機能の 1 つは、控えめなリアクティビティーシステムです。コンポーネントの状態はリアクティブな JavaScript オブジェクトで構成されています。状態を変更すると、ビュー（View）が更新されます。状態管理はシンプルで直感的ですが、よくある落とし穴を避けるために、仕組みを理解することも重要です。このセクションでは Vue のリアクティビティーシステムのより低レベルの詳細について、いくつか掘り下げていきます。

## リアクティビティーとは？ {#what-is-reactivity}

最近この用語がプログラミングでよく出てくるようになりましたが、人々がそれについて話すとき、何を意味しているのでしょうか？リアクティビティーとは、宣言的な方法で変化に対応できるようにするプログラミングパラダイムです。よく挙げられる典型的な例として Excel のスプレッドシートが挙げられます:

<SpreadSheet />

ここでセル A2 は `= A0 + A1` という数式で定義されているので（A2 をクリックして数式を表示または編集できます）、スプレッドシートには 3 が表示されます。これは驚くことではありません。ですが A0 や A1 を更新すると、A2 も自動的に更新されることに気がつくでしょう。

JavaScript は通常このようには動作しません。JavaScript で同等のものを書こうとすると:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // 3 のまま
```

`A0` を変更しても、`A2` は自動的に変化しません。

では、JavaScript でこれを行うにはどうしたらよいでしょうか？まず、`A2` を更新するコードを再実行するために、それを関数でラップしてみましょう:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

次に、いくつかの用語を定義する必要があります:

- `update()` 関数はプログラムの状態を変更するため、**副作用（side effect、略してエフェクト）** を発生させます。

- `A0` と `A1` はエフェクトの**依存関係**と見なされ、それらの値はエフェクトを実行するために使用されます。エフェクトは依存関係との関係において **購読者（subscriber）** と言われます。

必要なのは `A0` や `A1`（**依存関係**）が変わるたびに `update()`（**エフェクト**）を呼び出せるマジックメソッドです:

```js
whenDepsChange(update)
```

この `whenDepsChange()` 関数には、以下のようなタスクがあります:

1. 変数が読み込まれたときの追跡。例えば `A0 + A1` という式を評価するときに、`A0` と `A1` の両方が読み込まれます。

2. 実行中のエフェクトがあるときに変数が読み込まれた場合、その変数の購読者にエフェクトを実行します。例: `update()` が実行されているときに `A0` と `A1` が読み込まれるので、最初の呼び出し以降は `update()` が `A0` と `A1` の両方の購読者になります。

3. 変数が変更されたときの検知。例:`A0` に新しい値が代入されたとき、再実行のため購読者であるエフェクトすべてに通知します。

## Vue におけるリアクティビティーの仕組み {#how-reactivity-works-in-vue}

私たちは、この例のようなローカル変数の読み書きを実際に追跡することはできません。バニラ（素の）JavaScript にはそのような仕組みがないのです。**できる**のは、**オブジェクトのプロパティ**の読み書きを傍受（インターセプト）することです。

JavaScript でプロパティにアクセスを傍受する方法は 2 つあります: [getter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/get#%E8%A7%A3%E8%AA%AC) / [setter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/set#%E8%A7%A3%E8%AA%AC)、そして [Proxy](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) です。Vue 2 では、ブラウザのサポートの制限により、getter / setter のみを使用していました。Vue 3 では、Proxy はリアクティブオブジェクトに、getter / setters は ref に使用されています。以下は、動作を説明する疑似コードです:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
ここと以下のコードスニペットは、核となるコンセプトをできるだけシンプルに説明することを目的としているため、多くの詳細は省略され、エッジケースも無視されています。
:::

これは基礎のセクションで説明したいくつかの[リアクティブオブジェクトの制限](/guide/essentials/reactivity-fundamentals#limitations-of-reactive)を説明するものです:

- リアクティブオブジェクトのプロパティをローカル変数に割り当てたり分割代入した場合、その変数へのアクセスや代入は、ソースオブジェクトの get / set プロキシートラップをトリガーしなくなるため、非リアクティブになります。この「切断」は変数バインディングにのみ影響することに注意してください。変数がオブジェクトのような非プリミティブな値を指している場合、オブジェクトの変更は依然としてリアクティブです。

- `reactive()` から返されたプロキシーはオリジナルと同じように動作しますが、`===` 演算子を用いてオリジナルと比較すると、異なる固有性を持つことになります。

`track()` の内部では、現在実行中のエフェクトがあるかどうかをチェックします。ある場合は、追跡されているプロパティの購読者であるエフェクト（Set に格納）を検索し、実行中のエフェクトを Set に追加します:

```js
// これは、エフェクトの実行直前に設定されます。
// これについては後ほど扱います。
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

エフェクトの購読は、グローバルなデータストラクチャ `WeakMap<target, Map<key, Set<effect>>` に格納されます。もし、あるプロパティに対して購読するエフェクトの Set が見つからなかった場合（初めて追跡された場合）、Set が作成されます。要するに、これが `getSubscribersForProperty()` 関数が行うことです。説明の簡略化のため、詳細は割愛します。

`trigger()` 内部では再びプロパティの購読者であるエフェクトを検索しています。ですが、今回は探す代わりにエフェクトを呼び出しています:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

では、`whenDepsChange()` 関数に話を戻しましょう:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

ここでは実際のアップデートを実行する前に、エフェクト自身に現在のアクティブなエフェクトをセットするために素の `update` 関数をラップしています。これにより、アップデート中に `track()` を呼び出し、現在のアクティブなエフェクトを特定することができます。

この時点で、依存関係を自動的に追跡し、依存関係が変更されるたびに再実行するエフェクトを作成しました。これを **リアクティブエフェクト（Reactive Effect）** と呼びます。

Vue はリアクティブエフェクトを作成するための API を提供しています: [`watchEffect()`](/api/reactivity-core#watcheffect)。実際、この例にある魔法のような `whenDepsChange()` とかなり似た動きをすることに気づくかもしれません。これで、実際の Vue の API を使って最初のサンプルを作り直すことができます:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // A0 と A1 を追跡
  A2.value = A0.value + A1.value
})

// エフェクトをトリガー
A0.value = 2
```

ref の変更のためにリアクティブエフェクトを使用するのはあまり気持ちのいい使い方ではありません。実際、算出プロパティを使う方がより宣言的です:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

内部的には、`computed` がリアクティブエフェクトを使って無効化や再計算を管理しています。

では、一般的で便利なリアクティブエフェクトの例とは何でしょうか？そう、DOM の更新です！単純な"リアクティブレンダリング"を実装するには、次のようにします:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})

// DOM を更新
count.value++
```

実際、これは Vue のコンポーネントが状態と DOM を同期させる方法にかなり近いです。各コンポーネントのインスタンスは、DOM をレンダリングして更新するためのリアクティブエフェクトを作成します。もちろん、Vue コンポーネントは `innerHTML` よりもずっと効率的な方法で DOM を更新しています。これについては[レンダリングメカニズム](./rendering-mechanism)で説明されています。

<div class="options-api">

`ref()`、`computed()` と `watchEffect()` API はすべて Composition API の一部です。これまで Vue で Options API だけを使用していた方は、Composition API が Vue のリアクティブシステムの仕組みに近いことに気がつくでしょう。実際、Vue 3 では、Options API は Composition API の上に実装されています。コンポーネントインスタンス（`this`）のすべてのプロパティへのアクセスは、リアクティビティー追跡のための getter / setter をトリガーし、`watch` や `computed` などのオプションは、内部的に Composition API と同等のものを呼び出します。

</div>

## ランタイムとコンパイルタイムのリアクティビティーの比較 {#runtime-vs-compile-time-reactivity}

Vue のリアクティビティーシステムは、主にランタイムベースです:追跡とトリガーは、すべてコードがブラウザーで直接実行されている間に行われます。ランタイム中のリアクティビティーの長所は、ビルドステップなしで動作すること、そしてエッジケースが少ないことです。一方で、JavaScript の構文の制限に制約されることになり、Vue の ref のような値コンテナーの必要性につながります。

[Svelte](https://svelte.dev/) のような一部のフレームワークは、コンパイル時のリアクティビティーを実装することで、そのような制限を克服することを選択しています。リアクティビティーをシミュレートするためにコードを分析および変換します。コンパイルステップにより、フレームワークは JavaScript 自体のセマンティクスを変更できます。例えば、依存関係の解析やローカル定義された変数へのアクセスに関するエフェクトトリガーを実行するコードを暗黙のうちに注入できます。欠点は、このような変換にはビルドステップが必要であり、また JavaScript のセマンティクスを変更するということは、本質的には「JavaScript のように見えるが別のものにコンパイルされる言語を作成すること」になります。

Vue チームは、[Reactivity Transform](/guide/extras/reactivity-transform) という実験的な機能を通じてこの方向性を模索しましたが、最終的には[こういった理由](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)で、このプロジェクトには適していないだろうと判断しました。

## リアクティビティーのデバッグ {#reactivity-debugging}

Vue のリアクティビティーシステムが依存関係を自動的に追跡するのは素晴らしいことですが、場合によっては、何が追跡されているのか、あるいは何がコンポーネントの再レンダリングを引き起こしているのかを正確に把握したいと時があるかもしれません。

### コンポーネントデバッグフック {#component-debugging-hooks}

コンポーネントのレンダリング時にどの依存関係が使われているか、どの依存関係が更新のトリガーになっているかは、<span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> と <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> ライフサイクルフックを使ってデバッグすることができます。どちらのフックも、調べたい依存関係の情報を含むデバッガーイベントを受け取ります。依存関係を対話的に調査するために、コールバックの中に `debugger` ステートメントを置くことをお勧めします:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
コンポーネントデバッグフックは開発モードでのみ動作します。
:::

デバッグイベントオブジェクトの型は下記の通りです:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 算出プロパティのデバッグ {#computed-debugging}

<!-- TODO options API equivalent -->

`computed()` の第 2 引数に `onTrack` と `onTrigger` のコールバック関数オブジェクトを渡すことで、算出プロパティをデバッグすることができます:

- `onTrack` はリアクティブなプロパティや ref が依存関係として追跡されるときに呼ばれます。
- `onTrigger` は依存関係の変更によってウォッチャーのコールバック関数がトリガーされたときに呼ばれます。

どちらのコールバックも、コンポーネントデバッグフックと[同じフォーマット](#debugger-event)でデバッガーイベントを受信します:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // count.value が依存関係として追跡されたときにトリガーされます
    debugger
  },
  onTrigger(e) {
    // count.value が変更されたときにトリガーされます
    debugger
  }
})

// plusOne にアクセスすると、onTrack がトリガーされる
console.log(plusOne.value)

// count.value を変更すると、onTrigger がトリガーされる
count.value++
```

:::tip
算出プロパティの `onTrack` と `onTrigger` オプションは開発モードでのみ動作します。
:::

### ウォッチャーのデバッグ {#watcher-debugging}

<!-- TODO options API equivalent -->

`computed()` と同様にウォッチャーも `onTrack` と `onTrigger` オプションをサポートしています:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
ウォッチャーの `onTrack` と `onTrigger` オプションは開発モードでのみ動作します。
:::

## 外部の状態システムとの統合 {#integration-with-external-state-systems}

Vue のリアクティビティーシステムは、プレーンな JavaScript オブジェクトをリアクティブなプロキシーに綿密に変換することで機能します。外部の状態管理システムと統合する場合（例えば、外部のソリューションもプロキシーを使用する場合）、この変換は不要になることがあり、時には望ましくないことになります。

Vue のリアクティビティーシステムを外部の状態管理ソリューションと統合する一般的な方法は、外部の状態を [`shallowRef`](/api/reactivity-advanced#shallowref) で保持することです。shallow ref は `.value` プロパティにアクセスしたときのみリアクティブになり、内部の値はそのまま残されます。外部の状態が変化したら、更新をトリガーするために ref の値を置き換えます。

### イミュータブルなデータ {#immutable-data}

undo/redo 機能（元に戻す/やり直す機能）を実装する場合、ユーザーが編集するたびにアプリケーションの状態のスナップショットを取得したいと思うかもしれません。ですが、ステートツリーが大きい場合、こういった機能に対しては Vue のミュータブル（変更可能）なリアクティビティーシステムは適していません。更新があるたびにステートオブジェクト全体をシリアライズすると、CPU とメモリー両方のコストがかかる可能性があるためです。

[イミュータブルなデータ構造](https://en.wikipedia.org/wiki/Persistent_data_structure)は、ステートオブジェクトを決して変更させないことでこれを解決します。変更の代わりに、古いオブジェクトと同じ、変化のない部分を共有する新しいオブジェクトを作成するのです。JavaScript でイミュータブルなデータを使用する方法はさまざまありますが、Vue で [Immer](https://immerjs.github.io/immer/) を使用すると、ミュータブルな構文を維持しつつ、より人に分かりやすい状態でイミュータブルなデータを使用できるため、おすすめです。

Immer と Vue は、簡単なコンポーザブルを介して統合できます:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Playground で試す](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### ステートマシン {#state-machines}

[ステートマシン](https://en.wikipedia.org/wiki/Finite-state_machine)は、アプリケーションが取りうるすべての状態と、ある状態から別の状態に移行するためのすべての方法を記述するためのモデルです。単純なコンポーネントには過剰かもしれませんが、複雑な状態遷移をより堅牢で管理しやすくするのに役立ちます。

JavaScript で最も人気のあるステートマシンの実装の 1 つとして [XState](https://xstate.js.org/) があります。ここに XState と統合したコンポーザブルがあります:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Playground で試す](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) は、非同期イベントストリームを扱うためのライブラリーです。[VueUse](https://vueuse.org/) ライブラリーは、RxJS ストリームと Vue のリアクティブシステムを接続するための [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) アドオンを提供します。

## シグナルとの関連 {#connection-to-signals}

他のたくさんのフレームワークでも、Vue の Composition API の ref に似たリアクティビティープリミティブを「シグナル」という用語で導入しています:

- [Solid のシグナル](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular のシグナル](https://angular.io/guide/signals)
- [Preact のシグナル](https://preactjs.com/guide/v10/signals/)
- [Qwik のシグナル](https://qwik.builder.io/docs/components/state/#usesignal)

基本的に、シグナルは Vue の ref と同じ種類のリアクティビティープリミティブです。これは、アクセス時の依存関係の追跡と、変更時の副作用のトリガーを提供する値コンテナーです。このリアクティビティープリミティブベースのパラダイムは、フロントエンドの世界においては特に新しい概念ではなく、10 年以上前の [Knockout observables](https://knockoutjs.com/documentation/observables.html) や [Meteor Tracker](https://docs.meteor.com/api/tracker.html) のような実装に遡ることができます。Vue の Options API や React の状態管理ライブラリーである [MobX](https://mobx.js.org/) も同じ原理に基づいていますが、オブジェクトプロパティの裏側にあるプリミティブを隠しています。

シグナルとして認定されるために必要な特性ではありませんが、今日、この概念はきめ細かいサブスクリプションを通じて更新が実行されるレンダリングモデルと一緒に議論されることがよくあります。仮想 DOM を使用しているため、Vue は現在、[コンパイラーに依存して同様の最適化を実現しています](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom)。しかし、私たちは [Vapor モード](https://github.com/vuejs/core-vapor)と呼ばれる、Solid にインスパイアされた新しいコンパイル戦略も模索しています。これは仮想 DOM に依存せず、Vue の組み込みのリアクティビティーシステムをより活用するものです。

### API 設計のトレードオフ {#api-design-trade-offs}

Preact と Qwik のシグナルの設計は Vue の [shallowRef](/api/reactivity-advanced#shallowref) に非常に似ています。3 つとも `.value` プロパティを介してミュータブルなインターフェースを提供しています。Solid と Angular のシグナルについて考察してみます。

#### Solid のシグナル {#solid-signals}

Solid の `createSignal()` API 設計は、読み取りと書き込みの分離に重点を置いています。シグナルは読み取り専用のゲッターと、独立したセッターとして公開されます:

```js
const [count, setCount] = createSignal(0)

count() // 値にアクセス
setCount(1) // 値を更新
```

`count` シグナルはセッターなしでも受け渡せることに注意してください。これは、セッターが明示的に公開されない限り、状態が決して変更されないことを保証しています。この安全性の保証が、より冗長な構文を正当化するかどうかは、プロジェクトの要件や個人の好みによりますが、この API スタイルを好む場合は、Vue でも簡単に再現できます:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Playground で試す](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular のシグナル {#angular-signals}

Angular はダーティーチェックを廃止し、リアクティビティープリミティブの独自の実装を導入することで、いくつかの根本的な変化を遂げようとしています。Angular のシグナル API は以下のような感じです。

```js
const count = signal(0)

count() // 値にアクセス
count.set(1) // 新しい値を設定
count.update((v) => v + 1) // 前回の値を元に更新
```

この API も、Vue で簡単に再現できます:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Playground で試す](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

Vue の ref と比較して、Solid や Angular のゲッターベースの API スタイルは、Vue のコンポーネント内で使用する場合にいくつかの興味深いトレードオフを提供します:

- `()` は `.value` よりわずかに簡潔ですが、値を更新する場合は冗長になります。
- ref のアンラップはないので、値にアクセスするには常に `()` が必要です。これにより、値へのアクセスはどこでも一貫したものになります。これはまた、シグナルをそのままコンポーネントの props として渡せることを意味します。

これらの API スタイルが自分に合うかどうかは、ある程度主観的なものです。ここでの目標は、これらの異なる API 設計間の根本的な類似性とトレードオフを示すことです。また、Vue は柔軟であり、既存の API に縛られないことも示したいです。必要であれば、より具体的なニーズに合わせて独自のリアクティビティープリミティブ API を作成できます。
