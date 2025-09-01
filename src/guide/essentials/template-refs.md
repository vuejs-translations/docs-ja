# テンプレート参照 {#template-refs}

Vue の宣言型レンダリングモデルは、直接的な DOM 操作のほとんどを抽象化してくれます。それでも、基盤の DOM 要素に直接アクセスすることが必要になるケースがまだ存在するかもしれません。次に示す `ref` という特殊な属性を用いると、それを実現することができます:

```vue-html
<input ref="input">
```

`ref` は、`v-for` の章で説明した `key` 属性に似た、特殊な属性です。これを使用すると、特定の DOM 要素や子コンポーネントのインスタンスがマウントされた後に、そのインスタンスへの直接の参照を取得することができます。例えば、コンポーネントがマウントされた時にプログラムを使って入力欄にフォーカスを当てたり、ある要素に使用するサードパーティのライブラリーを初期化したりしたい時に便利です。

## 参照へのアクセス {#accessing-the-refs}

<div class="composition-api">

Composition API で参照を取得するには、[`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) ヘルパー <sup class="vt-badge" data-text="3.5+" /> を使用できます:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// 最初の引数は、テンプレートの ref の値に一致させる必要があります。
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

TypeScript を使用する場合、Vue の IDE サポートと `vue-tsc` は、一致する `ref` 属性が使用されている要素やコンポーネントに基づいて、`input.value` の型を自動的に推論します。

<details>
<summary>3.5 以前の使用方法</summary>

`useTemplateRef()` が導入されていなかった 3.5 以前のバージョンでは、テンプレート内の `ref` 属性の値と同じ名前で `ref` を宣言する必要がありました:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 要素の参照を保持する ref を宣言します。
// 名前は、テンプレートの ref の値に一致させる必要があります。
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

`<script setup>` を使用しない場合は、`setup()` から ref を返す必要もあります:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

結果として得られる参照は、以下のように `this.$refs` で公開されます:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

参照にアクセスできるのは、**コンポーネントがマウントされた後**に限られることに注意してください。テンプレートの式で <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> にアクセスしようとしても、初回のレンダリングでは <span class="options-api">`undefined`</span><span class="composition-api">`null`</span> になっています。なぜなら、初回のレンダリングが終わった後でないと要素が存在しないためです！

<div class="composition-api">

テンプレート参照の更新を監視する時は、参照が `null` 値になる場合があることを考慮する必要があります:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 要素がまだマウントされていない、または（v-if などによって）アンマウントされた
  }
})
```

こちらもご覧ください: [テンプレート参照の型付け](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## コンポーネントでの参照 {#ref-on-component}

> このセクションは、[コンポーネント](/guide/essentials/component-basics)についての知識があることを前提にしています。読み飛ばして、後で戻ってくるのでも大丈夫です。

`ref` は子コンポーネントに対して使用することもできます。その場合、以下のように、参照はコンポーネントのインスタンスへの参照になります:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value は <Child /> のインスタンスを保持します。
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>3.5 以前の使用方法</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value は <Child /> のインスタンスを保持します。
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child は <Child /> のインスタンスを保持します。
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">子コンポーネントが Options API で書かれている場合、または子コンポーネントが `<script setup>` を使わずに書かれている場合、</span><span class="options-api"></span>参照されるインスタンスは子コンポーネントの `this` と同じになります。これは、親コンポーネントからは子コンポーネントのすべてのプロパティとメソッドに完全にアクセスできることを意味します。そうなると、親と子の間で実装の細かな部分が緊密に結合された状態が作られやすくなってしまいます。したがって、コンポーネントの参照は、絶対に必要と言える場合に限って使用するべきです。ほとんどの場合、まずは標準の props と emit のインターフェースを使って親子間のやり取りを実装することを試みるとよいでしょう。

<div class="composition-api">

特例は、`<script setup>` を使用するコンポーネントです。このようなコンポーネントは、**デフォルトでプライベート**となります。`<script setup>` が使われている子コンポーネントを親コンポーネントから参照する場合、親コンポーネントは、子コンポーネントで `defineExpose` マクロを使って選択されたパブリックインターフェース以外のものにアクセスすることができません:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// defineExpose などのコンパイラーマクロはインポートする必要はありません
defineExpose({
  a,
  b
})
</script>
```

親がテンプレート参照を用いてこのコンポーネントのインスタンスを取得する場合、取得されるインスタンスは `{ a: number, b: number }` の形になります（通常のインスタンスと同様に、ref は自動的にアンラップされます）。

defineExpose は必ず await 操作の前に呼び出す必要があります。そうでないと、await 操作の後に公開されるプロパティやメソッドにアクセスできなくなります。

こちらもご覧ください: [コンポーネントのテンプレート参照の型付け](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

子インスタンスへのアクセスに制限を設けるには、`expose` オプションを使用します:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

上の例では、テンプレート参照を用いてこのコンポーネントを参照する親に、`publicData` と `publicMethod` のみへのアクセスを許可します。

</div>

## `v-for` の中の参照 {#refs-inside-v-for}

> v3.5 以降が必要です。

<div class="composition-api">

`v-for` の中で `ref` を使用すると、対応する参照には配列値が格納されます。そしてこの配列値には、マウント後の要素が代入されます:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>3.5 以前の使用方法</summary>

`useTemplateRef()` が導入されていなかった 3.5 以前のバージョンでは、テンプレートの ref 属性の値と一致する名前で ref を宣言する必要があります。 ref には配列の値も含まれます:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

`v-for` の中で `ref` を使用すると、結果として得られる参照の値は、対応する要素を格納する配列になります:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

参照の配列では、元の配列と同じ順序が**保証されない**ことに注意する必要があります。

## 関数を使った参照 {#function-refs}

`ref` 属性は、文字列のキーの代わりに、関数にバインドすることもできます。関数はコンポーネントが更新されるたびに呼び出され、要素の参照をどこに保持するかを柔軟に決めることができます。関数は、第 1 引数として要素への参照を受け取ります:

```vue-html
<input :ref="(el) => { /* el をプロパティまたは ref に保持する */ }">
```

動的な `:ref` のバインディングを使っていることに注目してください。これにより、参照の名前を示す文字列ではなく、関数を渡すことが可能になります。要素がアンマウントされると、引数は `null` になります。もちろん、インライン関数のほかに、メソッドを指定することもできます。
