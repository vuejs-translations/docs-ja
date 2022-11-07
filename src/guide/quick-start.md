---
footer: false
---

# クイックスタート {#quick-start}

## オンラインで Vue を試す {#try-vue-online}

- Vue をすぐに体験するには、[プレイグラウンド](https://sfc.vuejs.org/#eNo9j01qAzEMha+iapMWOjbdDm6gu96gG2/cjJJM8B+2nBaGuXvlpBMwtj4/JL234EfO6toIRzT1UObMexvpN6fCMNHRNc+w2AgwOXbPL/caoBC3EjcCCPU0wu6TvE/wlYqfnnZ3ae2PXHKMfiwQYArZOyYhAHN+2y9LnwLrarTQ7XeOuTFch5Am8u8WRbcoktGPbnzFOXS3Q3BZXWqKkuRmy/4L1eK4GbUoUTtbPDPnOmpdj4ee/1JVKictlSot8hxIUQ3Dd0k/lYoMtrglwfUPkXdoJg==)で直接試すことができます。

- もし、ビルドのステップのないプレーンな HTML のセットアップを好む場合は、この [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) を出発点として使用できます。

- Node.js とビルドツールの概念に既に慣れている場合は、[StackBlitz](https://vite.new/vue) を使ってブラウザー内で完全なビルドセットアップを試すことも可能です。

## Vue アプリケーションの作成 {#creating-a-vue-application}

:::tip 前提条件

- コマンドラインに精通していること
- [Node.js](https://nodejs.org/ja/) のバージョン 16.0 以上をインストールすること
  :::

このセクションでは、ローカルマシン上で Vue の[シングルページアプリケーション](/guide/extras/ways-of-using-vue.html#single-page-application-spa)を生成する方法を紹介します。作成されたプロジェクトは、[Vite](https://ja.vitejs.dev/) に基づいたビルド設定を使用し、Vue の単一ファイルコンポーネント（SFC）を使用できるようにします。

[Node.js](https://nodejs.org/) の最新バージョンがインストールされていることを確認してから、コマンドラインで次のコマンドを（`>` 記号なしで）実行します:

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

あなたの初めての Vue プロジェクトが今実行されているはずです！　なお、生成されたプロジェクトのサンプルコンポーネントは、[Options API](/guide/introduction.html#options-api) ではなく、[Composition API](/guide/introduction.html#composition-api) と `<script setup>` で書かれていることに注意してください。いくつか追加のヒントをどうぞ:

- IDE の推奨構成は [Visual Studio Code](https://code.visualstudio.com/) + [Volar extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) です。他のエディターを使用している場合は、[IDE のサポート](/guide/scaling-up/tooling.html#ide-support)を確認してください。
- バックエンドフレームワークとの統合を含む、ツールのさらなる詳細については、[ツールガイド](/guide/scaling-up/tooling.html) で説明しています。
- 基礎となっているビルドツール Vite について学ぶには、[Vite のドキュメント](https://ja.vitejs.dev/) を確認しましょう。
- もし TypeScript を使うことを選択したなら、[TypeScript の使い方](typescript/overview.html) を確認しましょう。

あなたのアプリをプロダクション環境に出す準備ができたら、以下を実行してください:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

これであなたのアプリのプロダクション向けビルドがプロジェクトの `./dist` ディレクトリーに作成されます。プロダクション環境への出荷についてさらに学ぶには [プロダクション環境への配信](/guide/best-practices/production-deployment.html) を確認してください。

[次のステップ ＞](#次のステップ)

## CDN の Vue を使用する {#using-vue-from-cdn}

script タグで CDN から直接 Vue を使用できます:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

ここでは [unpkg](https://unpkg.com/) を使っていますが、例えば [jsdelivr](https://www.jsdelivr.com/package/npm/vue) や [cdnjs](https://cdnjs.com/libraries/vue) など、npm パッケージを提供する CDN なら何でも使えます。もちろん、このファイルをダウンロードして、自分で配信することもできます。

CDN から Vue を使用する場合は「ビルドステップ」は必要ありません。これによりセットアップが非常にシンプルになり、静的な HTML を拡張したり、バックエンドのフレームワークと統合したりするのに適しています。ただし、単一ファイルコンポーネント（SFC）の構文は使用できません。

### グローバルビルドの使用 {#using-the-global-build}

上記のリンクは、Vue の**グローバルビルド**を読み込んでいます。これは、すべてのトップレベル API がグローバルな `Vue` オブジェクトのプロパティとして公開されています。以下は、グローバルビルドを使用した完全な例です:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[JSFiddle のデモ](https://jsfiddle.net/yyx990803/nw1xg8Lj/)

### ES モジュール ビルドの使用 {#using-the-es-module-build}

このドキュメントの残りの部分では、主に [ES モジュール](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)構文を使用します。最近のブラウザーは ES モジュールをネイティブでサポートしているので、次のようにネイティブの ES モジュールで CDN から Vue を使用できます:

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

`<script type="module">` を使用していることと、インポートされる CDN の URL が、（ひとつ前の例とは違って）Vue の **ES モジュール ビルド** を指していることに注意してください。

[JSFiddle のデモ](https://jsfiddle.net/yyx990803/vo23c470/)

### インポートマップの有効化 {#enabling-import-maps}

上記の例では、完全な CDN URL からインポートしていますが、他のドキュメントでは、次のようなコードが表示されます:

```js
import { createApp } from 'vue'
```

[インポートマップ](https://caniuse.com/import-maps)を使って、`vue` のインポートの場所をブラウザーに教えることができます:

```html{1-7,12}
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

[JSFiddle のデモ](https://jsfiddle.net/yyx990803/2ke1ab0z/)

他の依存関係のエントリーをインポートマップに追加することもできますが、使おうとしているライブラリーの ES モジュールバージョンを指していることを確認してください。

:::tip インポートマップのブラウザサポート
インポートマップは Chromium ベースのブラウザーでデフォルトでサポートされているため、学習過程の間は Chrome または Edge の使用を推奨します。

Firefox を使用している場合、バージョン 102+ でのみサポートされており、現在は `about:config` にある `dom.importMaps.enabled` オプションで有効にする必要があります。

あなたの好むブラウザーがまだインポートマップに対応していなくとも、[es-module-shims](https://github.com/guybedford/es-module-shims) でポリフィル (polyfill) できます。
:::

:::warning プロダクション使用の注意
ここまでの例では、Vue の開発ビルドを使用しています。プロダクションで CDN から Vue を使用する場合は、[プロダクション環境への配信](/guide/best-practices/production-deployment.html#without-build-tools)を確認してください。
:::

### モジュールの分割 {#splitting-up-the-modules}

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

ES モジュールは `file://` プロトコルでは動作しないため、上記の `index.html` をブラウザーで直接開くとエラーが発生します。これを動作させるには、ローカルの HTTP サーバーを使い `http://` プロトコルで `index.html` を配信する必要があります。

ローカル HTTP サーバーを起動するには、まず [Node.js](https://nodejs.org/ja/) をインストールし、HTML ファイルと同じディレクトリーで、コマンドラインから `npx serve` を実行します。正しい MIME タイプで静的ファイルを配信できる、他の HTTP サーバーを使用することもできます。

あなたはインポートされたコンポーネントのテンプレートが JavaScript 文字列としてインライン化されていることに気づいたかもしれません。あなたが VSCode を使っていれば、[es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 拡張をインストールして `/*html*/` コメントを文字列の前につけることで構文を強調表示 (syntax highlighting) できます。

### ビルドステップなしで Composition API を使用する {#using-composition-api-without-a-build-step}

Composition API の例の多くは `<script setup>` 構文を使用しています。Composition API をビルドなしで使用する場合は、[`setup()` オプション](/api/composition-api-setup.html)の使用方法を参照してください。

## 次のステップ {#next-steps}

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
