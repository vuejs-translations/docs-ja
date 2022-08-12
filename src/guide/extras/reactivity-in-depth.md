---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# リアクティビティの探求

Vue の最も特徴的な機能の 1 つは、控えめなリアクティビティシステムです。コンポーネントの状態はリアクティブな JavaScript オブジェクトです。状態を変更すると、ビュー (View) が更新されます。状態管理はシンプルで直感的ですが、よくある落とし穴を避けるために、仕組みを理解することも重要です。このセクションでは Vue のリアクティビティシステムのより低レベルの詳細について、いくつか掘り下げていきます。

## リアクティビティとは？

最近この用語がプログラミングでよく出てくるようになりましたが、人々がそれについて話すとき、何を意味しているのでしょうか？リアクティビティとは、宣言的な方法で変化に対応できるようにするプログラミングパラダイムです。よく挙げられる典型的な例として Excel のスプレッドシートが挙げられます:

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

- `update()` 関数はプログラムの状態を変更するため、**副作用（サイドエフェクト: side effect）**、もしくは略して**作用（エフェクト: effect）**を発生させます。

- `A0` と `A1` は作用の**依存関係**と見なされ、それらの値は作用を実行するために使用されます。作用は依存関係との関係において**購読者（subscriber）**と言われます。

必要なのは `A0` や `A1`（**依存関係**）が変わるたびに `update()`（**作用**）を呼び出せるマジックメソッドです:

```js
whenDepsChange(update)
```

この `whenDepsChange()` 関数には、以下のようなタスクがあります:

1. 変数が読み込まれたときの追跡。例えば `A0 + A1` という式を評価するときに、`A0` と `A1` の両方が読み込まれます。

2. 実行中の作用があるときに変数が読み込まれた場合、作用をその変数の購読者にします。例： `update()` が実行されているときに `A0` と `A1` が読み込まれるので、最初の呼び出し以降は `update()` が `A0` と `A1` の両方の購読者になります。

3. 変数が変更されたときの検知。例:`A0` に新しい値が代入されたとき、再実行のため購読者である作用すべてに通知します。

## Vue におけるリアクティビティの仕組み

私たちは、この例のようなローカル変数の読み書きを実際に追跡することはできません。バニラ（素の）JavaScript にはそのような仕組みがないのです。**できる**のは、**オブジェクトのプロパティ**の読み書きを傍受(インターセプト)することです。

JavaScript でプロパティにアクセスを傍受する方法は 2 つあります:[getter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/set) と [Proxies](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) です。Vue 2 では、ブラウザのサポートの制限により、getter / setter のみを使用していました。Vue 3 では、Proxies はリアクティブオブジェクトに、getter/setters は refs に使用されています。以下は、動作を説明する疑似コードです:

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

これは基礎のセクションで説明したいくつかの[リアクティブオブジェクトの制限](/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive)を説明するものです:

- リアクティブオブジェクトのプロパティをローカル変数に割り当てたり分割代入した場合、ローカル変数へのアクセスはプロキシーが仕込んだ get/set をトリガーしなくなるため、リアクティビティが"切断"されます。

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

この時点で、依存関係を自動的に追跡し、依存関係が変更されるたびに再実行する作用が作成しました。これを**リアクティブ作用（Reactive Effect）**と呼びます。

Vue はリアクティブ作用を作成するための API を提供しています:[watchEffect()`](/api/reactivity-core.html#watcheffect)。実際、この例にある魔法のような `whenDepsChange()` とかなり似た動きをすることに気づくかもしれません。これで、実際の Vue の API を使って最初のサンプルを作り直すことができます:

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

`ref()`、`computed()` と `watchEffect()` API はすべて Composition API の一部です。これまで Vue で Options API だけを使用していた方は、Composition API が Vue のリアクティブシステムの仕組みに近いことに気がつくでしょう。実際、Vue 3 では、Options API は Composition API の上に実装されています。コンポーネントインスタンス（`this`）のすべてのプロパティへのアクセスは、リアクティビティ追跡のための getter/setter をトリガーし、`watch` や `computed` などのオプションは、内部的に Composition API と同等のものを呼び出します。

</div>

## ランタイム VS. リアクティビティのコンパイルタイム

Vue のリアクティビティシステムは、主にランタイムベースです:追跡とトリガーは、すべてコードがブラウザーで直接実行されている間に行われます。ランタイム中のリアクティビティの長所は、ビルドステップなしで動作すること、そしてエッジケースが少ないことです。一方で、JavaScript の構文の制限に制約されることになります。

先ほどの例では、すでにその制限に遭遇しました:JavaScript はローカル変数の読み書きをインターセプトする方法を提供していません。なので、リアクティブな状態にアクセスするには、常にリアクティブオブジェクトか refs を使ってオブジェクトのプロパティとしてアクセスしなければなりません。

私たちは、コードの冗長性を減らすために[Reactivity Transform](/guide/extras/reactivity-transform.html)機能を実験的に使用しています:

```js
let A0 = $ref(0)
let A1 = $ref(1)

// 変数の読み込みの追跡
const A2 = $computed(() => A0 + A1)

// 変数の書き込みをトリガー
A0 = 2
```

このスニペットは、変数への参照の後に自動的に `.value` を追加することで、トランスフォームなしで書いたものと全く同じにコンパイルされます。Reactivity Transform によって、Vue のリアクティビティシステムは洗練されたものになります。

## リアクティビティのデバッグ

Vue のリアクティビティシステムが依存関係を自動的に追跡するのは素晴らしいことですが、場合によっては、何が追跡されているのか、あるいは何がコンポーネントの再レンダリングを引き起こしているのかを正確に把握したいと時があるかもしれません。

### コンポーネントデバッグフック

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

### 算出プロパティのデバッグ

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

### ウォッチャーのデバッグ

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

## 外部の状態システムとの統合

Vue のリアクティビティシステムは、プレーンな JavaScript オブジェクトをリアクティブなプロキシーに綿密に変換することで機能します。外部の状態管理システムと統合する場合（例えば、外部のソリューションもプロキシーを使用する場合）、この変換は不要になることがあり、時には望ましくないことになります。

Vue のリアクティビティシステムを外部の状態管理ソリューションと統合する一般的な方法は、外部の状態を [`shallowRef`](/api/reactivity-advanced.html#shallowref) で保持することです。shallow ref は `.value` プロパティにアクセスしたときのみリアクティブになり、内部の値はそのまま残されます。外部の状態が変化したら、更新をトリガーするために ref の値を置き換えます。

### イミュータブルなデータ

undo/redo 機能（元に戻す/やり直す機能）を実装する場合、ユーザーが編集するたびにアプリケーションの状態のスナップショットを取得したいと思うかもしれません。ですが、ステートツリーが大きい場合、こういった機能に対しては Vue のミュータブル（変更可能）なリアクティビティシステムは適していません。更新があるたびにステートオブジェクト全体をシリアライズすると、CPU とメモリー両方のコストがかかる可能性があるためです。

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

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZUltbWVyIH0gZnJvbSAnLi9pbW1lci5qcydcbiAgXG5jb25zdCBbaXRlbXMsIHVwZGF0ZUl0ZW1zXSA9IHVzZUltbWVyKFtcbiAge1xuICAgICB0aXRsZTogXCJMZWFybiBWdWVcIixcbiAgICAgZG9uZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgIHRpdGxlOiBcIlVzZSBWdWUgd2l0aCBJbW1lclwiLFxuICAgICBkb25lOiBmYWxzZVxuICB9XG5dKVxuXG5mdW5jdGlvbiB0b2dnbGVJdGVtKGluZGV4KSB7XG4gIHVwZGF0ZUl0ZW1zKGl0ZW1zID0+IHtcbiAgICBpdGVtc1tpbmRleF0uZG9uZSA9ICFpdGVtc1tpbmRleF0uZG9uZVxuICB9KVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHVsPlxuICAgIDxsaSB2LWZvcj1cIih7IHRpdGxlLCBkb25lIH0sIGluZGV4KSBpbiBpdGVtc1wiXG4gICAgICAgIDpjbGFzcz1cInsgZG9uZSB9XCJcbiAgICAgICAgQGNsaWNrPVwidG9nZ2xlSXRlbShpbmRleClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICA8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlPlxuLmRvbmUge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJpbW1lclwiOiBcImh0dHBzOi8vdW5wa2cuY29tL2ltbWVyQDkuMC43L2Rpc3QvaW1tZXIuZXNtLmpzP21vZHVsZVwiXG4gIH1cbn0iLCJpbW1lci5qcyI6ImltcG9ydCBwcm9kdWNlIGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUltbWVyKGJhc2VTdGF0ZSkge1xuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYoYmFzZVN0YXRlKVxuICBjb25zdCB1cGRhdGUgPSAodXBkYXRlcikgPT4ge1xuICAgIHN0YXRlLnZhbHVlID0gcHJvZHVjZShzdGF0ZS52YWx1ZSwgdXBkYXRlcilcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHVwZGF0ZV1cbn0ifQ==)

### ステートマシン

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

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICcuL21hY2hpbmUuanMnXG4gIFxuY29uc3QgW3N0YXRlLCBzZW5kXSA9IHVzZU1hY2hpbmUoe1xuICBpZDogJ3RvZ2dsZScsXG4gIGluaXRpYWw6ICdpbmFjdGl2ZScsXG4gIHN0YXRlczoge1xuICAgIGluYWN0aXZlOiB7IG9uOiB7IFRPR0dMRTogJ2FjdGl2ZScgfSB9LFxuICAgIGFjdGl2ZTogeyBvbjogeyBUT0dHTEU6ICdpbmFjdGl2ZScgfSB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cInNlbmQoJ1RPR0dMRScpXCI+XG4gICAge3sgc3RhdGUubWF0Y2hlcyhcImluYWN0aXZlXCIpID8gXCJPZmZcIiA6IFwiT25cIiB9fVxuICA8L2J1dHRvbj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJ4c3RhdGVcIjogXCJodHRwczovL3VucGtnLmNvbS94c3RhdGVANC4yNy4wL2VzL2luZGV4LmpzP21vZHVsZVwiXG4gIH1cbn0iLCJtYWNoaW5lLmpzIjoiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgaW50ZXJwcmV0IH0gZnJvbSAneHN0YXRlJ1xuaW1wb3J0IHsgc2hhbGxvd1JlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1hY2hpbmUob3B0aW9ucykge1xuICBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShvcHRpb25zKVxuICBjb25zdCBzdGF0ZSA9IHNoYWxsb3dSZWYobWFjaGluZS5pbml0aWFsU3RhdGUpXG4gIGNvbnN0IHNlcnZpY2UgPSBpbnRlcnByZXQobWFjaGluZSlcbiAgICAub25UcmFuc2l0aW9uKChuZXdTdGF0ZSkgPT4gKHN0YXRlLnZhbHVlID0gbmV3U3RhdGUpKVxuICAgIC5zdGFydCgpXG4gIGNvbnN0IHNlbmQgPSAoZXZlbnQpID0+IHNlcnZpY2Uuc2VuZChldmVudClcblxuICByZXR1cm4gW3N0YXRlLCBzZW5kXVxufSJ9)

### RxJS

[RxJS](https://rxjs.dev/) は、非同期イベントストリームを扱うためのライブラリーです。[VueUse](https://vueuse.org/) ライブラリーは、RxJS ストリームと Vue のリアクティブシステムを接続するための [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) アドオンを提供します。
