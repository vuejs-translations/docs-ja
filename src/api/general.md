# グローバル API: 汎用 {#global-api-general}

## version {#version}

Vue の現在のバージョンを公開します。

- **型:** `string`

- **例**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

次の DOM 更新処理を待つためのユーティリティーです。

- **型**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **詳細**

  Vue でリアクティブな状態を変更したとき、その結果の DOM 更新は同期的に適用されません。その代わり、Vue は「次の tick」まで更新をバッファリングし、どれだけ状態を変更しても各コンポーネントの更新が一度だけであることを保証します。

  状態を変更した直後に `nextTick()` を使用すると、DOM 更新が完了するのを待つことができます。引数としてコールバックを渡すか、戻り値の Promise を使用できます。

- **例**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM はまだ更新されていない
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // ここでは DOM が更新されている
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM はまだ更新されていない
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // ここでは DOM が更新されている
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **参照** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

型推論つきの Vue コンポーネントを定義するための型ヘルパー。

- **型**

  ```ts
  // オプション構文
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // 関数構文（3.3 以上が必要）
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  最初の引数には、コンポーネントオプションのオブジェクトを指定します。この関数は基本的に型推論のためだけに実行されるものなので、戻り値は同じオプションオブジェクトになります。

  戻り値の型は少し特殊で、オプションに基づいて推測されたコンポーネントのインスタンス型を持つコンストラクタ型になることに注意してください。これは、返された型が TSX のタグとして使われるときに型推論に使われます。

  次のように、`defineComponent()` の戻り値の型からコンポーネントのインスタンス型（オプションの `this` の型に相当）を抽出することができます:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### 関数シグネチャー <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` には、Composition API と[レンダー関数か JSX](/guide/extras/render-function.html) で使うための代替シグネチャーもあります。

  オプションオブジェクトを渡す代わりに、関数を受け取ります。この関数は、Composition API の [`setup()`](/api/composition-api-setup.html#composition-api-setup) 関数と同じ働きをします: つまり props と setup コンテキストを受け取ります。戻り値はレンダー関数であるべきで、`h()` と JSX の両方がサポートされています:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // ここでは <script setup> 内と同じように Composition API を使用します
      const count = ref(0)

      return () => {
        // レンダー関数か JSX
        return h('div', count.value)
      }
    },
    // 追加のオプション（例: props や emits の宣言など）
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  このシグネチャーの主なユースケースは、ジェネリックをサポートしているため、TypeScript（特に TSX）での使用です:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // ここでは <script setup> 内と同じように Composition API を使用します
      const count = ref(0)

      return () => {
        // レンダー関数か JSX
        return <div>{count.value}</div>
      }
    },
    // 現在のところ、手動によるランタイム props 宣言はまだ必要です。
    {
      props: ['msg', 'list']
    }
  )
  ```

  将来的には、ランタイム props を自動的に推論して注入する Babel プラグインを提供し（SFC の `defineProps` のように）、ランタイム props 宣言を省略できるようにする予定です。

  ### webpack のツリーシェイキングに関する注意 {#note-on-webpack-treeshaking}

  `defineComponent()` は関数呼び出しなので、webpack などのビルドツールでは副作用が発生するように見えるかもしれません。これは、コンポーネントが一度も使われていないときでも、コンポーネントがツリーシェイクされるのを防ぐことができます。

  この関数呼び出しがツリーシェイクされても安全であることを webpack に伝えるには、関数呼び出しの前に `/*#__PURE__*/` のコメント表記を追加します:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  これは Vite を使っている場合には必要ないことに注意してください。Rollup（Vite が使用するプロダクションのバンドラー）は賢いので、手動でアノテーションを付けなくても `defineComponent()` が実際には副作用がないことを判断できます。

- **参照** [ガイド - TypeScript で Vue を使用する](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

レンダリング時にのみ遅延読み込みされる非同期コンポーネントを定義します。引数にはローダー関数か、読み込み動作をより詳細に制御するためのオプションオブジェクトを指定します。

- **型**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **参照** [ガイド - 非同期コンポーネント](/guide/components/async)

## defineCustomElement() {#definecustomelement}

このメソッドは [`defineComponent`](#definecomponent) と同じ引数を受け取りますが、代わりにネイティブの[カスタム要素](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements)クラスのコンストラクタを返します。

- **型**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  通常のコンポーネントオプションに加えて、 `defineCustomElement()` は特別なオプション `styles` をサポートします。これはインラインの CSS 文字列の配列で、要素のシャドウルートに注入する CSS を提供するためのものです。

  戻り値は [`customElements.define()`](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/define) を使って登録できるカスタム要素のコンストラクタです。

- **例**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* コンポーネントオプション */
  })

  // カスタム要素を登録する。
  customElements.define('my-vue-element', MyVueElement)
  ```

- **参照**

  - [ガイド - Vue によるカスタム要素のビルド](/guide/extras/web-components#building-custom-elements-with-vue)

  - また、`defineCustomElement()` は単一ファイルコンポーネントで使用する場合、[特別な設定](/guide/extras/web-components#sfc-as-custom-element)が必要なので注意してください。

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

アクセシビリティ属性やフォーム要素に対して、アプリケーションごとに一意な ID を生成するために使用します。

- **型**

  ```ts
  function useId(): string
  ```

- **例**
  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```
- **詳細**

  `useId()` で生成された ID はアプリケーションごとに一意なものになります。フォーム要素やアクセシビリティ属性の ID を生成するために使用できます。同じコンポーネントで複数回呼び出すと、異なる ID が生成されます。`useId()` を呼び出す同じコンポーネントの複数のインスタンスも、異なる ID を持つことになります。

  `useId()` で生成された ID は、サーバとクライアントのレンダー間で安定していることが保証されているため、SSR アプリケーションでもハイドレーションミスマッチを起こすことなく使用できます。

  同じページ内に複数の Vue アプリケーションのインスタンスがある場合、[`app.config.idPrefix`](/api/application#app-config-idprefix)を使用して各アプリケーションに ID プレフィックスを与えることで、ID の衝突を避けることができます。
