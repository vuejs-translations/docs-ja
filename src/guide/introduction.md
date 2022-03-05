---
footer: false
---

# はじめに

:::info 今ここに表示されているのは、Vue 3 のドキュメントです！

- Vue 2 のドキュメントは [v2.vuejs.org](https://v2.vuejs.org/) に移動しました。
- Vue 2 からの移行について詳しくは、[移行ガイド](https://v3-migration.vuejs.org/)を確認してください。
  :::

<style src="/@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses-path/beginner" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Learn Vue with video tutorials on <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## Vue とは？

Vue (発音は /vjuː/、**view** と同様) は、ユーザーインターフェースの構築のための JavaScript フレームワークです。標準的な HTML、CSS、JavaScript を土台とする、コンポーネントベースの宣言的なプログラミングモデルを提供します。シンプルなものから複雑なものまで、ユーザーインターフェースの開発を効率的に支えるフレームワークです。

最小限のサンプルは、次のようになります:

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

```vue-html
<div id="app">
  <button @click="count++">
    カウント: {{ count }}
  </button>
</div>
```

**結果**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    カウント: {{ count }}
  </button>
</div>

上のサンプルは、Vue が備える次の 2 つのコア機能を示すものです:

- **宣言的レンダリング**: Vue では、標準的な HTML を拡張したテンプレート構文を使って、HTML の出力を宣言的に記述することができます。この出力は、JavaScript の状態に基づきます。

- **リアクティブ性**: Vue は JavaScript の状態の変化を自動的に追跡し、変化が起きると効率的に DOM を更新します。

すでに分からないことがあるかもしれませんが、ご心配なく。このドキュメントの続きを読めば、細かい点まで理解できるようになっています。Vue が何を提供するかを大まかに掴んでいただくため、今はまず、このまま読み進めていただければと思います。

:::tip 前提となる知識
このドキュメントの続きでは、HTML、CSS、そして JavaScript の基礎知識があることが前提となっています。もしフロントエンドの開発をまったく経験したことがなければ、最初の一歩で Vue のようなフレームワークにすぐに飛び込むのは最適な方針でないかもしれません。基本を習ってからここに戻ってくるのでも大丈夫です！　ほかのフレームワークを使用した経験があれば、役立ちます。ただし、必須ではありません。
:::

## プログレッシブなフレームワーク

Vue は、フロントエンド開発に必要な一般的な機能のほとんどをカバーするフレームワークであり、エコシステムでもあります。しかし、Web はきわめて多様です。私たちが Web で構築するものは、形態の点でも規模の点でもそれぞれ大きく異なります。Vue はそのことを念頭に置いて、柔軟性を提供する設計、そして段階的に適用できる設計となっています。Vue はユースケースに応じて、以下のようにさまざまな方法で活用することができます:

- ビルドステップなしで静的な HTML を拡充する
- 任意のページに Web コンポーネントとして埋め込む
- シングルページアプリケーション (SPA)
- フルスタック / サーバーサイドレンダリング (SSR)
- JAMStack / 静的サイトジェネレーション (SSG)
- デスクトップ、モバイル、WebGL、さらにはターミナルをターゲットとする開発

これらのテーマにはまだ付いていけないと感じても、大丈夫です！　チュートリアルとガイドでは、本当に基礎的な HTML と JavaScript の知識だけが求められます。これらのテーマのエキスパートでなくても、付いていける内容となっています。

経験豊富な開発者向けには、既存のスタックに Vue を統合する最適な方法や、これらのテーマに出る用語の意味について詳しく説明するドキュメントがあります。興味をお持ちの方は、[Vue のさまざまな活用方法](/guide/extras/ways-of-using-vue)をご覧ください。

柔軟性を備える一方で、Vue が動く仕組みについての中心的な知識は、上に挙げたすべてのユースケースで共通です。今はまだ初心者であっても、進みながら得てゆく知識は、今後もっと大きなプロジェクトに取り組むうえで常に役立つものであり続けます。ベテランであれば、解決したい問題に応じて、生産性を保ちながら Vue を適切に活用する方法を選定できるでしょう。Vue を「プログレッシブなフレームワーク」と呼んでいる理由は、そこにあります。Vue は、皆さんとともに成長し、皆さんのニーズに適応するフレームワークなのです。

## 単一ファイルコンポーネント

ビルドツールが利用可能な Vue プロジェクトでは、**単一ファイルコンポーネント**と呼ばれる、HTML に似たファイル形式の Vue コンポーネントがよく利用されます (`*.vue` ファイルとしても知られ、「**SFC**」と略されます)。Vue の SFC は、その名前が示す通り、コンポーネントのロジック (JavaScript)、テンプレート (HTML)、およびスタイル (CSS) を単一のファイルに収めたものです。先ほどのサンプルコードを SFC 形式で書いたものを以下に示します:

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">カウント: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

SFC は、Vue を特徴付ける機能です。ビルドのセットアップが利用できるユースケースで**あれば**、Vue コンポーネントを作成していく方法がおすすめです。詳細を知りたい方は、[SFC の作成方法と用途](/guide/scaling-up/sfc)に特設のセクションがありますので、ぜひご覧ください。ここでは、ビルドツール全体のセットアップを Vue が手伝ってくれることだけ覚えておいてください。

## 2 つの API スタイル

Vue コンポーネントを作成する際は、**オプション API**、そして **コンポジション API** と呼ばれる 2 種類の異なる API スタイルが利用できます。

### オプション API

オプション API では、`data`、`methods`、`mounted` といった数々のオプションからなる 1 つのオブジェクトを用いてコンポーネントのロジックを定義します。これらのオプションによって定義されたプロパティには、コンポーネントのインスタンスを指す `this` を使って、関数内から次のようにアクセスできます:

```vue
<script>
export default {
  // data() で返すプロパティはリアクティブな状態になり、
  // `this` 経由でアクセスすることができます。
  data() {
    return {
      count: 0
    }
  },

  // メソッドの中身は、状態を変化させ、更新をトリガーさせる関数です。
  // 各メソッドは、テンプレート内のイベントリスナーに束縛することができます。
  methods: {
    increment() {
      this.count++
    }
  },

  // ライフサイクルフックは、コンポーネントのライフサイクルの
  // 特定のステージで呼び出されます。
  // 以下の関数は、コンポーネントが「マウント」されたときに呼び出されます。
  mounted() {
    console.log(`カウントの初期値は ${this.count} です。`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[サンドボックスで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gcmVhY3RpdmUgc3RhdGVcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IDBcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbiAgbWV0aG9kczoge1xuICAgIGluY3JlbWVudCgpIHtcbiAgICAgIHRoaXMuY291bnQrK1xuICAgIH1cbiAgfSxcblxuICAvLyBsaWZlY3ljbGUgaG9va3NcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgVGhlIGluaXRpYWwgY291bnQgaXMgJHt0aGlzLmNvdW50fS5gKVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPkNvdW50IGlzOiB7eyBjb3VudCB9fTwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4ifQ==)

### コンポジション API

コンポジション API では、インポートした各種 API 関数を使ってコンポーネントのロジックを定義していきます。SFC において、コンポジション API は通常、[`<script setup>`](/api/sfc-script-setup) と組み合わせて使用します。`setup` という属性を付けることで、Vue にコンパイル時の変形操作を実行してほしいというヒントが伝えられます。これにより、定型的な書式の少ないコンポジション API を利用することができます。たとえば、`<script setup>` のなかで宣言したインポート、トップレベルの変数、トップレベルの関数は、テンプレート内で直接使うことができます。

先ほどと同じコンポーネントを、テンプレート部分は同一のまま、コンポジション API と `<script setup>` に置き換えたサンプルとして以下に示します:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// リアクティブな状態
const count = ref(0)

// 状態をミューテートし、更新をトリガーする関数。
function increment() {
  count.value++
}

// ライフサイクルフック
onMounted(() => {
  console.log(`カウントの初期値は ${count.value} です。`)
})
</script>

<template>
  <button @click="increment">カウント: {{ count }}</button>
</template>
```

[サンドボックスで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgb25Nb3VudGVkIH0gZnJvbSAndnVlJ1xuXG4vLyByZWFjdGl2ZSBzdGF0ZVxuY29uc3QgY291bnQgPSByZWYoMClcblxuLy8gZnVuY3Rpb25zIHRoYXQgbXV0YXRlIHN0YXRlIGFuZCB0cmlnZ2VyIHVwZGF0ZXNcbmZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgY291bnQudmFsdWUrK1xufVxuXG4vLyBsaWZlY3ljbGUgaG9va3Ncbm9uTW91bnRlZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBUaGUgaW5pdGlhbCBjb3VudCBpcyAke2NvdW50LnZhbHVlfS5gKVxufSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50XCI+Q291bnQgaXM6IHt7IGNvdW50IH19PC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

### どちらを選ぶか？

まず、どちらのスタイルの API でも、よくあるユースケースは全面的にカバーされます。両者はインターフェースが異なるものの、それを支える基盤のシステムはまったく同じです。事実として、オプション API はコンポジション API を土台にしています！　Vue に関する基本的な考え方と必要な知識は、2 つのスタイル間で共通です。

オプション API の考え方は、「コンポーネントのインスタンス」(サンプルに見られる `this`) を中心とするもので、OOP 言語の経験のあるユーザーにとってはクラスベースの心理的モデルによく適合します。同時に、オプション API ではリアクティブ性の細かな部分が抽象化され、各オプションのグループによってコードの構成が整理されるため、初心者にとって分かりやすいモデルでもあります。

コンポジション API は、リアクティブな状態変数を関数のスコープ内で直接宣言し、複数の関数の組み合わせによって状態を組み立てて複雑な処理を扱おう、という考え方が中心にあります。より自由度が高い形式であるため、効果的な使い方をするには Vue のリアクティブ性がどのような仕組みで動くのかを理解しておく必要があります。その代わり、柔軟性が高いことから、さまざまなパターンに沿ってロジックの整理や再利用を強力に進めることができます。

2 つのスタイル間の比較や、コンポジション API に秘められたメリットについては、[コンポジション API に関するよくある質問](/guide/extras/composition-api-faq)で詳しく説明しています。

Vue を初めて使う方に、一般的な推奨事項をお伝えします:

- 学習が目的の場合は、自分で理解しやすいと思うスタイルをお選びください。繰り返しますが、中核的な概念の多くは、どちらのスタイルでも共通です。もう一方のスタイルも、好きなときに後から習得することができます。

- プロダクション用途の場合は、以下をおすすめします:

  - ビルドツールを利用しない予定の場合や、プログレッシブエンハンスメントなどの複雑性の低いシナリオで主に Vue を使う予定の場合は、オプション API を選択します。 

  - アプリケーション全体を Vue で構築する予定の場合は、コンポジション API と単一ファイルコンポーネントの組み合わせを使用します。

学習を進める段階では、どちらか一方のスタイルにこだわる必要はありません。このドキュメントの続きの部分に登場するコードサンプルは、該当する場合、両方のスタイルで提供されます。左サイドバーの上部にある **API 設定スイッチ**を使って、いつでもスタイルを切り替えることができます。

## さらに知りたいことはありますか？

[よくある質問](/about/faq)をチェックしてみてください。

## ラーニングパスを選びましょう

学習の進め方は、開発者によってさまざまです。好みに合った学習方法を自由にお選びください。もし可能なら、すべてのコンテンツに目を通しておくのがおすすめです！

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">チュートリアルを試す</p>
    <p class="next-steps-caption">実際に手を動かしながら学びたい方に。</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">ガイドを読む</p>
    <p class="next-steps-caption">ガイドでは、フレームワークのあらゆる面を詳しく解説します。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">サンプルを見る</p>
    <p class="next-steps-caption">コア機能と一般的な UI タスクのサンプルを観察してみましょう。</p>
  </a>
</div>
