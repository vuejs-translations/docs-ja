# ユーティリティー型 {#utility-types}

:::info
このページでは、一般的に使われるものの中から、使用法の説明が必要ないくつかのユーティリティー型のみがリストされています。export された型の完全なリストについては、[ソースコード](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)を参照してください。
:::

## PropType\<T> {#proptype-t}

ランタイムプロパティ宣言を使用する際、より具体的な型でプロパティに注釈を付けるために使われます。

- **例**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // より具体的な型を `Object` に提供します
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **参照:** [ガイド - コンポーネントプロパティの型付け](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

Alias for `T | Ref<T>`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## MaybeRefOrGetter\<T> {#maybereforgetter}

Alias for `T | Ref<T> | (() => T)`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

- Only supported in 3.3+.

## ExtractPropTypes\<T> {#extractproptypes}

Extract prop types from a runtime props options object. The extracted types are internal facing - i.e. the resolved props received by the component. This means boolean props and props with default values are always defined, even if they are not required.

To extract public facing props, i.e. props that the parent is allowed to pass, use [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```
  
## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

Extract prop types from a runtime props options object. The extracted types are public facing - i.e. the props that the parent is allowed to pass.

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

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
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties)を参照してください。
  :::

- **参照:** [ガイド - グローバルプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

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
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties)を参照してください。
  :::

- **参照:** [ガイド - カスタムオプションの拡張](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

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
  拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties)を参照してください。
  :::

## CSSProperties {#cssproperties}

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
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
拡張するには、モジュールを `.ts` または `.d.ts` ファイルとして配置する必要があります。詳細は[グローバルプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties)を参照してください。
:::

:::info 参照
SFC `<style>` タグは、`v-bind` CSS 関数を使って、CSS の値を動的コンポーネントの状態にリンクすることをサポートしています。これにより、型を拡張することなく、カスタムプロパティを使用することができます。

- [CSS の v-bind()](/api/sfc-css-features#v-bind-in-css)
  :::
