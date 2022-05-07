---
footer: false
---

# クイックスタート

あなたのユースケースや好みに応じて、ビルドステップの有無に関わらず Vue を使うことができます。

## ビルドツールあり

ビルドセットアップによって Vue の[単一ファイルコンポーネント](/guide/scaling-up/sfc) (SFC) を使うことができます。Vue の公式ビルドセットアップは、モダンで軽量、そして非常に高速なフロントエンドビルドツールである [Vite](https://ja.vitejs.dev) に基づいています。

### オンライン

SFC を [StackBlitz](https://vite.new/vue) 上のオンラインで試してみることができます。StackBlitz は Vite に基づいたビルドセットアップをブラウザー上で直接実行するので、ローカルのセットアップとほとんど同じですが、あなたのマシンに何かをインストールする必要がありません。

### ローカル

:::tip 前提条件

- コマンドラインに精通していること
- [Node.js](https://nodejs.org/ja/) をインストールすること
  :::

マシン上にビルドツール対応の Vue プロジェクトを作成するためには、コマンドラインで次のコマンドを（`>` 記号なしで）実行します。

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

このコマンドは、公式の Vue プロジェクトスキャフォールディングツールである [create-vue](https://github.com/vuejs/create-vue) をインストールして実行します。TypeScript やテストのサポートといった複数のオプション機能がプロンプトに表示されます:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Cypress for both Unit and End-to-End testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

もしオプションについてはっきりとわからないなら、今のところ単純にエンターを押して `No` を選んでください。プロジェクトが作成されたら、指示に従って依存関係をインストールし開発サーバーを起動しましょう:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

あなたの初めての Vue プロジェクトが今実行されているはずです！　いくつか追加のヒントをどうぞ:

- IDE の推奨構成は [Visual Studio Code](https://code.visualstudio.com/) + [Volar extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) です。[WebStorm](https://www.jetbrains.com/ja-jp/webstorm/) も利用できます。
- バックエンドフレームワークとの統合を含む、ツールのさらなる詳細については、[ツールガイド](/guide/scaling-up/tooling.html) で説明しています。
- 基礎となっているビルドツール Vite について学ぶには、[Vite のドキュメント](https://ja.vitejs.dev/) を確認しましょう。
- もし TypeScript を使うことを選択したなら、[TypeScript の使い方](typescript/overview.html) を確認しましょう。

あなたのアプリをプロダクション環境に出す準備ができたら、以下を実行してください:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

これであなたのアプリのプロダクション向けビルドがプロジェクトの `./dist` ディレクトリーに作成されます。プロダクション環境への出荷についてさらに学ぶには [プロダクション環境への配信](/guide/best-practices/production-deployment.html) を確認してください。

[次のステップ ＞](#次のステップ)

## ビルドツールなし

ビルドステップなしで Vue を始めるには、単に次のコードを HTML ファイルにコピーしてブラウザーでそれを開くだけでよいです:

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

上の例ではグローバル `Vue` 変数の下ですべての API が公開されている、Vue のグローバルビルドを使っています。

グローバルビルドは機能しますが、以降のドキュメントでは一貫性を保つため主に [ES modules](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules) 構文を使用します。ネイティブ ES モジュールで Vue を使うには、代わりに次の HTML を使用してください。

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

コード中の `'vue'` から直接インポートする方法に注目してください - これは `<script type="importmap">` によって可能になり、[Import Maps](https://caniuse.com/import-maps) と呼ばれるネイティブのブラウザー機能を活用します。Import maps は現在のところ Chromium ベースのブラウザーのみで利用可能なので、学習過程の間は Chrome または Edge の使用を推奨します。あなたの好むブラウザーがまだ import maps に対応していなくとも、[es-module-shims](https://github.com/guybedford/es-module-shims) でポリフィル (polyfill) できます。

他の依存関係のエントリーを import map に追加することができます - 使おうとしているライブラリーの ES モジュールバージョンを指していることは確認してください。

:::tip プロダクション向けではありません
Import maps に基づいたセットアップは学習のみを目的にしています - プロダクション環境でビルドツールを用いずに Vue を使おうとしている場合は、[プロダクション環境への配信](/guide/best-practices/production-deployment.html#without-build-tools) を確認してください。
:::

### HTTP 経由の提供

ガイドをさらに深く潜っていくと、管理しやすくするためにコードを個別の JavaScript ファイルに分割する必要がでるかもしれません。例えば:

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

これを機能させるためには、`file://` プロトコルの代わりに `http://` プロトコル経由で提供する必要があります。ローカル HTTP サーバーを起動するには、まず [Node.js](https://nodejs.org/ja/) をインストールし、そしてコマンドラインから HTML ファイルと同じディレクトリーで `npx serve` を実行します。静的ファイルを正しい MIME タイプで提供できる他の HTTP サーバーを使うこともできます。

あなたはインポートされたコンポーネントのテンプレートが JavaScript 文字列としてインライン化されていることに気づいたかもしれません。あなたが VSCode を使っていれば、[es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 拡張をインストールして `/*html*/` コメントを文字列の前につけることで構文を強調表示 (syntax highlighting) できます。

## 次のステップ

あなたが [はじめに](/guide/introduction) を跳ばしたなら、残りのドキュメントに移る前にこれを読むことを強く推奨します。

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">ガイドを続ける</p>
    <p class="next-steps-caption">ガイドはこのフレームワークのあらゆる側面について詳しく説明しています。</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">チュートリアルを試す</p>
    <p class="next-steps-caption">手を動かしながら学びたい人々のために。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">例を見てみる</p>
    <p class="next-steps-caption">コア機能や一般的な UI タスクの例を探索する。</p>
  </a>
</div>
