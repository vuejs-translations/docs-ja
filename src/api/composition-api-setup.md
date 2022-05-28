# Composition API: setup()

:::info Note
このページでは、`setup` コンポーネントオプションの使用方法を説明します。単一ファイルコンポーネントで Composition API を使用する場合は、より簡潔で人間工学的な構文である [`<script setup>`](/api/sfc-script-setup.html) を使用することを推奨します。
:::

`setup()` フックは、次のような場合にコンポーネントで Composition API を使用するのためのエントリーポイントとして機能します:

1. ビルドステップなしでの Composition API の使用
2. Options API コンポーネント内の Composition API に基づくコードの統合

## 基本的な使い方

[リアクティビティ API](./reactivity-core.html) を使ってリアクティブな状態を宣言したり、`setup()` からオブジェクトを返すことによってそれらを公開することができます。返されたオブジェクトのプロパティは、コンポーネントインスタンス上でも利用することができます (他のオプションが使用されている場合):

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

`setup` から返された [refs](/api/reactivity-core.html#ref) は、テンプレート内でアクセスされたときに[自動的に浅くアンラップされる](/guide/essentials/reactivity-fundamentals.html#ディープなリアクティビティ)ため、テンプレート内で `.value` を使用する必要はないことに注意してください。また、`this` でアクセスしたときも同様にアンラップされます。

:::tip
`setup()` 自体はコンポーネントインスタンスにアクセスできません。- `this` は `setup()` 内では `undefined` 値を持ちます。Options API から Composition API で公開された値にアクセスすることができますが、その逆はできません。
:::

## Props へのアクセス

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

もし、`props` オブジェクトを分割代入する場合は、分割代入された変数はリアクティビティを失うことに注意してください。 そのため、常に `props.xxx` の形で props にアクセスすることを推奨します。

もし、本当に props を分割代入すること、もしくはリアクティビティを保持しながら外部の関数に渡すことが必要なら、 ユーティリティー APIs である [toRefs()](./reactivity-utilities.html#torefs) や [toRef()](/api/reactivity-utilities.html#toref) を使用することで、行うことができます:

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

## Setup Context

`setup` 関数へ渡される第 2 引数は **Setup Context** オブジェクトです。context オブジェクトは `setup` 内で便利と思われる他の値を公開します:

```js
export default {
  setup(props, context) {
    // Attributes (非リアクティブオブジェクト、$attrs と同等です)
    console.log(context.attrs)

    // Slots (非リアクティブオブジェクト、$slots と同等です)
    console.log(context.slots)

    // Emit events (関数、$emit と同等です)
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

### パブリックプロパティの公開

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

## Render 関数での使用

`setup` は同じスコープで宣言されたリアクティブなステートを直接利用することができる [render 関数](/guide/extras/render-function.html)を返すこともできます:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

render 関数を返すことで、他のものを返すことができなくなります。内部的には問題ありませんが、このコンポーネントのメソッドをテンプレート参照から親コンポーネントに公開したい場合には、問題となります。

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
