---
outline: deep
---

# Composition API に関するよくある質問 {#composition-api-faq}

:::tip
このページは Vue を使用した経験、 特に Vue 2 の Options API の経験があることを前提としています。
:::

## Composition API とは? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Composition API の無料レッスン"/>

Composition API はオプションを宣言する代わりに関数をインポートすることで Vue コンポーネントを書くことができる API セットのことです。以下に記載する API を含む包括的な用語です:

- [リアクティビティー API](/api/reactivity-core) 、例: `ref()` や `reactive()` で、リアクティブな状態、算出状態、ウォッチャーを直接作成できます。

- [ライフサイクルフック](/api/composition-api-lifecycle)、 例: `onMounted()` や `onUnmounted()` で、コンポーネントのライフサイクルにプログラム的なフックを設定します。

- [依存関係の注入](/api/composition-api-dependency-injection)、すなわち `provide()` と `inject()` によって、 リアクティビティー API を使用しながら Vue の依存関係注入システムを利用できます。

Composition API は Vue 3 と [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html) の組み込み機能です。Vue 2 の古いバージョンでは、公式にメンテナンスされている[`@vue/composition-api`](https://github.com/vuejs/composition-api)プラグインを使用してください。Vue 3 においては、 単一ファイルコンポーネント内で  [`<script setup>`](/api/sfc-script-setup) 構文を書くことで使えます。以下は Composition API を使った簡単なコンポーネントの例です。

```vue
<script setup>
import { ref, onMounted } from 'vue'

// リアクティブな状態
const count = ref(0)

// 状態を変更し更新トリガーする関数
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

関数合成ベースの API スタイルにも関わらず、 **Composition API は関数型プログラミングではありません**。 関数型プログラミングはイミュータブルを重視するのに対して、 Composition API は Vue のミュータブルできめ細かなリアクティブさをベースにしています。

Vue の Composition API の使い方について興味があるようでしたら、左サイドメニューの一番上にある　API 選択トグルを Composition API に切り替えて、最初からガイドを読み進めることができます。

## なぜ Composition API なのか? {#why-composition-api}

### より良いロジックの再利用 {#better-logic-reuse}

Composition API の最大の利点は [コンポーザブル関数](/guide/reusability/composables)の形式で、クリーンかつ効率的にロジックを再利用できることです。これは Options API の主要なロジック再利用メカニズムであった[ミックスインの欠点を全て](/guide/reusability/composables#vs-mixins)解決しています。

Composition API のロジック再利用性は [VueUse](https://vueuse.org/) のようなすばらしいコミュニティープロジェクトを生み出し、コンポーザブルの利便性を広める存在を増やし続けています。クリーンなメカニズムによってサードパーティーサービス・ライブラリーと Vue のリアクティブ機能との安定した統合も容易にしてくれています、例えば[イミュータブルなデータ](/guide/extras/reactivity-in-depth#immutable-data)、[ステートマシン](/guide/extras/reactivity-in-depth.html#state-machines)、そして [RxJS](https://vueuse.org/rxjs/readme.html#vueuse-rxjs) などです。

### より柔軟なコード整理 {#more-flexible-code-organization}

多くのユーザーはデフォルトの Options API で構成されたコードを書くことを好みます: なにごとにもあるべき方法というものが決まっているものです。しかしながら、 Options API では単一ファイルコンポーネントのロジックが成長し、ある一定以上の複雑さを超えた時点で深刻な制限を受けることになります。この制限は複数の**論理的関心**を扱うコンポーネントで特に顕著で、私たちは実際に稼働している多くの Vue 2 アプリケーションで目にしてきました。

例として Vue CLI の GUI で使われるフォルダーエクスプローラーコンポーネントをとりあげます: このコンポーネントは以下のような論理的関心を担っています:

- 現在のフォルダーの状態のトラッキングと内容の表示
- フォルダーナビゲーションのハンドリング(開く、閉じる、再読み込み)
- 新規フォルダーの作成のハンドリング
- お気に入りフォルダーのみ表示の切り替え
- 隠しフォルダーの表示切り替え
- 作業中のディレクトリーの変更のハンドリング

[オリジナル](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) のコンポーネントは Options API で書かれました。もし、これらのロジックを論理的関心ごとにを色付けしたコードで示した場合、以下のようになります:

<img alt="folder component before" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

同じ論理的関心を扱うコードがファイルの異なる部分、異なるオプションに分割せざるを得なくなっていることに注目してください。数百行あるコンポーネントの中から、1 つの論理的関心ごとを理解し終えるにはファイルの上から下まで何度もスクロールしなければならず、必要以上に困難なものにしています。加えて、もし私たちが論理的関心を再利用の利便性のため抽出しようとしたら、機能の断片となるちっぽけコードをファイルの異なるパートから抜き出すことになります。

これが同じコンポーネントを [Composition API にリファクタリング](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e) する前と後です:

![folder component after](./images/composition-api-after.png)

コードが同じ論理的関心でまとまっていることに注目してください:もはや特定の論理的関心のために異なるオプションブロックを飛び回る必要はなくなりました。そのうえ、コードをまとめて最小限の労力で外部ファイルに移すことができ、コードをあちこちひっかき回す必要もありません。リファクタリングのしづらさが減ることは大規模なコードを長期間メンテナンスする時のカギです。

### より良い型推論 {#better-type-inference}

ここ数年、多くのフロントエンドの開発者たちが [TypeScript](https://www.typescriptlang.org/) を取り入れ、より堅牢なコードを書き、より安心して変更を加えられるようにしていて、また IDE のサポートと共にすばらしい開発体験を提供してくれています。しかしながら、2013 年に Options API が生まれた当時、型推論の考慮がない状態でデザインされました。 Options API に型推論を取り入れるためには [とてもありえない複雑な型定義](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165)をしなければなりませんでした。これだけの努力をしても、 Options API の型推論はミックスインや依存関係の注入により壊れてしまいます。

このため、 Vue を Typescript で使いたい多くの開発者が `vue-class-component` による Class API を使うようになりました。ですが、クラスベースの API は ES デコレータに重度に依存しているため、 機能的には Vue 3 が開発された 2019 年時点の、ステージ 2 のプロポーザル段階のものになっています。私たちは公式の API が不安定なプロポーザルベースに依存していることはリスキー過ぎると感じました。それ以降、デコレータのプロポーザルはまたも全面的に見直され、2022 年にようやくステージ 3 に到達しました。加えて、クラスベースの API は Options API と同様にロジックの再利用とコード整理の制限の悩みがあります。

これと比較して、 Composition API はほとんどプレーンな変数と関数を活用しているため、もともと型と親和性があります。 Composition API で書かれたコードのほとんどはタイプヒントを付ける必要なく型推論を享受することができます。大抵の場合 Composition API のコードは、TypeScript とプレーンな JavaScript でほぼ同じに見えるでしょう。これにより、プレーンな Javascript ユーザーも部分的に型推論の恩恵を得ることが可能です。

### プロダクションバンドルをより小さく、そしてオーバーヘッドを減らす {#smaller-production-bundle-and-less-overhead}

Composition API で書かれたコードと `<script setup>` は　Options API より効率的でバンドルサイズの縮小化に親和性があります。テンプレート内の `<script setup>` コンポーネントは `<script setup>` と同じスコープ内にインラインの関数としてコンパイルされます。`this` からのプロパティアクセスとは異なり、コンパイルされたテンプレートコードは `<script setup>` 内で宣言された変数に、インスタンスプロキシを間に挟まずに直接アクセスすることができるようになります。これは、すべての変数名を安全に短縮することにもなり、より良い縮小化につながります。

## Options API との関係 {#relationship-with-options-api}

### トレードオフ {#trade-offs}

Options API から移行したユーザーの中には、Composition API のコードが整理されていないことに気づき、Composition API の方がコード整理の面で「悪い」と結論づけた人がいます。このような意見をお持ちの方は、別の視点からその問題を検討されることをお勧めします。

確かに Composition API は、コードをそれぞれのバケツに入れるよう導く「ガードレール」を提供しなくなりました。その代わり、通常の JavaScript を書くように、コンポーネントのコードを書くことができます。つまり、**通常の JavaScript を書くときと同じように、Composition API のコードにもコード整理のベストプラクティスを適用できますし、適用すべきです**。よくまとまった JavaScript を書けるなら、よくまとまった Composition API のコードも書けるはずです。

Options API は、コンポーネントコードを書くときに「考えることを減らす」ことを可能にし、それが多くのユーザーに支持されている理由です。しかし、精神的なオーバーヘッドを減らす一方で、逃げ場のない規定のコード構成パターンに縛られてしまい、大規模なプロジェクトではリファクタリングやコード品質の向上が困難になる可能性があります。この点、Composition API は、長期的なスケーラビリティに優れています。

### Composition API は全てのユースケースをカバーしていますか? {#does-composition-api-cover-all-use-cases}

はい、状態を持つロジックについてはそうです。 少しではありますが、Composition API を使う時にオプションがいくつか必要になります: `props` 、 `emits` 、 `name` 、 と `inheritAttrs` です。もし `<script setup>` を使っているしたら、唯一 `inheritAttrs` がプレーンな `<script>` が必要なオプションです。

Composition API だけを使用したい場合は(上にあげたオプションと共に)、 [compile-time flag](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) を使用することで Options API に関するコードを省き数キロバイトプロダクションバンドルをカットすることができます。これはあなたの依存関係内の Vue コンポーネントに影響に与える点に注意してください。

### 両方の API を一緒に使うことはできますか? {#can-i-use-both-apis-together}

はい。 Options API のコンポーネント内で [`setup()`](/api/composition-api-setup) オプションを使用することで Composition API を使うことができます。

しかしながら、この方法は既存の Options API コードベースがあり、Composition API で書かれた新しい機能/外部ライブラリーと統合する必要がある場合にのみ採ることを推奨します。

### Options API は非推奨になったのですか? {#will-options-api-be-deprecated}

いいえ、私たちは特にそうする予定はありません。 Options API は Vue の不可欠な要素であり、多くの開発者が Vue を愛する理由にもなっています。 Composition API の利点の多くは大規模プロジェクトでこそ現れるものであり、多くの低~中程度の複雑性のシナリオにおいては Options API が堅実な選択肢であり続けることも理解しています。

## Class API との関係 {#relationship-with-class-api}

Vue 3 においてはもはや Class API を推奨してません。 Composition API が提供する強力な TypeScript との統合とロジックの再利用とコード整理の恩恵があるためです。

## React Hooks との比較 {#comparison-with-react-hooks}

Composition API は React Hooks と同レベルのロジック構成機能を提供しますが、いくつか重要な違いがあります。

React Hooks はコンポーネントが更新されるたびに繰り返し実行されます。そのため、熟練した React 開発者でも戸惑うような注意点がいくつも出てきます。また、開発体験に深刻な影響を与えるパフォーマンス最適化の問題にもつながります。以下はその例です:

- Hooks は呼び出し順序に敏感で、条件付きでない

- React コンポーネント内で変数が宣言されるとフッククロージャに補足され、開発者が正しく依存関係の配列にパスしなかった場合に "stale" になります。そのため、 React の開発者は ESLint のルールに頼りつつ正しい依存関係を渡すようにしています。しかし、このルールは十分に賢くないことが多く、正しさを補おうとし過ぎるあまり、エッジケースに遭遇したときに不必要に無効化され頭痛の種になることがあります。

- コストの高い計算には `useMemo` の使用が必要となり、再び手動で正しい依存関係の配列を渡す必要があります。

- 子コンポーネントに渡されるイベントハンドラーは、デフォルトでは不必要な子コンポーネントの更新を引き起こすので、最適化として明示的に `useCallback` を必要とします。これはほとんど常に必要であり、また正しい依存関係の配列が必要です。これを無視すると、デフォルトでアプリケーションがオーバーレンダリングされることになり、気づかないうちにパフォーマンスの問題を引き起こす可能性があります。

- stale クロージャの問題は、 Concurrent 機能と組み合わさって、フックコードの一部がいつ実行されるかを推論することを難しくし、(`useRef` によって) レンダー間で持続されるべき変更可能な状態を扱うことを面倒なものにします。

これと比較して、 Vue Composition API は:

- `setup()` または `<script setup>` のコードを一度だけ呼び出します。これにより、コードは JavaScript の慣用的な使い方に沿った直感的なコードになり、 stale クロージャの心配はありません。 Composition API の呼び出しは、呼び出しの順番に関係なく、条件付きで呼び出すことができます。

- Vue のランタイムリアクティブシステムは、算出プロパティやウォッチャで使用されるリアクティブな依存関係を自動的に収集するため、依存関係を手動で宣言する必要がありません。

- 子コンポーネントの不要な更新を避けるために、コールバック関数を手動でキャッシュする必要がありません。一般に、 Vue のきめ細かいリアクティブシステムにより、子コンポーネントは必要なときだけ更新されます。 Vue の開発者が手動で子コンポーネント更新の最適化を気にする必要はほとんどありません。

React Hooks のクリエイティブさは確かなものですし Composition API のインスピレーションの大きな源となっています。ですが、上に書いたような課題が設計の中に存在します。さらに、私たちは Vue のリアクティブモデルがそれらを回避する方法を提供していることに気づきました。
