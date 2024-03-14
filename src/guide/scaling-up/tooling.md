<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# ツールガイド {#tooling}

## オンラインで試す {#try-it-online}

Vue の SFC を試すためにマシンに何かをインストールする必要はありません - ブラウザーですぐに試せるオンラインのプレイグラウンドがあります:

- [Vue SFC Playground](https://play.vuejs.org)
  - 常に最新のコミットがデプロイされています
  - コンポーネントのコンパイル結果を確認できるように設計されています
- [Vue + Vite on StackBlitz](https://vite.new/vue)
  - ブラウザー上で Vite の開発サーバーを実行している IDE 的な環境です
  - ローカルでセットアップした状態に近いです

また、バグ報告の際には、これらのオンラインのプレイグラウンドで再現方法を提供することが推奨されます。

## プロジェクトの雛形の作成 (Project Scaffolding) {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) は、ファーストクラスの Vue SFC のサポートがある軽量で高速なビルドツールです。Vue の作者でもある Evan You によって作成されました！

Vite + Vue で始めるには、以下を実行するだけです:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">
  
  ```sh
  $ pnpm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">
  
  ```sh
  $ yarn create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">
  
  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

このコマンドは、Vue 公式の雛形作成 (scaffolding) ツールである [create-vue](https://github.com/vuejs/create-vue) をインストールして実行します。

- Vite の詳細については、[Vite ドキュメント](https://ja.vitejs.dev) を参照してください。
- Vite のプロジェクトで Vue のコンパイラーにオプションを渡すなどの、Vue 固有の設定をするには、[@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme) のドキュメントを参照してください。

上記のオンラインプレイグラウンドはいずれも Vite プロジェクトとしてのファイルのダウンロードにも対応しています。

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) は、Vue のための公式の webpack ベースのツールチェーンです。現在はメンテナンスモードで、特定の webpack のみの機能に依存していない限り、新しいプロジェクトは Vite で始めることを推奨します。ほとんどの場合において Vite は優れた開発経験を提供します。

Vue CLI から Vite への移行は以下を参照してください:

- [Vue CLI -> Vite マイグレーションガイド from VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [自動マイグレーションをサポートするツール / プラグイン](https://github.com/vitejs/awesome-vite#vue-cli)

### ブラウザー上でのテンプレートコンパイルについての注意点 {#note-on-in-browser-template-compilation}

Vue をビルドステップなしで使用する場合、コンポーネントテンプレートはページの HTML に直接もしくはインラインの JavaScript の文字列として書き込まれます。Vue はオンザフライでテンプレートのコンパイルを実行するために、テンプレートコンパイラーをブラウザーに同梱する必要があります。一方、ビルドステップでテンプレートをプリコンパイルすれば、コンパイラーは不要になります。Vue は、クライアントのバンドルサイズを小さくするために、ユースケースごとに最適化された [さまざまな「ビルド」](https://unpkg.com/browse/vue@3/dist/) を提供しています。

- `vue.runtime.*` で始まるビルドファイルは、**ランタイムのみのビルド** です: コンパイラーは含まれません。これらのビルドを使用する場合、全てのテンプレートはビルド時にプリコンパイルする必要があります。

- `.runtime` を含まないビルドファイルは、**フルビルド** です: コンパイラーを含み、ブラウザー上でのテンプレートのコンパイルをサポートします。しかし、ペイロードが ~14kb 増加します。

デフォルトのツールのセットアップでは、SFC 内の全てのテンプレートがコンパイル済みのため、ランタイムのみのビルドを使用します。もし、何らかの理由でビルドステップが有ってもブラウザー上でのコンパイルが必要な場合は、`vue` の代わりに `vue/dist/vue.esm-bundler.js` にエイリアスするようにビルドツールを設定すれば、コンパイルできるようになります。

ビルドステップが無いより軽量なものをお探しの場合は、[petite-vue](https://github.com/vuejs/petite-vue) をチェックしてみてください。

## IDE のサポート {#ide-support}

- 推奨の IDE の設定は [VSCode](https://code.visualstudio.com/) + [Vue - Official 拡張機能](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（元 Volar）です。その拡張は、シンタックスハイライト、TypeScript のサポート、テンプレート内の式とコンポーネント props の intellisense を提供します。

  :::tip
  Vue - Official は Vue 2 用の以前の VSCode 拡張である [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) を置き換えるものです。Vetur をインストールしている場合は、Vue 3 のプロジェクトでは無効にすることを忘れないでください。
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) も Vue SFC の素晴らしいサポートを提供しています。

- [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) をサポートする他の IDE も LSP を介して Volar のコア機能を利用できます。

  - [LSP-Volar](https://github.com/sublimelsp/LSP-volar) による Sublime Text のサポート

  - [coc-volar](https://github.com/yaegassy/coc-volar) による vim / Neovim のサポート

  - [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/) による emacs のサポート

## ブラウザーの開発者ツール {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Free Vue.js Devtools Lesson"/>

Vue のブラウザー開発者ツール拡張では、Vue アプリのコンポーネントツリーの探索や、個別のコンポーネントの状態の確認、状態管理イベントの追跡、パフォーマンスのプロファイルなどができます。

![devtools screenshot](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [ドキュメント](https://devtools.vuejs.org/)
- [Chrome Extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Firefox Addon](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [スタンドアロンの Electron アプリ](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

主な記事: [TypeScript で Vue を使用する](/guide/typescript/overview).

- [Vue - Official 拡張機能](https://github.com/vuejs/language-tools)は `<script lang="ts">` ブロックを使用した SFC に対して、テンプレート内の式やコンポーネント間の props のバリデーションを含む型チェックを提供します。

- コマンドラインから同様の型チェックを行う場合や、SFC 用の `d.ts` ファイルを生成する場合は、[`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) を使用します。

## テスト {#testing}

主な記事: [テストガイド](/guide/scaling-up/testing).

- E2E テストには [Cypress](https://www.cypress.io/) を推奨します。また、[Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction) を介して、Vue の SFC のコンポーネントテストに使用することも可能です。

- [Vitest](https://vitest.dev/) は、Vue / Vite チームのメンバーによって作成された、スピードに重点を置いたテストランナーです。Vite ベースのアプリケーションにユニット/コンポーネントテストと同じ即時のフィードバックループを提供するために、特別に設計されています。

- [Jest](https://jestjs.io/) は [vite-jest](https://github.com/sodatea/vite-jest) を介して Vite で動作させることができます。しかし、これは、既存の Jest ベースのテストスイートを Vite ベースに移行する必要がある場合にのみ推奨される方法で、Vitest では同様の機能をより効率的に統合することができます。

## リント {#linting}

Vue チームは、SFC 固有のリントルールをサポートする [ESLint](https://eslint.org/) プラグインである [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) をメンテナンスしています。

Vue CLI を使用していたユーザーは、webpack ローダーを介してリンターを設定することに慣れているかもしれません。しかし、Vite ベースのビルド設定を使用する場合、私たちの一般的な推奨事項は次のとおりです:

1. `npm install -D eslint eslint-plugin-vue` を実行し、それから `eslint-plugin-vue` の [設定ガイド](https://eslint.vuejs.org/user-guide/#usage) に従います。

2. [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) などの ESLint の IDE 拡張を設定することで、開発中にエディターで直接リンターのフィードバックを受けることができます。また、開発サーバーの起動時に不要なリントが実行されるコストを回避することができます。

3. プロダクションビルドコマンドの一部として ESLint を実行し、プロダクションにリリースする前に完全なリンターのフィードバックを受けることができます。

4. (任意) [lint-staged](https://github.com/okonet/lint-staged) のようなツールを設定して、git commit 時に変更したファイルを自動的にリントするようにします。

## コードフォーマット {#formatting}

- [Vue - Official](https://github.com/vuejs/language-tools) VSCode 拡張は、すぐ使える Vue SFC のフォーマット機能を提供します。

- また、 [Prettier](https://prettier.io/) では、Vue の SFC のフォーマットを組み込みでサポートしています。

## SFC カスタムブロック統合 {#sfc-custom-block-integrations}

カスタムブロックは、異なるリクエストクエリを持つ同じ Vue ファイルへのインポートにコンパイルされます。これらのインポートリクエストを処理するのは、ビルドツールに任されています。

- Vite を使用する場合、カスタム Vite プラグインを使用して、マッチしたカスタムブロックを実行可能な JavaScript に変換する必要があります。[例](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Vue CLI またはプレーンな webpack を使用している場合、マッチしたブロックを変換するために webpack ローダーを設定する必要があります。[例](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## 低レベルのパッケージ群 {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [ドキュメント](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

このパッケージは Vue core のモノレポの一部で、常にメインの `vue` パッケージと同じバージョンで公開されています。このパッケージはメインの `vue` パッケージの依存関係として含まれており、 `vue/compiler-sfc` の下にプロキシされているので、個別にインストールする必要はありません。

このパッケージ自体は、Vue SFC を処理するための低レベルのユーティリティーを提供し、カスタムツールで Vue SFC をサポートする必要があるツールの作者のみを対象としています。

:::tip
Vue のランタイムと同期したバージョンであることを保証するため `vue/compiler-sfc` のディープインポートを介して使用するのが好ましいです。
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [ドキュメント](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Vite で Vue SFC のサポートを提供するための公式プラグインです。

### `vue-loader` {#vue-loader}

- [ドキュメント](https://vue-loader.vuejs.org/)

webpack で Vue の SFC サポートを提供するための公式ローダーです。Vue CLI をお使いの方は、[Vue CLI の `vue-loader` オプションの編集についてのドキュメント](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader) もご覧ください。

## その他のオンラインプレイグラウンド {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on Components.studio](https://components.studio/create/vue3)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
