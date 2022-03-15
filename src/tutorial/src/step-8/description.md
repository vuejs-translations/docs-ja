# 算出プロパティー

前回のステップで作成した TODO リストの上に追加していきましょう。ここでは各 TODO にトグル機能を追加していきます。これは各 TODO オブジェクトに `done` プロパティーを追加して、チェックボックスにそれをバインドするために `v-model` を使います:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done" />
  ...
</li>
```

次の変更点はすでに完了した Todo を隠せるようにすることです。すでに `hideCompleted` 状態をトグルするボタンがあります。しかし、その状態に基づいて異なるリスト項目をレンダリングするにはどうしたらよいでしょうか？

<div class="options-api">

<a target="_blank" href="/guide/essentials/computed.html">算出プロパティー</a>の紹介です。他のプロパティーからリアクティブに算出されたプロパティーを `computed` オプションを使用して宣言することができます:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // `this.hideCompleted` を元にフィルターされた TODO を返却する
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // `this.hideCompleted` を元にフィルターされた TODO を返却する
    }
  }
})
```

</div>

</div>
<div class="composition-api">

<a target="_blank" href="/guide/essentials/computed.html">`computed()`</a> の紹介です。他のリアクティブなデータソースに基づいて `.value` を計算する算出参照をつくることができます:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // `todos.value` と `hideCompleted.value` に基づいて
  // フィルターされた TODO を返却する
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // `todos.value` と `hideCompleted.value` に基づいて
      // フィルターされた TODO を返却する
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

算出プロパティーは、その計算の中で使用される他のリアクティブステートを依存関係として追跡します。計算結果はキャッシュされて、依存関係が変更されると自動的に更新されます。

では、 `filteredTodos` の算出プロパティーを追加して、その算出ロジックを実装してみましょう！　正しく実装されていれば、完了したアイテムを非表示にするときに、TODO のチェックをオフにすると、すぐにそのアイテムも非表示になるはずです。
