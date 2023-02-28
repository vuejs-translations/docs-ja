# レンダー関数 API {#render-function-apis}

## h() {#h}

仮想 DOM ノード（vnode）を作成します。

- **型**

  ```ts
  // 完全なシグネチャー
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // プロパティを省略する場合
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  第 1 引数には、文字列（ネイティブ要素の場合）または Vue コンポーネント定義を指定します。第 2 引数は渡されるプロパティで、第 3 引数は子要素です。

  コンポーネントの vnode を作成するとき、子要素はスロット関数として渡さなければなりません。コンポーネントがデフォルトのスロットのみを想定している場合、単一のスロット関数を渡すことができます。そうでない場合は、スロットはスロット関数のオブジェクトとして渡さなければなりません。

  便宜上、子要素が slot オブジェクトでない場合はプロパティ引数を省略できます。

- **例**

  ネイティブ要素を作成する:

  ```js
  import { h } from 'vue'

  // type 以外の引数は省略可能
  h('div')
  h('div', { id: 'foo' })

  // 第 2 引数は属性とプロパティの両方が使用可能
  // Vue は自動的に適切な方法で割り当てます
  h('div', { class: 'bar', innerHTML: 'hello' })

  // テンプレート内と同様、クラスとスタイルは
  // オブジェクトや配列の値をサポートしています
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // イベントリスナーは onXxx として渡す必要があります
  h('div', { onClick: () => {} })

  // children は文字列でも構いません
  h('div', { id: 'foo' }, 'hello')

  // プロパティがない場合は省略できます
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children 配列には vnode と文字列を混在させることができます
  h('div', ['hello', h('span', 'hello')])
  ```

  コンポーネントを作成:

  ```js
  import Foo from './Foo.vue'

  // プロパティを渡す
  h(Foo, {
    // some-prop="hello" と同等
    someProp: 'hello',
    // @update="() => {}" と同等
    onUpdate: () => {}
  })

  // 単一のデフォルトスロットを渡す
  h(Foo, () => 'default slot')

  // 名前付きスロットを渡す
  // スロットのオブジェクトがプロパティとして扱われないよう
  // `null` が必要
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **参照:** [ガイド - レンダー関数 - vnode の作成](/guide/extras/render-function.html#creating-vnodes)

## mergeProps() {#mergeprops}

複数のプロパティオブジェクトをマージします。特定のプロパティには特別な処理があります。

- **型**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **詳細**

  `mergeProps()` は複数のプロパティオブジェクトのマージをサポートし、以下のプロパティに対して特別な処理を行います:

  - `class`
  - `style`
  - `onXxx` イベントリスナー - 同じ名前の複数のリスナーは、配列にマージされます。

  マージ動作が不要で、単純な上書きでよい場合は、代わりにネイティブオブジェクトのスプレッドを使用できます。

- **例**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

vnode のクローンを作成します。

- **型**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **詳細**

  クローンした vnode を返します。オリジナルの vnode とマージするための追加のプロパティを含みます。

  vnode は一度作成したらイミュータブルであると考えるべきで、既存の vnode のプロパティを変更するべきではありません。その代わり、別のプロパティ/追加のプロパティでそれをクローンしてください。

  vnode は特別な内部プロパティを持っているので、クローンするのはオブジェクトのスプレッドのように単純ではありません。`cloneVNode()` はその内部ロジックの大部分を処理します。

- **例**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

値が vnode かどうかをチェックします。

- **型**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

登録されたコンポーネントを名前によって手動で解決します。

- **型**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **詳細**

  **注意：コンポーネントを直接インポートできる場合は不要です。**

  `resolveComponent()` は、正しいコンポーネントコンテキストから解決するために <span class="composition-api"> `setup()` または</span> レンダー関数の内部で呼び出す必要があります。

  コンポーネントが見つからない場合、実行時警告が発生し、名前の文字列が返されます。

- **例**

  <div class="composition-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  const { h, resolveComponent } = Vue

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **参照:** [ガイド - レンダー関数 - コンポーネント](/guide/extras/render-function.html#components)

## resolveDirective() {#resolvedirective}

登録されたディレクティブを名前によって手動で解決します。

- **型**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **詳細**

  **注意：コンポーネントを直接インポートできる場合は不要です。**

  `resolveDirective()` は、正しいコンポーネントコンテキストから解決するために <span class="composition-api"> `setup()` または</span> レンダー関数の内部で呼び出す必要があります。

  ディレクティブが見つからない場合、実行時警告が発生し、この関数は `undefined` を返します。

- **参照:** [ガイド - レンダー関数 - カスタムディレクティブ](/guide/extras/render-function.html#custom-directives)

## withDirectives() {#withdirectives}

vnode にカスタムディレクティブを追加します。

- **型**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **詳細**

  既存の vnode をカスタムディレクティブでラップします。第 2 引数はカスタムディレクティブの配列です。各カスタムディレクティブは `[Directive, value, argument, modifiers]` 形式の配列としても表せます。配列の末尾の要素は、必要なければ省略できます。

- **例**

  ```js
  import { h, withDirectives } from 'vue'

  // カスタムディレクティブ
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **参照:** [ガイド - レンダー関数 - カスタムディレクティブ](/guide/extras/render-function.html#custom-directives)

## withModifiers() {#withmodifiers}

イベントハンドラー関数に、ビルトインの [`v-on` 修飾子](/guide/essentials/event-handling.html#event-modifiers)を追加します。

- **型**

  ```ts
  function withModifiers(fn: Function, modifiers: string[]): Function
  ```

- **例**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // v-on.stop.prevent と同等
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **参照:** [ガイド - レンダー関数 - イベント修飾子](/guide/extras/render-function.html#event-modifiers)
