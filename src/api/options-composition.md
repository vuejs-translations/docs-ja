# オプション: 合成 {#options-composition}

## provide {#provide}

子孫のコンポーネントによって注入できる値を提供します。

- **型**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **詳細:**

  `provide` と [`inject`](#inject) を一緒に使うと、同じ親チェーンにある限り、コンポーネント階層の深さに関係なく、祖先コンポーネントがそのすべての子孫の依存関係インジェクターとして機能できるようになります。

  `provide` オプションは、オブジェクトか、オブジェクトを返す関数のどちらかでなければなりません。このオブジェクトには、その子孫への注入に利用できるプロパティが含まれています。このオブジェクトではシンボルをキーとして使用できます。

- **例**

  基本的な使い方:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  関数を使用してコンポーネントごとの状態を提供する:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  上記の例では、提供された `msg` はリアクティブではないことに注意してください。詳しくは[リアクティビティーと共に利用する](/guide/components/provide-inject#working-with-reactivity)を参照してください。

- **参照:** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

祖先プロバイダーを探し、現在のコンポーネントに注入するプロパティを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **詳細**

  `inject` オプションは次のいずれかです:

  - 文字列の配列、または
  - キーがローカルバインディング名で、値が次のいずれかであるオブジェクト:
    - 利用可能なインジェクションで検索するキー（文字列またはシンボル）、または
    - 次のようなオブジェクト:
      - `from` プロパティは、利用可能なインジェクションを検索するためのキー（文字列またはシンボル）になっている。さらに
      - `default` プロパティは、フォールバック値として使用されます。コンポーネントプロパティのデフォルト値と同様に、複数のコンポーネントインスタンス間での値の共有を避けるために、オブジェクトタイプにもファクトリ関数が必要です。

  一致するプロパティもデフォルト値も提供されなかった場合、注入されたプロパティは `undefined` となります。

  注入されたバインディングは反応的で**ない**ことに注意してください。これは意図的なものです。ただし、注入された値がリアクティブなオブジェクトである場合、そのオブジェクトのプロパティはリアクティブなままです。詳しくは[リアクティビティーと共に利用する](/guide/components/provide-inject#working-with-reactivity)を参照してください。

- **例**

  基本的な使い方:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  注入された値をプロパティのデフォルトとして使用する:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  注入された値をデータとして使用する:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  インジェクションはデフォルト値を使って省略可能にできます:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  異なる名前のプロパティから注入する必要がある場合は、`from` を使用して、注入元のプロパティを示します:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  プロパティのデフォルトと同様に、プリミティブでない値にはファクトリー関数を使用する必要があります:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **参照:** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

現在のコンポーネントに混合されるオプションオブジェクトの配列。

- **型**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **詳細:**

  `mixins` オプションは、ミックスインオブジェクトの配列を受け取ります。これらのミックスインオブジェクトには、通常のインスタンスオブジェクトのようなインスタンスオプションを含めることができ、特定のオプションマージロジックを使用して、最終的なオプションに対してマージされます。例えば、ミックスインに `created` フックが含まれていて、コンポーネント自体もフックを持っている場合、両方の関数が呼ばれることになります。

  ミックスインフックは提供された順に呼び出され、コンポーネント自身のフックの前に呼び出されます。

  :::warning もう推奨されていません
  Vue 2 では、ミックスインはコンポーネントロジックの再利用可能なチャンクを作成するための主要なメカニズムでした。ミックスインは Vue 3 でも引き続きサポートされていますが、コンポーネント間でのコード再利用には、[Composition API を使用したコンポーザブル関数](/guide/reusability/composables)が好ましいアプローチとなっています。
  :::

- **例:**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

拡張元となる「基底クラス」コンポーネント。

- **型:**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **詳細:**

  コンポーネントのオプションを継承し、あるコンポーネントが別のコンポーネントを拡張できるようにします。

  実装の観点からは、 `extends` は `mixins` とほとんど同じです。`extends` で指定されたコンポーネントは、最初のミックスインであるかのように扱われます。

  しかし、`extends` と `mixins` は異なる意図を表しています。`mixins` オプションは主に機能のチャンクを構成するために使用されるのに対し、`extends` は主に継承に関係しています。

  `mixins` と同様に、すべてのオプション（`setup()` は除く）は、関連するマージ戦略を使用してマージされます。

- **例:**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Composition API には推奨されません
  `extends` は Options API 用に設計されており、`setup()` フックのマージは扱えません。

  Composition API では、ロジックの再利用のためのメンタルモデルとして、「継承」よりも「合成」が推奨されています。あるコンポーネントのロジックを別のコンポーネントで再利用する必要がある場合、関連するロジックを[コンポーザブル](/guide/reusability/composables#composables)に抽出することを検討してください。

  それでも Composition API を使ってコンポーネントを「拡張」するつもりなら、ベースコンポーネントの `setup()` を拡張コンポーネントの `setup()` で呼び出せます:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // ローカルのバインディング
      }
    }
  }
  ```
  :::
