---
outline: deep
---

# TypeScript のサポート

TypeScript が持つ静的型システムは、特にアプリケーションが成長するに伴い、多くの潜在的なランタイムエラーを防止するのに役立ちます。また、エディターにおける型ベースの自動補完により、あなたの開発体験を向上させることができます。

Vue 自体が TypeScript で書かれており、全ての公式 Vue パッケージには型定義が付属されているため、すぐに利用することができます。

## プロジェクトのセットアップ

[`create-vue`](https://github.com/vuejs/create-vue) は公式のプロジェクトセットアップツールで、Vite を用いた TypeScript 対応の Vue プロジェクトをセットアップするためのオプションが用意されています。

### 概要

Vite を使ってセットアップした場合、開発サーバーとそのバンドラーはトラインスパイルのみ行い、型チェックは行いません。これにより、Vite の開発サーバーは TypeScript を使用しても超高速に動作します。

- 開発中は、すぐに型エラーのフィードバックを得るために、優れた [エディターによるサポート](#エディターによるサポート) に頼ることを推奨します。

- 単一ファイルコンポーネント（SFC）を使用する場合、コマンドラインでの型チェックと型宣言の生成には [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) を使用します。`vue-tsc` は TypeScript のコマンドラインインタフェースである `tsc` のラッパーで、TypeScript のファイルに加えて SFC ファイルをサポートする以外は、`tsc` とほぼ同じように動作します。

- `vue-tsc` は現在、ウォッチモードをサポートしていませんが、ロードマップ上には存在しています。それまでの間、開発コマンドの一部として型チェックを行いたい場合は、[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) を確認してください。

- Vue CLI は TypeScript もサポートしていますが、推奨されなくなりました。[以下の注意点](#vue-cli-と-ts-loader-に関する注意点)を参照してください。

### エディターによるサポート

- TypeScript による Vue アプリケーションの開発のために、すぐに利用できる TypeScript サポートを提供している [Visual Studio Code](https://code.visualstudio.com/) (VSCode) を強く推奨します。

  - [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) は公式 VSCode 拡張機能です。SFC 内部での TypeScript のサポートなど、その他の優れた機能を持ちます。

    :::tip
    Volar は Vue 2 の公式 VSCode 拡張機能である [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) を置き換えるものです。現在 Vetur がインストールされている場合、Vue 3 のプロジェクトでは無効化してください。
    :::

  - TS ファイル内で `*.vue` をインポートする際に型推論を行う場合、[TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) も必要となります。

- [WebStorm](https://www.jetbrains.com/webstorm/) は TypeScript と Vue の両方をすぐに利用できるようサポートしています。他の JetBrains IDE も最初から、または [この無料プラグイン](https://plugins.jetbrains.com/plugin/9442-vue-js) で、これらをサポートしています。

### `tsconfig.json` の構成

`create-vue` を使ってセットアップしたプロジェクトには、構成済みの `tsconfig.json` が含まれます。ベースとなった構成は [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) パッケージにて抽象化されています。プロジェクト内部では、[Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) を使って、異なる環境（例: アプリとテスト）で実行されるコードに対して正しい型を保証しています。

`tsconfig.json` を手動で構成する場合、いくつかの注目すべきオプションを含めてください:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) を `true` に設定してください。Vite は TypeScript のトランスパイルに [esbuild](https://esbuild.github.io/) を使用しており、単一ファイルのトランスパイル制限に従うからです。

- Options API を使用する場合は、コンポーネントオプションにおける this の型チェックを活用するために [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) を `true` に設定 (もしくは少なくとも strict フラグの一部である [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) を `true` に設定) する必要があります。そうでないと、this は常に any 型として扱われます。

- `create-vue` でセットアップしたプロジェクトで設定される `@/*` エイリアスのような resolver エイリアスをビルドツールで設定した場合、TypeScript 用の設定として、[`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) にもエイリアスを設定する必要があります。

参照する:

- [Official TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript compilation caveats](https://esbuild.github.io/content-types/#typescript-caveats)

### Takeover Mode

> このセクションは、VSCode + Volar の場合のみ該当します。

SFC ファイルと TypeScript を連携させるために、 Volar は Vue 固有のサポートを含む分離された TS 言語サービスインスタンスを作成し、SFC ファイル内で使われます。同時に、プレーンな TS ファイルは VSCode にビルトインされた TS 言語サービスによって処理されます。TS ファイル内で SFC ファイルをインポートする際の型推論に [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) が必要なのはそういった理由からです。このデフォルトのセットアップ方法はうまく動きますが、プロジェクトごとに 2 つの TS 言語サービスインスタンスが実行されます: 1 つは Volar の言語サービス、もう 1 つは VSCode にビルトインされた言語サービスです。これは少し非効率で、大規模プロジェクトではパフォーマンスの問題につながる可能性があります。

Volar はパフォーマンスの改善のために、"Takeover Mode" と呼ばれる機能を提供しています。Takeover Mode では、Volar は単一の TS 言語サービスインスタンスを使用して Vue と TS の両ファイルをサポートします。

Takeover Mode を有効にするには以下の手順に従って、VSCode にビルトインされた TS 言語サービスを**プロジェクトのワークスペースのみ**で無効化する必要があります:

1. プロジェクトのワークスペースで、コマンドパレットを `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）で表示します。
2. `built` と入力し、"Extensions: Show Built-in Extensions" を選択します。
3. 拡張機能の検索ボックスに `typescript` と入力します（`@builtin` というプレフィックスは削除しないでください）。
4. "TypeScript and JavaScript Language Features" の小さい歯車のアイコンをクリックし、"Disable (Workspace)" を選択してください。
5. ワークスペースを再読み込みしてください。Vue や TS ファイルを開くと、Takeover Mode が有効になります。

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Vue CLI と `ts-loader` に関する注意点

Vue CLI など、webpack を用いたセットアップでは、モジュールの変換パイプラインの一部で、例えば `ts-loader` を使って型チェックを行うことが一般的です。しかし型システムは、型チェックを行うためにモジュールグラフ全体の知識が必要となるので、良い解決策とは言えません。個々のモジュールの変換ステップは、単にこのタスクを行うための良い方法ではないのです。これは、以下のような問題を引き起こします:

- `ts-loader` は変換後のコードしか型チェックができません。これは、エディターや `vue-tsc` でみられる、ソースコードに直接関連づけられたエラーとは一致しません。

- 型チェックが遅くなる可能性があります。コード変換と同じスレッド / プロセスで行われると、アプリケーション全体のビルド速度に大きな影響を与えます。

- すでにエディターで型チェックを別のプロセスで実行しているので、開発体験を低下させるコストは、単純に良いトレードオフではありません。

現在、Vue CLI 経由で Vue 3 + TypeScript を使っている場合、Vite への移行を強く推奨します。トランスパイルのみでの TS サポートを有効にする CLI オプションにも取り組んでいるので、型チェックのために `vue-tsc` に切り替えることができます。

## 一般的な使用法

### `defineComponent()`

TypeScript がコンポーネントオプション内の型を適切に推論するには、[`defineComponent()`](/api/general.html#definecomponent) を使ってコンポーネントを定義する必要があります:

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

参照する: [type tests for `defineComponent`](https://github.com/vuejs/core/blob/main/test-dts/defineComponent.test-d.tsx)

:::tip
`defineComponent()` は、プレーンな JavaScript で定義されたコンポーネントに対しても型推論を行うことができます。
:::

### 単一ファイルコンポーネントでの使用法

SFC で TypeScript を使用する場合、`<script>` タグに `lang="ts"` 属性を追加してください。`lang="ts"` を設定した場合、全てのテンプレート式に対しても厳格な型チェックが適用されます。

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

### テンプレート内での TypeScript

`<template>` は、`<script lang="ts">` や `<script setup lang="ts">` が使われている場合、バインディング式について、TypeScript をサポートします。これは、テンプレート式の中で型キャストを行う必要がある場合に便利です。

以下は不自然な例です:

```vue
<script setup lang="ts"></script>
let x: string | number = 1
</script>

<template>
  <!-- x は string の可能性があるためエラー -->
  {{ x.toFixed(2) }}
</template>
```

このエラーはインラインの型キャストで回避することができます:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Vue CLI や webpack を用いてセットアップした場合、テンプレート式での TypeScript の使用には `vue-loader@^16.8.0` が必要になります。
:::

## API 固有の情報

- [Composition API とともに TypeScript を使用する](./composition-api)
- [Options API とともに TypeScript を使用する](./options-api)
