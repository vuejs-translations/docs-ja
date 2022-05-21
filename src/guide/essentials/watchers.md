# Watchers

## 基本の例

算出プロパティを使うと、派生した値を宣言的に算出することができるようになります。しかしながら、状態の変更に応じて「副作用」を実行する必要とする場合があります。たとえば、DOM が変化する、あるいは非同期処理の結果に基づいて、別の状態にに変更した場合といったものです。

<div class="options-api">

Option API では、[`watch` オプション](/api/options-state.html#watch) を使って、リアクティブなプロパティが変更されるたびに関数を実行することができます:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)'
    }
  },
  watch: {
    // 問題内容が変更されるたびに、関数が実行されます。
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" />
</p>
<p>{{ answer }}</p>
```

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVlc3Rpb246ICcnLFxuICAgICAgYW5zd2VyOiAnUXVlc3Rpb25zIHVzdWFsbHkgY29udGFpbiBhIHF1ZXN0aW9uIG1hcmsuIDstKSdcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgLy8gd2hlbmV2ZXIgcXVlc3Rpb24gY2hhbmdlcywgdGhpcyBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIHF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBvbGRRdWVzdGlvbikge1xuICAgICAgaWYgKG5ld1F1ZXN0aW9uLmluZGV4T2YoJz8nKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuZ2V0QW5zd2VyKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhc3luYyBnZXRBbnN3ZXIoKSB7XG4gICAgICB0aGlzLmFuc3dlciA9ICdUaGlua2luZy4uLidcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgICB0aGlzLmFuc3dlciA9IChhd2FpdCByZXMuanNvbigpKS5hbnN3ZXJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyID0gJ0Vycm9yISBDb3VsZCBub3QgcmVhY2ggdGhlIEFQSS4gJyArIGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

`watch` オプションはドットで区切られたパスをキーとして使うこともできます。

```js
export default {
  watch: {
    // 注意 単純なパスのみ対応しています。式は対応していません。
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

Composition API では、[`watch` 関数](/api/reactivity-core.html#watch) を使用することでリアクティブな状態の一部が変更されるたびにコールバックが実行することができます:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// watch 関数は ref を直接扱えます
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnXG5cbmNvbnN0IHF1ZXN0aW9uID0gcmVmKCcnKVxuY29uc3QgYW5zd2VyID0gcmVmKCdRdWVzdGlvbnMgdXN1YWxseSBjb250YWluIGEgcXVlc3Rpb24gbWFyay4gOy0pJylcblxud2F0Y2gocXVlc3Rpb24sIGFzeW5jIChuZXdRdWVzdGlvbikgPT4ge1xuICBpZiAobmV3UXVlc3Rpb24uaW5kZXhPZignPycpID4gLTEpIHtcbiAgICBhbnN3ZXIudmFsdWUgPSAnVGhpbmtpbmcuLi4nXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3llc25vLnd0Zi9hcGknKVxuICAgICAgYW5zd2VyLnZhbHVlID0gKGF3YWl0IHJlcy5qc29uKCkpLmFuc3dlclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbnN3ZXIudmFsdWUgPSAnRXJyb3IhIENvdWxkIG5vdCByZWFjaCB0aGUgQVBJLiAnICsgZXJyb3JcbiAgICB9XG4gIH1cbn0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBBc2sgYSB5ZXMvbm8gcXVlc3Rpb246XG4gICAgPGlucHV0IHYtbW9kZWw9XCJxdWVzdGlvblwiIC8+XG4gIDwvcD5cbiAgPHA+e3sgYW5zd2VyIH19PC9wPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

### 監視ソースの種類

`watch` の第一引数は、リアクティブな「ソース」のさまざまな型に対応しています: その引数には ref（算出 ref も含む）やリアクティブなオブジェクト、getter 関数、あるいは複数のソースの配列といったものです:

```js
const x = ref(0)
const y = ref(0)

// 単一の ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 複数のソースの配列
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

以下のようなリアクティブのオブジェクトのプロパティを監視できないことに注意してください:

```js
const obj = reactive({ count: 0 })

// これは、watch() に数値を渡しているので動作しません。
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

代わりに、getter を使います:

```js
// 代わりに、getter を使います:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

</div>

## Deep Watchers

<div class="options-api">

`watch` はデフォルトではネストが浅い場合にしか対応していません: そのため、コールバックは監視対象のプロパティに新しい値が割り当てられた場合にしか実行されません。- そのため、ネストしたプロパティの変更があった場合には実行されません。もし、ネストしたすべての変更でコールバックが実行されるようにする場合、deep watcher を使用する必要があります。

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：オブジェクト自体が置き替わらない限り、
        // ネストした変更では、 `newValue` は、`oldValue` と
        // 等しくなります。
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

リアクティブなオブジェクト上で、`watch()` 関数を直接呼び出すとき、暗黙的に deep watcher が生成されます。 - そのため、コールバックはすべてのネストした変更で実行されます:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // ネストしたプロパティの変更で実行されます
  // 注意: `newValue` は、`oldValue` と同じだとみなされます。
  // なぜなら、両者はともに同じオブジェクトを示しているからです。
})

obj.count++
```

これは、リアクティブなオブジェクトを返す getter により、差別化されます。 - 後者の場合、異なるオブジェクトを返したときにのみコールバックは実行されます。

```js
watch(
  () => state.someObject,
  () => {
    // state.someObject が置き換わった時のみ実行されます。
  }
)
```

しかしながら、`deep` オプションを明示的に使用すれば、続いての例で強制的に deep watcher にすることができます。

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    //注意: `newValue` は、`oldValue` と同じだとみなされます。
    //state.someObject が置き替わらない*限りは*。
  },
  { deep: true }
)
```

</div>

:::warning  使用上の注意
deep watch は、監視対象のオブジェクトのネストされた全てのプロパティをトラバースする必要があるため、大きなデータ構造で使用するときにはコストが高くなります。使用するときは、どうしても必要なときにだけ使用し、パフォーマンスへの影響に注意しましょう。
:::

<div class="options-api">

## Eager Watchers \*

`watch` は、デフォルトでは、遅延して実行されます: 監視対象の値が変更するまでコールバックは実行されません。しかし、同様のコールバックのロジックを先に実行したい場合もあります。- たとえば、初期値のデータを読み込み、関連する状態が変更されるたび、再びデータを読み込みたいときです。

`handler` 関数と `immediate: true` オプションを設定したオブジェクトを利用して宣言することで、監視対象のコールバック関数をすぐ実行させることができます:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // コンポーネントが生成されるとすぐに実行されます。
      },
      // 前倒しして、コールバックの実行を強制します。
      immediate: true
    }
  }
  // ...
}
```

</div>

<div class="composition-api">

## `watchEffect()` \*\*

`watch()` は遅延して実行されます: 監視対象の値が変更するまでコールバックは実行されません。しかし、同様のコールバックのロジックを先に実行したい場合もあります。- たとえば、初期値のデータを読み込み、関連する状態が変更されるたび、再びデータを読み込みたいときです。気づいたら次のようにしているかもしれません:

```js
const url = ref('https://...')
const data = ref(null)

async function fetchData() {
  const response = await fetch(url.value)
  data.value = await response.json()
}

// 読み込みがすぐに実行されます。
fetchData()
// そして、url の変更を監視します。
watch(url, fetchData)
```

これは、[`watchEffect()`](/api/reactivity-core.html#watcheffect) によって簡略化できます。`watchEffect()` によって、effect のリアクティブな依存先を自動的に追跡しつつ、副作用をすぐに実行してくれるようになります。上記の例を次のように書き直すことができます:

```js
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

これで、コールバックはすぐに実行されます。実行している間、依存先（算出プロパティに似たもの）としての `url.value` を自動的に追跡してくれます。`url.value` が変更されるたびに、コールバックは再実行されます。

[この例](/examples/#fetching-data)では、`watchEffect` と実際にデータの読み込みがリアクティブに行われている様子をチェックすることができます。

:::tip
`watchEffect` は**同期的な**処理中のみ依存先を追跡します。非同期のコールバックで使用する場合、最初の `await` の前にアクセスされたプロパティのみが追跡されます。
:::

### `watch` 対 `watchEffect`

`watch` と `watchEffect` は、どちらとも副作用をリアクティブに処理することができます。両者の主な違いはリアクティブの依存先の監視方法にあります:

- `watch` は明示的に示されたソースしか監視しません。コールバック内でアクセスされたものは追跡しません。加えて、コールバックはソースが実際に変更したときにのみ実行されます。`watch` は依存性の追跡を副作用から分離します。それにより、コールバックをいつ実行するかをより正確にコントロールすることができます。

- それに対して、`watchEffect` は依存先の追跡と副作用を 1 つのフェーズにまとめたものになります。同期処理を実行している間にアクセスしたすべてのリアクティブのプロパティを自動的に追跡します。これにより、より便利で一般的にコードが短くなりますが、そのリアクティブの依存先はあまり明示的にならなくなってしまいます。

</div>

## コールバックが実行されるタイミング

リアクティブのステートが変更されるとき、Vue コンポーネントの更新と生成された watcher コールバックを実行します。

デフォルトでは、ユーザーが生成した watcher のコールバックは Vue コンポーネントが更新される**前に**呼ばれます。これはつまり、コールバック内で DOM へアクセスしようとすると、DOM は Vue が更新を適用される前の状態です。

もし Vue の更新**後**に watcher コールバック内で DOM へアクセスしたいとき、`flush: 'post'` オプションで指定する必要があります:

<div class="options-api">

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

フラッシュ後の `watchEffect()` には、便利なエイリアスである `watchPostEffect()` があります:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* Vue 更新後に実行されます*/
})
```

</div>

<div class="options-api">

## `this.$watch()` \*

また、[`$watch()  インスタンスメソッド`](/api/component-instance.html#watch) を使用して watcher を強制的に作成することが可能です:

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

これは、条件付きで watcher をセットアップする必要があるときや、ユーザーの相互作用に応じる場合にのみ、何かを監視しないといけないときに役立ちます。これにより、watcher を早い段階で停止することができます。

</div>

## Watcher の停止

<div class="options-api">

`watch` オプションを使って宣言した watchers、あるいは `$watch()` インスタンスメソッドは、オーナーコンポーネントがアンマウントされた自動的に停止します。そのため、多くの場合において、watcher 自体が停止することを心配する必要はありません。

ごくまれに、オーナーコンポーネントがアンマウントされる前に停止する必要がある場合には、`$watch()` API は次のような関数を返します:

```js
const unwatch = this.$watch('foo', callback)

// ...wathcer が必要なくなったとき:
unwatch()
```

</div>

<div class="composition-api">

`setup()`, あるいは  `<script setup>` 内に同期的に宣言された watcher により、オーナーコンポーネントのインスタンスにバインドされます。それにより、オーナーコンポーネントがアンマウントされたときに自動的に停止されます。多くの場合、watcher を自分で停止させることを心配する必要はありません。

ここで重要なのは、watcher が**同期的に** 生成されなければならないということです。もし watcher が非同期なコールバックで生成されたら、オーナーコンポーネントにはバインドされず、メモリーリークを避けるために手動で停止しなければいけないからです。それは次の通りです:

```vue
<script setup>
import { watchEffect } from 'vue'

// これは自動的に停止します
watchEffect(() => {})

// ...これは自動では停止しません
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

手動で watcher を停止するには、返されたハンドル関数を使用します。これは、`watch` や `watchEffect` のどちらにも作用します:

```js
const unwatch = watchEffect(() => {})

// ...あとで、もはや必要なくなったとき
unwatch()
```

非同期的に watcher を作成する必要にある場合はほとんどになく、可能な限り同期的に作成する方が望ましいことに注意してください。もし非同期のデータを待つ必要があるなら、代わりに watch のロジックを条件付きにすることができます:

```js
// 非同期的にロードされるデータ
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // データがロードされたときに何かを実行します
  }
})
```

</div>
