# カスタム要素 API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

このメソッドは [`defineComponent`](#definecomponent) と同じ引数を受け取りますが、代わりにネイティブの[カスタム要素](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements)クラスのコンストラクタを返します。

- **型**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // 以下のオプションは 3.5 以上で利用可能
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  通常のコンポーネントオプションに加えて、 `defineCustomElement()` はカスタム要素固有のいくつかのオプションをサポートします:

  - **`styles`**: 要素のシャドウルートに注入する CSS を提供するためのインラインの CSS 文字列の配列。

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: カスタム要素に対して Vue アプリケーションインスタンスを設定するために使用できる関数。

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`、デフォルトは `true`。`false` に設定すると、シャドウルートなしでカスタム要素をレンダリングします。これは、カスタム要素 SFC の `<style>` タグがカプセル化されなくなることを意味します。

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`、指定された場合、シャドウルートに注入される `<style>` タグの `nonce` 属性として設定されます。

  これらのオプションは、コンポーネント自体の一部として渡される代わりに、第 2 引数として渡すこともできることに注意してください:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

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

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

現在の Vue カスタム要素のホスト要素を返す Composition API ヘルパーです。

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

現在の Vue カスタム要素のシャドウルートを返す Composition API ヘルパーです。

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

現在の Vue カスタム要素のホスト要素を公開するための Options API の属性です。
