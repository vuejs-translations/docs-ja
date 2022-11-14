# フォームバインディング {#form-bindings}

`v-bind` と `v-on` を一緒に使うことで、input 要素に双方向 (two-way) バインディングを作成することができます。

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // v-on ハンドラーはネイティブDOMのイベントを
    // 引数として受け取ります。
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // v-on ハンドラーはネイティブDOMのイベントを
  // 引数として受け取ります。
  text.value = e.target.value
}
```

</div>

入力ボックスに文字を入力してみてください。`<p>` の中の文字が入力された通りに更新されるのがわかると思います。

双方向 (two-way) バインディングを簡略化するために、Vue は上記の糖衣構文 (syntax sugar) の `v-model` というディレクティブを提供しています。

```vue-html
<input v-model="text">
```

`v-model` は `<input>` の値をバインドされた状態と自動的に同期するので、そのためのイベントハンドラーを使う必要はありません。

`v-model` はテキスト入力だけではなく、チェックボックス、ラジオボタン、セレクトボックスなどの他の入力タイプでも機能します。詳しくは<a target="_blank" href="/guide/essentials/forms.html">ガイド - フォームバインディング</a>を参照してください。

では、代わりに `v-model` を使用するようにコードをリファクタリングしてみましょう。
