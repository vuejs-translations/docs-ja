# はじめに {#getting-started}

Vue のチュートリアルにようこそ！

このチュートリアルの目的はブラウザーで Vue で作業することがどのような感じなのかいち早く体験してもらうことです。網羅的な内容を目指すものではないため、すべてを理解してから次に進む必要はありません。しかしながら、すべてを完了したあと、各項目についてより詳しく説明している<a target="_blank" href="/guide/introduction.html">ガイド</a>を必ずお読みください。

## 前提条件 {#prerequisites}

このチュートリアルは HTML 、 CSS 、 JavaScript の基本的な知識を前提にしています。もしフロントエンドの開発が全くはじめての場合、最初のステップとしてフレームワークに飛び込むのは良い選択ではないかもしれません。基本を理解してからまた来てください。他のフレームワークを使った過去の経験はあなたの手助けになるかもしれませんが、必須ではありません。

## このチュートリアルの使い方 {#how-to-use-this-tutorial}

<span class="wide">右</span><span class="narrow">下</span>のコードを編集することができて、瞬時に更新された結果を確認することができます。それぞれのステップでは Vue のコア機能を紹介し、デモが動作するようにコードを完成させることが期待されます。もし行き詰まったら、 "Show me!" ボタンで動作中のコードを表示できます。このボタンに頼り過ぎないようにしましょう。自分自身で考えて解いた方が早く習得できます。

Vue 2 や他のフレームワークから来た経験豊富な開発者であれば、このチュートリアルを最大限に活用するために、いくつかの設定を変更することができます。もしあなたが初心者の場合、デフォルトの状態で解くことをお勧めします。

<details>
<summary>チュートリアルの詳細設定</summary>

- Vue には 2 つの API スタイルがあります : Options API と Composition API です。このチュートリアルは、両方で動作するように設計されています。上部にある **API 選択**スイッチを使って、好みのスタイルを選択することができます。 <a target="_blank" href="/guide/introduction.html#api-styles">API スタイルの詳細については、こちらをご覧ください</a> 。

- また、 SFC モードと HTML モードの切り替えも可能です。前者は<a target="_blank" href="/guide/introduction.html#single-file-components">単一ファイルコンポーネント</a>（SFC）形式のコード例を表示します。これは、多くの開発者が Vue をビルドステップで使用するときに使用する形式です。HTML モードは、ビルドステップなしで使用する方法を示しています。

<div class="html">

:::tip
If you're about to use HTML-mode without a build step in your own applications, make sure you either change imports to:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

inside your scripts or configure your build tool to resolve `vue` accordingly. Sample config for [Vite](https://vitejs.dev/):

```js
// vite.config.js
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

See the respective [section in Tooling guide](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation) for more information.
:::

</div>

</details>

準備はいいですか？　"Next" をクリックしてください。
