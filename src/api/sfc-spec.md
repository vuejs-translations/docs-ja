# SFC 構文仕様 {#sfc-syntax-specification}

## 概要 {#overview}

Vue の単一ファイルコンポーネント（SFC）は、慣習的に *.vue というファイル拡張子が使用され、Vue コンポーネントを記述するために HTML のような構文を使用するカスタムファイル形式です。Vue の SFC は、HTML と構文的に互換性があります。

各 `*.vue` ファイルは、`<template>`, `<script>`, `<style>` の 3 種類のトップレベル言語ブロックと、オプションで追加できるカスタムブロックから構成されます:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## 言語ブロック {#language-blocks}

### `<template>` {#template}

- 各 `*.vue` ファイルには、最大 1 つのトップレベル `<template>` ブロックを含めることができます。

- コンテンツは抽出されて `@vue/compiler-dom` に渡され、JavaScript のレンダー関数に事前コンパイルされ、エクスポートされたコンポーネントに `render` オプションとしてアタッチされます。

### `<script>` {#script}

- 各 `*.vue` ファイルには、最大 1 つの `<script>` ブロックを含めることができます（[`<script setup>`](/api/sfc-script-setup) は除く）。

- スクリプトは、ES モジュールとして実行されます。

- **default export** は、プレーンオブジェクトか [defineComponent](/api/general#definecomponent) の戻り値のどちらかで、Vue のコンポーネントオプションオブジェクトになっている必要があります。

### `<script setup>` {#script-setup}

- 各 `*.vue` ファイルには、最大 1 つの `<script setup>` ブロックを含めることができます（通常の `<script>` は除く）。

- スクリプトは前処理され、コンポーネントの `setup()` 関数として使用されます。これは、**コンポーネントの各インスタンスに対して**実行されることを意味します。`<script setup>` のトップレベルのバインディングは、自動的にテンプレートに公開されます。詳細は [`<script setup>` に関する専用のドキュメント](/api/sfc-script-setup)を参照してください。

### `<style>` {#style}

- 1 つの `*.vue` ファイルに複数の `<style>` タグを含めることができます。

- スタイルを現在のコンポーネントにカプセル化するため、`<style>` タグに `scoped` または `module` 属性を指定できます（詳細は [SFC スタイル機能](/api/sfc-css-features)を参照）。同じコンポーネント内に、異なるカプセル化モードを持つ複数の `<style>` タグを混在させることができます。

### カスタムブロック {#custom-blocks}

プロジェクト固有のニーズに応じて、`*.vue` ファイルに `<docs>` ブロックのような追加のカスタムブロックを含めることができます。カスタムブロックの実際の例としては、以下のようなものがあります:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

カスタムブロックの扱いはツールに依存します - 独自のカスタムブロック統合を構築したい場合は、[SFC カスタムブロック統合ツールのセクション](/guide/scaling-up/tooling#sfc-custom-block-integrations)で詳細を確認してください。

## 自動名前推論 {#automatic-name-inference}

SFC は以下の場合、コンポーネントの名前を**ファイル名**から自動的に推論します:

- 開発時の警告フォーマット
- DevTools の inspection
- 再帰的な自己参照。例えば `FooBar.vue` という名前のファイルは、そのテンプレート内で自分自身を `<FooBar/>` として参照できます。これは、明示的に登録/インポートされたコンポーネントよりも優先順位が低くなります。

## プリプロセッサー {#pre-processors}

ブロックに `lang` 属性を使ってプリプロセッサーの言語を宣言できます。最も一般的なケースは、`<script>` ブロックでの TypeScript の使用です:

```vue-html
<script lang="ts">
  // TypeScript を使う
</script>
```

`lang` はどのブロックにも適用できます - 例えば、`<style>` で [Sass](https://sass-lang.com/) を使用したり、`<template>` で [Pug](https://pugjs.org/api/getting-started.html) を使用できます:

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

なお、各種プリプロセッサーとの統合はツールチェーンによって異なる場合があることに注意してください。例については、それぞれのドキュメントを参照してください:

- [Vite](https://ja.vitejs.dev/guide/features.html#css-%E3%83%97%E3%83%AA%E3%83%97%E3%83%AD%E3%82%BB%E3%83%83%E3%82%B5)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## `src` でのインポート {#src-imports}

`*.vue` コンポーネントを複数のファイルに分割したい場合は、`src` 属性を使用して言語ブロックに外部ファイルをインポートできます:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

`src` でのインポートは webpack のモジュールリクエストと同じパス解決ルールに従うので注意してください。つまり:

- 相対パスは `./` で始める必要があります
- npm の依存関係からリソースをインポートできます:

```vue
<!-- インストール済みの "todomvc-app-css" npm パッケージからファイルをインポート -->
<style src="todomvc-app-css/index.css" />
```

`src` でのインポートは、カスタムブロックでも動作します。例:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## コメント {#comments}

各ブロックの中では、使用されている言語（HTML、CSS、JavaScript、Pug など）のコメント構文を使用する必要があります。トップレベルのコメントには、HTML のコメント構文を使用します: `<!-- コメント内容をここに -->`
