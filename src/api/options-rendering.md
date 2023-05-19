# オプション: レンダリング {#options-rendering}

## template {#template}

コンポーネントの文字列テンプレート。

- **型**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **詳細**

  `template` オプションで提供されたテンプレートは、実行時にオンザフライでコンパイルされます。これは、テンプレートコンパイラーを含んでいる Vue のビルドを使用する場合にのみサポートされます。`vue.runtime.esm-bundler.js` など、名前に `runtime` が入っている Vue のビルドにはテンプレートコンパイラーは含まれて**いません**。各ビルドの詳細については、[dist ファイルガイド](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)を参照してください。

  文字列が `#` で始まる場合は `querySelector` として使用され、選択された要素の `innerHTML` がテンプレート文字列として使用されます。これにより、ネイティブの `<template>` 要素を使用してソーステンプレートを作成できます。

  同じコンポーネントに `render` オプションがある場合、`template` は無視されます。

  アプリケーションのルートコンポーネントに `template` や `render` オプションが指定されていない場合、Vue はマウントされた要素の `innerHTML` を代わりにテンプレートとして使用しようとします。

  :::warning セキュリティーに関する注意
  テンプレートのソースは信頼できるものだけを使用してください。ユーザーが提供したコンテンツをテンプレートとして使用しないでください。詳しくは[セキュリティーガイド](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates)を参照してください。
  :::

## render {#render}

コンポーネントの仮想 DOM ツリーをプログラムで返す関数。

- **型**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **詳細:**

  `render` は文字列テンプレートに代わるもので、JavaScript のプログラミング能力をフルに活用してコンポーネントのレンダリング出力を宣言できます。

  単一ファイルコンポーネントのような、あらかじめコンパイルされたテンプレートは、ビルド時に `render` オプションにコンパイルされます。`render` と `template` の両方がコンポーネント内に存在する場合は `render` の方が優先されます。

- **参照:**
  - [レンダリングの仕組み](/guide/extras/rendering-mechanism)
  - [レンダー関数](/guide/extras/render-function)

## compilerOptions {#compileroptions}

コンポーネントのテンプレートのランタイムコンパイラーオプションを設定します。

- **型**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // default: 'condense'
      delimiters?: [string, string] // default: ['{{', '}}']
      comments?: boolean // default: false
    }
  }
  ```

- **詳細**

  この設定オプションは、フルビルド（つまり、ブラウザー上でテンプレートをコンパイルできるスタンドアロンの `vue.js`）を使っているときだけ反映されます。アプリケーションレベルの [app.config.compilerOptions](/api/application#app-config-compileroptions) と同じオプションをサポートし、現在のコンポーネントに対してより高い優先順位が設定されています。

- **参照:** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## スロット <sup class="vt-badge ts"/> {#slots}

レンダー関数でプログラム的にスロットを使用する際に、型推論を支援するオプションです。3.3 以上でのみサポートされています。

- **詳細**

  このオプションの実行時の値は使用されません。実際の型は `SlotsType` 型ヘルパーを使った型キャストによって宣言する必要があります：

  ```ts
  import { SlotsType } from 'vue'
  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
