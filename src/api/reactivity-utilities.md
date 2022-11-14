# リアクティビティー API: ユーティリティー {#reactivity-api-utilities}

## isRef() {#isref}

値が ref オブジェクトかどうかをチェックします。

- **型**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  戻り値の型は[型述語](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)であることに注意してください。これは `isRef` が型ガードとして使用できることを意味します:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo の型が Ref<unknown> に絞り込まれる
    foo.value
  }
  ```

## unref() {#unref}

引数が ref であればその内部の値を返し、そうでなければ引数そのものを返します。これは `val = isRef(val) ? val.value : val` に対するシュガー関数です。

- **型**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **例**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped は number であることが保証されます
  }
  ```

## toRef() {#toref}

ソースとなるリアクティブオブジェクトのプロパティの ref を作成するために使用できます。作成された ref はそのソースのプロパティと同期されます。ソースのプロパティを変更すると ref も更新され、その逆も同様です。

- **型**

  ```ts
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **例**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const fooRef = toRef(state, 'foo')

  // ref を変更すると参照元も更新されます
  fooRef.value++
  console.log(state.foo) // 2

  // 参照元を変更すると ref も更新されます
  state.foo++
  console.log(fooRef.value) // 3
  ```

  以下とはことなるので注意してください:

  ```js
  const fooRef = ref(state.foo)
  ```

  `ref()` が単なる数字の値を受け取っているため、上記の ref は `state.foo` と同期して**いません**。

  `toRef()` は prop の ref をコンポーザブル関数へ渡したいときに便利です:

  ```vue
  <script setup>
  import { toRef } from 'vue'
  
  const props = defineProps(/* ... */)

  // `props.foo` を ref に変換して
  // コンポーザブルに渡す
  useSomeFeature(toRef(props, 'foo'))
  </script>
  ```

  コンポーネントの props に `toRefs` を使用する場合、props の変更に関するいつも通りの制限が適用されます。ref に新しい値を代入しようとするのは、props を直接変更しようとすることと同等であり、許可されていません。そのようなシナリオでは `get` と `set` を持つ [`computed`](./reactivity-core.html#computed) を使うことを検討するとよいでしょう。詳しくは、[コンポーネントで `v-model` を使う](/guide/components/events.html#usage-with-v-model)ためのガイドを参照してください。

  `toRef()` はソースプロパティが現在存在しない場合でも、利用可能な ref を返します。これにより [`toRefs`](#torefs) では取得できないオプショナルなプロパティを扱えるようになります。

## toRefs() {#torefs}

リアクティブオブジェクトをプレーンオブジェクトに変換します。変換後のオブジェクトの各プロパティは、元のオブジェクトの対応するプロパティを指す ref です。個々の ref は [`toRef()`](#toref) を用いて生成されます。

- **型**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **例**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  stateAsRefs の型: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // ref と参照元のプロパティは「リンク」している
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` はコンポーザブル関数からリアクティブなオブジェクトを返す場合に便利です。使用する側のコンポーネントはリアクティビティを失わずに、返されたオブジェクトを分割代入やスプレッドできます:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...ステートに関するロジック

    // 返すときに ref に変換する
    return toRefs(state)
  }

  // リアクティビティを失わずに分割代入できる
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` は呼び出した時のソースオブジェクトにある列挙可能なプロパティに対する ref だけを生成します。存在しないかも知れないプロパティに対する ref を作るには、代わりに [`toRef`](#toref) を使用してください。

## isProxy() {#isproxy}

オブジェクトが [`reactive()`](./reactivity-core.html#reactive), [`readonly()`](./reactivity-core.html#readonly), [`shallowReactive()`](./reactivity-advanced.html#shallowreactive), [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) によって作られたプロキシかどうかをチェックします。

- **型**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

オブジェクトが [`reactive()`](./reactivity-core.html#reactive) または [`shallowReactive()`](./reactivity-advanced.html#shallowreactive) によって作られたプロキシかどうかをチェックします。

- **型**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

渡された値が読み取り専用オブジェクトであるかどうかをチェックします。読み取り専用オブジェクトのプロパティは変更可能ですが、渡されたオブジェクトを経由して直接代入することはできません。

[`readonly()`](./reactivity-core.html#readonly) と [`shallowReadonly()`](./reactivity-advanced.html#shallowreadonly) で作成したプロキシは、`set` 関数なしの [`computed()`](./reactivity-core.html#computed) ref と同様に読み取り専用と見なされます。

- **型**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
