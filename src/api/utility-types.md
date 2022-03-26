# ユーティリティー型

:::info
このページには、一般的に使われるもののうち、使用法の説明が必要ないくつかのユーティリティー型のみがリストされています。export された型の完全なリストについては、[ソースコード](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)を参照してください。
:::

## PropType\<T>

ランタイムプロパティ宣言を使用する際、より具体的な型でプロパティに注釈を付けるために使用されます。
Used to annotate a prop with more advanced types when using runtime props declarations.

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

- **See also:** [ガイド - コンポーネントプロパティの型付け](/guide/typescript/options-api.html#typing-component-props)

## ComponentCustomProperties

コンポーネントインスタンス型にカスタムグローバルプロパティをサポートする拡張の為に使われます。
Used to augment the component instance type to support custom global properties.

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

カスタムオプションをサポートしたコンポーネントオプション型として拡張するために使用されます。
Used to augment the component options type to support custom options.

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

TSX 要素のプロパティとして宣言されていないプロパティを TSX プロパティとして使用する為に拡張します。
Used to augment allowed TSX props in order to use non-declared props on TSX elements.

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
  // helloが宣言されていないプロパティでも使えるようになります
  <MyComponent hello="world" />
  ```

  :::tip
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api.html#augmenting-global-properties)を参照してください。
  :::

## CSSProperties

スタイルプロパティに適用する値を決めるために拡張します。

- **例**

  どんなカスタム CSS プロパティでも許容します

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
SFC `<style>` タグは、`v-bind CSS` 関数を使用した CSS 値の動的コンポーネント状態へのリンクをサポートします。これにより、型を拡張せずにカスタムプロパティを使用できます。

- [v-bind() in CSS](/api/sfc-css-features.html#v-bind-in-css)
  :::
