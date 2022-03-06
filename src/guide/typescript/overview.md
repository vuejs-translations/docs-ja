---
outline: deep
---

# TypeScript で Vue を使用する

TypeScript のような型システムは、ビルド時に静的解析で多くの一般的なエラーを検出できます。これにより、本番環境でのランタイムエラーの確率を下げ、より自信を持って大規模アプリケーションのコードをリファクタリングできるようになります。TypeScript は、IDE における型ベースの自動補完により、開発者の人間工学も改善します。

Vue 自体が TypeScript で書かれており、第一級の TypeScript のサポートを提供します。全ての公式 Vue パッケージには型定義が付属されているため、すぐに利用することができます。

## プロジェクトのセットアップ

[`create-vue`](https://github.com/vuejs/create-vue) は公式のプロジェクトセットアップツールで、[Vite](https://vitejs.dev/) を用いた TypeScript 対応の Vue プロジェクトをセットアップするためのオプションを提供します。

### 概要

Vite ベースのセットアップでは、開発サーバーとそのバンドラーはトラインスパイルのみ行い、型チェックは行いません。これにより、Vite の開発サーバーは TypeScript を使用していても超高速に動作し続けることが保証されます。

- 開発中は、すぐに型エラーのフィードバックを得るために、優れた [IDE セットアップ](#ide-のサポート) に頼ることを推奨します。

- SFC を使用する場合、コマンドラインでの型チェックと型宣言の生成には [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc) を使用します。`vue-tsc` は TypeScript 独自のコマンドラインインターフェースである `tsc` のラッパーです。TypeScript のファイルに加えて Vue SFC をサポートする以外は、`tsc` とほぼ同じように動作します。

- `vue-tsc` は現在、ウォッチモードをサポートしていませんが、ロードマップ上に存在しています。それまでの間、dev コマンドの一部として型チェックを行いたい場合は、[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) を確認してください。

- Vue CLI は TypeScript もサポートしていますが、推奨されなくなりました。[以下の注意](#vue-cli-と-ts-loader-に関する注意)を参照してください。

### IDE のサポート

- [Visual Studio Code](https://code.visualstudio.com/) (VSCode) は、すぐに利用できる TypeScript サポートを提供しているため、強く推奨されます。

  - [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) は公式 VSCode 拡張機能です。Vue SFC 内部での TypeScript のサポートなど、その他の優れた機能を持ちます。

    :::tip
    Volar は Vue 2 の公式 VSCode 拡張機能である [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) を置き換えるものです。現在 Vetur がインストールされている場合、Vue 3 のプロジェクトで必ず無効化してください。
    :::

  - TS ファイル内で `*.vue` をインポートする際に型サポートを得る場合、[TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) も必要となります。

- [WebStorm](https://www.jetbrains.com/webstorm/) は TypeScript と Vue の両方をすぐに利用できるようサポートしています。他の JetBrains IDE も最初から、または [この無料プラグイン](https://plugins.jetbrains.com/plugin/9442-vue-js) で、これらをサポートしています。

### `tsconfig.json` の構成

`create-vue` を使ってセットアップしたプロジェクトには、構成済みの `tsconfig.json` が含まれます。ベースとなった構成は [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) パッケージにて抽象化されています。プロジェクト内部では、[Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) を使って、異なる環境（例: アプリとテスト）で実行されるコードに対して正しい型を保証しています。

`tsconfig.json` を手動で構成する場合、いくつかの注目すべきオプションは以下の通りです:

- Vite は TypeScript のトランスパイルに [esbuild](https://esbuild.github.io/) を使用しており、単一ファイルのトランスパイル制限に従うので、[`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) を `true` に設定してください。

- Options API を使用する場合は、コンポーネントオプションにおける this の型チェックを活用するために [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) を `true` に設定 (もしくは少なくとも strict フラグの一部である [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) を `true` に設定) する必要があります。そうでないと、this は常に any 型として扱われます。

- 例えば `create-vue` プロジェクトでデフォルトで設定される `@/*` エイリアスのような resolver エイリアスをビルドツールで設定した場合、TypeScript 用の設定として、[`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) にもエイリアスを設定する必要があります。

参照:

- [Official TypeScript compiler options docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript compilation caveats](https://esbuild.github.io/content-types/#typescript-caveats)

### Takeover Mode

> このセクションは、VSCode + Volar の場合のみ該当します。

Vue SFC と TypeScript を連携させるために、 Volar は Vue 固有のサポートをパッチした別の TS 言語サービスインスタンスを作成し、Vue SFC 内で使われます。同時に、プレーンな TS ファイルは依然として VSCode の組み込み TS 言語サービスによって処理されます。TS ファイル内での Vue SFC インポートのサポート時に [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) が必要なのはそういった理由からです。このデフォルトのセットアップ方法はうまく動きますが、プロジェクトごとに 2 つの TS 言語サービスインスタンスが実行されます: 1 つは Volar の言語サービス、もう 1 つは VSCode の組み込み言語サービスです。これは少し非効率であり、大規模プロジェクトではパフォーマンスの問題を引き起こす可能性があります。

Volar はパフォーマンスの改善のために、"Takeover Mode" と呼ばれる機能を提供しています。Takeover Mode では、Volar は単一の TS 言語サービスインスタンスを使用して Vue と TS の両ファイルをサポートします。

Takeover Mode を有効にするには以下の手順に従って、VSCode の組み込み TS 言語サービスを**プロジェクトのワークスペースのみ**で無効化する必要があります:

1. プロジェクトのワークスペース内で、 `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）でコマンドパレットを表示します。
2. `built` と入力し、"Extensions: Show Built-in Extensions" を選択します。
3. 拡張機能の検索ボックスに `typescript` と入力します（`@builtin` というプレフィックスは削除しないでください）。
4. "TypeScript and JavaScript Language Features" の小さい歯車のアイコンをクリックし、"Disable (Workspace)" を選択してください。
5. ワークスペースを再読み込みしてください。Vue または TS ファイルを開くと、Takeover Mode が有効になります。

<img src="./images/takeover-mode.png" width="590" height="426" style="margin:0px auto;border-radius:8px">

### Vue CLI と `ts-loader` に関する注意

Vue CLI など、webpack ベースのセットアップでは、モジュールの変換パイプラインの一部で、例えば `ts-loader` を使って型チェックを行うことが一般的です。しかし、これは型チェックを行うためにモジュールグラフ全体の知識が必要となるので、クリーンな解決法とは言えません。個々のモジュールの変換ステップは、単にこのタスクを行うための良い方法ではないのです。これは、以下のような問題を引き起こします:

- `ts-loader` は変換後のコードしか型チェックができません。これは、IDE や `vue-tsc` でみられる、ソースコードに直接マップされるエラーとは一致しません。

- 型チェックは遅くなる可能性があります。コード変換と同じスレッド / プロセスで行われると、アプリケーション全体のビルド速度に大きく影響します。

- すでに IDE で型チェックを別のプロセスで実行しているので、開発体験を低下させるコストは、単純に適切なトレードオフではありません。

現在、Vue CLI 経由で Vue 3 + TypeScript を使っている場合、Vite への移行を強く推奨します。トランスパイルのみでの TS サポートを有効にする CLI オプションにも取り組んでいるので、型チェックのために `vue-tsc` に切り替えることができます。

## 一般的な使用上の注意

### `defineComponent()`

TypeScript がコンポーネントオプション内の型を適切に推論できるようにするには、[`defineComponent()`](/api/general.html#definecomponent) を使ってコンポーネントを定義する必要があります:

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

参照: [type tests for `defineComponent`](https://github.com/vuejs/core/blob/main/test-dts/defineComponent.test-d.tsx)

:::tip
`defineComponent()` は、プレーンな JavaScript で定義されたコンポーネントに対しても型推論を行うことができます。
:::

### 単一ファイルコンポーネントでの使用法

SFC で TypeScript を使用する場合、`<script>` タグに `lang="ts"` 属性を追加してください。`lang="ts"` が存在する場合、全てのテンプレート式に対してもより厳格な型チェックを利用できます。

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

`<template>` は、`<script lang="ts">` や `<script setup lang="ts">` が使われている場合、バインディング式について、TypeScript をサポートします。これは、テンプレート式で型キャストを行う必要がある場合に便利です。

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
Vue CLI または webpack ベースのセットアップを使用する場合、テンプレート式での TypeScript の使用には `vue-loader@^16.8.0` が必要になります。
:::

## API 固有のレシピ

- [Composition API とともに TypeScript を使用する](./composition-api)
- [Options API とともに TypeScript を使用する](./options-api)
