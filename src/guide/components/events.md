<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>
# コンポーネントのイベント {#component-events}

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Free Vue.js Lesson on Defining Custom Events"/>
</div>

## イベントの発行と購読 {#emitting-and-listening-to-events}

コンポーネントは、組み込みの `$emit` メソッドを使用して、テンプレート式（例: `v-on` ハンドラー内）で直接カスタムイベントを発行できます:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

<div class="options-api">

`$emit()` メソッドは、コンポーネントインスタンス上でも `this.$emit()` として使用できます:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

そして、親コンポーネントは `v-on` を使ってイベントを購読できます:

```vue-html
<MyComponent @some-event="callback" />
```

`.once` 修飾子は、コンポーネントのイベントリスナーでもサポートされています:

```vue-html
<MyComponent @some-event.once="callback" />
```

コンポーネントや props と同様に、イベント名も自動的な大文字・小文字の変換を提供します。キャメルケースのイベントを発行しましたが、親ではケバブケースのリスナーを使用して購読できることに注意してください。[プロパティ名での大文字・小文字の使い分け](/guide/components/props.html#prop-name-casing)と同様に、テンプレートではケバブケースのイベントリスナーを使用することをお勧めします。

:::tip
ネイティブの DOM イベントとは異なり、コンポーネントから発行されたイベントはバブリング**しません**。直接の子コンポーネントから発行されたイベントのみを購読できます。兄弟コンポーネントや深くネストしたコンポーネント間で通信する必要がある場合は、外部のイベントバスや[グローバルな状態管理ソリューション](/guide/scaling-up/state-management.html)を使ってください。
:::

## イベントの引数 {#event-arguments}

イベントで特定の値を発行すると便利な場合があります。例えば、 `<BlogPost>` コンポーネントに、テキストをどれだけ拡大するかを担当させたい場合があります。そのような場合、`$emit` に追加の引数を渡して値を提供できます:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

次に、親でイベントを購読する際に、リスナーとしてインラインのアロー関数を使用することで、イベントの引数にアクセスできます:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

または、イベントハンドラーがメソッドの場合は:

```vue-html
<MyButton @increase-by="increaseCount" />
```

その値はそのメソッドの最初のパラメーターとして渡されます:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
`$emit()` に渡されたイベント名の後にあるすべての追加の引数はリスナーに転送されます。たとえば `$emit('foo', 1, 2, 3)` とすると、リスナー関数は 3 つの引数を受け取ります。
:::

## 発行するイベントの宣言 {#declaring-emitted-events}

<span class="composition-api">[`defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits) マクロ</span><span class="options-api">[`emits`](/api/options-state.html#emits) オプション</span>を使用して、コンポーネントが発行するイベントを明示的に宣言できます:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

`<template>` で使用した `$emit` メソッドは、コンポーネントの `<script setup>` セクション内ではアクセスできませんが、代わりに `defineEmits()` が同等の関数を返してくれるので、それを使用できます:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

`defineEmits()` マクロは関数の中では使用**できません**。上記の例のように、`<script setup>` 内に直接記述する必要があります。

`<script setup>` の代わりに明示的な `setup` 関数を使う場合は、イベントは [`emits`](/api/options-state.html#emits) オプションを使って宣言する必要があり、`emit` 関数は `setup()` コンテキスト上で公開されます:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

`setup()` コンテキストの他のプロパティと同様に、`emit` は安全に分割代入できます:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

`emits` オプションはオブジェクト構文もサポートしており、発行されたイベントのペイロードのランタイムバリデーションを実行できます:

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  submit(payload) {
    // バリデーションの合格/不合格を示す
    // `true` または `false` を返す
  }
})
</script>
```

`<script setup>` で TypeScript 使用している場合、純粋な型アノテーションを使用して、発行するイベントを宣言することもできます:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

詳細: [コンポーネントの emit の型付け](/guide/typescript/composition-api.html#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload) {
    // バリデーションの合格/不合格を示す
    // `true` または `false` を返す
    }
  }
}
```

参照: [コンポーネントの emit の型付け](/guide/typescript/options-api.html#typing-component-emits) <sup class="vt-badge ts" />

</div>

任意ですが、コンポーネントがどのように動作すべきかをよりよく文書化するために、発行されるすべてのイベントを定義することが推奨されます。また、これにより Vue は既知のリスナーを[フォールスルー属性](/guide/components/attrs.html#v-on-listener-inheritance)から除外し、サードパーティのコードによって手動でディスパッチされた DOM イベントによって起こるエッジケースを回避できます。

:::tip
ネイティブイベント（例: `click`）が `emits` オプションに定義されている場合、リスナーはコンポーネントが発行する `click` イベントのみを購読し、ネイティブの `click` イベントには反応しなくなります。
:::

## イベントのバリデーション {#events-validation}

発行するイベントは、プロパティの型バリデーションと同様に、配列構文ではなくオブジェクト構文で定義されている場合にバリデーションできます。

バリデーションを追加するには、「<span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> の呼び出しに渡された引数」を受け取り、「イベントが正当かどうかを示す真偽値」を返す関数をイベントに割り当てます。

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // バリデーションなし
  click: null,

  // submit イベントをバリデーション
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // バリデーションなし
    click: null,

  // submit イベントをバリデーション
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
