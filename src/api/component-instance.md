# コンポーネントインスタンス {#component-instance}

:::info
このページでは、コンポーネントのパブリックインスタンス、すなわち `this` で公開される組み込みのプロパティとメソッドについて説明します。

このページに記載されているすべてのプロパティは読み取り専用です（`$data` にネストされたプロパティを除く）。
:::

## $data {#data}

コンポーネントによってリアクティブにされた [`data`](./options-state.html#data) オプションから返されるオブジェクトです。コンポーネントインスタンスは、その data オブジェクトのプロパティへのアクセスをプロキシします。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

コンポーネントの現在の解決された props を表すオブジェクト。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **詳細**

  [`props`](./options-state.html#props) オプションで宣言された props のみが含まれます。コンポーネントインスタンスは、その props オブジェクトのプロパティへのアクセスをプロキシします。

## $el {#el}

コンポーネントインスタンスが管理しているルート DOM ノード。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **詳細**

  コンポーネントが[マウント](./options-lifecycle#mounted)されるまで、`$el` は `undefined` となります。

  - 単一のルート要素を持つコンポーネントの場合、`$el` はその要素を指します。
  - テキストをルートとするコンポーネントの場合、`$el` はテキストノードを指します。
  - 複数のルートノードを持つコンポーネントの場合、`$el` は Vue が DOM 内のコンポーネントの位置を追跡するために使用するプレースホルダ DOM ノード（テキストノード、または SSR ハイドレーションモードではコメントノード）になります。

  :::tip
  一貫性を保つため、要素への直接アクセスは `$el` に頼らず、[テンプレート参照](/guide/essentials/template-refs.html)を使用することが推奨されます。
  :::

## $options {#options}

現在のコンポーネントインスタンスをインスタンス化するために使用された解決済みのコンポーネントオプション。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **詳細**

  `$options` オブジェクトは、現在のコンポーネントの解決されたオプションを公開し、以下の可能なソースのマージ結果です:

  - グローバルミックスイン
  - コンポーネントの `extends` のベース
  - コンポーネントのミックスイン

  通常、カスタムコンポーネントオプションをサポートするために使用されます:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **参照:** [`app.config.optionMergeStrategies`](/api/application.html#app-config-optionmergestrategies)

## $parent {#parent}

現在のインスタンスの親インスタンス（親がある場合）。ルートインスタンス自身の場合は `null` になります。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

現在のコンポーネントツリーのルートコンポーネントインスタンス。現在のインスタンスに親がない場合、この値はそれ自身になります。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

親コンポーネントから渡された[スロット](/guide/components/slots.html)を表すオブジェクト。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **詳細**

  通常、[Render 関数](/guide/extras/render-function.html) を手動で作成するときに使用しますが、スロットが存在するかどうかを検出するためにも使用できます。

  各スロットは、そのスロットの名前に対応するキーの下にある vnode の配列を返す関数として `this.$slots` で公開されます。デフォルトのスロットは `this.$slots.default` として公開されます。

  スロットが[スコープ付きスロット](/guide/components/slots.html#scoped-slots)の場合、スロット関数に渡された引数はそのスロットの props として利用可能です。

- **参照:** [Render 関数 - スロットのレンダリング](/guide/extras/render-function.html#rendering-slots)

## $refs {#refs}

[テンプレート参照](/guide/essentials/template-refs.html)を通じて登録された、DOM 要素およびコンポーネントインスタンスのオブジェクト。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **参照:**

  - [テンプレート参照](/guide/essentials/template-refs.html)
  - [特別な属性 - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

コンポーネントのフォールスルー属性が入ったオブジェクト。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **詳細**

  [フォールスルー属性](/guide/components/attrs.html)は、親コンポーネントから渡される属性やイベントハンドラーで、prop や子コンポーネントから発行されたイベントとして宣言されていないものです。

  デフォルトでは、ルート要素が 1 つしかない場合は `$attrs` に含まれるすべての要素がコンポーネントのルート要素に自動的に継承されます。コンポーネントに複数のルートノードがある場合、この動作は無効になります。また、[`inheritAttrs`](./options-misc.html#inheritattrs) オプションを使って明示的に無効化できます。

- **参照:**

  - [フォールスルー属性](/guide/components/attrs.html)

## $watch() {#watch}

ウォッチャーを作成するための命令的 API。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **詳細**

  最初の引数は監視対象です。コンポーネントのプロパティ名の文字列、単純なドット区切りのパス文字列、または getter 関数を指定できます。

  第 2 引数はコールバック関数です。コールバックは監視対象の新しい値と古い値を受け取ります。

  - **`immediate`**: ウォッチャー作成時、すぐにコールバックをトリガーします。最初の呼び出しでは、古い値は `undefined` になります。
  - **`deep`**: ソースがオブジェクトの場合、深い探索を強制し、深部の変更の際にコールバックが発生するようにします。[ディープ・ウォッチャー](/guide/essentials/watchers.html#deep-watchers)を参照してください。
  - **`flush`**: コールバックの実行タイミングを調整します。[コールバックが実行されるタイミング](/guide/essentials/watchers.html#callback-flush-timing)と [`watchEffect()`](/api/reactivity-core.html#watcheffect) を参照してください。
  - **`onTrack / onTrigger`**: ウォッチャーの依存関係をデバッグします。[ウォッチャーのデバッグ](/guide/extras/reactivity-in-depth.html#watcher-debugging)を参照してください。

- **例**

  プロパティ名を監視:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  ドット区切りのパスを監視:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  より複雑な表現にはゲッターを使用:

  ```js
  this.$watch(
    // `this.a + this.b` という式が異なる結果をもたらすたびに
    // ハンドラーが呼び出されます。
    // 算出プロパティそのものを定義することなく、算出プロパティを
    // 監視しているようなものです。
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  ウォッチャーの停止:

  ```js
  const unwatch = this.$watch('a', cb)

  // その後...
  unwatch()
  ```

- **参照:**
  - [オプション - `watch`](/api/options-state.html#watch)
  - [ガイド - ウォッチャー](/guide/essentials/watchers.html)

## $emit() {#emit}

現在のインスタンスでカスタムイベントをトリガーします。追加の引数は、リスナーのコールバック関数に渡されます。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **例**

  ```js
  export default {
    created() {
      // イベントのみ
      this.$emit('foo')
      // 追加の引数あり
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **参照:**

  - [コンポーネント - イベント](/guide/components/events.html)
  - [`emits` オプション](./options-state.html#emits)

## $forceUpdate() {#forceupdate}

コンポーネントのインスタンスを強制的に再レンダリングします。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **詳細**

  Vue の完全に自動化されたリアクティビティーシステムを考えると、これが必要になることはほとんどありません。唯一必要なケースは、高度なリアクティビティー API を使ってリアクティブでないコンポーネントの状態を明示的に作成した場合です。

## $nextTick() {#nexttick}

グローバルな [`nextTick()`](./general.html#nexttick) の、インスタンスにバインドされたバージョン。

- **型**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **詳細**

  グローバルバージョンの `nextTick()` との唯一の違いは、`this.$nextTick()` に渡されるコールバックの `this` コンテキストが現在のコンポーネントインスタンスにバインドされるということです。

- **参照:** [`nextTick()`](./general.html#nexttick)
