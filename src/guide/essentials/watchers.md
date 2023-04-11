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
      answer: 'Questions usually contain a question mark. ;-)'
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

[Playground で試す](https://play.vuejs.org/#eNptUk2PmzAQ/SuvXAA1sdVrmt0qqnroqa3UIxcLhuCGjKk/wkYR/70OBJLuroRkPDPvzbznuSS7rhOnQMkm2brS6s4/F0wvnbEeFdUqtB6XgoFKeZXl0z9gyQfL8w34G8h5bXiDNF3NQcWuJxtDv25Zh+CCatszSsNeaYZakDgqexD4vM7TCT9cj2Ek65Uvm83cTUr0DTGdyN7RZaN4T24F32iHOnA5hnvdtrCBJ+RcnTH180wrmLaaL4s+QNd4LBOaK3r5UWfplzTHM9afHmoxdhV78rtRcpbPmVHEf1qO5BtTuUWNcmcu8QC9046kk4l4Qvq70XzQvBdC3CyKJfb8OEa01fn4OC7Wq15pj5qidVnaeN+5jZRncmxE72upOp0uY77ulU3gSCT+uOhXnt9yiy6U1zdBRtYa+9aK+9TfrgUf8NWEtgKbK6mKQN8Qdj+/C6T4iJHkXcsKjt9WLpsZL56OXas8xRuw7cYD2LlDXKYoT7K5b+OU22rugsdpfTQVtU9FMueLBHKikRNPpLtcbnuLYZjCW7m0TIZ/92UFiQ==)

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

[Playground で試す](https://play.vuejs.org/#eNplkkGPmzAQhf/KKxdA3Rj1mpJUUdVDT22lHrlYxDRuYOzaJjRC/PcdxyGr3b2A7PfmmzcMc3awVlxGlW2z2rdO2wCvwmj3DenBGhcww6nuCZMM7QkLOmcG5FyRN9RQa8gH/BuVD9oQdtFb5Hm5KpL8pNx6/+vu8xj9KPv+CnYFqQnyhTFIdxb4vCkjpaFb32JVnyD9lVoUpKaVVmK3x9wQoLtXgtB0VP9/cOMveYk9Np/K5MM9l7jIflScLv990nTW9EcIwXNFR3DX1YwYk4dxyrNXTlIHdCrGyk8hWL+tqqvyZMQUukpaHYOnujdtilTLHPHXGyrKUiRH8i9obx+5UM4Z98j6Pu23qH/AVzP2R5CJRMl14aRw+PldIMdH3Bh3bnzxY+FcdZW2zPvlQ1CD7WVQfALquPToP/gzL4RHqsg89rJNWq3JjgGXzWCOqt812ao3GaqEqRKHcfO8/gDLkq7r6tEyW54Bf5TTlg==)

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
watch(source, (newValue, oldValue) => {
  // すぐに実行され、`source` が変更されると再び実行される
}, { immediate: true })
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

ウォッチャーのコールバックは、ソースと全く同じリアクティブな状態を使用するのが一般的です。例えば、次のコードでは `todoId` の ref が変更されるたびに、ウォッチャーを使ってリモートのリソースを読み込んでいます:

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
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

このような、依存関係が 1 つしかない例では、`watchEffect()` のメリットは比較的小さいです。しかし、複数の依存関係があるウォッチャーでは、`watchEffect()` を使うことで、依存関係のリストを手動で管理する負担がなくなります。さらに、ネストしたデータ構造内の複数のプロパティをウォッチする必要がある場合、`watchEffect()` は、すべてのプロパティを再帰的に追跡するのではなく、コールバックで使用されるプロパティのみを追跡するので、ディープ・ウォッチャーよりも効率的であることがわかるでしょう。

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

デフォルトでは、ユーザーが生成したウォッチャーのコールバックは Vue コンポーネントが更新される**前に**呼ばれます。これはつまり、コールバック内で DOM へアクセスしようとすると、DOM は Vue が更新を適用される前の状態です。

もし Vue の更新**後**にウォッチャーコールバック内で DOM へアクセスしたいとき、`flush: 'post'` オプションで指定する必要があります:

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

非同期的にウォッチャーを作成する必要にある場合はほとんどになく、可能な限り同期的に作成する方が望ましいことに注意してください。もし非同期のデータを待つ必要があるなら、代わりに watch のロジックを条件付きにすることができます:

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
