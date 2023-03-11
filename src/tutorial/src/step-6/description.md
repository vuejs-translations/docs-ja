# 条件付きレンダリング {#conditional-rendering}

要素を条件付きでレンダリングする際に `v-if` ディレクティブを使用することができます:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

この `<h1>` は `awesome` の値が [truthy](https://developer.mozilla.org/ja/docs/Glossary/Truthy) である場合にのみレンダリングされます。もし `awesome` の値が [falsy](https://developer.mozilla.org/ja/docs/Glossary/Falsy) に変わったら、この `<h1>` は DOM から削除されます。

また、他の条件分岐を示すために `v-else` や `v-else-if` を使用することもできます:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

現在、デモでは `<h1>` が両方一緒に表示されていて、ボタンは何もしません。それらに `v-if` と `v-else` ディレクティブを追加し、 `toggle()` メソッドを実装して、ボタンを押下時に切り替えができるようにしてみてください。

`v-if` についての詳細: <a target="_blank" href="/guide/essentials/conditional.html">ガイド - 条件付きレンダリング</a>
