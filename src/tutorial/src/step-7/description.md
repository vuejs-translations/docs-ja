# リストレンダリング

`v-for` ディレクティブを使用すると、配列を基にした要素のリストをレンダリングすることができます:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

ここでの `todo` は、現在反復処理中の配列の要素を表すローカル変数です。これは `v-for` ディレクティブを使っている要素、またはその内部でのみアクセス可能です。

各 Todo オブジェクトに一意の `id` を与え、それを各 `<li>` の <a target="_blank" href="/api/built-in-special-attributes.html#key">特別な `key` 属性</a> としてバインドしていることに注目してください。この `key` により、Vue は各 `<li>` を配列内の対応するオブジェクトの位置に合わせて正確に移動させることができます。

リストを更新するには、次の 2 つの方法があります:

1. 配列の [変更メソッド](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) を呼び出す:

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. 配列を新しいものに置き換える:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

ここでは、シンプルな Todo リストを用意しています。`addTodo()` メソッドと `removeTodo()` メソッドのロジックを実装して、動作するようにしてみてください。

`v-for` の詳細: <a target="_blank" href="/guide/essentials/list.html">ガイド - リストレンダリング</a>

