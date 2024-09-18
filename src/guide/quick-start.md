---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# クイックスタート {#quick-start}

## オンラインで Vue を試す {#try-vue-online}

- Vue をすぐに体験するには、[Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==) で直接試すことができます。

- もし、ビルドのステップのないプレーンな HTML のセットアップを好む場合は、この [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) を出発点として使用できます。

- Node.js とビルドツールの概念に既に慣れている場合は、[StackBlitz](https://vite.new/vue) を使ってブラウザー内で完全なビルドセットアップを試すことも可能です。

## Vue アプリケーションの作成 {#creating-a-vue-application}

:::tip 前提条件

- コマンドラインに慣れている
- [Node.js](https://nodejs.org/ja/) のバージョン 18.3 以上をインストールしている
  :::

このセクションでは、ローカルマシン上で Vue の[シングルページアプリケーション](/guide/extras/ways-of-using-vue#single-page-application-spa)を生成する方法を紹介します。作成されたプロジェクトは、[Vite](https://ja.vitejs.dev/) に基づいたビルド設定を使用し、Vue の単一ファイルコンポーネント（SFC）を使用できるようにします。

[Node.js](https://nodejs.org/) の最新バージョンがインストールされていること、現在の作業ディレクトリがプロジェクトを作成する予定の場所であることを確認し、コマンドラインで次のコマンドを（`$` 記号なしで）実行します:

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
  # Yarn (v1+)
  $ yarn create vue

  # Yarn (v2+)
  $ yarn create vue@latest
  
  # Yarn ^v4.11
  $ yarn dlx create-vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

このコマンドは、公式の Vue プロジェクトスキャフォールディングツールである [create-vue](https://github.com/vuejs/create-vue) をインストールして実行します。TypeScript やテストのサポートなど、いくつかのオプション機能がプロンプトに表示されます:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Nightwatch / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… No / <span style="color:#89DDFF;text-decoration:underline">Yes</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue DevTools 7 extension for debugging? (experimental) <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

もしオプションについてはっきりとわからないなら、今のところ単純にエンターを押して `No` を選んでください。プロジェクトが作成されたら、指示に従って依存関係をインストールし開発サーバーを起動しましょう:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ npm install
  $ npm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ pnpm install
  $ pnpm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ yarn
  $ yarn dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ bun install
  $ bun run dev
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

あなたの初めての Vue プロジェクトが今実行されているはずです！　なお、生成されたプロジェクトのサンプルコンポーネントは、[Options API](/guide/introduction#options-api) ではなく、[Composition API](/guide/introduction#composition-api) と `<script setup>` で書かれていることに注意してください。いくつか追加のヒントをどうぞ:

- IDE の推奨構成は [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Official 拡張機能](https://marketplace.visualstudio.com/items?itemName=Vue.volar) です。他のエディターを使用している場合は、[IDE のサポート](/guide/scaling-up/tooling#ide-support)を確認してください。
- バックエンドフレームワークとの統合を含む、ツールのさらなる詳細については、[ツールガイド](/guide/scaling-up/tooling) で説明しています。
- 基礎となっているビルドツール Vite について学ぶには、[Vite のドキュメント](https://ja.vitejs.dev/) を確認しましょう。
- もし TypeScript を使うことを選択したなら、[TypeScript の使い方](typescript/overview) を確認しましょう。

あなたのアプリをプロダクション環境に出す準備ができたら、以下を実行してください:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh
  $ pnpm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh
  $ yarn build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun run build
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

これであなたのアプリのプロダクション向けビルドがプロジェクトの `./dist` ディレクトリーに作成されます。プロダクション環境への出荷についてさらに学ぶには [プロダクション環境への配信](/guide/best-practices/production-deployment) を確認してください。

[次のステップ ＞](#next-steps)

## CDN の Vue を使用する {#using-vue-from-cdn}

script タグで CDN から直接 Vue を使用できます:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

ここでは [unpkg](https://unpkg.com/) を使っていますが、例えば [jsdelivr](https://www.jsdelivr.com/package/npm/vue) や [cdnjs](https://cdnjs.com/libraries/vue) など、npm パッケージを提供する CDN なら何でも使えます。もちろん、このファイルをダウンロードして、自分で配信することもできます。

CDN から Vue を使用する場合は「ビルドステップ」は必要ありません。これによりセットアップが非常にシンプルになり、静的な HTML を拡張したり、バックエンドのフレームワークと統合したりするのに適しています。ただし、単一ファイルコンポーネント（SFC）の構文は使用できません。

### グローバルビルドの使用 {#using-the-global-build}

上記のリンクは、Vue の**グローバルビルド**を読み込んでいます。これは、すべてのトップレベル API がグローバルな `Vue` オブジェクトのプロパティとして公開されています。以下は、グローバルビルドを使用した完全な例です:

<div class="options-api">

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

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
このガイドでは、Composition API の多くの例で `<script setup>` という構文を使用しており、これにはビルド ツールが必要です。ビルドステップなしで Composition API を使用する場合は、[`setup()` オプション](/api/composition-api-setup) の使い方を参照してください。
:::

</div>

### ES モジュール ビルドの使用 {#using-the-es-module-build}

このドキュメントの残りの部分では、主に [ES モジュール](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)構文を使用します。最近のブラウザーは ES モジュールをネイティブでサポートしているので、次のようにネイティブの ES モジュールで CDN から Vue を使用できます:

<div class="options-api">

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

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

`<script type="module">` を使用していることと、インポートされる CDN の URL が、（ひとつ前の例とは違って）Vue の **ES モジュール ビルド** を指していることに注意してください。

<div class="options-api">

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### インポートマップの有効化 {#enabling-import-maps}

上記の例では、完全な CDN URL からインポートしていますが、他のドキュメントでは、次のようなコードが表示されます:

```js
import { createApp } from 'vue'
```

[インポートマップ](https://caniuse.com/import-maps)を使って、`vue` のインポートの場所をブラウザーに教えることができます:

<div class="options-api">

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

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

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
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen のデモ &gt;](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

他の依存関係のエントリーをインポートマップに追加することもできますが、使用するライブラリーの ES モジュールのバージョンを指していることを確認してください。

:::tip インポートマップのブラウザーサポート
インポートマップは比較的新しいブラウザー機能です。必ず[サポート範囲](https://caniuse.com/import-maps)内のブラウザーを使用してください。特に、Safari 16.4+ でのみサポートされています。
:::

:::warning プロダクション使用の注意
ここまでの例では、Vue の開発ビルドを使用しています。プロダクションで CDN から Vue を使用する場合は、[プロダクション環境への配信](/guide/best-practices/production-deployment#without-build-tools)を確認してください。

ビルドシステムなしで Vue を使用することは可能ですが、別のアプローチとして、[`vuejs/petite-vue`](https://github.com/vuejs/petite-vue) を使用することも検討してください。`petite-vue` は、[`jquery/jquery`](https://github.com/jquery/jquery)（過去）や[`alpinejs/alpine`](https://github.com/alpinejs/alpine)（現在）が使用されるようなコンテキストに適しています。
:::

### モジュールの分割 {#splitting-up-the-modules}

ガイドをさらに深く潜っていくと、管理しやすくするためにコードを個別の JavaScript ファイルに分割する必要がでるかもしれません。例えば:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>Count is: {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>Count is: {{ count }}</div>`
}
```

</div>

ES モジュールは `file://` プロトコルでは動作しないため、上記の `index.html` をブラウザーで直接開くとエラーが発生します。これは、ローカルファイルを開くときにブラウザーが使用するプロトコルです。

セキュリティー上の理由から、ES モジュールは `http://` プロトコルでのみ動作できます。これはブラウザがウェブ上でページを開くときに使用するプロトコルです。ES モジュールをローカルマシンで動作させるためには、ローカルの HTTP サーバーを使って `http://` プロトコルで `index.html` を配信する必要があります。

ローカル HTTP サーバーを起動するには、まず [Node.js](https://nodejs.org/en/) がインストールされていることを確認し、HTML ファイルがあるのと同じディレクトリでコマンドラインから `npx serve` を実行します。正しい MIME タイプで静的ファイルを配信できる他の HTTP サーバーを使用することもできます。

インポートされたコンポーネントのテンプレートが JavaScript 文字列としてインライン化されていることに気づいたかもしれません。VS Code を使っている場合は [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 拡張機能をインストールして、文字列の前に `/*html*/` というコメントをつけることでシンタックスハイライトさせられます。

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
