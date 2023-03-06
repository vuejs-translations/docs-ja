# Composition API: setup() {#composition-api-setup}

## 基本的な使い方 {#basic-usage}

`setup()` フックは、次のような場合にコンポーネントで Composition API を使用するのためのエントリーポイントとして機能します:

1. ビルドステップなしでの Composition API の使用
2. Options API コンポーネント内の Composition API に基づくコードの統合

:::info Note
単一ファイルコンポーネントで Composition API を使用する場合は、より簡潔で人間工学的な構文のために、[`<script setup>`](/api/sfc-script-setup) を強くお勧めします。
:::

[リアクティビティー API](./reactivity-core) を使ってリアクティブな状態を宣言したり、`setup()` からオブジェクトを返すことによってそれらを公開することができます。返されたオブジェクトのプロパティは、コンポーネントインスタンス上でも利用することができます (他のオプションが使用されている場合):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // テンプレートや他の options API フックを公開します
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

`setup` から返された [ref](/api/reactivity-core.html#ref) は、テンプレート内でアクセスされたときに[自動的に浅くアンラップされる](/guide/essentials/reactivity-fundamentals.html#deep-reactivity)ため、テンプレート内で `.value` を使用する必要はありません。また、`this` でアクセスしたときも同様にアンラップされます。

`setup()` 自体はコンポーネントインスタンスにアクセスできません。- `this` は `setup()` 内では `undefined` 値を持ちます。Options API から Composition API で公開された値にアクセスすることができますが、その逆はできません。

`setup()` は**同期的**にオブジェクトを返さなければなりません。`async setup()` が使用できるのは、そのコンポーネントが [Suspense](../guide/built-ins/suspense) コンポーネントの子孫であるときだけです。

## プロパティへのアクセス {#accessing-props}

`setup` 関数の第 1 引数は `props` 引数です。標準コンポーネントで期待するように、`setup` 関数内の `props` はリアクティブで、新しい `props` が渡されたら更新されます。

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

もし、`props` オブジェクトを分割代入する場合は、分割代入された変数はリアクティビティーを失うことに注意してください。 そのため、常に `props.xxx` の形でプロパティにアクセスすることを推奨します。

もし、本当にプロパティを分割代入すること、もしくはリアクティビティーを保持しながら外部の関数に渡すことが必要なら、 ユーティリティー API である [toRefs()](./reactivity-utilities.html#torefs) や [toRef()](/api/reactivity-utilities.html#toref) を使用することで、行うことができます:

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // `props` から refs オブジェクトへ変換し、分割代入を行います
    const { title } = toRefs(props)
    // `title` は `props.title` を追跡する ref です
    console.log(title.value)

    // もしくは、 `props` 内の単一プロパティから ref へ変換します
    const title = toRef(props, 'title')
  }
}
```

## Setup Context {#setup-context}

`setup` 関数へ渡される第 2 引数は **Setup Context** オブジェクトです。context オブジェクトは `setup` 内で便利と思われる他の値を公開します:

```js
export default {
  setup(props, context) {
    // 属性 (非リアクティブオブジェクト、$attrs と同等です)
    console.log(context.attrs)

    // スロット (非リアクティブオブジェクト、$slots と同等です)
    console.log(context.slots)

    // イベントの発行 (関数、$emit と同等です)
    console.log(context.emit)

    // パブリックプロパティの公開 (関数)
    console.log(context.expose)
  }
}
```

context オブジェクトはリアクティブではなく、安全に分割代入できます:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` と `slots` はステートフルなオブジェクトです。コンポーネント自身が更新されたとき、常に更新されます。つまり、分割代入の使用を避け、`attrs.x` や `slots.x` のようにプロパティを常に参照する必要があります。また、`props` とは異なり、`attrs` と `slots` のプロパティは **リアクティブではない** ということに注意してください。もし、`attrs` か `slots` の変更による副作用を適用したいのなら、`onBeforeUpdate` ライフサイクルフックの中で行うべきです。

### パブリックプロパティの公開 {#exposing-public-properties}

`expose` は、親コンポーネントから[テンプレート参照](/guide/essentials/template-refs.html#ref-on-component)でコンポーネントインスタンスにアクセスする際に、公開するプロパティを明示的に制限するために使用することができる関数です:

```js{5,10}
export default {
  setup(props, { expose }) {
    // インスタンスを"隠蔽"します -
    // つまり、 全てを親に公開しません
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // ローカルステートを選択的に公開します
    expose({ count: publicCount })
  }
}
```

## レンダー関数での使用 {#usage-with-render-functions}

`setup` は同じスコープで宣言されたリアクティブなステートを直接利用することができる [レンダー関数](/guide/extras/render-function)を返すこともできます:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

レンダー関数を返すことで、他のものを返すことができなくなります。内部的には問題ありませんが、このコンポーネントのメソッドをテンプレート参照から親コンポーネントに公開したい場合には、問題となります。

[`expose()`](#exposing-public-properties) を呼び出すことによって、この問題を解決することができます:

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

この `increment` メソッドは、親コンポーネントでテンプレート参照を介して利用可能になります。
