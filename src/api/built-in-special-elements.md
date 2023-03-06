# ビルトインの特別な要素 {#built-in-special-elements}

:::info コンポーネントではありません
`<component>` と `<slot>` と `<template>` はコンポーネントのような機能であり、テンプレート構文の一部です。これらは真のコンポーネントではなく、テンプレートのコンパイル時に取り除かれます。そのため、テンプレート内では慣習的に小文字で記述されます。
:::

## `<component>` {#component}

動的コンポーネントや動的な要素をレンダリングするための「メタ・コンポーネント」です。

- **プロパティ**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **詳細**

  実際にレンダリングするコンポーネントは `is` プロパティによって決定されます。

  - `is` が文字列の場合、HTML タグ名か、コンポーネントの登録名となります。

  - また、`is` はコンポーネントの定義に直接バインドもできます。

- **例**

  登録名によるコンポーネントのレンダリング（Options API）:

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  定義によるコンポーネントのレンダリング（`<script setup>` の Composition API）:

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  HTML 要素のレンダリング:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  [ビルトインのコンポーネント](./built-in-components)はすべて `is` に渡すことができますが、名前で渡したい場合は登録しなければなりません。例えば:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  例えば `<script setup>` などで、コンポーネント名ではなく、コンポーネント自体を `is` に渡す場合は、登録は必要ありません。

  もし `v-model` が `<component>` タグで使用された場合、テンプレートコンパイラーは他のコンポーネントと同じように、`modelValue` プロパティと `update:modelValue` イベントリスナーに展開されます。しかし、これは `<input>` や `<select>` のようなネイティブ HTML 要素とは互換性がありません。そのため、動的に生成されるネイティブ要素に対して `v-model` を使用しても動作しません:

  ```vue
  <script setup>
  import { ref } from 'vue'
  
  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- 'input' はネイティブ HTML 要素なので、動作しません -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  実際のアプリケーションでは、ネイティブのフォームフィールドはコンポーネントでラップされるのが一般的なので、このようなエッジケースはあまりありません。もし、ネイティブ要素を直接使用する必要がある場合は、 `v-model` を属性とイベントに手動で分割できます。

- **参照:** [動的コンポーネント](/guide/essentials/component-basics.html#dynamic-components)

## `<slot>` {#slot}

テンプレート内でスロットコンテンツのアウトレットを表します。

- **プロパティ**

  ```ts
  interface SlotProps {
    /**
     * <slot> に渡されたすべてのプロパティは、スコープ付き
     * スロットの引数として渡されます
     */
    [key: string]: any
    /**
     * スロット名を指定するために予約済み。
     */
    name?: string
  }
  ```

- **詳細**

  `<slot>` 要素では `name` 属性を使用してスロット名を指定できます。`name` が指定されない場合は、デフォルトのスロットがレンダリングされます。slot 要素に渡された追加の属性は、親で定義されたスコープ付きスロットにスロットプロパティとして渡されます。

  この要素そのものは、一致したスロットの内容に置き換えられます。

  Vue テンプレートの `<slot>` 要素は JavaScript にコンパイルされているので、[ネイティブの `<slot>` 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/slot)と混同しないように注意してください。

- **参照:** [コンポーネント - スロット](/guide/components/slots)

## `<template>` {#template}

DOM に要素をレンダリングせずに組み込みディレクティブを使用したい場合、`<template>` タグをプレースホルダーとして使用します。

- **詳細:**

  `<template>` の特別な処理は、以下のディレクティブと一緒に使われた場合のみ発生します:

  - `v-if`、`v-else-if`、または `v-else`
  - `v-for`
  - `v-slot`

  これらのディレクティブが存在しない場合は、代わりに[ネイティブの `<template>` 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/template)としてレンダリングされます。

  `v-for` を持つ `<template>` は [`key` 属性](/api/built-in-special-attributes.html#key)を持たせることができます。それ以外の属性やディレクティブは、対応する要素がなければ意味をなさないので、すべて破棄されます。

  単一ファイルコンポーネントは、テンプレート全体をラップするために[トップレベルの `<template>` タグ](/api/sfc-spec.html#language-blocks)を使用します。この使い方は、上記で説明した `<template>` の使い方とは別のものです。このトップレベルタグはテンプレート自体の一部ではなく、ディレクティブのようなテンプレートの構文もサポートしていません。 

- **参照:**
  - [ガイド - `<template>` に `v-if` を適用する](/guide/essentials/conditional.html#v-if-on-template) 
  - [ガイド - `<template>` に `v-for` を適用する](/guide/essentials/list.html#v-for-on-template) 
  - [ガイド - 名前付きスロット](/guide/components/slots.html#named-slots) 
