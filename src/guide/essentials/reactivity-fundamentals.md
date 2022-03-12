---
outline: deep
---

# リアクティビティの基礎

:::tip API の参照
このページと、当ガイドの多くの章では、Options API と Composition API で異なる内容が含まれています。現在の設定は <span class="options-api">Options API</span> <span class="composition-api">Composition API</span> です。左サイドバーの上部にある「API の参照」スイッチで、API スタイルを切り替えることができます。
:::

## リアクティブな状態を宣言する

<div class="options-api">

Options API では、`data` オプションを使用して、コンポーネントのリアクティブな状態を宣言します。オプションの値は、オブジェクトを返す関数でなければなりません。Vue は、新しいコンポーネントのインスタンスを作成するときにこの関数を呼び出し、返されたオブジェクトをリアクティブシステムでラップします。このオブジェクトのトップレベルのプロパティは、コンポーネントのインスタンス（メソッドやライフサイクルフックでは `this`）にプロキシされます：

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

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDFcbiAgICB9XG4gIH0sXG5cbiAgLy8gYG1vdW50ZWRgIGlzIGEgbGlmZWN5Y2xlIGhvb2sgd2hpY2ggd2Ugd2lsbCBleHBsYWluIGxhdGVyXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gYHRoaXNgIHJlZmVycyB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIGNvbnNvbGUubG9nKHRoaXMuY291bnQpIC8vID0+IDFcblxuICAgIC8vIGRhdGEgY2FuIGJlIG11dGF0ZWQgYXMgd2VsbFxuICAgIHRoaXMuY291bnQgPSAyXG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIENvdW50IGlzOiB7eyBjb3VudCB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

これらインスタンスのプロパティは、インスタンスが最初に作成されたときにのみ追加されます。したがって、 `data` 関数が返すオブジェクトにこれらのプロパティが全て存在していることを確認する必要があります。必要であれば、 `null` や `undefined` などのプレースホルダーを使用して、まだ利用できない値をプロパティとして指定します。

新しいプロパティを `data` に含めず、直接 `this` に追加することも可能です。しかし、この方法で追加されたプロパティは、リアクティブな更新をトリガーすることができません。

Vue は、コンポーネントのインスタンスを介して自身の組み込み API を公開する際に、接頭辞として `$` を使用します。また、内部プロパティには `_` という接頭辞を予約します。トップレベルの `data` プロパティには、これらの文字で始まる名前を使用しないでください。

### リアクティブプロキシ vs. 独自 \*

Vue 3 では、[JavaScript プロキシ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) を活用することで、データをリアクティブにすることができます。Vue 2 から来たユーザーは、以下のエッジケースに注意する必要があります：

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

リアクティブなオブジェクトや配列を作るには、[`reactive()`](/api/reactivity-core.html#reactive) 関数を使用します。

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

リアクティブなオブジェクトは [JavaScript プロキシ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) で、通常のオブジェクトと同じように振る舞います。違いは、Vue がリアクティブなオブジェクトのプロパティアクセスと変更を追跡できることです。詳細については、[Reactivity in Depth](/guide/extras/reactivity-in-depth.html) で Vue のリアクティブシステムの仕組みを説明していますが、このメインガイドを読み終えた後に読むことをお勧めします。

こちらもご参照ください。[Typing Reactive](/guide/typescript/composition-api.html#typing-reactive) <sup class="vt-badge ts" />。

コンポーネントのテンプレートでリアクティブな状態を使うには、下記に示すように、コンポーネントの `setup()` 関数で宣言し、それを返します：

```js{5,9-11}
import { reactive } from 'vue'

export default {
  // `setup` 関数は、Composition API 専用の特別なフックです。
  setup() {
    const state = reactive({ count: 0 })

    // 状態をテンプレートに公開します
    return {
      state
    }
  }
}
```

```vue-html
<div>{{ state.count }}</div>
```

同様に、リアクティブな状態を変化させる関数を同じスコープで宣言し、状態と並行してメソッドとして公開することができます：

```js{7-9,14}
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 関数も公開することを忘れないでください。
    return {
      state,
      increment
    }
  }
}
```

通常、公開されたメソッドはイベントリスナーとして使用されます。

```vue-html
<button @click="increment">
  {{ state.count }}
</button>
```

### `<script setup>` \*\*

`setup()` 関数を使って手動で状態やメソッドを公開すると、冗長になることがあります。幸いなことに、これはビルドステップを使用しない場合にのみ必要です。単一ファイルコンポーネント (SFC) を使用する場合は、 `<script setup>` を使用することで大幅に簡略化することができます。

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHsgY291bnQ6IDAgfSlcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBzdGF0ZS5jb3VudCsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPlxuICAgIHt7IHN0YXRlLmNvdW50IH19XG4gIDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

トップレベルのインポートと `<script setup>` で宣言された変数は、同じコンポーネントのテンプレートで自動的に使用できるようになります。

> 当ページ残りの部分では、Composition API のコード例として主に SFC + `<script setup>` という構文を使用します。

</div>

<div class="options-api">

## メソッドの宣言 \*

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Vue School の無料動画レッスン"/>

コンポーネントのインスタンスにメソッドを追加するには、 `methods` オプションを使用します。これは、必要なメソッドを含むオブジェクトでなければなりません：

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

コンポーネントのインスタンスに属する他のプロパティと同じく、`methods` はコンポーネントのテンプレート内からアクセスすることができます。テンプレートの中では、イベントリスナーとして一般的に使用されます：

```vue-html
<button @click="increment">{{ count }}</button>
```

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbmNyZW1lbnQoKSB7XG4gICAgICB0aGlzLmNvdW50KytcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnQoKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

上記の例では、`<button>` がクリックされたときに `increment` というメソッドが呼び出されます。

</div>

### DOM 更新のタイミング

リアクティブな状態を変化させると、DOM は自動的に更新されます。しかし、DOM の更新は同期的に適用されないことに注意する必要があります。その代わりに Vue は、更新サイクルの「next tick」まで更新をバッファリングし、どれだけ状態を変化させても、各コンポーネントは一度だけ更新する必要があることを保証しています。

状態変化後の DOM 更新が完了するのを待つため、[nextTick()](/api/general.html#nexttick) というグローバル API を使用することができます：

<div class="composition-api">

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // DOM 更新にアクセスします
  })
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // DOM 更新にアクセスします
      })
    }
  }
}
```

</div>

### ディープなリアクティビティ

Vue では、デフォルトで状態がリアクティブになっています。つまり、ネストしたオブジェクトや配列を変化させた場合でも、変更が検出されることが期待できます：

<div class="options-api">

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

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // これらは期待通りに動作します。
  obj.nested.count++
  obj.arr.push('baz')
}
```

</div>

また、ルートレベルでのみリアクティビティを追跡する [shallow reactive object](/api/reactivity-advanced.html#shallowreactive) を明示的に作成することも可能ですが、これらは一般的に高度な使用例においてのみ必要とされるものとなります。

<div class="composition-api">

### リアクティブプロキシ vs. 独自 \*\*

注意すべきは、`reactive()` の戻り値が、元のオブジェクトの [プロキシ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) であり、元のオブジェクトと等しくないということです：

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

このルールは、ネストされたオブジェクトにも適用されます。深いリアクティビティを持つため、リアクティブなオブジェクトの中にあるネストされたオブジェクトもプロキシとなります。

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()` の制限 \*\*

`reactive()` API には 2 つの制限があります：

1. オブジェクト型 (オブジェクト、配列、および `Map` や `Set` などの [コレクション型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections)) に対してのみ機能します。文字列、数値、ブールなどの [プリミティブ型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) を保持することはできません。

2. Vue のリアクティビティ追跡はプロパティアクセス上で動作するため、リアクティブなオブジェクトへの参照を常に同じに保つ必要があります。つまり、リアクティブなオブジェクトを簡単に「置き換える」ことができません。

   ```js
   let state = reactive({ count: 0 })

   // これは動きません！
   state = reactive({ count: 1 })
   ```

   また、リアクティブなオブジェクトのプロパティをローカル変数に代入したり、分割代入したり、そのプロパティを関数に渡したりすると、下記に示すようにリアクティブなつながりが失われることとなります：

   ```js
   const state = reactive({ count: 0 })

   // n は切り離されたローカル変数
   // を state.count から取得します。
   let n = state.count
   // 元の状態に戻りません。
   n++

   // count も state.count と切り離されます。
   let { count } = state
   // 元の状態に戻りません。
   count++

   // この関数が受け取る平文番号と
   // state.count の変更を追跡することができません。
   callSomeFunction(state.count)
   ```

## `ref()` と共に使うリアクティブな変数 \*\*

Vue は、`reactive()` の制限に対処するため、[`ref()`](/api/reactivity-core.html#ref) という関数も提供しており、任意の値の型を保持できるリアクティブな **"refs "** を作成することができます：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` は引数を受け取り、それを `.value` プロパティを持つ ref オブジェクトにラップして返します。

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

こちらもご覧ください。[Typing Refs](/guide/typescript/composition-api.html#typing-ref) <sup class="vt-badge ts" />。

リアクティブなオブジェクトのプロパティと同様に、ref の `.value` プロパティはリアクティブとなります。また、オブジェクト型を保持する場合、ref は `.value` を `reactive()` で自動的に変換します。

オブジェクトの値を含む ref は、オブジェクト全体をリアクティブに置き換えることができます：

```js
const objectRef = ref({ count: 0 })

// これはリアクティブに動きます。
objectRef.value = { count: 1 }
```

また、Ref を関数に渡したり、プレーンオブジェクトから分解したりしても、リアクティビティが失われることはありません。

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// ref を受け取るこの関数は、
// .value を介して値にアクセスする必要がありますが、それは
// リアクティビティを保持します。
callSomeFunction(obj.foo)

// リアクティビティを保持しています。
const { foo, bar } = obj
```

つまり、`ref()` を使うと、任意の値への「参照」を作り、リアクティビティを失わずに受け渡しすることができます。この能力は、ロジックを [Composable Functions](/guide/reusability/composables.html) に抽出する際に頻繁に使用されるため、非常に重要となります。

### Ref Unwrapping in Templates \*\*

ref がテンプレートのトップレベルのプロパティとしてアクセスされた場合、それらは自動的に「アンラップ」されるので、`.value` を使用する必要はありません。以下は、先ほどのカウンターの例で、代わりに `ref()` を使用したものとなります。

```vue{13}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- .value は必要ありません -->
  </button>
</template>
```

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnQgPSByZWYoMClcblxuZnVuY3Rpb24gaW5jcmVtZW50KCkge1xuICBjb3VudC52YWx1ZSsrXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPnt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

アンラップは、ref がテンプレートに描画されるコンテキスト上のトップレベルのプロパティである場合にのみ適用されることに注意してください。例として `foo` はトップレベルのプロパティですが、`object.foo` はトップレベルではありません。

そこで、下記に示したようなオブジェクトが与えられた：

```js
const object = { foo: ref(1) }
```

下記に示した式は、期待通りに動作 **しません** ：

```vue-html
{{ object.foo + 1 }}
```

レンダリング結果は `[object Object]1` となります。これは `object.foo` が ref オブジェクトであるためです。これを解決するには、下記に示すように `foo` をトップレベルのプロパティにします：

```js
const { foo } = object
```

```vue-html
{{ foo + 1 }}
```

これで、レンダリング結果は「2」になります。

注意点としては、ref がテキスト補間の最終評価値（つまり <code v-pre>{{ }}</code> タグ）である場合もアンラップされるので、以下のように `1` がレンダリングされます。

```vue-html
{{ object.foo }}
```

これはテキスト補間の便利な機能に過ぎず、 <code v-pre>{{ object.foo.value }}</code> と等価になります。

### リアクティブなオブジェクトにおける Ref のアンラッピング \*\*

リアクティブなオブジェクトのプロパティとして `ref` にアクセスしたり変化させたりすると、自動的にアンラップされるので、通常のプロパティと同じように振る舞うことができます。

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

既存の ref にリンクされたプロパティに新しい ref が割り当てられた場合、下記に示すように、それは古い ref を置き換えることとなります：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 元の ref は state.count から切り離されました。
console.log(count.value) // 1
```

Ref のアンラッピングは、より深いリアクティブなオブジェクトの内部にネストされている場合にのみ発生します。[浅いリアクティブなオブジェクト](/api/reactivity-advanced.html#shallowreactive) のプロパティとしてアクセスされた場合は適用されません。

#### 配列とコレクションにおける Ref のアンラッピング

リアクティブなオブジェクトと異なり、ref がリアクティブな配列の要素や、`Map` のようなネイティブコレクション型としてアクセスされた場合には、アンラップは行われません。

```js
const books = reactive([ref('Vue 3 Guide')])
// ここでは .value が必要となります
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// ここでは .value が必要となります
console.log(map.get('count').value)
```

</div>

<div class="options-api">

### ステートフルなメソッド \*

場合によっては、デバウンスされたイベントハンドラーを作成するなど、下記に示すように、動的にメソッド関数を作成する必要があります：

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

各コンポーネントのインスタンスのデバウンスされた関数を他から独立させるために、 `created` ライフサイクルフックでデバウンスされたバージョンを作成することができます。

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

<div class="composition-api">

## リアクティビティ変換 <sup class="vt-badge experimental" /> \*\*

Ref で `.value` を使わなければならないのは、JavaScript の言語的な制約による欠点です。しかし、コンパイル時の変換 (ここでいうコンパイル時とは SFC を JavaScript コードへ変換する時) を利用すれば、適切な場所に自動的に `.value` を追加して人間工学を改善することができます。Vue はコンパイル時の変換を提供しており、先ほどの「カウンター」の例をこのように記述することができます。

```vue
<script setup>
let count = $ref(0)

function increment() {
  // ここでは .value が不要です
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

[リアクティビティ変換](/guide/extras/reactivity-transform.html) の詳細については、専用のセクションで説明されています。ただし、現在はまだ実験的なものであり、最終的に完成するまでに変更される可能性があることに注意してください。

</div>
