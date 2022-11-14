# ウォッチャー {#watchers}

時には "side effects (副作用)" をリアクティブに実行する必要があるかもしれません - 例えば、数値が変化したときにコンソールにログを記録するといったことです。これはウォッチャーで実現することができます:

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // yes, console.log() is a side effect
  console.log(`new count is: ${newCount}`)
})
```

`watch()` は、直接 ref を監視することができ、 `count` の値が変化するたびにコールバックが発生します。 `watch()` は、他のタイプのデータソースを監視することもできます - 詳細は <a target="_blank" href="/guide/essentials/watchers.html">ガイド - ウォッチャー</a> で説明しています。

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // yes, console.log() is a side effect
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

ここでは、`watch` オプションを使用して、`count` プロパティの変更を監視しています。watch コールバックは `count` が変更されたときに呼び出され、新しい値を引数として受け取ります。詳細は <a target="_blank" href="/guide/essentials/watchers.html">ガイド - ウォッチャー</a> で説明しています。

</div>

コンソールへのログ記録よりも実用的な例としては、ID が変更されたときに新しいデータをフェッチすることでしょう。このコードでは、コンポーネントのマウント時にモック API から todos データを取得しています。また、フェッチすべき todo ID をインクリメントするボタンもあります。ボタンがクリックされたときに新しい todo をフェッチするウォッチャーを実装してみてください。
