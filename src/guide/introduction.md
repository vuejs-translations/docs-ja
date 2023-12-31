---
footer: false
---

# はじめに {#introduction}

:::info 今ここに表示されているのは、Vue 3 のドキュメントです！

- Vue 2 のサポートは **2023 年 12 月 31 日**に終了しました。詳細は [Vue 2 EOL](https://v2.vuejs.org/eol/) をご覧ください。
- Vue 2 からの移行について詳しくは、[移行ガイド](https://v3-migration.vuejs.org/ja/)を確認してください。
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Learn Vue with video tutorials on <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## Vue とは？ {#what-is-vue}

Vue (発音は /vjuː/、**view** と同様) は、ユーザーインターフェースの構築のための JavaScript フレームワークです。標準的な HTML、CSS、JavaScript を土台とする、コンポーネントベースの宣言的なプログラミングモデルを提供します。シンプルなものから複雑なものまで、ユーザーインターフェースの開発を効率的に支えるフレームワークです。

最小限のサンプルは、次のようになります:

<div class="options-api">

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

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
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
    Count is: {{ count }}
  </button>
</div>

上のサンプルは、Vue が備える次の 2 つのコア機能を示すものです:

- **宣言的レンダリング**: Vue では、標準的な HTML を拡張したテンプレート構文を使って、HTML の出力を宣言的に記述することができます。この出力は、JavaScript の状態に基づきます。

- **リアクティビティー**: Vue は JavaScript の状態の変化を自動的に追跡し、変化が起きると効率的に DOM を更新します。

すでに分からないことがあるかもしれませんが、ご心配なく。このドキュメントの続きを読めば、細かい点まで理解できるようになっています。Vue が何を提供するかを大まかに掴んでいただくため、今はまず、このまま読み進めていただければと思います。

:::tip 前提となる知識
このドキュメントの続きでは、HTML、CSS、そして JavaScript の基礎知識があることが前提となっています。もしフロントエンドの開発をまったく経験したことがなければ、最初の一歩で Vue のようなフレームワークにすぐに飛び込むのは最適な方針でないかもしれません。基本を習ってからここに戻ってくるのでも大丈夫です！　必要に応じて、[JavaScript](https://developer.mozilla.org/ja/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/ja/docs/Learn/HTML/Introduction_to_HTML)、[CSS](https://developer.mozilla.org/ja/docs/Learn/CSS/First_steps) の概要を見て知識レベル確認できます。他のフレームワークを使用した経験があれば役立ちますが、必須ではありません。
:::

## プログレッシブフレームワーク {#the-progressive-framework}

Vue は、フロントエンド開発に必要な一般的な機能のほとんどをカバーするフレームワークであり、エコシステムでもあります。しかし、Web はきわめて多様です。私たちが Web で構築するものは、形態の点でも規模の点でもそれぞれ大きく異なります。Vue はそのことを念頭に置いて、柔軟性を提供する設計、そして段階的に適用できる設計となっています。Vue はユースケースに応じて、以下のようにさまざまな方法で活用することができます:

- ビルドステップなしで静的な HTML を拡充する
- 任意のページに Web コンポーネントとして埋め込む
- シングルページアプリケーション (SPA)
- フルスタック / サーバーサイドレンダリング (SSR)
- Jamstack / 静的サイトジェネレーション (SSG)
- デスクトップ、モバイル、WebGL、さらにはターミナルをターゲットとする開発

これらの概念にはまだ付いていけないと感じても、大丈夫です！チュートリアルとガイドでは、本当に基礎的な HTML と JavaScript の知識だけが求められます。これらの概念のエキスパートでなくても、付いていける内容となっています。

経験豊富な開発者向けには、既存のスタックに Vue を統合する最適な方法や、これらの概念に出る用語の意味について詳しく説明するドキュメントがあります。興味をお持ちの方は、[Vue のさまざまな活用方法](/guide/extras/ways-of-using-vue)をご覧ください。

柔軟性を備える一方で、Vue が動く仕組みについての中心的な知識は、上に挙げたすべてのユースケースで共通です。今はまだ初心者であっても、進みながら得てゆく知識は、今後もっと大きなプロジェクトに取り組むうえで常に役立つものであり続けます。ベテランであれば、解決したい問題に応じて、生産性を保ちながら Vue を適切に活用する方法を選定できるでしょう。Vue を「プログレッシブフレームワーク」と呼んでいる理由は、そこにあります。Vue は、皆さんとともに成長し、皆さんのニーズに適応するフレームワークなのです。

## 単一ファイルコンポーネント {#single-file-components}

ビルドツールが利用可能な Vue プロジェクトでは、**単一ファイルコンポーネント**と呼ばれる、HTML に似たファイル形式の Vue コンポーネントがよく利用されます (`*.vue` ファイルとしても知られ、「**SFC**」と略されます)。Vue の SFC は、その名前が示す通り、コンポーネントのロジック (JavaScript)、テンプレート (HTML)、およびスタイル (CSS) を単一のファイルに収めたものです。先ほどのサンプルコードを SFC 形式で書いたものを以下に示します:

<div class="options-api">

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
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

SFC は、Vue を特徴付ける機能で、ビルドのセットアップが必要なユースケースで**あれば**、Vue コンポーネントを作成するために推奨される方法です。詳細を知りたい方は、[SFC の作成方法と用途](/guide/scaling-up/sfc)に特設のセクションがありますので、ぜひご覧ください。ここでは、ビルドツール全体のセットアップを Vue が手伝ってくれることだけ覚えておいてください。

## 2 つの API スタイル {#api-styles}

Vue コンポーネントを作成する際は、**Options API**、そして **Composition API** と呼ばれる 2 種類の異なる API スタイルが利用できます。

### Options API {#options-api}

Options API では、`data`、`methods`、`mounted` といった数々のオプションからなる 1 つのオブジェクトを用いてコンポーネントのロジックを定義します。これらのオプションによって定義されたプロパティには、コンポーネントのインスタンスを指す `this` を使って、関数内から次のようにアクセスできます:

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
  // 各メソッドは、テンプレート内のイベントハンドラーにバインドすることができます。
  methods: {
    increment() {
      this.count++
    }
  },

  // ライフサイクルフックは、コンポーネントのライフサイクルの
  // 特定のステージで呼び出されます。
  // 以下の関数は、コンポーネントが「マウント」されたときに呼び出されます。
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

Composition API では、インポートした各種 API 関数を使ってコンポーネントのロジックを定義していきます。SFC において、Composition API は通常、[`<script setup>`](/api/sfc-script-setup) と組み合わせて使用します。`setup` という属性を付けることで、Vue にコンパイル時の変形操作を実行してほしいというヒントが伝えられます。これにより、定型的な書式の少ない Composition API を利用することができます。たとえば、`<script setup>` のなかで宣言したインポート、トップレベルの変数、トップレベルの関数は、テンプレート内で直接使うことができます。

先ほどと同じコンポーネントを、テンプレート部分は同一のまま、Composition API と `<script setup>` に置き換えたサンプルとして以下に示します:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// リアクティブな状態
const count = ref(0)

// 状態を変更し、更新をトリガーする関数。
function increment() {
  count.value++
}

// ライフサイクルフック
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### どちらを選ぶか？ {#which-to-choose}

どちらのスタイルの API でも、よくあるユースケースは全面的にカバーされます。両者はインターフェースが異なるものの、それを支える基盤のシステムはまったく同じです。事実として、Options API は Composition API を土台にしています！Vue に関する基本的な考え方と必要な知識は、2 つのスタイル間で共通です。

Options API の考え方は、「コンポーネントのインスタンス」(サンプルに見られる `this`) を中心とするもので、OOP (Object Oriented Programming: オブジェクト指向プログラミング) 言語の経験のあるユーザーにとってはクラスベースの心理的モデルによく適合します。同時に、Options API ではリアクティビティーの細かな部分が抽象化され、各オプションのグループによってコードの構成が整理されるため、初心者にとって分かりやすいモデルでもあります。

Composition API は、リアクティブな状態変数を関数のスコープ内で直接宣言し、複数の関数の組み合わせによって状態を組み立てて複雑な処理を扱おう、という考え方が中心にあります。より自由度が高い形式であるため、効果的な使い方をするには Vue のリアクティビティーがどのような仕組みで動くのかを理解しておく必要があります。その代わり、柔軟性が高いことから、さまざまなパターンに沿ってロジックの整理や再利用を強力に進めることができます。

2 つのスタイル間の比較や、Composition API に秘められたメリットについては、[Composition API に関するよくある質問](/guide/extras/composition-api-faq)で詳しく説明しています。

Vue を初めて使う方に、一般的な推奨事項をお伝えします:

- 学習が目的の場合は、自分で理解しやすいと思うスタイルをお選びください。繰り返しますが、中核的な概念の多くは、どちらのスタイルでも共通です。もう一方のスタイルも、好きなときに後から習得することができます。

- プロダクション用途の場合は、以下をおすすめします:

  - ビルドツールを利用しない予定の場合や、プログレッシブエンハンスメントなどの複雑性の低いシナリオで主に Vue を使う予定の場合は、Options API を選択します。

  - アプリケーション全体を Vue で構築する予定の場合は、Composition API と単一ファイルコンポーネントの組み合わせを使用します。

学習を進める段階では、どちらか一方のスタイルにこだわる必要はありません。このドキュメントの続きの部分に登場するコードサンプルは、該当する場合、両方のスタイルで提供されます。左サイドバーの上部にある **API 選択スイッチ**を使って、いつでもスタイルを切り替えることができます。

## さらに知りたいことはありますか？ {#still-got-questions}

[よくある質問](/about/faq)をチェックしてみてください。

## 学習方法を選びましょう {#pick-your-learning-path}

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
