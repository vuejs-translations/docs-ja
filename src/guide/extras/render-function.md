---
outline: deep
---

# Render 関数と JSX

Vue は、ほとんどの場合、アプリケーションを構築するためにテンプレートを使用することを推奨しています。しかし、JavaScript の完全なプログラムの力が必要な状況もあります。そこで、**render 関数** を使用します。

> 仮想 DOM や render 関数の概念に初めて触れる方は、まず[レンダリングの仕組み](/guide/extras/rendering-mechanism.html)の章を必ずお読みください。

## 基本的な使い方

### vnode の作成

Vue は、vnode を作成するための `h()` 関数を提供しています:

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

`h()` 関数は **hyperscript** の略で、「HTML (hypertext markup language) を生成する JavaScript」という意味です。この名前は、多くの仮想 DOM 実装で共有されている慣習を継承しています。より分かりやすい名前としては `createVnode()` がありますが、render 関数の中でこの関数を何度も呼び出さなければならない場合には、短い名前の方が便利です。

`h()` 関数は非常に柔軟に設計されています。

```js
// type 以外のすべての引数はオプションです
h('div')
h('div', { id: 'foo' })

// 属性とプロパティの両方が props で使用できます
// Vue は自動的に正しい割り当て方法を選択します
h('div', { class: 'bar', innerHTML: 'hello' })

// .prop や .attr などの props 修飾子には、
// それぞれ '.' と `^' という接頭辞を付けることができます
h('div', { '.name': 'some-name', '^width': '100' })

// class と style は、
// テンプレートと同じオブジェクト / 配列 の値をサポートしています
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// イベントリスナーは onXxx として渡す必要があります
h('div', { onClick: () => {} })

// children は文字列です
h('div', { id: 'foo' }, 'hello')

// props がない場合は省略可能です
h('div', 'hello')
h('div', [h('span', 'hello')])

// 子供の配列は、vnodes と文字列を混在させることができます
h('div', ['hello', h('span', 'hello')])
```

出来上がった vnode は以下のようになります:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning 備考
完全な `VNode` インターフェースは他にも多くの内部プロパティを含んでいますが、ここに挙げた以外のプロパティに依存しないことを強く推奨します。これにより、内部プロパティが変更された場合に意図しない破損を避けることができます。
:::

### Render 関数の宣言

<div class="composition-api">

Composition API でテンプレートを使用する場合、`setup()` フックの戻り値はテンプレートにデータを公開するために使用されます。しかし、render 関数を使う場合は、代わりに render 関数を直接返すことができます:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // render 関数を返します
    return () => h('div', props.msg + count.value)
  }
}
```

render 関数は `setup()` の内部で宣言されているので、当然同じスコープで宣言された props やリアクティブなステートにアクセスすることができます。

単一の vnode を返すだけでなく、文字列や配列を返すこともできます:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // 複数のルートノードを返すために配列を使用します。
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
値を直接返すのではなく、必ず関数を返すようにしましょう！ `setup()` 関数はコンポーネントごとに一度だけ呼び出されますが、返される render 関数は複数回呼び出されることになります。
:::

</div>
<div class="options-api">

render 関数は `render` オプションで宣言することができます:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

`render()` 関数は、`this` を介してコンポーネントのインスタンスにアクセスできます。

単一の vnode を返すだけでなく、文字列や配列を返すこともできます:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // 複数のルートノードを返すために配列を使用します。
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

render 関数のコンポーネントがインスタンスの状態を必要としない場合、簡潔にするために、直接関数として宣言することもできます:

```js
function Hello() {
  return 'hello world!'
}
```

そうです、これは有効な Vue コンポーネントなのです！この構文の詳細については、[関数型コンポーネント](#関数型コンポーネント) を参照してください。

### Vnode は一意でなければならない

コンポーネントツリー内のすべての vnode は一意でなければなりません。つまり、以下の render 関数は無効です:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // おっと - VNode が重複しています!
    p,
    p
  ])
}
```

どうしても同じ要素／コンポーネントを何度も複製したい場合は、ファクトリー関数を使用します。例えば、以下の render 関数は、20 個の同じ段落をレンダリングする方法として完全に有効です:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX

[JSX](https://facebook.github.io/jsx/) は、JavaScript の XML 的な拡張機能で、こんなコードを書くことができるようになります:

```jsx
const vnode = <div>hello</div>
```

JSX 式の内部では、中括弧を使用して動的な値を埋め込みます:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` と Vue CLI には、JSX のサポートが事前に設定されたプロジェクトをスキャフォールドするためのオプションがあります。JSX を手動で設定する場合は、[`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) のドキュメントを参照すると詳細が分かるでしょう。

React によって最初に導入されましたが、JSX は実際にはランタイムセマンティクスが定義されておらず、様々な異なる出力にコンパイルすることができます。JSX を扱ったことがある場合、**Vue JSX 変換は React の JSX 変換とは異なる** ので、Vue アプリケーションで React の JSX 変換を使用することはできないことに注意してください。React の JSX との顕著な違いとしては、以下のようなものがあります:

- `class` や `for` などの HTML 属性を props として使用できます - `className` や `htmlFor` を使用する必要はありません。
- コンポーネントへの子要素の渡し方（スロットなど）が[異なります](#スロットの渡し方)。

Vue の型定義は、TSX を使用するための型推論も提供します。TSX を使用する場合は、Vue の JSX 変換が処理できるように、TypeScript が JSX の構文をそのまま残すように、必ず `tsconfig.json` で `"jsx": "preserve"` を指定してください。

## Render 関数のレシピ

以下では、テンプレート機能を同等の render 関数/JSX として実装するための一般的なレシピをいくつか紹介します。

### `v-if`

Template:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

同等の render 関数／JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for`

Template:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

同等の render 関数／JSX:

<div class="composition-api">

```js
h(
  'ul',
  // `items` が配列の値を持つ ref であると仮定する
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on`

`on` で始まり、大文字が続く名前の props は、イベントリスナーとして扱われます。例えば、 `onClick` はテンプレートでは `@click` に相当します。

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  click me
</button>
```

#### イベント修飾子

イベント修飾子 `.passive`, `.capture`, `.once` については、イベント名の後にキャメルケースを用いて連結して記述することが可能です。

例えば:

```js
h('input', {
  onClickCapture() {
    /* キャプチャモード時のリスナー */
  },
  onKeyupOnce() {
    /* 一度だけトリガーする */
  },
  onMouseoverOnceCapture() {
    /* 一度だけ + キャプチャ */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

その他のイベントやキー修飾子については、[`withModifiers`](/api/render-function.html#withmodifiers) ヘルパーを使用することが可能です:

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Components

コンポーネント用の vnode を作成するには、`h()` に渡される最初の引数はコンポーネントの定義でなければなりません。つまり、render 関数を使う場合、コンポーネントを登録する必要はなく、インポートされたコンポーネントを直接使えばいいのです:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

このように、`h` は有効な Vue コンポーネントであれば、どんなファイルフォーマットからインポートしたコンポーネントでも動作させることができます。

動的なコンポーネントは、render 関数を使えば簡単です:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

コンポーネントが名前で登録されていて直接インポートできない場合 (例えば、ライブラリーによってグローバルに登録されている場合)、 [`resolveComponent()`](/api/render-function.html#resolvecomponent) ヘルパーを使ってプログラムで解決することが可能です。

### レンダリングスロット

<div class="composition-api">

render 関数では、スロットは `setup()` コンテキストからアクセスすることができます。`slots` オブジェクトの各スロットは、**vnode の配列を返す関数** です:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // デフォルトスロット:
      // <div><slot /></div>
      h('div', slots.default()),

      // 名前付きスロット:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

同等の JSX:

```jsx
// デフォルト
<div>{slots.default()}</div>

// 名前付き
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

render 関数では、スロットは [`this.$slots`](/api/component-instance.html#slots) からアクセスすることができます。

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

同等の JSX:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### スロットの渡し方

コンポーネントへの子の渡し方は、要素への子の渡し方と少し異なります。配列の代わりに、スロット関数か、スロット関数のオブジェクトを渡す必要があります。スロット関数は、通常の render 関数が返せるものなら何でも返せますが、子コンポーネントでアクセスするときは、常に vnode の配列に正規化されます。

```js
// 単一のデフォルトスロット
h(MyComponent, () => 'hello')

// 名前付きスロット
// スロットのオブジェクトが props として扱われるのを避けるために、
// `null` が必要であることに注意してください。
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

同等の JSX:

```jsx
// デフォルト
<MyComponent>{() => 'hello'}</MyComponent>

// 名前付き
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

スロットを関数として渡すことで、子コンポーネントがスロットを遅延的に呼び出すことができます。これにより、スロットの依存関係が親ではなく子によって追跡されるようになり、より正確で効率的な更新が行われるようになります。

### 組み込みコンポーネント

render 関数で使用するためには、`<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>`, `<Suspense>` などの [組み込みコンポーネント](/api/built-in-components.html) をインポートする必要があります。

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model`

`v-model` ディレクティブは、テンプレートのコンパイル時に `modelValue` と `onUpdate:modelValue` プロパティに展開されます:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### カスタムディレクティブ

カスタムディレクティブは、[`withDirectives`](/api/render-function.html#withdirectives)を使って vnode に適用することが可能です:

```js
import { h, withDirectives } from 'vue'

// カスタムディレクティブ
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

ディレクティブが名前で登録されていて、直接インポートできない場合は、[`resolveDirective`](/api/render-function.html#resolvedirective) ヘルパーを使って解決することが可能です。

## 関数型コンポーネント

関数型コンポーネントは、それ自身の状態を持たないコンポーネントの代替形態です。それらは純粋な関数のように動作します。 props を受け取り、vnodes を返します。 コンポーネントのインスタンスを作成することなく（つまり、`this` はありません）、通常のコンポーネントのライフサイクルフックもなくレンダリングされます。

関数型コンポーネントを作成するには、オプションオブジェクトではなく、単純な関数を使用します。この関数は事実上、コンポーネントの `render` 関数です。

<div class="composition-api">

関数型コンポーネントのシグネチャは `setup()` フックと同じです:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

関数型コンポーネントに `this` という参照はないので、Vue は最初の引数として `props` を渡します。

```js
function MyComponent(props, context) {
  // ...
}
```

第二引数の `context` には、3 つのプロパティが含まれます。 `attrs` , `emit` , そして `slots` です。これらはそれぞれ、インスタンスのプロパティである [`$attrs`](/api/component-instance.html#attrs), [`$emit`](/api/component-instance.html#emit), および [`$slots`](/api/component-instance.html#slots) と同じです。

</div>

コンポーネントに対する通常の設定オプションのほとんどは、関数型コンポーネントでは使用できません。しかし、[`props`](/api/options-state.html#props) と [`emits`](/api/options-state.html#emits) はプロパティとして追加することで定義することが可能です。

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

`props` オプションが指定されていない場合、関数に渡される `props` オブジェクトには、`attrs` と同じようにすべての属性が含まれます。`props` オプションが指定されない限り、prop の名前はキャメルケースに正規化されません。

関数型コンポーネントは、通常のコンポーネントと同様に登録や消費を行うことができます。もし、`h()` の第一引数に関数を渡した場合、それは関数型コンポーネントとして扱われます。
