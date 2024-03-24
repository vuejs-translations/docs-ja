# カスタムディレクティブ {#custom-directives}

<script setup>
const vFocus = {
  mounted: el => {
    el.focus()
  }
}
</script>

## はじめに {#introduction}

コアに設定されているデフォルトのディレクティブのセット（`v-model` や `v-show` など）に加え、Vue では独自のカスタムディレクティブを登録することができます。

Vue におけるコードの再利用として 2 つの方法を紹介してきました:[コンポーネント](/guide/essentials/component-basics)と[コンポーザブル](./composables)です。コンポーネントはメインブロックの構築、コンポーザブルはステートフルなロジックの再利用に重点を置いています。一方、カスタムディレクティブは主にプレーンな要素に対する低レベルの DOM アクセスを伴うロジックを再利用することを目的としています。

カスタムディレクティブは、コンポーネントと同様のライフサイクルフックを含むオブジェクトとして定義されます。フックは、ディレクティブがバインドされている要素を受け取ります。以下は Vue によって要素が DOM に挿入されたときに入力欄にフォーカスするディレクティブの例です:

<div class="composition-api">

```vue
<script setup>
// テンプレート内で v-focus が有効になります
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // テンプレート内で v-focus が有効になります
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

<div class="demo">
  <input v-focus placeholder="This should be focused" />
</div>

ページの他の場所をクリックしていないと仮定すると、上の入力欄は自動的にフォーカスされるはずです。このディレクティブはページロード時だけでなく、Vue によって要素が動的に挿入されたときにも機能するため、`autofocus` 属性よりも便利です。

<div class="composition-api">

`<script setup>` では、接頭辞が `v` で始まるキャメルケースの変数をカスタムディレクティブとして使用することができます。上の例では、`vFocus` はテンプレート内で `v-focus` として使用できます。

`<script setup>` を使用しない場合、カスタムディレクティブは `directives` オプションを使用して登録することができます:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // テンプレート内で v-focus が有効になります
    focus: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

コンポーネントと同様に、カスタムディレクティブもテンプレートで使用できるように登録する必要があります。上の例では、 `directives` オプションを使用してローカル登録しています。

</div>

また、カスタムディレクティブをアプリケーションレベルでグローバル登録することもよくあります:

```js
const app = createApp({})

// 全てのコンポーネントで v-focus が使用可能
app.directive('focus', {
  /* ... */
})
```

:::tip
カスタムディレクティブは DOM を直接操作することでしか必要な機能を実現できない場合にのみ使用してください。`v-bind` のような組み込みディレクティブを使用した宣言的なテンプレートは、効率的かつサーバーレンダリングフレンドリーです。可能なかぎり組み込みディレクティブを使用することをおすすめします。
:::

## ディレクティブフック {#directive-hooks}

ディレクティブ定義オブジェクトは、いくつかのフック関数（すべて任意です）を提供することができます:

```js
const myDirective = {
  // バインドされた要素の属性や
  // イベントリスナーが適用される前に呼ばれます
  created(el, binding, vnode, prevVnode) {
    // 引数の詳細については下を参照してください
  },
  // 要素が DOM に挿入される直前に呼ばれます
  beforeMount(el, binding, vnode, prevVnode) {},
  // バインドされた要素の親コンポーネントと
  // そのすべての子要素がマウントされたときに呼び出されます
  mounted(el, binding, vnode, prevVnode) {},
  // 親コンポーネントが更新される前に呼ばれます
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 親コンポーネントとすべての子要素が
  // 更新された後に呼ばれます
  updated(el, binding, vnode, prevVnode) {},
  // 親コンポーネントがアンマウントされる前に呼ばれます
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 親コンポーネントのアンマウント時に呼ばれます
  unmounted(el, binding, vnode, prevVnode) {}
}
```

### フックの引数 {#hook-arguments}

ディレクティブフックには以下の引数が渡されます:

- `el`: ディレクティブがバインドされている要素。DOM を直接操作するために使用されます。

- `binding`: 以下のプロパティを含むオブジェクト。

  - `value`: ディレクティブに渡される値。例えば `v-my-directive="1 + 1"` の場合、値は `2` となります。
  - `oldValue`: 更新前の値。 `beforeUpdate` と `updated` でのみ利用可能です。値が変更されているかどうかに関係なく利用できます。
  - `arg`: ディレクティブに渡される引数がある場合に存在する引数。例えば `v-my-directive:foo` の場合、引数は `"foo"` となります。
  - `modifiers`: 修飾子がある時に、それを含むオブジェクト。例えば `v-my-directive.foo.bar` の場合、修飾子オブジェクトは `{ foo: true, bar: true }` となります。
  - `instance`: ディレクティブが使用されるコンポーネントのインスタンス。
  - `dir`: ディレクティブ定義オブジェクト。

- `vnode`: バインドされた要素を表す基礎となる VNode。
- `prevVnode`: 前のレンダリングからバインドされた要素を表す VNode。`beforeUpdate` と `updated` フックでのみ利用可能です。

例として、次のようなディレクティブの使い方を考えてみましょう:

```vue-html
<div v-example:foo.bar="baz">
```

引数 `binding` は以下のような構造のオブジェクトになります:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` の値 */,
  oldValue: /* 前回の更新による `baz` の値 */
}
```

組み込みのディレクティブと同様に、カスタムディレクティブの引数も動的にできます。例えば:

```vue-html
<div v-example:[arg]="value"></div>
```

ここでは、ディレクティブの引数は、コンポーネントの状態にある `arg` プロパティに基づいてリアクティブに更新されます。

:::tip 注意
`el` 以外のディレクティブの引数は、読み取り専用として扱い、決して変更しないようにしましょう。フック間で情報を共有する必要がある場合は、要素の [dataset](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/dataset) を通して行うことを推奨します。
:::

## 関数のショートハンド {#function-shorthand}

よくあることとして、カスタムディレクティブが `mounted` と `updated` に対して同じ動作をさせ、他のフックを必要としないことがあります。このような場合、ディレクティブを関数として定義することができます:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // `mounted` と `updated` の両方で呼ばれます
  el.style.color = binding.value
})
```

## オブジェクトリテラル {#object-literals}

ディレクティブが複数の値を必要とする場合、JavaScript のオブジェクトリテラルを渡すこともできます。ディレクティブは有効な JavaScript の式はなんでも引き受けられることを覚えておきましょう。

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## コンポーネントでの使い方 {#usage-on-components}

コンポーネントで使用すると、[フォールスルー属性](/guide/components/attrs)と同様にカスタムディレクティブは常にコンポーネントのルートノードに適用されます。

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- template of MyComponent -->

<div> <!-- v-demo directive will be applied here -->
  <span>My component content</span>
</div>
```

コンポーネントは潜在的に複数のルートノードを持つ可能性があることに注意してください。複数のルートを持つコンポーネントに適用された場合、ディレクティブは無視され、警告が投げられます。属性とは異なり、ディレクティブは `v-bind="$attrs"` で別の要素に渡すことができません。一般に、カスタムディレクティブをコンポーネントで使用することはお勧め**しません**。
