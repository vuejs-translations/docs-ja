# ユーティリティー型

:::info
このページでは、一般的に使われるものの中から、使用法の説明が必要ないくつかのユーティリティー型のみがリストされています。export された型の完全なリストについては、[ソースコード](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)を参照してください。
:::

## PropType\<T>

ランタイムプロパティ宣言を使用する際、より具体的な型でプロパティに注釈を付けるために使われます。

- **例**

  ```ts
  import { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // より具体的な型を`Object`に提供します
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **参照:** [ガイド - コンポーネントプロパティの型付け](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties

コンポーネントインスタンス型を拡張してカスタムグローバルプロパティのサポートするのに使われます。

- **例**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)を参照してください。
  :::

- **参照:** [ガイド - グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomOptions

コンポーネントオプション型を拡張してカスタムオプションをサポートするのに使われます。

- **例**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)を参照してください。
  :::

- **参照:** [ガイド - グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)

## ComponentCustomProps

TSX 要素のプロパティとして宣言されていないプロパティを拡張して TSX プロパティとして使用します。

- **例**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // hello が宣言されていないプロパティでも使えるようになります
  <MyComponent hello="world" />
  ```

  :::tip
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)を参照してください。
  :::

## CSSProperties

スタイルプロパティに適用できる値を拡張します。

- **例**

  どんなカスタム CSS プロパティでも適用できます

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```
  ```html
  <div :style="{ '--bg-color': 'blue' }">
  ```

:::tip
拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)を参照してください。
:::

:::info 参照
SFC `<style>` タグは、`v-bind CSS` 関数を使って、CSS の値を動的コンポーネントの状態にリンクすることをサポートしています。

- [v-bind() in CSS](/api/sfc-css-features.html#v-bind-in-css)
  :::
