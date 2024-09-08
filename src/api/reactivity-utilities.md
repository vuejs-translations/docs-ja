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

値 / ref / getter を ref に正規化するために使用できます（3.3+）。

ソースとなるリアクティブオブジェクトのプロパティの ref を作成するためにも使用できます。作成された ref はそのソースのプロパティと同期されます。ソースのプロパティを変更すると ref も更新され、その逆も同様です。

- **型**

  ```ts
  // 正規化のシグネチャー（3.3+）
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // オブジェクトプロパティのシグネチャー
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **例**

  正規化のシグネチャー（3.3+）:

  ```js
  // 既存の ref をそのまま返します
  toRef(existingRef)

  // .value のアクセス時に getter を呼び出す、読み取り専用の ref を作成します
  toRef(() => props.foo)

  // ref(1) に相当する、関数でない値から
  // 通常の ref を生成します
  toRef(1)
  ```

  オブジェクトプロパティのシグネチャー:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 元のプロパティと同期する双方向の ref
  const fooRef = toRef(state, 'foo')

  // ref を変更すると参照元も更新されます
  fooRef.value++
  console.log(state.foo) // 2

  // 参照元を変更すると ref も更新されます
  state.foo++
  console.log(fooRef.value) // 3
  ```

  以下とは異なるので注意してください:

  ```js
  const fooRef = ref(state.foo)
  ```

  `ref()` が単なる数字の値を受け取っているため、上記の ref は `state.foo` と同期して**いません**。

  `toRef()` は props の ref をコンポーザブル関数へ渡したいときに便利です:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // `props.foo` を ref に変換して
  // コンポーザブルに渡す
  useSomeFeature(toRef(props, 'foo'))

  // getter 構文 - 3.3+ で推奨
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  コンポーネント props に `toRefs` を使用する場合、props の変更に関するいつも通りの制限が適用されます。ref に新しい値を代入しようとするのは、props を直接変更しようとすることと同等であり、許可されていません。そのようなシナリオでは `get` と `set` を持つ [`computed`](./reactivity-core#computed) を使うことを検討するとよいでしょう。詳しくは、[コンポーネントで `v-model` を使う](/guide/components/v-model)ためのガイドを参照してください。

  オブジェクトプロパティのシグネチャーを使用する場合、`toRef()` はソースプロパティが現在存在しない場合でも、利用可能な ref を返します。これにより [`toRefs`](#torefs) では取得できない、省略可能なプロパティを扱えるようになります。

## toValue() {#tovalue}

値 / ref / getter を値に正規化します。これは [unref()](#unref) に似ていますが、getter も正規化する点が異なります。引数が getter の場合、その getter が呼び出され、その戻り値が返されます。

これは、[コンポーザブル](/guide/reusability/composables.html)で、値、ref、getter のいずれかになりうる引数を正規化するために使用できます。

- 3.3 以上でのみサポートされています。

- **型**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **例**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  コンポーザブルの引数の正規化:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // id の変化に対応する
    })
  }

  // このコンポーザブルは、以下のいずれかをサポートします:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

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

オブジェクトが [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive), [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) によって作られたプロキシかどうかをチェックします。

- **型**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

オブジェクトが [`reactive()`](./reactivity-core#reactive) または [`shallowReactive()`](./reactivity-advanced#shallowreactive) によって作られたプロキシかどうかをチェックします。

- **型**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

渡された値が読み取り専用オブジェクトであるかどうかをチェックします。読み取り専用オブジェクトのプロパティは変更可能ですが、渡されたオブジェクトを経由して直接代入することはできません。

[`readonly()`](./reactivity-core#readonly) と [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) で作成したプロキシは、`set` 関数なしの [`computed()`](./reactivity-core#computed) ref と同様に読み取り専用と見なされます。

- **型**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
