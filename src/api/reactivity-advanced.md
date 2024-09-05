# リアクティビティー API: 上級編 {#reactivity-api-advanced}

## shallowRef() {#shallowref}

[`ref()`](./reactivity-core#ref) の shallow（浅い）バージョン。

- **型**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **詳細**

  `ref()` とは異なり、浅い ref の内部の値はそのまま格納・公開され、深いリアクティブにはなりません。`.value` へのアクセスだけがリアクティブです。

  `shallowRef()` は通常、大きなデータ構造のパフォーマンスの最適化や外部の状態管理システムとの統合に使用されます。

- **例**

  ```js
  const state = shallowRef({ count: 1 })

  // 変更をトリガーしない
  state.value.count = 2

  // 変更をトリガーする
  state.value = { count: 2 }
  ```

- **参照**
  - [ガイド - 大きなイミュータブルな構造のリアクティビティオーバーヘッドを減らす](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [ガイド - 外部の状態システムとの統合](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

[浅い ref](#shallowref) に依存するエフェクトを強制的にトリガーします。これは通常、浅い ref の内部値に対して深い変更を加えた後に使用されます。

- **型**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **例**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // 初回実行時に一度だけ "Hello, world" をログ出力する
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // 浅い ref なので、これはエフェクトが発動しない
  shallow.value.greet = 'Hello, universe'

  // "Hello, universe" がログ出力される
  triggerRef(shallow)
  ```

## customRef() {#customref}

依存関係の追跡と更新のトリガーを明示的に制御して、カスタマイズされた ref を作成します。

- **型**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **詳細**

  `customRef()` はファクトリー関数を想定しており、引数として `track` と `trigger` 関数を受け取り、`get` と `set` メソッドを持つオブジェクトを返す必要があります。

  一般的に、`track()` は `get()` の内部で、`trigger()` は `set()` の内部で呼び出されるべきものです。しかし、これらをいつ呼び出すか、あるいは全く呼び出さないかについては、あなたが完全にコントロールできます。

- **例**

  最新の set 呼び出しから一定のタイムアウト後にのみ値を更新する debounced ref を作成する:

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  コンポーネントでの使用:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Playground で試す](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

  :::warning 注意して使用してください
  customRef を使用する場合、特にゲッターを実行するたびに新しいオブジェクトのデータ型を生成する場合にはそのゲッターの戻り値に注意が必要です。これは、このような customRef が props として渡されている親コンポーネントと子コンポーネントの関係に影響します。

  親コンポーネントのレンダー関数は、別のリアクティブな状態の変化によってトリガーされる可能性があります。再レンダリング中に customRef の値は再評価され、子コンポーネントへの props として新しいオブジェクトデータ型を返します。この props は子コンポーネントで前回の値と比較され、異なるので、子コンポーネント内で customRef のリアクティブな依存関係がトリガーされます。一方で customRef のセッターが呼び出されず、その結果としてその依存関係がトリガーされなかったため、親コンポーネントのリアクティブな依存関係は実行されません。

  [Playground で見る](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN/PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/bW17nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWXgpu6ek1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEz9OLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5kXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

  :::

## shallowReactive() {#shallowreactive}

[`reactive()`](./reactivity-core#reactive) の shallow（浅い）バージョン。

- **型**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **詳細**

  `reactive()` とは異なり、深い変換は行われません。浅いリアクティブオブジェクトでは、ルートレベルのプロパティのみがリアクティブになります。プロパティ値はそのまま保存され、公開されます。これは、ref 値を持つプロパティが自動的にアンラップ**されない**ことも意味します。

  :::warning 注意して使用してください
  浅いデータ構造は、コンポーネントのルートレベルの状態にのみ使用してください。深いリアクティブオブジェクトの中にネストするのは避けましょう。一貫性のないリアクティビティーの振る舞いを持ったツリーが作成され、理解やデバッグが困難になります。
  :::

- **例**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // ステート自身のプロパティを変更するのはリアクティブ
  state.foo++

  // ...しかしネストされたオブジェクトは変換しない
  isReactive(state.nested) // false

  // リアクティブではない
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

[`readonly()`](./reactivity-core#readonly) の shallow（浅い）バージョン。

- **型**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **詳細**

  `readonly()` とは異なり、深い変換は行われません。ルートレベルのプロパティのみが読み取り専用になります。プロパティ値はそのまま保存され、公開されます。これは、ref 値を持つプロパティが自動的にアンラップ**されない**ことも意味します。

  :::warning 注意して使用してください
  浅いデータ構造は、コンポーネントのルートレベルの状態にのみ使用すべきです。深いリアクティブオブジェクトの中にネストするのは避けましょう。一貫性のないリアクティブな振る舞いをするツリーが作成され、理解やデバッグが困難になります。
  :::

- **例**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // ステート自身のプロパティを変更すると失敗する
  state.foo++

  // ...しかしネストされたオブジェクトでは動作する
  isReadonly(state.nested) // false

  // 動作する
  state.nested.bar++
  ```

## toRaw() {#toraw}

Vue で作成されたプロキシの、未加工の元のオブジェクトを返します。

- **型**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **詳細**

  `toRaw()` は [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive), [`shallowReadonly()`](#shallowreadonly) で生成したプロキシから元のオブジェクトを返せるようにします。

  これは、プロキシのアクセスやトラッキングのオーバーヘッドを発生させずに一時的に読み込んだり、変更をトリガーせずに書き込んだりするために使用できる緊急避難口です。元のオブジェクトへの永続的な参照を保持することは推奨**されません**。注意して使用してください。

- **例**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

プロキシに変換されないようにオブジェクトをマークします。オブジェクト自体を返します。

- **型**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **例**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // 他のリアクティブオブジェクトの中にネストされても動作します
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning 注意して使用してください
  `markRaw()` や `shallowReactive()` などの浅い API を使うと、デフォルトの深いリアクティブ/読み取り専用の変換を選択的にオプトアウトして、未加工の非プロキシオブジェクトを状態グラフに埋め込むことができるようになります。これらは様々な理由で利用できます:

  - 複雑なサードパーティのクラスインスタンスや Vue のコンポーネントオブジェクトのように、単純にリアクティブにすべきではない値もあります。

  - プロキシ変換をスキップすることで、イミュータブルなデータソースで大きなリストをレンダリングするときのパフォーマンスが向上する可能性があります。

  未加工のオプトアウトはルートレベルのみであるため、ネストされた、マークされていない未加工のオブジェクトをリアクティブオブジェクトにセットし、再度アクセスすると、プロキシされたバージョンが戻ってくるので、高度とみなされます。これは、**アイデンティティハザード**（オブジェクトの同一性に依存する操作を、同じオブジェクトの未加工バージョンとプロキシされたバージョンの両方を使用して操作すること）につながる可能性があります。

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // `foo` は未加工としてマークされるが foo.nested はそうでない
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  アイデンティティハザードが発生することは一般的に稀です。しかし、安全にアイデンティティハザードを回避しながらこれらの API を適切に利用するには、リアクティビティーの仕組みについてしっかりと理解することが必要です。

  :::

## effectScope() {#effectscope}

エフェクトスコープオブジェクトを作成し、その中に作成されたリアクティブエフェクト（すなわち、computed とウォッチャー）をキャプチャーして、これらのエフェクトを一緒に廃棄できるようにします。この API の詳細な使用例については、対応する [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) を参照してください。

- **型**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // スコープがアクティブでなければ undefined
    stop(): void
  }
  ```

- **例**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // スコープ内のすべてのエフェクトを破棄
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

現在アクティブな[エフェクトスコープ](#effectscope)がある場合、それを返します。

- **型**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

現在アクティブな[エフェクトスコープ](#effectscope)に破棄のコールバックを登録します。このコールバックは、関連するエフェクトスコープが停止されたときに呼び出されます。

各 Vue コンポーネントの `setup()` 関数はエフェクトスコープでも呼び出されるので、このメソッドは再利用可能なコンポジション関数において、コンポーネントに結合しない `onUnmounted` の代替として使用できます。

アクティブなエフェクトスコープがない状態でこの関数を呼び出すと、警告が表示されます。バージョン 3.5 以上では、第二引数に `true` を渡すことで、警告を抑制することができます。

- **型**

  ```ts
  function onScopeDispose(fn: () => void, failSilently?: boolean): void
  ```
