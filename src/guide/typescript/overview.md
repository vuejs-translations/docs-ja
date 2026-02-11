---
outline: deep
---

# TypeScript で Vue を使用する {#using-vue-with-typescript}

TypeScript のような型システムは、ビルド時に静的解析で多くの一般的なエラーを検出できます。これにより、本番環境でのランタイムエラーの確率を下げ、より自信を持って大規模アプリケーションのコードをリファクタリングできるようになります。TypeScript は、IDE における型ベースの自動補完により、開発者の人間工学も改善します。

Vue 自体が TypeScript で書かれており、第一級の TypeScript のサポートを提供します。全ての公式 Vue パッケージには型定義が付属されているため、すぐに利用することができます。

## プロジェクトのセットアップ {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue) は公式のプロジェクトセットアップツールで、[Vite](https://ja.vite.dev/) を用いた TypeScript 対応の Vue プロジェクトをセットアップするためのオプションを提供します。

### 概要 {#overview}

Vite ベースのセットアップでは、開発サーバーとそのバンドラーはトランスパイルのみ行い、型チェックは行いません。これにより、Vite の開発サーバーは TypeScript を使用していても超高速に動作し続けることが保証されます。

- 開発中は、すぐに型エラーのフィードバックを得るために、優れた [IDE セットアップ](#ide-support) に頼ることを推奨します。

- SFC を使用する場合、コマンドラインでの型チェックと型宣言の生成には [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) を使用します。`vue-tsc` は TypeScript 独自のコマンドラインインターフェースである `tsc` のラッパーです。TypeScript のファイルに加えて Vue SFC をサポートする以外は、`tsc` とほぼ同じように動作します。Vite の開発サーバーと並行して、`vue-tsc` をウォッチモードで実行するか、別のワーカースレッドでチェックを実行する [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) のような Vite プラグインを使用できます。

- Vue CLI は TypeScript もサポートしていますが、推奨されなくなりました。[以下の注意](#note-on-vue-cli-and-ts-loader)を参照してください。

### IDE のサポート {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/)（VS Code）は、すぐに利用できる TypeScript サポートを提供しているため、強く推奨されます。

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（元 Volar）は公式 VS Code 拡張機能です。Vue SFC 内部での TypeScript のサポートなど、その他の優れた機能を持ちます。

    :::tip
    Vue - Official は Vue 2 の公式 VS Code 拡張機能である [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) を置き換えるものです。現在 Vetur がインストールされている場合、Vue 3 のプロジェクトで必ず無効化してください。
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) は TypeScript と Vue の両方をすぐに利用できるようサポートしています。他の JetBrains IDE も最初から、または [この無料プラグイン](https://plugins.jetbrains.com/plugin/9442-vue-js) で、これらをサポートしています。バージョン 2023.2 では、WebStorm と Vue プラグインは Vue Language Server をビルトインでサポートしています。Settings → Languages & Frameworks → TypeScript → Vue で、すべての TypeScript バージョンで Volar インテグレーションを使用するように Vue サービスを設定できます。デフォルトでは、Volar は TypeScript バージョン 5.0 以上で使用されます。

### `tsconfig.json` の構成 {#configuring-tsconfig-json}

`create-vue` を使ってセットアップしたプロジェクトには、構成済みの `tsconfig.json` が含まれます。ベースとなった構成は [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) パッケージにて抽象化されています。プロジェクト内部では、[Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) を使って、異なる環境（例: アプリコードとテストコードで異なるグローバル変数を持つ必要がある）で実行されるコードに対して正しい型を保証しています。

`tsconfig.json` を手動で構成する場合、いくつかの注目すべきオプションは以下の通りです:

- Vite は TypeScript のトランスパイルに [esbuild](https://esbuild.github.io/) を使用しており、単一ファイルのトランスパイル制限に従うので、[`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) を `true` に設定してください。[`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) は [`isolatedModules` のスーパーセット](https://github.com/microsoft/TypeScript/issues/53601)であり、これも良い選択です。これは [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) で使用されています。

- Options API を使用する場合は、コンポーネントオプションにおける this の型チェックを活用するために [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) を `true` に設定（もしくは少なくとも strict フラグの一部である [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) を `true` に設定）する必要があります。そうでないと、this は常に any 型として扱われます。

- 例えば `create-vue` プロジェクトでデフォルトで設定される `@/*` エイリアスのような resolver エイリアスをビルドツールで設定した場合、TypeScript 用の設定として、[`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) にもエイリアスを設定する必要があります。

- Vue で TSX を使用する場合は [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) を `"preserve"` に設定し [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) を `"vue"` に設定してください。

参照:

- [Official TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript compilation caveats](https://esbuild.github.io/content-types/#typescript-caveats)

### Vue CLI と `ts-loader` に関する注意 {#note-on-vue-cli-and-ts-loader}

Vue CLI など、webpack ベースのセットアップでは、モジュールの変換パイプラインの一部で、例えば `ts-loader` を使って型チェックを行うことが一般的です。しかし、これは型チェックを行うためにモジュールグラフ全体の知識が必要となるので、クリーンな解決法とは言えません。個々のモジュールの変換ステップは、単にこのタスクを行うための良い方法ではないのです。これは、以下のような問題を引き起こします:

- `ts-loader` は変換後のコードしか型チェックができません。これは、IDE や `vue-tsc` でみられる、ソースコードに直接マップされるエラーとは一致しません。

- 型チェックは遅くなる可能性があります。コード変換と同じスレッド / プロセスで行われると、アプリケーション全体のビルド速度に大きく影響します。

- すでに IDE で型チェックを別のプロセスで実行しているので、開発体験を低下させるコストは、単純に適切なトレードオフではありません。

現在、Vue CLI 経由で Vue 3 + TypeScript を使っている場合、Vite への移行を強く推奨します。トランスパイルのみでの TS サポートを有効にする CLI オプションにも取り組んでいるので、型チェックのために `vue-tsc` に切り替えることができます。

## 一般的な使用上の注意 {#general-usage-notes}

### `defineComponent()` {#definecomponent}

TypeScript がコンポーネントオプション内の型を適切に推論できるようにするには、[`defineComponent()`](/api/general#definecomponent) を使ってコンポーネントを定義する必要があります:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 型推論が有効
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

`<script setup>` を使わずに Composition API を使用する場合、`defineComponent()` は `setup()` に渡された props を推論することができます:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 型推論が有効
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

参照:

- [webpack のツリーシェイキングに関する注意](/api/general#note-on-webpack-treeshaking)
- [`defineComponent` の型テスト](https://github.com/vuejs/core/blob/main/packages-private/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` は、プレーンな JavaScript で定義されたコンポーネントに対しても型推論を行うことができます。
:::

### 単一ファイルコンポーネントでの使用法 {#usage-in-single-file-components}

SFC で TypeScript を使用する場合、`<script>` タグに `lang="ts"` 属性を追加してください。`lang="ts"` が存在する場合、全てのテンプレート内の式に対してもより厳格な型チェックを利用できます。

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 型チェックと自動補完が有効 -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` は、`<script setup>` とともにも使用できます:

```vue
<script setup lang="ts">
// TypeScript が有効
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 型チェックと自動補完が有効 -->
  {{ count.toFixed(2) }}
</template>
```

### テンプレート内での TypeScript {#typescript-in-templates}

`<template>` は、`<script lang="ts">` や `<script setup lang="ts">` が使われている場合、バインディング式について、TypeScript をサポートします。これは、テンプレート内の式で型キャストを行う必要がある場合に便利です。

不自然な例を以下に示します:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- x は string の可能性があるためエラー -->
  {{ x.toFixed(2) }}
</template>
```

これはインラインの型キャストで回避することができます:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Vue CLI または webpack ベースのセットアップを使用する場合、テンプレート内の式での TypeScript の使用には `vue-loader@^16.8.0` が必要になります。
:::

### TSX の使用方法 {#usage-with-tsx}

Vue では、JSX / TSX を使ったコンポーネントの作成もサポートしています。詳細については、[レンダー関数と JSX](/guide/extras/render-function.html#jsx-tsx) で説明しています。

## ジェネリックコンポーネント {#generic-components}

ジェネリックコンポーネントは以下の 2 つのケースでサポートされています:

- SFC 内: [`generic` 属性ありの `<script setup>`](/api/sfc-script-setup.html#generics)
- レンダー関数 / JSX コンポーネント: [`defineComponent()` の関数シグネチャー](/api/general.html#function-signature)

## API 固有のレシピ {#api-specific-recipes}

- [Composition API で TypeScript を使用する](./composition-api)
- [Options API で TypeScript を使用する](./options-api)
