# イベントリスナー

`v-on` ディレクティブを使うことで DOM イベントを購読することができます:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

頻繁に使われるので、`v-on` には省略記法があります:

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

ここでは、`increment` は `methods` オプションを使って宣言された関数を参照しています:

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // コンポーネントの状態を更新する
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // コンポーネントの状態を更新する
      this.count++
    }
  }
})
```

</div>

メソッドの中では、`this` を使ってコンポーネントインスタンスにアクセスすることができます。コンポーネントインスタンスは `data` によって宣言されたデータプロパティを公開します。これらのプロパティを変更することで、コンポーネントの状態を更新することができます。

</div>

<div class="composition-api">

<div class="sfc">

ここでは、`increment` は `<script setup>` で宣言された関数を参照しています:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // コンポーネントの状態を更新する
  count.value++
}
</script>
```

</div>

<div class="html">

ここでは、`increment` は `setup()` から返却されたオブジェクトの中にあるメソッドを参照しています:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // コンポーネントの状態を更新する
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

関数の中では、ref を変えることによってコンポーネントの状態を更新することができます。

</div>

イベントハンドラーはインライン表現も使うことができ、共通のタスクを装飾子で簡略にすることができます。これらの詳細は <a target="_blank" href="/guide/essentials/event-handling.html">ガイド - イベントハンドリング</a> の中でカバーされています。

では、自分自身で `increment` <span class="options-api">メソッド</span><span class="composition-api">関数</span> を実装して、`v-on` を使ってボタンに束縛してみましょう。
