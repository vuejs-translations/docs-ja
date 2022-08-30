# Composition API とともに TypeScript を使用する

> このページは [TypeScript で Vue を使用する](./overview) ページの内容をすでに読んでいることを前提にしています。

## コンポーネントの props の型付け

### `<script setup>` の使用

`<script setup>` を使用する場合、 `defineProps()` マクロは、引数に基づいて props の型を推論できます:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

これは "runtime declaration" (実行時宣言) と呼ばれます、なぜなら `defineProps()` に渡された引数は、実行時に `props` のオプションとして使用されるためです。

しかし、通常は型引数で props の型を定義するほうがより単純です:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

これは "type-based declaration" (型ベースの宣言) と呼ばれます。コンパイラーは型引数に基づいて同等の実行時のオプションを推論しようとします。今回の場合、2 番目の例は最初の例と全く同じ実行時のオプションにコンパイルされます。

type-base declaration と runtime declaration の両方を同時に使用することはできません。

props の型をインターフェースとして分離することもできます:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

#### 構文の制限

正しい実行時のコードが生成されるために、 `defineProps` の型引数は以下のいずれでなければなりません:

- オブジェクトリテラル型:

  ```ts
  defineProps<{ /*... */ }>()
  ```

- **同じファイル内の** インターフェース、またはオブジェクトリテラル型への参照:

  ```ts
  interface Props {/* ... */}

  defineProps<Props>()
  ```

インターフェースやオブジェクトリテラル型自体は、他のファイルから import した型を含むことができますが、`defineProps()` の型引数に渡す引数は **他のファイルから import された型であってはいけません**:

```ts
import { Props } from './other-file'

// サポートされていない
defineProps<Props>()
```

これは、Vue コンポーネントが単独でコンパイルされるためで、コンパイラーはソースコードの型を分析するために import されたファイルをクロールすることがありません。この制限は将来のリリースで削除される可能性があります。

### props のデフォルト値 <sup class="vt-badge experimental" />

type-based declaration を使用すると、props のデフォルト値を宣言することができません。これは、現在実験的な機能である [Reactivity Transform](/guide/extras/reactivity-transform.html) で解決することができます:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

// defineProps() のリアクティブな分割代入
// デフォルト値は、同等の実行時オプションにコンパイルされる
const { foo, bar = 100 } = defineProps<Props>()
</script>
```

こちらの振る舞いを利用するには [明示的なオプトイン](/guide/extras/reactivity-transform.html#explicit-opt-in) が必要です。

### `<script setup>` を使用しない場合

`<script setup>` を使用しない場合、 `defineComponent()` を使用して、props の型推論をする必要があります。`setup()` に渡された変数 props の型は、`props` オプションから推論されます。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type: string
  }
})
```

## コンポーネントの emit の型付け

`<script setup>` では、`emit` 関数も runtime declaration もしくは type declaration (型宣言) のいずれかを使って型付けすることができます:

```vue
<script setup lang="ts">
// runtime
const emit = defineEmits(['change', 'update'])

// type-based
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

type declaration の場合、引数は、[Call Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures) を持つ型リテラルでなければなりません。この型リテラルは、返される `emit` 関数の型として使用されます。見れば分かるとおり、型ベースの宣言をすることで emit されるイベントの型をより細かく制御することができます。

`<script setup>` を使用しない場合は、`defineComponent()` は setup コンテキスト内で `emit` 関数のイベント名を推論できます:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- 型チェック / 自動補完
  }
})
```

## `ref()` の型付け

ref は初期値から型推論されます:

```ts
import { ref } from 'vue'

// 推論された型: Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

時に、ref に対して複雑な型を指定する必要があります。そのような場合には `Ref` 型を使います:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

もしくは、`ref()` を呼ぶ時に型引数を渡すことで、推論された型を上書きできます:

```ts
// 型: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

もし、型引数を指定して初期値を省略した場合には、型は `undefined` を含む union 型になります:

```ts
// 推論された型: Ref<number | undefined>
const n = ref<number>()
```

## `reactive()` の型付け

`reactive()` も引数から暗黙に型を推論します:

```ts
import { reactive } from 'vue'

// 推論された型: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

`reactive` のプロパティを明示的に型付けするには、インターフェースが使えます:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
`reactive()` の型引数を使用することは推奨されません、なぜなら reactive の戻り値の型は、ネストされた ref をアンラップする処理を含む為、型引数によって与えられる型と異なるからです。
:::

## `computed()` の型付け

`computed()` は、getter の戻り値に基づいて型が推論されます:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// 推論された型: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

型引数を渡すことで、明示的に型付けすることもできます:

```ts
const double = computed<number>(() => {
  // number を返さない場合は型エラーになる
})
```

## イベントハンドラーの型付け

ネイティブ DOM イベントを扱う場合、イベントハンドラーに渡す引数を正しく型付けしておくと便利な場合があります。次の例を見てみましょう:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` は、暗黙の `any` 型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

type annotation (型注釈) が無い場合、`event` 引数は暗黙の `any` 型になります。`tsconfig.json` で `"strict": true` や `"noImplicitAny": true` にしている場合、これは型エラーになります。そのため、明示的にイベントハンドラーの引数を型付けすることが推奨されます。加えて、`event` のプロパティを明示的に型アサーションする必要があるかもしれません:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Provide / Inject の型付け

provide (提供) と inject (注入) は通常、別々のコンポーネントで実行されます。注入された値を適切に型付けするために、Vue は `InjectionKey` インターフェースを提供します。これは、`Symbol` を継承したジェネリック型で、provider (値を提供する側) と consumer (値を利用する側) の間で注入された値の型を同期させるために使用できます:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // string 型以外の値を渡すとエラーになる

const foo = inject(key) // type of foo: string | undefined
```

複数のコンポーネントで import できるように、injection key は別のファイルに格納することが推奨されます。

injection key に文字列を使用した場合、注入された値の型は `unknown` になり、型引数で明示的に型付けする必要があります。

```ts
const foo = inject<string>('foo') // type: string | undefined
```

注入された値が `undefined` になりうることに注意してください、なぜなら実行時に provider (値を提供する側) がその値を提供する保証は無いからです。

デフォルト値を提供することで、`undefined` 型を取り除くことができます:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

また、その値が必ず提供されることがわかっているのであれば、値を強制的に型アサーションすることもできます:

```ts
const foo = inject('foo') as string
```

## テンプレート参照の型付け

テンプレート参照は、明示的な型引数と初期値 `null` を指定して作成されます:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

厳密な型安全性のために、`el.value` にアクセスする際には、オプショナルチェーンもしくは type guards (型ガード) をする必要があります。なぜなら、コンポーネントがマウントされるまでは ref の初期値は `null` であり、参照されていた要素が `v-if` によってアンマウントされた場合にも `null` にセットされる可能性があるからです。

## コンポーネントのテンプレート参照の型付け

時に、子コンポーネントのパブリックメソッドを呼ぶために、子コンポーネントのテンプレート参照に型づけする必要があるかもしれません。例えば、モーダルを開くメソッドを持つ `MyModal` という子コンポーネントがあるとします:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

`MyModal` のインスタンスの型を得るために、まず `typeof` によって型を取得し、次に TypeScript の組み込みユーティリティーの `InstanceType` を使って型を抽出する必要があります:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

この方法を Vue SFC ではなく、TypeScript ファイルで使いたい場合は、 Volar の [Takeover Mode](./overview.md#volar-takeover-mode) を有効にする必要があることに注意してください。
