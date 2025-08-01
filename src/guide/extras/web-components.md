# Vue と Web コンポーネント {#vue-and-web-components}

[Web コンポーネント](https://developer.mozilla.org/ja/docs/Web/Web_Components) は、開発者が再利用可能なカスタム要素（custom elements）を作成するための一連の Web ネイティブ API 群の総称です。

私たちは Vue と Web コンポーネントを主に補完的な技術と考えています。Vue はカスタム要素の作成と使用することの両方に優れたサポートを提供します。既にある Vue アプリケーションにカスタム要素を統合する場合や、Vue を使ってビルドしそしてカスタム要素を配布する場合においても、良き仲間です。

## Vue でカスタム要素を使う {#using-custom-elements-in-vue}

Vue は[カスタム要素の全てのテストにおいてスコアは 100% 完璧です](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。Vue アプリケーション内部でカスタム要素を使うことはネイティブ HTML 要素を使うこととほぼ同じですが、いくつか注意点があります:

### コンポーネント解決のスキップ {#skipping-component-resolution}

デフォルトで Vue はカスタム要素をレンダリングするためのフォールバックをする前に、ネイティブではない HTML タグを登録された Vue コンポーネントとして解決しようとします。これにより、開発中に Vue が "failed to resolve component" という警告を出す原因となります。特定の要素をカスタム要素として扱い、Vue にコンポーネントの解決をスキップすることを知らせるために、[`compilerOptions.isCustomElement` オプション](/api/application#app-config-compileroptions)を指定できます。

もし Vue をビルドセットアップで使用している場合、このオプションはコンパイル時のオプションであるため、ビルド設定経由で渡す必要があります。

#### ブラウザー内設定の例 {#example-in-browser-config}

```js
// ブラウザ内コンパイルを使っている場合のみ動作します。
// ビルドツールを使う場合は、以下の設定例を参照してください。
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Vite 設定の例 {#example-vite-config}

```js [vite.config.js]
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // ダッシュを含むすべてのタグをカスタム要素として扱う
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 設定の例 {#example-vue-cli-config}

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // ion- で始まるタグはすべてカスタム要素として扱う
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### DOM プロパティの受け渡し {#passing-dom-properties}

DOM 属性は文字列のみしか扱えないため、複雑なデータをカスタム要素に DOM プロパティとして渡す必要があります。カスタム要素上に props が設定されるとき、Vue 3 では自動的に `in` 演算子を使って DOM プロパティの存在をチェックし、キーが存在する場合は DOM プロパティとして値を設定するよう優先します。これは、多くのケースではカスタム要素が[推奨されるベストプラクティス](https://web.dev/custom-elements-best-practices/)に従っている場合は、この点を考慮する必要はないことを意味します。

しかしながら、データを DOM プロパティとして渡さなければならないのに、カスタム要素がそのプロパティを適切に定義 / 反映していない（`in` チェックが失敗する）場合があります。このようなケースの場合、`.prop` 修飾子を使って `v-bind` バインディングを DOM プロパティとして設定するように強制することができます:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 省略同等 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Vue によるカスタム要素のビルド {#building-custom-elements-with-vue}

カスタム要素の最大の利点は、どんなフレームワークでも、あるいはフレームワークがなくても使用できるということです。そのため、利用者が同じフロントエンドスタックを使用していない場合にコンポーネントを配布する場合や、アプリケーションが使用するコンポーネントの実装の詳細から該当アプリケーションを隔離したい場合に最適です。

### defineCustomElement {#definecustomelement}

Vue は [`defineCustomElement`](/api/custom-elements#definecustomelement) メソッドを介したまったく同じ Vue コンポーネント API 群を使ってカスタム要素の作成をサポートします。このメソッドは [`defineComponent`](/api/general#definecomponent) と同じ引数を受け付けますが、代わりに `HTMLElement` を拡張したカスタム要素を返します:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 通常の Vue コンポーネントオプションはここに
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement のみ: shadow root に注入される CSS
  styles: [`/* inlined css */`]
})

// カスタム要素の登録。
// 登録後、ページ上の全ての `<my-vue-element>` タグは
// アップグレードされます。
customElements.define('my-vue-element', MyVueElement)

// プログラマチックに要素をインスタンス化することもできます:
//（登録後にのみ行うことができます）
document.body.appendChild(
  new MyVueElement({
    // 初期 props（任意）
  })
)
```

#### ライフサイクル {#lifecycle}

- Vue のカスタム要素は、要素の [`connectedCallback`](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements#%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E3%81%AE%E4%BD%BF%E7%94%A8) が初めて呼び出されたときに、その shadow root 内に内部の Vue コンポーネントインスタンスをマウントします。

- 要素の `disconnectedCallback` が呼び出されるとき、Vue はマイクロタスクの tick を動作させた後、ドキュメントから要素が切り離されているかどうかチェックします。

  - もし、要素がまだドキュメントに存在している場合は、それは移動状態であり、コンポーネントインスタンスは維持されています

  - もし、要素がドキュメントから切り離されている場合は、それは削除された状態であり、コンポーネントインスタンスはアンマウントされます。

#### Props {#props}

- `props` オプションを使って宣言されたすべての props は、カスタム要素にプロパティとして定義されます。Vue は必要に応じて、属性とプロパティの間のリフレクションを自動的に処理します。

  - 属性は常に対応するプロパティに反映されます。

  - プリミティブな値（`string`、`boolean`、`number`）を持つプロパティは、属性として反映されます。

- また、Vue は `Boolean` や `Number` で宣言された props が属性（常に文字列）として設定されると、自動的に目的の型にキャストします。例えば、次のようなプロパティ宣言があるとします:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  そして、カスタム要素での使用される場合:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  コンポーネントでは、`selected` は `true`（真偽値）に、 `index` は `1`（数値）にキャストされます。

#### イベント {#events}

`this.$emit` や setup の `emit` を通じて発行されたイベントは、カスタム要素上でネイティブの[カスタムイベント（CustomEvents）](https://developer.mozilla.org/ja/docs/Web/Events/Creating_and_triggering_events#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E8%BF%BD%E5%8A%A0_%E2%80%93_customevent) としてディスパッチされます。追加のイベント引数（ペイロード）は、カスタムイベントオブジェクトの `detail` プロパティの配列として公開されます。

#### スロット {#slots}

コンポーネント内部では、通常通り `<slot/>` 要素を使ってスロットをレンダリングすることができます。しかし、生成された要素を使うときは、[ネイティブのスロット構文](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_templates_and_slots)しか受け付けません。

- [スコープ付きスロット](/guide/components/slots#scoped-slots)はサポートされていません。

- 名前付きスロットを渡すときは、`v-slot` ディレクティブの代わりに `slot` 属性を使用します:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) と [Composition API](/api/composition-api-dependency-injection#provide) も、Vue で定義されたカスタム要素間で動作します。しかしながら、これは**カスタム要素間**のみ動作するということに注意してください。つまり、Vue で定義されたカスタム要素は、カスタム要素ではない Vue コンポーネントによってプロパティを注入することはできません。

#### アプリケーションレベルの設定 <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

`configureApp` オプションを使うことで、Vue のカスタム要素のアプリケーションインスタンスを設定できます:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### カスタム要素としての SFC {#sfc-as-custom-element}

`defineCustomElement` は、Vue の単一ファイルコンポーネント（SFC: Single-File Components）でも動作します。しかしながら、デフォルトのツール設定では、SFC 内の `<style>` は、プロダクションビルド時に抽出され、単一の CSS ファイルにマージされます。SFC をカスタム要素として使用する場合は、代わりにカスタム要素の shadow root に `<style>` タグを注入するのが望ましいことが多いです。

公式の SFC ツールは、"カスタム要素モード（custom element mode）" での SFC の読み込みをサポートしています（`@vitejs/plugin-vue@^1.4.0` または `vue-loader@^16.5.0` が必要）。カスタム要素モードで読み込まれた SFC は、その `<style>` タグを CSS の文字列としてインライン化し、コンポーネントの `styles` オプションで公開します。これは、`defineCustomElement` によってピックアップされ、インスタンス化されたときに要素の shadow root に注入されます。

このモードを利用する（オプトイン）には、コンポーネントのファイル名の最後に `.ce.vue` をつけるだけです:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// カスタム要素のコンストラクタに変換
const ExampleElement = defineCustomElement(Example)

// 登録
customElements.define('my-example', ExampleElement)
```

もし、カスタム要素モード（例えば、_すべて_ の SFC をカスタム要素として扱う場合）でどのファイルをインポートするかをカスタマイズしたい場合、それぞれのビルドプラグインに `customElement` オプションを渡すことができます:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Vue カスタム要素ライブラリー向けの秘訣 {#tips-for-a-vue-custom-elements-library}

Vue でカスタム要素をビルドする場合、要素は Vue のランタイムに依存します。使用する機能の数に応じて、ベースラインサイズが 16kb 程度になります。 つまり、単一のカスタム要素を提供する場合、Vue を使用することは理想的ではありません。vanilla JavaScript、[petite-vue](https://github.com/vuejs/petite-vue)、またはランタイムサイズの小ささに特化したフレームワークを使いたいかもしれません。しかしながら、複雑なロジックを持つカスタム要素の集合体を出荷する場合、Vue によって各コンポーネントがより少ないコードで作成されるため、基本サイズの大きさは正当化されます。一緒に出荷する要素が多ければ多いほど、トレードオフは良くなります。

もし、カスタム要素が Vue を使用しているアプリケーションでも使用される場合、ビルドされたバンドルから Vue を外部化することを選択し、要素がホストアプリケーションから同じ Vue のコピーを使用するようにできます。

個々の要素コンストラクタをエクスポートして、ユーザーに必要に応じてインポートさせたり、必要なタグ名で登録できる柔軟性を持たせることをおすすめします。また、すべての要素を自動的に登録する便利な関数をエクスポートすることもできます。以下は、Vue カスタム要素ライブラリのエントリーポイントの例です:

```js [elements.js]

import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 個々の要素をエクスポート
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

コンポーネントの利用者は、Vue ファイル内の要素を使用できます:

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

または、JSX などの他のフレームワーク内の要素を、カスタム名で使用することもできます:

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ... >
      <some-bar ... ></some-bar>
    </some-foo>
  </>
}
```

### Vue ベースの Web コンポーネントと TypeScript {#web-components-and-typescript}

Vue SFC テンプレートを記述する際には、カスタム要素として定義されたものも含めて、Vue コンポーネントの[型チェック](/guide/scaling-up/tooling.html#typescript) を行うとよいでしょう。

カスタム要素はネイティブ API を使用してグローバルに登録されるため、デフォルトでは Vue テンプレートで使用された際に型推論が行われません。カスタム要素として登録された Vue コンポーネントに型サポートを提供するには、Vue テンプレートおよび/または [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) で [`GlobalComponents` インターフェース](https://github.com/vuejs/language-tools/wiki/Global-Component-Types)を使用してグローバルコンポーネントの型付けを登録します。

Vue で作成されたカスタム要素の型を定義する方法は次のとおりです:

```typescript
import { defineCustomElement } from 'vue'

// Vue component をインポート。
import SomeComponent from './src/components/SomeComponent.ce.vue'

// Vue component をカスタム要素クラスに変換。
export const SomeElement = defineCustomElement(SomeComponent)

// 要素クラスをブラウザに登録することを忘れずに。
customElements.define('some-element', SomeElement)

// Vue の GlobalComponents タイプに新しい要素タイプを追加します。
declare module 'vue' {
  interface GlobalComponents {
    // ここでは必ず Vue コンポーネントタイプを渡してください。
    // (SomeElement **ではなく** SomeComponent)
    // カスタム要素にはハイフンが必要です。
    // そのため、ここではハイフン付きの要素名を使用します。
    'some-element': typeof SomeComponent
  }
}
```

## Vue ではない Web コンポーネントと TypeScript {#non-vue-web-components-and-typescript}

Vue で構築されていないカスタム要素の SFC テンプレートで型チェックを有効にする推奨の方法をご紹介します。

:::tip Note
この方法は、カスタム要素を作成する際に使用するフレームワークによって異なる場合があります。
:::

いくつかの JS プロパティとイベントが定義されたカスタム要素があり、それが `some-lib` というライブラリーに同梱されているとします:

```ts [some-lib/src/SomeElement.ts]
// 型付き JS プロパティを持つクラスを定義します。
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // このメソッドはテンプレート型に公開すべきではありません。
  someMethod() {
    /* ... */
  }

  // ... 実装の詳細は省略 ...
  // ... "apple-fell" という名前のイベントをディスパッチすると想定 ...
}

customElements.define('some-element', SomeElement)

// これは、フレームワークテンプレート（例えば、Vue SFCテンプレート）で
// 型チェックのために選択されるSomeElementのプロパティの一覧です。
// その他のプロパティは公開されません。
export type SomeElementAttributes = 'foo' | 'bar'

// SomeElement がディスパッチするイベントの種類を定義します。
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... 詳細は省略 ... */
}
```

実装の詳細は省略しますが、重要な部分は、プロパティの型とイベントの型という 2 つの型定義があることです。

Vue でカスタム要素の型定義を簡単に登録するための型ヘルパーを作成してみましょう

```ts [some-lib/src/DefineCustomElement.ts]
// 定義する必要のある要素ごとに、このタイプのヘルパーを再利用することができます。
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // テンプレート型のチェックに公開されるプロパティを定義するには、$props を使用します。
  // Vue は、特に `$props` 型から props 定義を読み取ります。要素の props を
  // グローバルな HTML props と Vue の特別な props と組み合わせることに
  // 注意してください。
  /** @deprecated カスタム要素参照では、$props プロパティを使用しないでください。
    これはテンプレート props 型専用です。 */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // イベントタイプを明示的に定義するには、$emit を使用します。
  // Vue は、イベントタイプを`$emit`タイプから読み取ります。
  // `$emit` は、`Events` にマッピングする特定のフォーマットを必要とします。
  /** @deprecated カスタム要素参照では $emit プロパティを使用しないでください。
    これはテンプレート props 型専用です。 */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// これは、Vue の $emit 型が期待する形式に EventMap をマッピングします。
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

:::tip Note
私たちは `$props` と `$emit` を非推奨としました。カスタム要素の `ref` を取得した際に、これらのプロパティを使用したくなる誘惑にかられないようにするためです。これらのプロパティはカスタム要素に関しては型チェックのみに使用されるためです。これらのプロパティは実際にはカスタム要素のインスタンスには存在しません。
:::

型ヘルパーを使用して、Vue テンプレートで型チェックのために公開すべき JS プロパティを選択できます:

```ts [some-lib/src/SomeElement.vue.ts]
import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// Vue の GlobalComponents タイプに新しい要素タイプを追加します。
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

`some-lib` が TypeScript のソースファイルを `dist/` フォルダにビルドするとします。 `some-lib` のユーザーは、`SomeElement` をインポートし、Vue SFC で次のように使用できます:

```vue
<script setup lang="ts">
// これにより、要素が作成され、ブラウザーに登録されます。
import 'some-lib/dist/SomeElement.js'

// TypeScript と Vue を使用しているユーザーは、さらに Vue 固有の型定義を
// インポートする必要があります（他のフレームワークを使用しているユーザーは、
// 他のフレームワーク固有の型定義をインポートする場合があります）。
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // これらの props は使用しないでください。これらは `undefined` です
  // IDE では取り消し線が表示されます:
  el.$props
  el.$emit
})
</script>

<template>
  <!-- これで型チェックを行いながら要素を使用できます: -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // ここで、`event` の型は `AppleFellEvent` であると推論されます
      }
    "
  ></some-element>
</template>
```

要素に型定義がない場合、プロパティとイベントの型はより手動で定義することができます:

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// `some-lib` が型定義のないプレーンな JavaScript で、TypeScript が型を
// 推論できないと仮定します:
import { SomeElement } from 'some-lib'

// 前回と同じ型ヘルパーを使用します。
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// Vue の GlobalComponents 型に新しい要素タイプを追加します。
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... 以前と同じように、要素への参照を使用します ...
</script>

<template>
  <!-- ... 以前と同じように、テンプレート内の要素を使用します ... -->
</template>
```

カスタム要素の作成者は、ライブラリーからフレームワーク固有のカスタム要素の型定義を自動的にエクスポートすべきではありません。例えば、ライブラリーの残りの部分もエクスポートする `index.ts` ファイルからエクスポートすべきではありません。そうしないと、ユーザーに予期しないモジュール拡張エラーが発生します。ユーザーは、必要なフレームワーク固有の型定義ファイルをインポートする必要があります。

## Web コンポーネント と Vue コンポーネントの比較 {#web-components-vs-vue-components}

開発者の中には、フレームワークに依存した独自のコンポーネントモデルは避けるべきであり、カスタム要素のみを使用することでアプリケーションの「将来性」を確保できると考える人もいます。ここでは、この考え方が問題を単純化しすぎていると思われる理由を説明します。

カスタム要素と Vue コンポーネントの間には、確かにある程度の機能の重複があります: どちらも、データの受け渡し、イベントの発行、ライフサイクルの管理を備えた再利用可能なコンポーネントを定義することができます。しかし、Web コンポーネントの API は比較的低レベルで素っ気ないものです。実際のアプリケーションを構築するには、このプラットフォームがカバーしていない、かなりの数の追加機能が必要です:

- 宣言的で効率的なテンプレートシステム

- コンポーネント間でのロジックの抽出と再利用を容易にする、リアクティブな状態管理システム

- SEO や [LCP などの Web Vitals の指標](https://web.dev/vitals/)で重要な、サーバー上でコンポーネントをレンダリングし、クライアント上でハイドレートするパフォーマンスの高い方法（SSR）。ネイティブのカスタム要素の SSR では、一般的に Node.js で DOM をシミュレートし、変異された DOM をシリアライズしますが、Vue の SSR では可能な限り文字列の連結にコンパイルされるため、より効率的です。

Vue のコンポーネントモデルは、これらのニーズを考慮して、一貫したシステムとして設計されています。

有能なエンジニアリングチームであれば、ネイティブのカスタム要素上に同等のものを構築することができるでしょう。しかし、これは、Vue のような成熟したフレームワークのエコシステムやコミュニティーの恩恵を受けられない一方で、自社フレームワークの長期的なメンテナンスの負担を負うことを意味します。

カスタム要素をコンポーネントモデルの基礎として使用しているフレームワークもありますが、いずれも上記のような問題に対して独自の解決策を導入しなければなりません。これらのフレームワークを使用することは、これらの問題を解決する方法に関する彼らの技術的な決定を受け入れることを意味します。これは、宣伝されているかもしれませんが、潜在的な将来の解約から自動的に保護されるものではありません。

また、カスタム要素では限界があると感じる部分もあります:

- スロットの評価時間が長いと、コンポーネントの構成を妨げます。Vue の[スコープ付きスロット](/guide/components/slots#scoped-slots)は、コンポーネント構成における強力なメカニズムですが、ネイティブスロットの先行性質のため、カスタム要素はサポートされません。先行スロットは、受信側のコンポーネントがスロットコンテンツの一部をレンダリングするタイミングやその有無を制御できないことを意味します。

- 現在、shadow DOM にスコープされた CSS を持つカスタム要素を配布するには、実行時に shadow root に注入できるように、JavaScript 内に CSS を埋め込む必要があります。また、SSR のシナリオでは、マークアップに重複したスタイルが発生します。この分野は、[プラットフォーム機能](https://github.com/whatwg/html/pull/4898/)としての開発が進められていますが、現時点ではまだ一般的にサポートされているわけではなく、パフォーマンスや SSR の面でも解決すべき問題があります。一方で、Vue の SFC は、スタイルをプレーンな CSS ファイルに抽出することをサポートする [CSS スコープ化するメカニズム](/api/sfc-css-features)を提供しています。

Vue は常に Web プラットフォームの最新の規格に対応しており、みなさんが開発しやすくなるのであれば、プラットフォームが提供するものを喜んで活用していきます。しかしながら、私たちの目標は今日でも十分に機能するソリューションを提供することです。つまり、批判的な考え方で新しいプラットフォームの機能を取り入れなければなりません。そのためには、今のうちに規格では不十分な部分を埋めておく必要があります。
