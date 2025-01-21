---
outline: deep
---

# パフォーマンス {#performance}

## 概要 {#overview}

Vue は、手動で最適化する必要なく、ほとんどの一般的なユースケースに対してパフォーマンスが高くなるように設計されています。しかし、微調整が必要な難しい場面は常に存在します。このセクションでは、Vue アプリケーションのパフォーマンスに関して注意すべき点について説明します。

まず、Web パフォーマンスの 2 大要素について説明します:

- **ページロードパフォーマンス**: 初回訪問時、アプリケーションがコンテンツを表示しインタラクティブになる速さ。これは通常 [Largest Contentful Paint（最大視覚コンテンツの表示時間、LCP）](https://web.dev/i18n/ja/lcp/)や [Interaction to Next Paint（UI の応答性、INP）](https://web.dev/articles/inp?hl=ja)のような Web バイタルメトリクスによって測られます。

- **更新パフォーマンス**: ユーザーの入力に応じたアプリケーションの更新速度。例えば、ユーザーが検索ボックスに入力したときのリストの更新速度や、シングルページアプリケーション（SPA）でユーザーがナビゲーションリンクをクリックしたときのページの切り替わり速度などです。

この 2 つを最大化させることが理想ですが、フロントエンドのアーキテクチャが異なると、これらの面で望ましい性能を達成するのが容易かどうかに影響する傾向があります。また、構築するアプリケーションの種類によって、性能面で何を優先すべきかに大きく影響します。したがって、最適なパフォーマンスを確保するための最初のステップは、構築するアプリケーションの種類に適したアーキテクチャを選択することです:

- Vue を様々な形でどのように活用するかは、[Vue を使う方法](/guide/extras/ways-of-using-vue)を参照してください。

- Jason Miller 氏は、[Application Holotypes](https://jasonformat.com/application-holotypes/) で、Web アプリケーションの種類と、それぞれの理想的な実装/配信について論じています。

## プロファイリングのオプション {#profiling-options}

パフォーマンス向上のために、まずその計測方法を知る必要があります。役立つ素晴らしい関連ツールがいくつもあります:

本番環境でのロードパフォーマンスプロファイリング:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

ローカル開発環境でのパフォーマンスプロファイリング:

- [Chrome DevTools Performance パネル](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) は、Chrome DevTools のパフォーマンスタイムラインで、Vue 固有のパフォーマンスマーカーを有効にします。
- [Vue DevTools 拡張](/guide/scaling-up/tooling#browser-devtools)もまた、パフォーマンスプロファイリング機能を提供します。

## ページロード最適化 {#page-load-optimizations}

ページロードパフォーマンスを最適化するための、フレームワークに依存しない多くの側面があります。包括的なまとめとして、[この web.dev ガイド](https://web.dev/fast/) をチェックしてください。ここでは、主に Vue 固有の技術に焦点を当てます。

### 適切なアーキテクチャの選択 {#choosing-the-right-architecture}

ページロードのパフォーマンスに敏感なユースケースの場合、純粋なクライアントサイド SPA として配信することは避けてください。ユーザーが見たいコンテンツを含む HTML をサーバーから直接送信する必要があります。純粋なクライアントサイドのレンダリングは、Time-to-Content の遅さに悩まされます。これは、[サーバーサイドレンダリング（SSR）](/guide/extras/ways-of-using-vue#fullstack-ssr) または [静的サイト生成（SSG）](/guide/extras/ways-of-using-vue#jamstack-ssg) で緩和できます。Vue による SSR の実行については、[SSR ガイド](/guide/scaling-up/ssr) を確認してください。アプリにリッチなインタラクティブ性が要求されない場合は、従来のバックエンドサーバーで HTML をレンダリングし、クライアント側で Vue を使って拡張することもできます。

もし、メインのアプリケーションが SPA である必要があり、マーケティングページ（ランディング、アバウト、ブログ）がある場合、それらを別々に配信してください。マーケティングページは、SSG を使用して最小限の JS を含む静的 HTML としてデプロイされるのが理想的です。

### バンドルサイズとツリーシェイキング {#bundle-size-and-tree-shaking}

ページロードパフォーマンスを向上させる最も効果的な方法の 1 つは、小さな JavaScript バンドルを配信することです。Vue を使用する際にバンドルサイズを小さくする方法をいくつか紹介します:

- 可能ならビルドステップを使用する

  - Vue の API の多くは、モダンなビルドツールを介してバンドルする場合、["tree-shakable"](https://developer.mozilla.org/ja/docs/Glossary/Tree_shaking) です。たとえば、組み込みの `<Transition>` コンポーネントを使用しない場合、最終的なプロダクションバンドルには含まれません。ツリーシェイキングは、ソースコード内の他の未使用のモジュールを削除することもできます。

  - ビルドステップを使用する場合、テンプレートは事前にコンパイルされるため、Vue コンパイラをブラウザーに配信する必要はありません。これにより、最低でも **14kb** の gzip された JavaScript が節約され、実行時のコンパイルコストが回避されます。

- 新しい依存関係を導入するときは、サイズに注意しましょう！実際のアプリケーションでは、バンドルが肥大化するのは、気づかないうちに重い依存関係を導入してしまった結果であることがほとんどです。

  - ビルドステップを使用する場合、ES Modules（ESM と略すこともある）を提供し、ツリーシェイキングに適した依存関係を選択してください。例えば、 `lodash` よりも `lodash-es` を選択します。

  - 依存関係のサイズをチェックし、それが提供する機能に見合うかどうかを評価してください。依存関係がツリーシェイキング・フレンドリーである場合、実際のサイズの増加は、あなたが実際にそこからインポートする API に依存することに注意してください。[bundlejs.com](https://bundlejs.com/) のようなツールは素早いチェックに使用できますが、実際のビルド設定での測定が常に最も正確でしょう。

- もし Vue を主にプログレッシブエンハンスメントのために使用していて、ビルドステップを避けたい場合は、代わりに[petite-vue](https://github.com/vuejs/petite-vue)（わずか **6kb**）を使用することを検討してください。

### コード分割 {#code-splitting}

コード分割とは、ビルドツールがアプリケーションバンドルを複数の小さなチャンクに分割し、オンデマンドまたは並列でロードできるようにすることです。適切なコード分割を行うことで、ページロード時に必要な機能を即時ダウンロードし、必要なときだけ追加のチャンクを遅延ロードして、パフォーマンスを向上させることができます。

Rollup（Vite のベースになっている）や webpack などのバンドラーは、ESM の動的インポート構文を検出することで、自動的に分割チャンクを作成することができます:

```js
// lazy.js とその依存関係は別のチャンクに分割され、
// `loadLazy()` が呼ばれたときだけロードされます。
function loadLazy() {
  return import('./lazy.js')
}
```

遅延ローディングは、最初のページロード後すぐに必要とされない機能で最もよく使用されます。Vue アプリケーションでは、これは Vue の[非同期コンポーネント](/guide/components/async)機能と組み合わせて、コンポーネントツリーの分割チャンクを作成するために使用できます:

```js
import { defineAsyncComponent } from 'vue'

// 分割チャンクは Foo.vue とその依存関係のために作られます。
// これは非同期コンポーネントがページにレンダリングされる
// タイミングにのみオンデマンドでフェッチされます。
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Vue Router を使用するアプリケーションでは、ルートコンポーネントに遅延ローディングを使用することが強く推奨されます。Vue Router は、`defineAsyncComponent` とは別に、遅延ローディングを明示的にサポートしています。詳しくは [Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html) を参照してください。

## 更新の最適化 {#update-optimizations}

### props の安定性 {#props-stability}

Vue では、子コンポーネントは、受け取った props のうち少なくとも 1 つが変更された場合にのみ更新します。次の例で考えてみましょう:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

`<ListItem>` コンポーネントの内部では、`id` と `activeId` props を使用して、現在アクティブなアイテムであるかどうかを判断します。これはうまくいくのですが、問題は `activeId` が変更されるたびに、リスト内の **全ての** `<ListItem>` が更新を行わなければならないことです！

本来なら、アクティブステータスが変化したアイテムだけを更新しなければなりません。アクティブステータスの計算を親に移し、`<ListItem>` が `active` props を直接受け取るようにすることで、これを実現できます。

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

これで、ほとんどのコンポーネントでは `activeId` が変わっても `active` props は変わらないので、更新する必要がなくなりました。一般的に、子コンポーネントに渡される props はできるだけ安定した状態に保つことが大切です。

### `v-once` {#v-once}

`v-once` は組み込みのディレクティブで、ランタイムデータに依存しながらも更新の必要がないコンテンツをレンダリングするために使用することができます。このディレクティブが使用されたサブツリー全体は、その後のすべての更新をスキップします。詳細は [API リファレンス](/api/built-in-directives#v-once)を参照してください。

### `v-memo` {#v-memo}

`v-memo` は組み込みのディレクティブで、大きなサブツリーや `v-for` リストの更新を条件付きでスキップするために使用することができます。詳細は [API リファレンス](/api/built-in-directives#v-memo)を参照してください。

### 算出プロパティの安定性 {#computed-stability}

Vue 3.4 以降では、算出プロパティは算出値が以前の値から変更された場合にのみエフェクトをトリガーします。例えば、以下の `isEven` の算出プロパティは、戻り値が `true` から `false` に変更された場合、またはその逆の場合にのみエフェクトをトリガーします:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// 算出値は `true` のままなので、新しいログをトリガーしません
count.value = 2
count.value = 4
```

これは不要なエフェクトのトリガーを減らしますが、残念ながら、算出プロパティが計算ごとに新しいオブジェクトを作成する場合には機能しません:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

新しいオブジェクトが毎回作成されるため、新しい値は技術的には常に古い値と異なります。たとえ `isEven` プロパティが同じままであるとしても、Vue は、古い値と新しい値を深く比較しない限り、わかりません。そのような比較はコストがかかりますし、その価値はないでしょう。

その代わりに、新しい値と古い値を手動で比較し、何も変更されていないことがわかれば古い値を条件付きで返すことで、これを最適化することができます:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Playground で試す](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

同じ依存を毎回の実行で収集できるように、古い値を比較して返す前に、完全な算出を常に実行する必要があることに注意してください。

## 全般的な最適化 {#general-optimizations}

> 以下のヒントは、ページロードと更新の両方のパフォーマンスに影響します。

### 大きなリストの仮想化 {#virtualize-large-lists}

すべてのフロントエンドアプリケーションで最も一般的なパフォーマンスの問題の 1 つは、大きなリストをレンダリングすることです。フレームワークがどんなに高速でも、何千ものアイテムを含むリストのレンダリングは、ブラウザーが処理する必要のある DOM ノードの数が膨大になるため、**遅くなります**。

しかし、必ずしもすべてのノードを愚直にレンダリングする必要はありません。ほとんどの場合、ユーザーの画面サイズでは、大きなリストのうちの小さなサブセットしか表示できません。**リスト仮想化**は、大きなリストの中で現在ビューポートに表示されているアイテムまたはそれに近いアイテムのみをレンダリングする技術で、パフォーマンスを大幅に向上させることができます。

リスト仮想化の実装は簡単ではありませんが、幸運にも、直接使える既存のコミュニティー・ライブラリーがあります:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### 大きなイミュータブルな構造のリアクティビティーオーバーヘッドを減らす {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue のリアクティビティーシステムは、デフォルトでディープです。これにより状態管理が直感的になりますが、データサイズが大きくなると、プロパティアクセスのたびに依存関係の追跡を行うプロキシトラップがトリガーされるため、一定レベルのオーバーヘッドが発生します。これは通常、深くネストされたオブジェクトの大きな配列を扱うとき、1 回のレンダリングで 10 万以上のプロパティにアクセスする必要があるために顕著になります。これは非常に特定のユースケースにのみ影響するはずです。

Vue は [`shallowRef()`](/api/reactivity-advanced#shallowref) と [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) によってディープなリアクティビティーを回避する方法を提供します。Shallow API は、ルートレベルでのみリアクティブな状態を作り、すべてのネストされたオブジェクトをそのまま公開します。これは、ネストされたプロパティへのアクセスを高速に保ちますが、トレードオフとして、すべてのネストされたオブジェクトをイミュータブルとして扱わなければならず、更新はルートの状態を置き換えることによってのみトリガーされるようになります:

```js
const shallowArray = shallowRef([
  /* ディープなオブジェクトの大きなリスト */
])

// これは更新をトリガーせず...
shallowArray.value.push(newObject)
// これはします:
shallowArray.value = [...shallowArray.value, newObject]

// これは更新をトリガーせず...
shallowArray.value[0].foo = 1
// これはします:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### 不必要なコンポーネントの抽象化を避ける {#avoid-unnecessary-component-abstractions}

時には、より良い抽象化やコード構成のために、[レンダーレスコンポーネント](/guide/components/slots#renderless-components)や高階コンポーネント（つまり、追加の props で他のコンポーネントをレンダリングするコンポーネント）を作ることもあります。これは悪いことではありませんが、コンポーネントインスタンスはプレーンな DOM ノードよりもはるかに高価であり、抽象化パターンによりそれらを大量に生成すると、パフォーマンスコストが発生することを覚えておいてください。

数個のインスタンスを減らすだけでは顕著な効果はないため、アプリ内で数回しかレンダリングされないコンポーネントなら頑張る必要はないことに注意してください。この最適化を検討するのにふさわしい場面は、やはり大きなリストです。100 のアイテムからなり、各アイテムのコンポーネントが多数の子コンポーネントを含んでいるリストを想像してみてください。ここで不要なコンポーネントの抽象化をひとつ削除すると、何百ものコンポーネントインスタンスを削減することができます。
