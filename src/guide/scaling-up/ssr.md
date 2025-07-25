---
outline: deep
---

# サーバーサイドレンダリング（SSR） {#server-side-rendering-ssr}

## 概要 {#overview}

### SSR とは？ {#what-is-ssr}

Vue.js は、クライアントサイドのアプリケーションを構築するためのフレームワークです。デフォルトでは、Vue コンポーネントは、出力としてブラウザー内で DOM を生成・操作します。ですが、同じコンポーネントをサーバー上で HTML 文字列にレンダリングし、それをブラウザーに直接送信し、最終的にクライアント上で完全にインタラクティブなアプリケーション内に静的なマークアップを"hydrate（ハイドレート）"することもできます。

サーバーレンダリングの Vue.js アプリケーションは、アプリケーションのコードの大部分がサーバー**と**クライアントの両方で実行されるという意味で、"isomorphic"（アイソモルフィック）または "universal"（ユニバーサル）であると考えることもできます。

### なぜ SSR なのか？ {#why-ssr}

クライアントサイドの SPA（シングルページアプリケーション）と比較して、主な SSR の利点は次の点にあります:

- **コンテンツ表示速度の高速化**: これは、低速のインターネットや低速のデバイスでより顕著です。サーバーレンダリングのマークアップは、すべての JavaScript のダウンロードと実行が完了するまで表示されるのを待つ必要がないため、ユーザーはより早く、完全にレンダリングされたページを見ることができます。さらに、初回アクセス時のデータ取得はサーバーサイドで行われるため、クライアントよりもデータベースへの接続が高速になる可能性があります。これにより、一般的には [Core Web Vitals](https://web.dev/vitals/) メトリクスが向上し、ユーザー体験が改善されます。また、コンテンツ表示速度がコンバージョン率に直結するアプリケーションでは重要です。

- **統一されたメンタルモデル**: バックエンドのテンプレートシステムとフロントエンドのフレームワークを行ったり来たりする代わりに、同じ言語で、同じ宣言型の、コンポーネント指向のメンタルモデルを使って、アプリケーション全体を開発することができます。

- **SEO 向上**: 検索エンジンクローラーが完全にレンダーされたページを直接見ることができます。

  :::tip
  現時点で Google と Bing は、同期型の JavaScript アプリケーションを問題なくインデックスできます。ここでのキーワードは同期です。アプリケーションがローディングスピナー（ロード状態）と共に始まり、Ajax でコンテンツを取得する場合、クローラーはアプリケーションの終了を待ちません。つまり、SEO が重要なページで非同期にコンテンツを取得する場合、SSR が必要になるかもしれません。
  :::

また、SSR を使用する際には、いくつかのトレードオフを考慮する必要もあります:

- 開発の制約。ブラウザー固有のコードは、特定のライフサイクルフック内でのみ使用可能です。また、外部ライブラリーの中には、サーバーレンダリング時のアプリケーション内で実行できるようにするためには特別な処理が必要なものがあります。

- ビルドのセットアップとデプロイの要件がより複雑になります。任意の静的ファイルサーバーにデプロイできる完全静的 SPA とは異なり、サーバーレンダリングアプリケーションは Node.js サーバーを実行できる環境が必要です。

- サーバー側の負荷が増えます。Node.js で完全なアプリケーションをレンダリングすると、静的なファイルだけを提供するよりも CPU 負荷が高くなります。したがって、高トラフィックが予想される場合は、相応のサーバー負荷に備え、賢いキャッシュ戦略をとる必要があります。

アプリケーションに SSR を用いる前に、まず問うべき質問は、それが本当に必要かどうかということです。これは、アプリケーションにとってコンテンツ表示速度がどれだけ重要であるか次第です。例えば、社内向けのダッシュボードを作成していて、数百ミリ秒の初期ロードがあってもそれほど重要ではない場合、SSR はオーバーエンジニアリングになります。ですが、コンテンツ表示速度が絶対的に重要であるケースにおいては、SSR は最大限の初期ロードパフォーマンスの達成に役立ちます。

### SSR vs. SSG {#ssr-vs-ssg}

**静的サイトジェネレーション（SSG）** は、プリレンダリングとも呼ばれ、高速なウェブサイトを構築する、もう 1 つの代表的な技術です。ページのサーバーレンダリングに必要なデータが、全てのユーザーに対して同じであれば、リクエストが来るたびにページをレンダリングする代わりに、あらかじめビルド時に一度だけレンダリングしておくことができます。プリレンダリングされたページは、静的な HTML ファイルとして生成・提供されます。

SSG は SSR アプリケーションと同じパフォーマンス特性を持っており、優れたコンテンツ表示速度性能を提供します。同時に、出力内容が静的な HTML とアセットであるため、SSR アプリケーションよりも低コストで簡単なデプロイが可能です。ここで重要なのは **static（静的）** というキーワードです: SSG は静的なデータ、つまりビルド時に既に内容が分かっていて、リクエスト間で変更されることのないデータを提供するページにのみ適用できます。データが変更されるたびに新しいデプロイが必要です。

もしあなたが一握りのマーケティングページ（例: `/` 、`/about` 、`/contact` など）の SEO を改善するためだけに SSR を調べているなら、おそらく SSR の代わりに SSG が適しているでしょう。SSG は、ドキュメントサイトやブログのようなコンテンツベースのウェブサイトにも適しています。実際、あなたが今読んでいるこのウェブサイトは、Vue を利用した静的サイトジェネレーター [VitePress](https://vitepress.dev/) を使って静的に生成されています。

## 基本チュートリアル {#basic-tutorial}

### アプリケーションのレンダリング {#rendering-an-app}

Vue SSR の必要最小限の実行サンプルを見てみましょう。

1. 新しいディレクトリーを作成し、`cd` で中に移動
2. `npm init -y` を実行
3. Node.js を [ES modules mode](https://nodejs.org/api/esm.html#modules-ecmascript-modules) で実行するために、`package.json` に `"type": "module"` を追加
4. `npm install vue` を実行
5. `example.js` ファイルを作成:

```js
// これはサーバー上の Node.js で実行されます。
import { createSSRApp } from 'vue'
// Vue のサーバーレンダリング API は `vue/server-renderer` 配下に公開されます。
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

次に以下を実行します:

```sh
> node example.js
```

コマンドラインには、次のように表示されるはずです:

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) は Vue アプリケーションのインスタンスを受け取り、アプリケーションでレンダリングされる HTML を解決する Promise を返します。また、[Node.js Stream API](https://nodejs.org/api/stream.html) や [Web Streams API](https://developer.mozilla.org/ja/docs/Web/API/Streams_API) を用いて、ストリームレンダリングもできます。詳しくは [SSR API リファレンス](/api/ssr)を参照してください。

そして、Vue SSR のコードをサーバーのリクエストハンドラーに移動させ、アプリケーションのマークアップをフルページの HTML でラップすることができます。次のステップでは [`express`](https://expressjs.com/) を使用します:

- `npm install express` を実行
- 下記の `server.js` ファイルを作成:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

最後に `node server.js` を実行し、`http://localhost:3000` にアクセスしましょう。ボタンが表示され、ページが動作しているのが分かるはずです。

[StackBlitz で試す](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### クライアント・ハイドレーション {#client-hydration}

ボタンをクリックしても、数字が変わらないことがわかると思います。ブラウザーで Vue を読み込んでいないため、クライアント上では HTML は完全に静的になっています。

クライアントサイドのアプリケーションをインタラクティブにするために、Vue は **hydration（ハイドレーション）** ステップを踏まえる必要があります。ハイドレーションでは、サーバー上で実行されたのと同じ Vue アプリケーションを作成し、各コンポーネントを制御する DOM ノードにマッチさせ、DOM イベントリスナーをアタッチします。

ハイドレーションモードでアプリケーションをマウントするには、`createApp()` の代わりに [`createSSRApp()`](/api/application#createssrapp) を使用する必要があります:

```js{2}
// これはブラウザー内で実行されます
import { createSSRApp } from 'vue'

const app = createSSRApp({
  //同じアプリケーションがサーバー内で実行されます
})

// クライアントで SSR アプリケーションをマウントすると、
// HTML がプリレンダリングされたものと見なされ、
// 新しい DOM ノードをマウントする代わりにハイドレーションが実行されます。
app.mount('#app')
```

### コード構造 {#code-structure}

サーバーと同じアプリケーションの実装を再利用する必要があることに注意してください。ここで、SSR アプリケーションのコード構造について考え始める必要があります。サーバーとクライアントの間で同じアプリケーションコードをどのように共有したらいいでしょうか？

ここでは、最も基本的なセットアップを実演します。まず、アプリケーションを作成するロジックを専用のファイル `app.js` に分割してみましょう:

```js [app.js]
// （サーバーとクライアント間に共有されています）
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

このファイルと依存関係は、サーバーとクライアントの間で共有されます。これを **universal code（ユニバーサルコード）** と呼びます。ユニバーサルコードを書くときには、いくつか注意しなければならないことがありますが、それについては[後述します](#writing-ssr-friendly-code)。

クライアントエントリーは、ユニバーサルコードをインポートしてアプリケーションを作成し、マウントを実行します:

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

そして、サーバーはリクエストハンドラー内で同じアプリケーション作成ロジックを使用します:

```js{2,5} [server.js]
// （関係ないコードは省略）
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

さらに、ブラウザーでクライアントのファイルを読み込むためには、次のようなことも必要です:

1. `server.js` に `server.use(express.static('.'))` を追加して、クライアントにファイルを提供する。
2. HTML シェルに `<script type="module" src="/client.js"></script>` を追加して、クライアントエントリーを読み込む。
3. HTML シェルに [Import Map](https://github.com/WICG/import-maps) を追加して、ブラウザー内で `import * from 'vue'` のような用法をサポートする。

[StackBlitz で完璧な使い方を試す](https://stackblitz.com/fork/vue-ssr-example?file=index.js)。いま、こちらのボタンはインタラクティブになっています！

## より高度な解決法 {#higher-level-solutions}

この例から本番用の SSR アプリケーションに移行するには、さらに多くのことが必要になります。必要なこととしては:

- Vue の単一ファイルコンポーネントやその他のビルドステップが必要とするもののサポート。実際は、同じアプリケーションに対して 2 つのビルドを調整する必要があります: 1 つはクライアント、もう 1 つはサーバー側です。

  :::tip
  SSR に使用される場合、Vue コンポーネントは、異なる方法でコンパイルされます。より効率的なレンダリングパフォーマンスを発揮するために、テンプレートは仮想 DOM レンダー関数の代わりに、連結した文字列にコンパイルされます。
  :::

- サーバー内のリクエストハンドラーでは、正しいクライアント側のアセット・リンクと最適なリソース・ヒントを共に HTML をレンダリングしてください。また、SSR モードと SSG モードを切り替えたり、同じアプリケーション内で両方を混在させる必要がある場合もあります。

- ルーティング、データ取得、状態管理ストアはユニバーサルな方法で管理します。

完全な実装をするのは非常に複雑で、かつ、あなたが選んだビルドツールチェーンに依存します。したがって、私たちの考えた、複雑性を抽象化し、上位レベルのソリューションを利用することを強くお勧めします。以下では、Vue のエコシステムで推奨されるいくつかの SSR ソリューションを紹介します。

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) は Vue のエコシステムの上に構築された上位フレームワークで、ユニバーサルな Vue アプリケーションを書くための効率的な開発体験を提供します。それだけでなく、静的サイトジェネレーターとして使用することもできます。ぜひ試してみてください。

### Quasar {#quasar}

[Quasar](https://quasar.dev) は SPA、SSR、PWA、モバイルアプリケーション、デスクトップアプリケーション、ブラウザー拡張のすべてを 1 つのコードベースでターゲットにできる、Vue ベースの完全なソリューションです。ビルドのセットアップ処理だけでなく、Material Design に準拠した UI コンポーネントの完全なコレクションを提供します。

### Vite SSR {#vite-ssr}

Vite は組み込みの [Vue サーバーサイドレンダリングのサポート](https://vitejs.dev/guide/ssr.html)を提供しますが、そのサポート内容は意図的に低レベルになっています。Vite を直接使いたい場合は、[vite-plugin-ssr](https://vite-plugin-ssr.com/) をチェックしてください。このプラグイン、多くの難しい設定を抽象化してくれる公式のプラグインです。

また、手動設定を使用した Vue + Vite SSR プロジェクトの例が[こちら](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)にありますので、これをベースに構築することもできます。これは、SSR やビルドツールの経験が豊富で、より高レベルのアーキテクチャーを完全に制御したい場合にのみ推奨されます。

## SSR フレンドリーなコードを書く {#writing-ssr-friendly-code}

ビルドの設定や上位フレームワークの選択にかかわらず、すべての Vue SSR アプリケーションに適用される原則がいくつかあります。

### サーバー上でのリアクティビティー {#reactivity-on-the-server}

SSR では、各リクエストの URL はアプリケーションにとって望ましい状態にマッピングされます。ユーザーとのインタラクションも DOM の更新もないので、サーバー側でリアクティビティーは不要です。デフォルトでは、パフォーマンス向上のために SSR 中のリアクティビティーは無効化されています。

### コンポーネントのライフサイクルフック {#component-lifecycle-hooks}

動的な更新がないため、<span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> や <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> などのライフサイクルフックは SSR の間に**呼ばれず**、クライアント側でのみ実行されます。<span class="options-api"> SSR 中に呼ばれるフックは `beforeCreate` と `created` だけです。</span>

<span class="options-api">`beforeCreate` や `created` </span><span class="composition-api">`setup()` あるいは `<script setup>` のルートスコープ</span>でクリーンアップが必要になるような副作用を発生させるようなコードは避けるべきでしょう。このような副作用の例としては、`setInterval` を使用してタイマーを設定することが挙げられます。クライアントサイドのみのコードでは、タイマーをセットアップして、<span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> もしくは <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>で終了させることがあります。ですが、SSR の間にアンマウントフックが呼ばれることはないため、タイマーはずっと残ることになります。代わりに、これを避けるために、副作用のあるコードを <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 内に移動しましょう。

### 特定のプラットフォームの API にアクセスする {#access-to-platform-specific-apis}

ユニバーサルコードはプラットフォーム固有の API へのアクセスを想定できないため、`window` や `document` のようなブラウザー専用のグローバルを直接使用したコードは、Node.js で実行するとエラーが発生します。また、その逆も同様です。

プラットフォームの API が異なる状態で、サーバーとクライアントで共有するタスクがある場合は、ユニバーサル API 内でプラットフォーム固有の API を実装してラップするか、それを行ってくれるライブラリーを使用することを推奨します。例えば、[`node-fetch`](https://github.com/node-fetch/node-fetch) を使用すると、サーバーとクライアントの両方で同じフェッチ API を使用することができます。

ブラウザー専用 API の場合、一般的なアプローチは、<span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>のようなクライアントだけのライフサイクルフックの中で遅延アクセス（lazy access）することです。

サードパーティのライブラリーがユニバーサルでの使用を念頭に置いて書かれていない場合、サーバーレンダリングされたアプリケーションに統合するのは困難な可能性があることに注意してください。グローバルのいくつかをモックすることで動作させることができるかもしれません。しかし、それは場当たり的な対応に過ぎず、他のライブラリーの環境検出コードに干渉してしまう可能性があります。

### クロスリクエスト状態汚染 {#cross-request-state-pollution}

状態管理のチャプターでは、[リアクティブ API を使ったシンプルな状態管理パターン](state-management#simple-state-management-with-reactivity-api)を紹介しました。SSR においては、このパターンにいくつかの追加的な調整が必要です。

このパターンでは、JavaScript モジュールのルートスコープで共有する状態を宣言します。これはそれらの状態を**シングルトン**、つまり、アプリケーションのライフサイクル全体を通じて 1 つだけのリアクティブオブジェクトのインスタンスにします。これは純粋なクライアントサイドの Vue アプリケーションで期待通りに動作します。なぜなら、アプリケーションのモジュールは、ブラウザーがページへアクセスする度に初期化されるからです。

しかし、SSR のコンテキストでは、アプリケーションモジュールは通常、サーバーが起動したときに一度だけ初期化されます。同じモジュール・インスタンスが複数のサーバー・リクエストにまたがって再利用されるので、シングルトンの状態オブジェクトも同じように再利用されます。あるユーザーに固有のデータを含む共有シングルトンの状態を変更した場合、誤って情報が他のユーザーからのリクエストに漏れてしまうことがあります。これを **cross-request state pollution（クロスリクエスト状態汚染）** と呼びます。

技術的には、ブラウザーで行うように、リクエストごとにすべての JavaScript モジュールを再初期化することも可能です。しかし、JavaScript モジュールの初期化にはコストがかかるため、サーバーのパフォーマンスに大きな影響を与えることになります。

推奨される解決策は、ルーターやグローバルストアを含むアプリケーション全体の新しいインスタンスを、リクエストごとに作成することです。それから、コンポーネントで直接インポートするのではなく、[アプリケーションレベルの Provide](/guide/components/provide-inject#app-level-provide) を使って共有する状態を提供し、それを必要とするコンポーネントでインジェクトすることです:

```js [app.js]
// （サーバーとクライアントで共有されます）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// リクエストごとに呼び出される
export function createApp() {
  const app = createSSRApp(/* ... */)
  // リクエスト単位で状態の新しいインスタンスを作成します
  const store = createStore(/* ... */)
  // 状態をアプリケーションレベルで提供します
  app.provide('store', store)
  // ハイドレーション目的で状態を公開することもできます
  return { app, store }
}
```

Pinia のような状態管理ライブラリーは、このことを念頭に置いて設計されています。詳しくは[Pinia の SSR ガイド](https://pinia.vuejs.org/ssr/)を参照してください。

### ハイドレーション・ミスマッチ {#hydration-mismatch}

プリレンダリングされた HTML の DOM 構造がクライアント側のアプリケーションが期待する内容と異なったときは、ハイドレーション・ミスマッチエラーになります。ハイドレーション・ミスマッチは一般的に、以下の原因によって起こされます:

1. テンプレートに無効な HTML のネスト構造が含まれており、ブラウザのネイティブ HTML パース動作によってレンダリングされた HTML が「修正」された。例えば、一般的な例として [`<div>` は `<p>` の内部に配置できない](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it)ことなどがあります:

   ```html
   <p><div>hi</div></p>
   ```

   これをサーバーレンダリングした HTML で作成すると、ブラウザーは `<div>` に出会ったときに最初の `<p>` を消し、以下の DOM 構造にパースします:

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. レンダリング時に使用されるデータに、ランダムに生成された値が含まれている。同じアプリケーションが 2 回（サーバーとクライアントで 1 回ずつ）実行されるため、2 回の実行でランダムな値が同じであることは保証されません。ランダム値によるミスマッチを避けるには、2 つの方法があります:

   1. `v-if` + `onMounted` を使用して、ランダムな値に依存する部分をクライアントだけでレンダリングします。例えば、VitePress の `<ClientOnly>` コンポーネントのように、フレームワークにはこれを容易にする機能が組み込まれているかもしれません。

   2. シードによる生成をサポートする乱数生成ライブラリーを使用し、サーバーの実行とクライアントの実行が同じシードを使用していることを保証します（例: シリアライズされたステートにシードを含め、クライアントでそれを取得する）。

3. サーバーとクライアントが異なるタイムゾーンにある。タイムスタンプをユーザーの現地時間に変換したい場合があります。しかし、サーバー実行時のタイムゾーンとクライアント実行時のタイムゾーンは常に同じとは限らず、サーバー実行時にユーザーのタイムゾーンを確実に知ることができない場合もあります。このような場合、現地時間の変換もクライアントのみの操作として実行する必要があります。

Vue は、ハイドレーション・ミスマッチになった時は、クライアント側の状態に合わせてプリレンダリングされた DOM を調整するよう自動的にリカバリーします。不正なノードの破棄と新しいノードのマウントのためレンダリングのパフォーマンスが多少低下しますが、ほとんどの場合、アプリケーションは期待通りに動作し続けるはずです。とはいえ、開発中にハイドレーションの不一致を解消するのがベストであることに変わりはありません。

#### ハイドレーション・ミスマッチの警告を抑制する <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

Vue 3.5+ では、[`data-allow-mismatch`](/api/ssr#data-allow-mismatch) 属性を使用して、避けられないハイドレーション・ミスマッチの警告を選択的に抑制することができます。

### カスタムディレクティブ {#custom-directives}

ほとんどのカスタムディレクティブは直接 DOM を操作する処理を含んでいるので、SSR の間は無視されます。しかしながら、カスタムディレクティブがどのようにレンダリングされるかを指定したい場合（例えば、どの属性をレンダリングされる要素に追加するか）は、`getSSRProps` ディレクティブフックを使用することができます:

```js
const myDirective = {
  mounted(el, binding) {
    // クライアント側の実装:
    // 直接 DOM を更新します
    el.id = binding.value
  },
  getSSRProps(binding) {
    // サーバー側の実装:
    // レンダリングされる props を返します。
    // getSSRProps はディレクトティブバインドだけを受け付けます。
    return {
      id: binding.value
    }
  }
}
```

### テレポート {#teleports}

テレポートは、SSR 中に特別な処理が必要です。レンダリングされたアプリにテレポートが含まれている場合、テレポートされたコンテンツはレンダリングされた文字列の一部にはなりません。より簡単な解決策は、マウント時にテレポートを条件付きでレンダリングすることです。

テレポートしたコンテンツをハイドレートする必要がある場合は、ssr コンテキストオブジェクトの `teleports` props で公開されます:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

テレポートのマークアップは、メインアプリのマークアップと同じように、最終的なページの HTML の正しい位置に挿入する必要があります。

:::tip
テレポートと SSR を一緒に使うときは `body` をターゲットにしないでください。通常、`<body>` には他のサーバーレンダリングのコンテンツが含まれており、テレポートがハイドレーションのための正しい開始位置を決定できなくなります。

代わりに、`<div id="teleported"></div>` のようにテレポートされたコンテンツのみを含む専用のコンテナを使用することをお勧めします。
:::
