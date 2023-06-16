---
outline: deep
---

# リアクティビティーの基礎 {#reactivity-fundamentals}

:::tip API の参照
このページと、当ガイドの多くの章では、Options API と Composition API で異なる内容が含まれています。現在の設定は <span class="options-api">Options API</span> <span class="composition-api">Composition API</span> です。左サイドバーの上部にある「API の参照」スイッチで、API スタイルを切り替えることができます。
:::

<div class="options-api">

## リアクティブな状態を宣言する \* {#declaring-reactive-state}

Options API では、`data` オプションを使用して、コンポーネントのリアクティブな状態を宣言します。オプションの値は、オブジェクトを返す関数でなければなりません。Vue は、新しいコンポーネントのインスタンスを作成するときにこの関数を呼び出し、返されたオブジェクトをリアクティブシステムでラップします。このオブジェクトのトップレベルのプロパティは、コンポーネントのインスタンス（メソッドやライフサイクルフックでは `this`）にプロキシされます:

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` は、後で説明するライフサイクルフックです。
  mounted() {
    // `this` は、コンポーネントのインスタンスを指します。
    console.log(this.count) // => 1

    // データは、変化することがある。
    this.count = 2
  }
}
```

[Playground で試す](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

これらインスタンスのプロパティは、インスタンスが最初に作成されたときにのみ追加されます。したがって、 `data` 関数が返すオブジェクトにこれらのプロパティが全て存在していることを確認する必要があります。必要であれば、 `null` や `undefined` などのプレースホルダーを使用して、まだ利用できない値をプロパティとして指定します。

新しいプロパティを `data` に含めず、直接 `this` に追加することも可能です。しかし、この方法で追加されたプロパティは、リアクティブな更新をトリガーできません。

Vue は、コンポーネントのインスタンスを介して自身の組み込み API を公開する際に、接頭辞として `$` を使用します。また、内部プロパティには `_` という接頭辞を予約します。トップレベルの `data` プロパティには、これらの文字で始まる名前を使用しないでください。

### リアクティブプロキシ vs. 独自 \* {#reactive-proxy-vs-original}

Vue 3 では、[JavaScript プロキシ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy)を活用することで、データをリアクティブにできます。Vue 2 から来たユーザーは、以下のエッジケースに注意する必要があります:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

代入後 `this.someObject` にアクセスすると、その値は元の `newObject` のリアクティブプロキシとなります。**Vue 2 とは異なり、元の `newObject` はそのまま残され、リアクティブになることはありません：リアクティブな状態にアクセスするには、常に `this` のプロパティとしてアクセスするようにしてください。

</div>

<div class="composition-api">

## リアクティブな状態を宣言する \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

Composition API では、リアクティブな状態を宣言する方法として、[`ref()`](/api/reactivity-core#ref) 関数を使用することを推奨します:

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` は、引数を受け取り、それを `.value` プロパティを持つ ref オブジェクトにラップして返します:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> 参照: [ref の型付け](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

コンポーネントのテンプレート内で ref にアクセスするには、下記に示すように、コンポーネントの `setup()` 関数で宣言し、それを返します:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` は、Composition API 専用の特別なフックです。
  setup() {
    const count = ref(0)

    // ref をテンプレートに公開します
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

テンプレート内で ref を使用する際、`.value` をつける必要は**ない**ことに注意してください。便利のよいように、ref はテンプレート内で使用されると自動的にアンラップされます（いくつかの[注意点](#caveat-when-unwrapping-in-templates)があります）。

イベントハンドラーで直接 ref を変更することもできます:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

より複雑なロジックの場合、同じスコープで ref を変更する関数を宣言し、状態とともにメソッドとして公開できます:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // JavaScript 内では .value が必要
      count.value++
    }

    // 関数も公開することを忘れないでください。
    return {
      count,
      increment
    }
  }
}
```

公開されたメソッドは、イベントハンドラーとして使用できます:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

これは、ビルドツールを使わずに、[Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo) 上で実行されている例です。

### `<script setup>` \*\* {#script-setup}

`setup()` で状態やメソッドを手動で公開するのは冗長になりがちです。幸い、[単一ファイルコンポーネント（SFC）](/guide/scaling-up/sfc) を使用すれば、これを避けられます。`<script setup>` によって使い方を簡略化できます:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

`<script setup>` で宣言されたトップレベルのインポート、変数、関数は、同じコンポーネントのテンプレートで自動的に使用可能になります。テンプレートは同じスコープで宣言された JavaScript の関数と同じだと考えれば、当然ながら、一緒に宣言されたすべてのものにアクセスできます。

:::tip
このガイドの残りの部分では、Composition API のコード例には主に SFC + `<script setup>` 構文を使用します。これは、Vue 開発者にとって最も一般的な使用方法だからです。

SFC を使用しない場合でも、[`setup()`](/api/composition-api-setup) オプションで Composition API を使用できます。
:::

### ref を使う理由 \*\* {#why-refs}

なぜ普通の変数ではなく、`.value` を使った ref が必要なのか、疑問に思うかもしれません。それを説明するために、Vue のリアクティビティシステムの仕組みについて簡単に説明する必要があります。

テンプレート内で ref を使用し、後から ref の値を変更した場合、Vue は自動的にその変更を検出し、それに応じて DOM を更新します。これは、依存関係追跡ベースのリアクティビティーシステムによって実現されています。コンポーネントが初めてレンダリングされるとき、Vue はレンダリング中に使用されたすべての ref を**追跡**します。その後 ref が変更されると、それを追跡しているコンポーネントの再レンダリングが**トリガー**されます。

標準的な JavaScript では、普通の変数のアクセスや変更を検出する方法はありません。しかし、プロパティの get や set の操作をインターセプトできます。

`.value` プロパティは、Vue に、ref がアクセスされたり変更されたタイミングを検出する機会を提供します。Vue は、getter でトラッキングを行い、setter でトリガーを実行する仕組みになっています。概念的には、ref は次のようなオブジェクトと考えることができます:

```js
// 実際の実装ではなく、疑似コード
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

ref のもう 1 つの優れた特徴は、普通の変数と違って、最新の値やリアクティビティー接続へのアクセスを維持したまま ref を関数に渡すことができることです。これは、複雑なロジックを再利用可能なコードにリファクタリングする際、特に便利です。

リアクティビティーシステムについては、[リアクティビティーの探求](/guide/extras/reactivity-in-depth)セクションで詳しく解説しています。
</div>

<div class="options-api">

## メソッドの宣言 \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Vue School の無料動画レッスン"/>

コンポーネントのインスタンスにメソッドを追加するには、 `methods` オプションを使用します。これは、必要なメソッドを含むオブジェクトでなければなりません:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // メソッドは、ライフサイクルフックで呼び出すこともできますし、他のメソッドでも呼び出せます！
    this.increment()
  }
}
```

Vue は `methods` の `this` 値を自動的にバインドし、常にコンポーネントのインスタンスを参照するようにします。これにより、イベントリスナーやコールバックとして使用される場合に、メソッドが正しい `this` 値を保持することが保証されます。Vue が適切な `this` 値をバインドできないため、 `methods` を定義する際にアロー関数を使用しないようにしましょう。

```js
export default {
  methods: {
    increment: () => {
      // BAD: ここでは `this` アクセスができません！
    }
  }
}
```

コンポーネントのインスタンスに属する他のプロパティと同じく、`methods` はコンポーネントのテンプレート内からアクセスできます。テンプレートの中では、イベントリスナーとして一般的に使用されます:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Playground で試す](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

上記の例では、`<button>` がクリックされたときに `increment` というメソッドが呼び出されます。

</div>

### ディープなリアクティビティー {#deep-reactivity}

<div class="options-api">

Vue では、デフォルトで状態がリアクティブになっています。つまり、ネストしたオブジェクトや配列を変化させた場合でも、変更が検出されることが期待できます:

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // これらは期待通りに動作します。
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

ref は、深くネストしたオブジェクトや配列、`Map` のような JavaScript ビルトインのデータ構造など、どんな値の型も保持できます。

ref は、その値を深いリアクティブにします。つまり、ネストしたオブジェクトや配列を変更した場合でも、変更が検出されることが期待できます:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // これらは期待通りに動作します。
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

非プリミティブ値は、後述する [`reactive()`](#reactive) を介してリアクティブプロキシーに変換されます。

また、[浅い ref](/api/reactivity-advanced#shallowref) により、深いリアクティビティーをオプトアウトすることもできます。浅い ref では、`.value` アクセスのみがリアクティビティーに追跡されます。浅い ref は、大きなオブジェクトの監視コストを回避してパフォーマンスを最適化する場合や、内部の状態を外部ライブラリーで管理する場合などに利用できます。

さらに読む:

- [大きなイミュータブルな構造のリアクティビティーオーバーヘッドを減らす](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [外部の状態システムとの統合](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM 更新のタイミング {#dom-update-timing}

リアクティブな状態を変化させると、DOM は自動的に更新されます。しかし、DOM の更新は同期的に適用されないことに注意する必要があります。その代わりに Vue は、更新サイクルの「next tick」まで更新をバッファリングし、どれだけ状態を変化させても、各コンポーネントは一度だけ更新することを保証しています。

状態変化後の DOM 更新が完了するのを待つため、[nextTick()](/api/general#nexttick) というグローバル API を使用できます:

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // DOM が更新されました
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // DOM が更新されました
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

リアクティブな状態を宣言する方法として、`reactive()` という API を使う方法もあります。内側の値を特別なオブジェクトでラップする ref とは異なり、`reactive()` はオブジェクト自体をリアクティブにします:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> 参照: [reactive の型付け](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

テンプレートでの使用法:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

リアクティブオブジェクトは [JavaScript プロキシ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) であり、通常のオブジェクトと同じように動作します。違いは、Vue がリアクティブオブジェクトのすべてのプロパティのアクセスや変更をインターセプトして、リアクティビティーの追跡やトリガーを行うことができることです。

`reactive()` はオブジェクトを深く変換します。ネストしたオブジェクトもアクセスした際に `reactive()` でラップされます。また、ref の値がオブジェクトである場合、内部では `ref()` からも呼び出されます。浅い ref と同様に、深いリアクティビティーをオプトアウトするための [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API もあります。

### リアクティブプロキシ vs. 独自 \*\* {#reactive-proxy-vs-original-1}

注意すべきは、`reactive()` の戻り値が、元のオブジェクトの[プロキシ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy)であり、元のオブジェクトと等しくないということです:

```js
const raw = {}
const proxy = reactive(raw)

// プロキシはオリジナルと同じではありません。
console.log(proxy === raw) // false
```

プロキシだけがリアクティブとなります。元のオブジェクトを変更しても更新は行われません。したがって、Vue のリアクティブシステムを使用する際のベストプラクティスは、**プロキシされた状態のバージョンだけを使用することになります**。

プロキシへの一貫したアクセスを保証するために、同じオブジェクトに対して `reactive()` を呼ぶと常に同じプロキシを返し、既存のプロキシに対して `reactive()` を呼ぶとその同じプロキシも返されます。

```js
// calling reactive() on the same object returns the same proxy
console.log(reactive(raw) === proxy) // true

// calling reactive() on a proxy returns itself
console.log(reactive(proxy) === proxy) // true
```

このルールは、ネストされたオブジェクトにも適用されます。深いリアクティビティーを持つため、リアクティブなオブジェクトの中にあるネストされたオブジェクトもプロキシとなります。

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()` の制限 \*\* {#limitations-of-reactive}

`reactive()` API にはいくつかの制限があります:

1. **限定された値の型:** オブジェクト型 (オブジェクト、配列、および `Map` や `Set` などの [コレクション型](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections)) に対してのみ機能します。文字列、数値、真偽値などの [プリミティブ型](https://developer.mozilla.org/ja/docs/Glossary/Primitive) を保持できません。

2. **オブジェクト全体を置換できない:** Vue のリアクティビティー追跡はプロパティアクセス上で動作するため、リアクティブなオブジェクトへの参照を常に同じに保つ必要があります。つまり、最初の参照へのリアクティブな接続が失われるため、リアクティブなオブジェクトを簡単に「置き換える」ことはできません:

   ```js
   let state = reactive({ count: 0 })

   // 上記の参照（{ count: 0 }）は、もはや追跡されていません
   // （リアクティブな接続は失われました！）
   state = reactive({ count: 1 })
   ```

3. **分割代入できない:** また、リアクティブなオブジェクトのプロパティをローカル変数に分割代入したり、そのプロパティを関数に渡したりすると、下記に示すようにリアクティブなつながりが失われることとなります：

   ```js
   const state = reactive({ count: 0 })

   // count は分割代入すると state.count と切り離されます。
   let { count } = state
   // 元の状態に戻りません。
   count++

   // この関数が受け取る平文番号と
   // state.count の変更を追跡することができません。
   // リアクティビティーを維持するためには、オブジェクト全体を渡す必要があります
   callSomeFunction(state.count)
   ```

このような制約があるため、リアクティブな状態を宣言するための主要な API として `ref()` を使用することを推奨します。

## 追加の ref アンラップの詳細 \*\* {#additional-ref-unwrapping-details}

### リアクティブなオブジェクトのプロパティとして \*\* {#ref-unwrapping-as-reactive-object-property}

ref は、リアクティブなオブジェクトのプロパティとしてアクセスまたは変更されると、自動的にアンラップされます。つまり、通常のプロパティと同じように動作します:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

既存の ref にリンクされたプロパティに新しい ref が割り当てられると、古い ref を置き換えることになります:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 元の ref は state.count から切り離されました
console.log(count.value) // 1
```

ref のアンラップは、深いリアクティブオブジェクトの内部にネストされたときのみ発生します。[浅いリアクティブオブジェクト](/api/reactivity-advanced#shallowreactive)のプロパティとしてアクセスされる場合には適用されません。

### 配列やコレクションにおける注意点 \*\* {#caveat-in-arrays-and-collections}

リアクティブオブジェクトとは異なり、ref がリアクティブな配列や `Map` のようなネイティブコレクション型の要素としてアクセスされた場合、アンラップは**行われません**:

```js
const books = reactive([ref('Vue 3 Guide')])
// ここでは .value が必要
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// ここでは .value が必要
console.log(map.get('count').value)
```

### テンプレートでアンラップするときの注意点 \*\* {#caveat-when-unwrapping-in-templates}

テンプレートでの ref のアンラップは、ref がテンプレートのレンダリングコンテキストでトップレベルのプロパティである場合にのみ適用されます。

以下の例では、`count` と `object` はトップレベルのプロパティですが、`object.id` はトップレベルではありません:

```js
const count = ref(0)
const object = { id: ref(0) }
```

したがって、この表現は期待通りに動作します:

```vue-html
{{ count + 1 }}
```

……一方、こちらは動作**しません**:

```vue-html
{{ object.id + 1 }}
```

レンダリング結果は `[object Object]1` となります。これは、式の評価時に `object.id` がアンラップされず、ref オブジェクトのままだからです。これを修正するには、`id` をトップレベルのプロパティに分割代入すればいいのです:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

これで、レンダリング結果は「2」になります。

もう 1 つ注意すべきは、ref がテキスト補間（つまり<code v-pre>{{ }}</code> タグ）の最終評価値である場合、アンラップされるので、以下のようにすると `1` が表示されます:

```vue-html
{{ object.id }}
```

これはテキスト補間の便利な機能に過ぎず、<code v-pre>{{ object.id.value }}</code> と同等です。

</div>

<div class="options-api">

### ステートフルなメソッド \* {#stateful-methods}

場合によっては、デバウンスされたイベントハンドラーを作成するなど、下記に示すように、動的にメソッド関数を作成する必要があります:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Lodash を使ったデバウンス
    click: debounce(function () {
      // ... クリックに対する反応 ...
    }, 500)
  }
}
```

しかし、デバウンスされた関数は**ステートフル**であり、経過時間に関する何らかの内部状態を保持するため、この方法は再利用されるコンポーネントにとって問題があります。複数のコンポーネントのインスタンスが同じデバウンスされた関数を共有する場合に、それらは互いに干渉します。

各コンポーネントのインスタンスのデバウンスされた関数を他から独立させるために、 `created` ライフサイクルフックでデバウンスされたバージョンを作成できます。

```js
export default {
  created() {
    // 各インスタンスがデバウンスされたハンドラーのコピーを持つようになりました。
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // また、タイマーをキャンセルするのも良いアイデアです
    // コンポーネントを取り外したとき
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... クリックに対する反応 ...
    }
  }
}
```

</div>
