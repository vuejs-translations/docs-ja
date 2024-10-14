# ビルトインの特別な属性 {#built-in-special-attributes}

## key {#key}

特別な属性 `key` は、主に Vue の仮想 DOM アルゴリズムが新しいノードリストを古いリストに対して差分する際に、vnode を識別するためのヒントとして使用されます。

- **期待する値:** `number | string | symbol`

- **詳細**

  キーがない場合、Vue は要素の移動を最小限に抑え、同じタイプの要素をできるだけその場でパッチ/再利用しようとするアルゴリズムを使用します。キーがある場合は、キーの順序変更に基づいて要素を並べ替え、存在しなくなったキーを持つ要素は常に削除/破棄されます。

  共通の同じ親を持つ子は、**ユニークなキー**を持つ必要があります。キーが重複するとレンダリングエラーになります。

  `v-for` と組み合わせるのが最も一般的な使用例です:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  また、要素/コンポーネントを再利用するのではなく、強制的に置き換えるためにも使用できます。これは、次のような場合に便利です:

  - コンポーネントのライフサイクルフックを適切にトリガーする
  - トランジションをトリガーする

  例えば:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  `text` が変更されると、`<span>` はパッチされるのではなく、常に置き換えられるので、トランジションがトリガーされます。

- **参照** [ガイド - リストレンダリング - `key` による状態管理](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

[テンプレート参照](/guide/essentials/template-refs)を表します。

- **期待する値:** `string | Function`

- **詳細**

  `ref` は、要素や子コンポーネントへの参照を登録するために使用します。

  Options API では、この参照はコンポーネントの `this.$refs` オブジェクトの下に登録されます:

  ```vue-html
  <!-- this.$refs.p として格納される -->
  <p ref="p">hello</p>
  ```

  Composition API では、一致する名前の ref に参照が格納されます:

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  もしプレーンな DOM 要素で使用された場合、その要素への参照になります。もし子コンポーネントで使用された場合は、そのコンポーネントのインスタンスへの参照になります。

  また、`ref` には関数も受け付けるので、参照を保存する場所を完全に制御できます:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  ref の登録タイミングに関する重要な注意点として、ref 自体はレンダー関数の結果として作成されるので、コンポーネントがマウントされるまで待ってからアクセスする必要があります。

  `this.$refs` はリアクティブではないので、テンプレート内でデータバインディングのために使わないでください。

- **参照**
  - [ガイド - テンプレート参照](/guide/essentials/template-refs)
  - [ガイド - テンプレート参照の型付け](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [ガイド - コンポーネントのテンプレート参照の型付け](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

[動的コンポーネント](/guide/essentials/component-basics#dynamic-components)のバインディングに使用します。

- **期待する値:** `string | Component`

- **ネイティブ要素での使用**

- 3.1 以上でのみサポートされています

  ネイティブの HTML 要素で `is` 属性が使われている場合、[Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) として解釈されます。これは、ネイティブの Web プラットフォームの機能です。

  しかし、[DOM 内テンプレート解析の注意点](/guide/essentials/component-basics#in-dom-template-parsing-caveats)で説明したように、ネイティブ要素を Vue コンポーネントに置き換えるためには Vue が必要になる場合があります。`is` 属性の値の前に `vue:` を付けると、Vue はその要素を Vue コンポーネントとしてレンダリングします:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **参照**

  - [ビルトインの特別な要素 - `<component>`](/api/built-in-special-elements#component)
  - [動的コンポーネント](/guide/essentials/component-basics#dynamic-components)
