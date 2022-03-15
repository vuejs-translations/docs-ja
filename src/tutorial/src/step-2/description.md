# 宣言的レンダリング

<div class="sfc">

エディターに表示されているのは、Vue Single File Component (SFC) です。SFC は再利用可能な自己完結型のコードブロックであり、一緒に属する HTML、CSS、JavaScript をカプセル化して `.vue` ファイル内に記述します。

</div>

Vue の中核となる機能は**宣言的レンダリング**です。HTML を拡張したテンプレート構文を用いて、JavaScript の状態に基づいて HTML がどのように見えるかを記述することができます。状態が変更されると、HTML は自動的に更新されます。

<div class="composition-api">

変更されたときに更新のトリガーとなるような状態は**リアクティブ**とみなされます。Vue の `reactive()` API を使用してリアクティブな状態を宣言することができます。`reactive()` で生成されるオブジェクトは JavaScript の [プロキシ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy) であり、通常のオブジェクトと同様に動作します:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 1
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` はオブジェクト（配列や `Map` や `Set` のような組み込み型も含む）に対してのみ動作します。一方、`ref()` は、任意の値の型を取り、`.value` プロパティの下で内部の値を公開するオブジェクトを作成することができます:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

`reactive()` と `ref()` の詳細については、<a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">ガイド - リアクティビティの基礎</a>で説明します。

<div class="sfc">

コンポーネントの `<script setup>` ブロックで宣言されたリアクティブステートはテンプレートで直接使用することができます。このようにして、mustaches 構文を使い、 `state` オブジェクトと `message` ref の値に基づいて動的なテキストをレンダリングすることができます:

</div>

<div class="html">

`createApp()` に渡されるオブジェクトは Vue のコンポーネントです。コンポーネントの状態は、その `setup()` 関数内で宣言され、オブジェクトを使用して返される必要があります:

```js{2,5}
setup() {
  const state = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    state,
    message
  }
}
```

返されたオブジェクトのプロパティはテンプレートで利用できるようになります。このようにして、mustaches 構文を使い、 `message` の値に基づいて動的なテキストをレンダリングすることができます:

</div>

```vue-html
<h1>{{ message }}</h1>
<p>count is: {{ counter.count }}</p>
```

テンプレートで `message` ref にアクセスする際、`.value` を使用する必要がないことに注意してください。自動的にアンラップされ、より簡潔な使い方ができます。

</div>

<div class="options-api">

変更されたときに更新のトリガーとなるような状態は**リアクティブ**とみなされます。Vue では、リアクティブステートはコンポーネントに保持されます。例のコードでは、`createApp()` に渡されるオブジェクトがコンポーネントになっています。

`data` コンポーネントオプションを使ってリアクティブステートを宣言することができますが、これはオブジェクトを返す関数であるべきです。

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

`message` プロパティはテンプレート内で使用可能です。このように、 mustaches 構文を使い、 `message` の値に基づいた動的なテキストをレンダリングすることができます。

```vue-html
<h1>{{ message }}</h1>
```

</div>

mustaches の内側の内容は識別子やパスに限られません。有効な JavaScript の式であれば何でも使うことができます:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

では、自分でリアクティブステートを作成し、それを使ってテンプレートの `<h1>` に動的なテキストコンテンツをレンダリングしてみましょう。

</div>

<div class="options-api">

では、自分でデータプロパティを作成して、テンプレート内の `<h1>` のテキストコンテンツとして使ってみてください。

</div>
