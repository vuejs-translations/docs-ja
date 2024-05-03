# ウォッチャー {#watchers}

## 基本の例 {#basic-example}

算出プロパティを使うと、派生した値を宣言的に算出することができるようになります。しかしながら、状態の変更に応じて「副作用」を実行する必要とする場合があります。たとえば、DOM が変化する、あるいは非同期処理の結果に基づいて、別の状態に変更した場合といったものです。

<div class="options-api">

Options API では、[`watch` オプション](/api/options-state#watch) を使って、リアクティブなプロパティが変更されるたびに関数を実行することができます:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)',
      loading: false
    }
  },
  watch: {
    // 問題内容が変更されるたびに、関数が実行されます。
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Playground で試す](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

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

Composition API では、[`watch` 関数](/api/reactivity-core#watch) を使用することでリアクティブな状態の一部が変更されるたびにコールバックを実行することができます:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// watch 関数は ref を直接扱えます
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### 監視ソースの種類 {#watch-source-types}

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
  console.log(`Count is: ${count}`)
})
```

代わりに、getter を使います:

```js
// 代わりに、getter を使います:
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

</div>

## ディープ・ウォッチャー {#deep-watchers}

<div class="options-api">

`watch` はデフォルトではネストが浅い場合にしか対応していません: そのため、コールバックは監視対象のプロパティに新しい値が割り当てられた場合にしか実行されません。- そのため、ネストしたプロパティの変更があった場合には実行されません。もし、ネストしたすべての変更でコールバックが実行されるようにする場合、ディープ・ウォッチャーを使用する必要があります。

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

リアクティブなオブジェクト上で、`watch()` 関数を直接呼び出すとき、暗黙的にディープ・ウォッチャーが生成されます。 - そのため、コールバックはすべてのネストした変更で実行されます:

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

しかしながら、`deep` オプションを明示的に使用すれば、続いての例で強制的にディープ・ウォッチャーにすることができます。

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

## 即時ウォッチャー {#eager-watchers}

`watch` は、デフォルトでは、遅延して実行されます: 監視対象の値が変更するまでコールバックは実行されません。しかし、同様のコールバックのロジックを先に実行したい場合もあります。- たとえば、初期値のデータを読み込み、関連する状態が変更されるたび、再びデータを読み込みたいときです。

<div class="options-api">

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

ハンドラー関数の初回実行は、`created` フックの直前で行われます。Vue は `data`、`computed`、`methods` オプションを処理済みなので、これらのプロパティは初回呼び出しの際に利用可能です。

</div>

<div class="composition-api">

`immediate: true` オプションを渡すと、ウォッチャーのコールバックを強制的に即時実行させられます:

```js
watch(
  source,
  (newValue, oldValue) => {
    // すぐに実行され、`source` が変更されると再び実行される
  },
  { immediate: true }
)
```

</div>


## 一度きりのウォッチャー <sup class="vt-badge" data-text="3.4+" /> {#once-watchers}

ウォッチャーのコールバックは、監視対象のソースが変更されるたびに実行されます。ソースが変更されたときに一度だけコールバックを起動したい場合は、`once: true` オプションを使用します。

<div class="options-api">
  
```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // `source` が変更された時、一度だけトリガーされる
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // `source` が変更された時、一度だけトリガーされる
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

ウォッチャーのコールバックは、ソースと全く同じリアクティブな状態を使用するのが一般的です。例えば、次のコードでは `todoId` の ref が変更されるたびに、ウォッチャーを使ってリモートのリソースを読み込んでいます:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

特に、ウォッチャーが `todoId` を 2 回使用していることに注目してください。1 回目はソースとして、2 回目はコールバック内で使用しています。

これは、[`watchEffect()`](/api/reactivity-core#watcheffect) によって簡略化できます。`watchEffect()` によって、コールバックのリアクティブな依存関係を自動的に追跡できます。上記のウォッチャーは次のように書き換えられます:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

コールバックは即時実行されるので、`immediate: true` を指定する必要はありません。実行中は、自動的に `todoId.value` を依存関係として追跡します（算出プロパティと同様）。`todoId.value` が変更されるたびに、コールバックが再実行されます。`watchEffect()` を使用すると、ソース値として明示的に `todoId` を渡す必要がなくなります。

[この例](/examples/#fetching-data)では、`watchEffect` と実際にデータの読み込みがリアクティブに行われている様子をチェックすることができます。

このような、依存関係が 1 つしかない例では、`watchEffect()` のメリットは比較的小さいです。しかし、複数の依存関係があるウォッチャーでは、`watchEffect()` を使うことで、依存関係のリストを手動で管理する負担がなくなります。さらに、ネストしたデータ構造内の複数のプロパティを監視する必要がある場合、`watchEffect()` は、すべてのプロパティを再帰的に追跡するのではなく、コールバックで使用されるプロパティのみを追跡するので、ディープ・ウォッチャーよりも効率的であることがわかるでしょう。

:::tip
`watchEffect` は**同期的な**処理中のみ依存先を追跡します。非同期のコールバックで使用する場合、最初の `await` の前にアクセスされたプロパティのみが追跡されます。
:::

### `watch` 対 `watchEffect` {#watch-vs-watcheffect}

`watch` と `watchEffect` は、どちらとも副作用をリアクティブに処理することができます。両者の主な違いはリアクティブの依存先の監視方法にあります:

- `watch` は明示的に示されたソースしか監視しません。コールバック内でアクセスされたものは追跡しません。加えて、コールバックはソースが実際に変更したときにのみ実行されます。`watch` は依存関係の追跡を副作用から分離します。それにより、コールバックをいつ実行するかをより正確にコントロールすることができます。

- それに対して、`watchEffect` は依存先の追跡と副作用を 1 つのフェーズにまとめたものになります。同期処理を実行している間にアクセスしたすべてのリアクティブのプロパティを自動的に追跡します。これにより、より便利で一般的にコードが短くなりますが、そのリアクティブの依存先はあまり明示的にならなくなってしまいます。

</div>

## コールバックが実行されるタイミング {#callback-flush-timing}

リアクティブな状態が変更されるとき、Vue コンポーネントの更新と生成されたウォッチャーコールバックを実行します。

コンポーネントの更新と同様に、ユーザーが作成したウォッチャーのコールバックは、重複実行を避けるためにバッチ処理されます。例えば、監視対象の配列に 1000 個のアイテムを同期的にプッシュする場合、ウォッチャーが 1000 回起動するのはおそらく望ましくないでしょう。

デフォルトでは、ウォッチャーのコールバックは親コンポーネント（存在する場合）の更新**後**、オーナーコンポーネントの DOM 更新**前**に呼び出されます。つまり、ウォッチャーのコールバック内でオーナーコンポーネント自身の DOM にアクセスしようとすると、DOM は更新前の状態になります。

### 遅延ウォッチャー {#post-watchers}

ウォッチャーコールバック内で、Vue が更新した**後**のオーナーコンポーネントの DOM にアクセスしたい場合は、`flush: 'post'` オプションを指定する必要があります:

<div class="options-api">

```js{6}
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

```js{2,6}
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

### 同期ウォッチャー {#sync-watchers}

Vue が管理する更新の前に、同期的に起動するウォッチャーを作成することもできます:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

sync の `watchEffect()` には、便利なエイリアスの `watchSyncEffect()` もあります:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* リアクティブなデータ変更時に同期的に実行される */
})
```

</div>

:::warning 使用には注意が必要
同期ウォッチャーにはバッチ機能はなく、リアクティブな変更が検出されるたびにトリガーされます。単純な真偽値を監視するために使うのは構いませんが、配列のように何度も同期的に変更される可能性のあるデータソースでは使わないようにしましょう。
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

また、[`$watch()  インスタンスメソッド`](/api/component-instance#watch) を使用してウォッチャーを強制的に作成することが可能です:

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

これは、条件付きでウォッチャーをセットアップする必要があるときや、ユーザーの相互作用に応じる場合にのみ、何かを監視しないといけないときに役立ちます。これにより、ウォッチャーを早い段階で停止することができます。

</div>

## ウォッチャーの停止 {#stopping-a-watcher}

<div class="options-api">

`watch` オプションを使って宣言したウォッチャー、あるいは `$watch()` インスタンスメソッドは、オーナーコンポーネントがアンマウントされた自動的に停止します。そのため、多くの場合において、ウォッチャー自体が停止することを心配する必要はありません。

ごくまれに、オーナーコンポーネントがアンマウントされる前に停止する必要がある場合には、`$watch()` API は次のような関数を返します:

```js
const unwatch = this.$watch('foo', callback)

// ...wathcer が必要なくなったとき:
unwatch()
```

</div>

<div class="composition-api">

`setup()`, あるいは  `<script setup>` 内に同期的に宣言されたウォッチャーにより、オーナーコンポーネントのインスタンスにバインドされます。それにより、オーナーコンポーネントがアンマウントされたときに自動的に停止されます。多くの場合、ウォッチャーを自分で停止させることを心配する必要はありません。

ここで重要なのは、ウォッチャーが**同期的に** 生成されなければならないということです。もしウォッチャーが非同期なコールバックで生成されたら、オーナーコンポーネントにはバインドされず、メモリーリークを避けるために手動で停止しなければいけないからです。それは次の通りです:

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

手動でウォッチャーを停止するには、返されたハンドル関数を使用します。これは、`watch` や `watchEffect` のどちらにも作用します:

```js
const unwatch = watchEffect(() => {})

// ...あとで、もはや必要なくなったとき
unwatch()
```

非同期的にウォッチャーを作成する必要がある場合はほとんどなく、可能な限り同期的に作成する方が望ましいことに注意してください。もし非同期のデータを待つ必要があるなら、代わりに watch のロジックを条件付きにすることができます:

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
