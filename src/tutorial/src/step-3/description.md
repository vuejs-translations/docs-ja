# 属性バインディング

Vue では mustaches（二重中括弧）はテキスト補間のみ使用します。動的な値を属性にバインドするのは、`v-bind` ディレクティブを使います：

```vue-html
<div v-bind:id="dynamicId"></div>
```

**ディレクティブ**は `v-` から始まる特別な属性です。これは Vue のテンプレート構文の一部です。テキスト補間と同様に、ディレクティブの値はコンポーネントの状態にアクセスできる JavaScript 式です。`v-bind` とディレクティブ構文の詳細については<a target="_blank" href="/guide/essentials/template-syntax.html">ガイド - テンプレート構文</a>で説明します。

コロンの後の部分（`:id`）はディレクティブの「引数」です。ここでは要素の `id` はコンポーネントの状態から `dynamicId` 属性と同期されます。

`v-bind` は非常に頻繁につかうため、専用の省略記法があります:

```vue-html
<div :id="dynamicId"></div>
```

では、`<h1>` に `titleClass` の<span class="options-api">データプロパティ</span><span class="composition-api">ref</span> を値として動的の属性バインディングを追加してみましょう。正しくバインドできたら、文字が赤くなります。
