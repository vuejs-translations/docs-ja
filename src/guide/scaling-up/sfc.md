# 単一ファイルコンポーネント {#single-file-components}

## はじめに {#introduction}

Vue 単一ファイルコンポーネント（別名 `*.vue` ファイル、 **SFC** と略記）は、Vue コンポーネントのテンプレート、ロジック、 **および** スタイルを 1 つのファイルにカプセル化できる特別なファイル形式です。SFC の例を以下に示します:

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

ご覧のとおり、Vue SFC は、HTML、CSS、JavaScript という古典的な 3 つの自然な拡張です。`<template>`、`<script>` および `<style>` ブロックは、同じファイル内のコンポーネントのビュー、ロジック、およびスタイルをカプセル化してまとめます。完全な構文は、 [SFC 構文仕様](/api/sfc-spec)で定義されています。

## なぜ SFC なのか {#why-sfc}

SFC にはビルドステップが必要ですが、その代わりに多くの利点があります:

- 使い慣れた HTML、CSS と JavaScript 構文を使用したモジュール化されたコンポーネントの作成
- [本質的に結合された関心の連結](#関心の分離についてはどうですか？)
- ランタイムのコンパイルコストがかからない事前コンパイルされたテンプレート
- [コンポーネントスコープのCSS](/api/sfc-css-features)
- [Composition API を使用する場合のより人間工学的な構文](/api/sfc-script-setup)
- テンプレートとスクリプトを相互分析することによるコンパイル時の最適化の強化
- テンプレート内の式のオートコンプリートと型チェックによる[IDE のサポート](/guide/scaling-up/tooling.html#IDE-のサポート)
- すぐに使用できるホットモジュールリプレイスメント（HMR）のサポート

SFC は、フレームワークとしての Vue を特徴付ける機能であり、次のシナリオで Vue を使用するための推奨されるアプローチです:

- シングルページアプリケーション (SPA)
- 静的サイトジェネレーション (SSG)
- より良い開発体験（DX）のためにビルドステップを正当化できるあらゆる重要なフロントエンド

そうは言っても、SFC がやり過ぎのように感じるシナリオがあることは認識しています。このため、Vue はビルドステップなしでプレーンな JavaScript で使用することができます。大部分が静的な HTML に軽いインタラクションを加える場合は、プログレッシブエンハンスメント用に最適化された Vue の 6 kB のサブセットである [petite-vue](https://github.com/vuejs/petite-vue) もご覧ください。

## 仕組み {#how-it-works}

Vue SFC はフレームワーク固有のファイル形式であり、[@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) によって標準の JavaScript と CSS に事前コンパイルする必要があります。コンパイルされた SFC は標準的な JavaScript（ES）モジュールです。つまり、適切なビルドセットアップを使用すると、モジュールのように SFC をインポートできます:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 内の `<style>` タグは通常ホットアップデートをサポートするために、開発中にネイティブな `<style>` タグとして挿入されます。本番環境では、それらを抽出して 1 つの CSS ファイルにマージできます。

[Vue SFC Playground](https://sfc.vuejs.org/) では、SFC を試したり、どのようにコンパイルされるかを調べることができます。

実際のプロジェクトでは、一般的に、SFC コンパイラーを [Vite](https://vitejs.dev/) や [Vue CLI](http://cli.vuejs.org/)（[webpack](https://webpack.js.org/)ベース）などのビルドツールと統合します。Vue では、SFC をできるだけ早く使い始めるための公式の scaffolding ツールを提供します。詳細については、[SFC ツール](/guide/scaling-up/tooling) をご覧ください。

## 関心の分離についてはどうですか？ {#what-about-separation-of-concerns}

従来の Web 開発のバックグラウンドを持つ一部のユーザーは、SFC が HTML / CSS / JS が分離するはずの異なる関心を同じ場所に混在させているのではないか！という懸念を持つかもしれません。

この質問に答えるには、 **関心の分離がファイルタイプの分離と同じではないこと** に同意することが重要です。エンジニアリング原則の最終的な目標は、コードベースの保守性を向上させることです。関心の分離は、ファイルタイプの分離のように独断的に適用されると、ますます複雑化するフロントエンドアプリケーションのコンテキストでは、その目標を達成することに役立ちません。

現代の UI 開発では、コードベースを互いに織り交ぜる 3 つの巨大なレイヤーに分割するのではなく、それらを疎結合なコンポーネントに分割して構成する方がはるかに理にかなっていることが分かっています。コンポーネント内では、そのテンプレート、ロジック、およびスタイルが本質的に結合されており、それらを連結することで、実際にコンポーネントがよりまとまり、保守しやすくなります。

単一ファイルコンポーネントのアイデアが好まない場合でも、[Src Imports](/api/sfc-spec.html#src-imports) を使用して JavaScript と CSS を別々のファイルに分割することで、ホットリロードと事前コンパイル機能を活用できることに注意してください。
