---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# リアクティビティーの探求 {#reactivity-in-depth}

Vue の最も特徴的な機能の 1 つは、控えめなリアクティビティーシステムです。コンポーネントの状態はリアクティブな JavaScript オブジェクトで構成されています。状態を変更すると、ビュー (View) が更新されます。状態管理はシンプルで直感的ですが、よくある落とし穴を避けるために、仕組みを理解することも重要です。このセクションでは Vue のリアクティビティーシステムのより低レベルの詳細について、いくつか掘り下げていきます。

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

- `update()` 関数はプログラムの状態を変更するため、**副作用（サイドエフェクト: side effect）**、もしくは略して **作用（エフェクト: effect）** を発生させます。

- `A0` と `A1` は作用の**依存関係**と見なされ、それらの値は作用を実行するために使用されます。作用は依存関係との関係において **購読者（subscriber）** と言われます。

必要なのは `A0` や `A1`（**依存関係**）が変わるたびに `update()`（**作用**）を呼び出せるマジックメソッドです:

```js
whenDepsChange(update)
```

この `whenDepsChange()` 関数には、以下のようなタスクがあります:

1. 変数が読み込まれたときの追跡。例えば `A0 + A1` という式を評価するときに、`A0` と `A1` の両方が読み込まれます。

2. 実行中の作用があるときに変数が読み込まれた場合、作用をその変数の購読者にします。例： `update()` が実行されているときに `A0` と `A1` が読み込まれるので、最初の呼び出し以降は `update()` が `A0` と `A1` の両方の購読者になります。

3. 変数が変更されたときの検知。例:`A0` に新しい値が代入されたとき、再実行のため購読者である作用すべてに通知します。

## Vue におけるリアクティビティーの仕組み {#how-reactivity-works-in-vue}

私たちは、この例のようなローカル変数の読み書きを実際に追跡することはできません。バニラ（素の）JavaScript にはそのような仕組みがないのです。**できる**のは、**オブジェクトのプロパティ**の読み書きを傍受(インターセプト)することです。

JavaScript でプロパティにアクセスを傍受する方法は 2 つあります:[getter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/set) と [Proxies](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) です。Vue 2 では、ブラウザのサポートの制限により、getter / setter のみを使用していました。Vue 3 では、Proxies はリアクティブオブジェクトに、getter / setters は refs に使用されています。以下は、動作を説明する疑似コードです:

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

- リアクティブオブジェクトのプロパティをローカル変数に割り当てたり分割代入した場合、ローカル変数へのアクセスはプロキシーが仕込んだ get/set をトリガーしなくなるため、リアクティビティーが"切断"されます。

- `reactive()` から返されたプロキシーはオリジナルと同じように動作しますが、`===` 演算子を用いてオリジナルと比較すると、異なる固有性を持つことになります。

`track()` の内部では、現在実行中の作用があるかどうかをチェックします。ある場合は、追跡しているプロパティの購読者である作用（Set に格納）を検索し、その作用を Set に追加します:

```js
// これは、作用の実行直前に設定されます。
// これについては後ほど扱います。
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

エフェクトサブスクリプションは、グローバルなデータストラクチャ `WeakMap<target, Map<key, Set<effect>>` に格納されます。もし、あるプロパティに対してサブスクライブする作用の Set が見つからなかった場合（初めて追跡された場合）、Set が作成されます。要するに、これが `getSubscribersForProperty()` 関数が行うことです。説明の簡略化のため、詳細は割愛します。

`trigger()` 内部では再びプロパティの購読者である作用を検索しています。ですが、今回は探す代わりに作用を呼び出しています:

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

ここでは実際のアップデートを実行する前に、作用自身に現在のアクティブなエフェクトをセットするために素の `update` 関数をラップしています。これにより、アップデート中に `track()` を呼び出し、現在のアクティブな作用を特定することができます。

この時点で、依存関係を自動的に追跡し、依存関係が変更されるたびに再実行する作用が作成しました。これを **リアクティブ作用（Reactive Effect）** と呼びます。

Vue はリアクティブ作用を作成するための API を提供しています: [`watchEffect()`](/api/reactivity-core#watcheffect)。実際、この例にある魔法のような `whenDepsChange()` とかなり似た動きをすることに気づくかもしれません。これで、実際の Vue の API を使って最初のサンプルを作り直すことができます:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // A0 と A1 を追跡
  A2.value = A0.value + A1.value
})

// 作用をトリガー
A0.value = 2
```

ref の変更のためにリアクティブ作用を使用するのはあまり気持ちのいい使い方ではありません。実際、算出プロパティを使う方がより宣言的です:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

内部的には、`computed` がリアクティブ作用を使って無効化や再計算を管理しています。

では、一般的で便利なリアクティブ作用の例とは何でしょうか？そう、DOM の更新です！単純な"リアクティブレンダリング"を実装するには、次のようにします:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `count is: ${count.value}`
})

// DOM を更新
count.value++
```

実際、これは Vue のコンポーネントが状態と DOM を同期させる方法にかなり近いです。各コンポーネントのインスタンスは、DOM をレンダリングして更新するためのリアクティブ作用を作成します。もちろん、Vue コンポーネントは `innerHTML` よりもずっと効率的な方法で DOM を更新しています。これについては[レンダリングメカニズム](./rendering-mechanism)で説明されています。

<div class="options-api">

`ref()`、`computed()` と `watchEffect()` API はすべて Composition API の一部です。これまで Vue で Options API だけを使用していた方は、Composition API が Vue のリアクティブシステムの仕組みに近いことに気がつくでしょう。実際、Vue 3 では、Options API は Composition API の上に実装されています。コンポーネントインスタンス（`this`）のすべてのプロパティへのアクセスは、リアクティビティー追跡のための getter / setter をトリガーし、`watch` や `computed` などのオプションは、内部的に Composition API と同等のものを呼び出します。

</div>

## ランタイムとコンパイルタイムのリアクティビティーの比較 {#runtime-vs-compile-time-reactivity}

Vue のリアクティビティーシステムは、主にランタイムベースです:追跡とトリガーは、すべてコードがブラウザーで直接実行されている間に行われます。ランタイム中のリアクティビティーの長所は、ビルドステップなしで動作すること、そしてエッジケースが少ないことです。一方で、JavaScript の構文の制限に制約されることになり、Vue の ref のような値コンテナーの必要性につながります。

[Svelte](https://svelte.dev/) のような一部のフレームワークは、コンパイル時のリアクティビティーを実装することで、そのような制限を克服することを選択しています。リアクティビティーをシミュレートするためにコードを分析および変換します。コンパイルステップにより、フレームワークは JavaScript 自体のセマンティクスを変更できます。例えば、依存関係の解析やローカル定義された変数へのアクセスに関する作用トリガーを実行するコードを暗黙のうちに注入できます。欠点は、このような変換にはビルドステップが必要であり、また JavaScript のセマンティクスを変更するということは、本質的には「JavaScript のように見えるが別のものにコンパイルされる言語を作成すること」になります。

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
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Playground で試す](https://play.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZUltbWVyIH0gZnJvbSAnLi9pbW1lci5qcydcbiAgXG5jb25zdCBbaXRlbXMsIHVwZGF0ZUl0ZW1zXSA9IHVzZUltbWVyKFtcbiAge1xuICAgICB0aXRsZTogXCJMZWFybiBWdWVcIixcbiAgICAgZG9uZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgIHRpdGxlOiBcIlVzZSBWdWUgd2l0aCBJbW1lclwiLFxuICAgICBkb25lOiBmYWxzZVxuICB9XG5dKVxuXG5mdW5jdGlvbiB0b2dnbGVJdGVtKGluZGV4KSB7XG4gIHVwZGF0ZUl0ZW1zKGl0ZW1zID0+IHtcbiAgICBpdGVtc1tpbmRleF0uZG9uZSA9ICFpdGVtc1tpbmRleF0uZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWZvcj1cIih7IHRpdGxlLCBkb25lIH0sIGluZGV4KSBpbiBpdGVtc1wiXG4gICAgICAgIDpjbGFzcz1cInsgZG9uZSB9XCJcbiAgICAgICAgQGNsaWNrPVwidG9nZ2xlSXRlbShpbmRleClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICA8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmRvbmUge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJpbW1lclwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2ltbWVyQDkuMC43L2Rpc3QvaW1tZXIuZXNtLmpzP21vZHVsZVwiXG4gIH1cbn0iLCJpbW1lci5qcyI6ImltcG9ydCBwcm9kdWNlIGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltbWVyKGJhc2VTdGF0ZSkge1xuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYoYmFzZVN0YXRlKVxuICBjb25zdCB1cGRhdGUgPSAodXBkYXRlcikgPT4ge1xuICAgIHN0YXRlLnZhbHVlID0gcHJvZHVjZShzdGF0ZS52YWx1ZSwgdXBkYXRlcilcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHVwZGF0ZV1cbn0ifQ==)

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

[Playground で試す](https://play.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICcuL21hY2hpbmUuanMnXG4gIFxuY29uc3QgW3N0YXRlLCBzZW5kXSA9IHVzZU1hY2hpbmUoe1xuICBpZDogJ3RvZ2dsZScsXG4gIGluaXRpYWw6ICdpbmFjdGl2ZScsXG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7IG9uOiB7IFRPR0dMRTogJ2FjdGl2ZScgfSB9LFxuICAgIGFjdGl2ZTogeyBvbjogeyBUT0dHTEU6ICdpbmFjdGl2ZScgfSB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cInNlbmQoJ1RPR0dMRScpXCI+XG4gICAge3sgc3RhdGUubWF0Y2hlcyhcImluYWN0aXZlXCIpID8gXCJPZmZcIiA6IFwiT25cIiB9fVxuICA8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ4c3RhdGVcIjogXCJodHRwczovL3VucGtnLmNvbS94c3RhdGVANC4yNy4wL2VzL2luZGV4LmpzP21vZHVsZVwiXG4gIH1cbn0iLCJtYWNoaW5lLmpzIjoiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgaW50ZXJwcmV0IH0gZnJvbSAneHN0YXRlJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1hY2hpbmUob3B0aW9ucykge1xuICBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShvcHRpb25zKVxuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYobWFjaGluZS5pbml0aWFsU3RhdGUpXG4gIGNvbnN0IHNlcnZpY2UgPSBpbnRlcnByZXQobWFjaGluZSlcbiAgICAub25UcmFuc2l0aW9uKChuZXdTdGF0ZSkgPT4gKHN0YXRlLnZhbHVlID0gbmV3U3RhdGUpKVxuICAgIC5zdGFydCgpXG4gIGNvbnN0IHNlbmQgPSAoZXZlbnQpID0+IHNlcnZpY2Uuc2VuZChldmVudClcblxuICByZXR1cm4gW3N0YXRlLCBzZW5kXVxufSJ9)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) は、非同期イベントストリームを扱うためのライブラリーです。[VueUse](https://vueuse.org/) ライブラリーは、RxJS ストリームと Vue のリアクティブシステムを接続するための [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) アドオンを提供します。

## シグナルとの関連 {#connection-to-signals}

他のたくさんのフレームワークでも、Vue の Composition API の ref に似たリアクティビティープリミティブを「シグナル」という用語で導入しています:

- [Solid のシグナル](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular のシグナル](https://github.com/angular/angular/discussions/49090)
- [Preact のシグナル](https://preactjs.com/guide/v10/signals/)
- [Qwik のシグナル](https://qwik.builder.io/docs/components/state/#usesignal)

基本的に、シグナルは Vue の ref と同じ種類のリアクティビティープリミティブです。これは、アクセス時の依存関係の追跡と、変更時の副作用のトリガーを提供する値コンテナーです。このリアクティビティープリミティブベースのパラダイムは、フロントエンドの世界においては特に新しい概念ではなく、10 年以上前の [Knockout observables](https://knockoutjs.com/documentation/observables.html) や [Meteor Tracker](https://docs.meteor.com/api/tracker.html) のような実装に遡ることができます。Vue の Options API や React の状態管理ライブラリーである [MobX](https://mobx.js.org/) も同じ原理に基づいていますが、オブジェクトプロパティの裏側にあるプリミティブを隠しています。

シグナルとして認定されるために必要な特性ではありませんが、今日、この概念はきめ細かいサブスクリプションを通じて更新が実行されるレンダリングモデルと一緒に議論されることがよくあります。仮想 DOM を使用しているため、Vue は現在、[コンパイラーに依存して同様の最適化を実現しています](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom)。しかし、仮想 DOM に依存せず、Vue の組み込みのリアクティビティーシステムをより活用する、Solid にインスパイアされた新しいコンパイル戦略（Vapor モード）も模索しています。

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

[Playground で試す](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl9iYY63XwE437A+2Y9WD69KOOlvSKNndEPjfR8lOsnZAbxTfIx/Jp7P46lw5TygOovItaRfAY5jcURk9OksBztASNgF/6N40AyzQkR1hV0pvB/289yldvvidMsq01vgAD62dTChip28xeoT6TZPsc65MJVc9VuJHwNENTOAXQHW6O55ZN9ZmOSxLJTmTkKcpBGvgSzvo9metxEUim6E+wgyf4C5XInEBtGHVEU1IpXKtZaySVzlRiHXP/dg43sIavsQ58tUGeCUOkDIxx6eKbyVOITh/kNJ3bbzfiy8t9ZKjkngcPWKJftw/kX31SNxYieKfHpKTM9Ke0DwjIX3U8x31v76x7aLMwqu8s4RXuZroT80w2Nfv2BUQSPc9EsdXO1kuGYi/E7+bTBs0H/qNbXMzTFiAdRHy+XqV1XJii28SK5NNvsA9Biawl2wSlQm9gexhBOeEbpfeSJwPfxzajq2t6xp2l8F2cA9ztrFyOMC8Wd5Bts13X+KvqRl8Kuw4YN5t84zSeHw4FuMfTwYeeMr0aR/jNZe/yX4QHw==)

#### Angular のシグナル {#angular-signals}

Angular はダーティーチェックを廃止し、リアクティビティープリミティブの独自の実装を導入することで、いくつかの根本的な変化を遂げようとしています。Angular のシグナル API は以下のような感じです。

```js
const count = signal(0)

count() // 値にアクセス
count.set(1) // 新しい値を設定
count.update((v) => v + 1) // 前回の値を元に更新

// 同一のディープオブジェクトを変更
const state = signal({ count: 0 })
state.mutate((o) => {
  o.count++
})
```

この API も、Vue で簡単に再現できます:

```js
import { shallowRef, triggerRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  s.mutate = (mutator) => {
    mutator(r.value)
    triggerRef(r)
  }
  return s
}
```

[Playground で試す](https://play.vuejs.org/#eNp9U8uO2zAM/BVCl3XaxO72mCZBi/YLeuhJQOE4jKOtLRmU5C1g+N9LWbI3j2JvEjkckqPRIL51Xd57FFuxsxWpzoFF57uD1KrtDDkYwKpal80aKtN23uEJRjiTaeEpL0pd+6akTYTkL/ZJaqkro61juNcO9qk8+7SaEyfjjw1yZibMshXsD7GAjx/gM2N3RZyHJ+GLw7ZrSod8A9hdng/fJ3ZltzAMS+U47grOzZgfsVECxbZ3qKN3zmj4WjWq+rOXYmLKfXfiXlkfpurhIzyvpJjwAEpXhC1qN5UXsf49LpYz7D7XE3LgrnZXLOuJtYi6b9qyYz2N5pcZAl6mhJWC14lkUvDThbsUF+c6uy0Ke67Ce77Y3FBd8CknnkK1mKNtN0cyrxaJiaVYX3EUHOyRNoT6hIT0Hucd9IE30I5Sj7zKgz14mTdbXcqmMa8/8bwGR6qukabzYrPSwu8Hz/Eck8fw70Rz9rpyilVPLlNaOVU2v8rG4yrKFE1HwYlLx1vcG8oyKpqR8j7kQsqGN+TEFAi5Yc4uQd434KJvOBoP3PMWnMJZirAVY13rXaybDibVpcuC/nIlU0apmPi3Eq/Pgv9PluWL1ei4840kFTdcBJ4BV5zpV85CjGL8B7sPb9o=)

Vue の ref と比較して、Solid や Angular のゲッターベースの API スタイルは、Vue のコンポーネント内で使用する場合にいくつかの興味深いトレードオフを提供します:

- `()` は `.value` よりわずかに簡潔ですが、値を更新する場合は冗長になります。
- ref のアンラップはないので、値にアクセスするには常に `()` が必要です。これにより、値へのアクセスはどこでも一貫したものになります。これはまた、シグナルをそのままコンポーネントのプロパティとして渡せることを意味します。

これらの API スタイルが自分に合うかどうかは、ある程度主観的なものです。ここでの目標は、これらの異なる API 設計間の根本的な類似性とトレードオフを示すことです。また、Vue は柔軟であり、既存の API に縛られないことも示したいです。必要であれば、より具体的なニーズに合わせて独自のリアクティビティープリミティブ API を作成できます。
