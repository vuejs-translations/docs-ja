# オプション: 状態 {#options-state}

## data {#data}

コンポーネントインスタンスの最初のリアクティブステートを返す関数。

- **型**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **詳細**

  この関数はプレーンな JavaScript オブジェクトを返すことが期待されており、そのオブジェクトは Vue によってリアクティブにされます。インスタンスが生成された後、リアクティブなデータオブジェクトは `this.$data` としてアクセスできます。コンポーネントインスタンスは、データオブジェクトにあるすべてのプロパティをプロキシするので、`this.a` は `this.$data.a` と同じ意味になります。

  トップレベルのデータプロパティはすべて、返されるデータオブジェクトに含まれていなければなりません。`this.$data` に新しいプロパティを追加可能ですが、**お勧めしません**。もし、あるプロパティの値がまだ利用できない場合は、 `undefined` や `null` などの空の値をプレースホルダとして含めることで、Vue にそのプロパティが存在することを認識させる必要があります。

  Vue の内部プロパティや API メソッドと競合する可能性があるため、`_` や `$` で始まるプロパティは、コンポーネントインスタンス上で**プロキシされません**。これらのプロパティには、`this.$data._property` としてアクセスしなければなりません。

  ブラウザー API オブジェクトやプロトタイププロパティのように、独自のステートフルな振る舞いをするオブジェクトを返すことは**推奨されません**。返されるオブジェクトは、コンポーネントの状態を表すだけのプレーンなオブジェクトであることが理想的です。

- **例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  `data` プロパティでアロー関数を使用する場合、`this` はコンポーネントのインスタンスにはなりませんが、関数の第一引数としてインスタンスにアクセスできることに注意してください:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **参照** [リアクティビティーの探求](/guide/extras/reactivity-in-depth)

## props {#props}

コンポーネント props を宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  Vue では、コンポーネント props はすべて明示的に宣言する必要があります。コンポーネント props は、2 つの形式で宣言できます:

  - 文字列の配列を使用したシンプルな形式
  - キーが props 名、値が props の型（コンストラクタ関数）または詳細オプションになっているオブジェクトを使用した完全な形式

  オブジェクトベースの構文では、各 props はさらに以下のオプションを定義できます:

  - **`type`**: 以下のネイティブコンストラクターのいずれかを指定します: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, 任意のカスタムコンストラクタ関数、またはそれらの配列。開発モードでは、Vue は props の値が宣言された型と一致するかどうかをチェックし、一致しない場合は警告を投げます。詳しくは [props のバリデーション](/guide/components/props#prop-validation) を参照してください。

    また、`Boolean` 型の props は、開発とプロダクションの両方で、値のキャスト動作に影響を与えることに注意してください。詳しくは[真偽値の型変換](/guide/components/props#boolean-casting)を参照してください。

  - **`default`**: その props が親から渡されなかったり、値が `undefined` の場合のデフォルト値を指定します。オブジェクトや配列のデフォルト値は、ファクトリー関数を用いて返さなければなりません。ファクトリー関数は引数として加工前の props オブジェクトも受け取ります。

  - **`required`**: その props が必須かどうかを定義します。プロダクション以外の環境では、この値が truthy になっていて props が渡されない場合、コンソールの警告が投げられます。

  - **`validator`**: props の値を唯一の引数として受け取るカスタムバリデータ関数。開発モードでは、この関数が falsy な値を返した場合（すなわちバリデーションが失敗した場合）、コンソールの警告が投げられます。

- **例**

  シンプルな宣言:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  バリデーションつきオブジェクト宣言:

  ```js
  export default {
    props: {
      // 型チェック
      height: Number,
      // 型チェックとその他のバリデーション
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **参照**
  - [ガイド - props](/guide/components/props)
  - [ガイド - コンポーネント props の型付け](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

コンポーネントインスタンスに公開される算出プロパティを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **詳細**

  このオプションは、キーが算出プロパティの名前、値が計算ゲッター、または `get` と `set` メソッドを持つオブジェクト（書き込み可能な算出プロパティの場合）であるオブジェクトを受け付けます。

  すべてのゲッターとセッターの `this` コンテキストは、コンポーネントのインスタンスにバインドされます。

  算出プロパティでアロー関数を使用する場合、`this` はコンポーネントのインスタンスを指しませんが、関数の第一引数としてインスタンスにアクセスできることに注意してください:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // 読み取り専用
      aDouble() {
        return this.a * 2
      },
      // 書き込み可能
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **参照**
  - [ガイド - 算出プロパティ](/guide/essentials/computed)
  - [ガイド - 算出プロパティの型付け](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

コンポーネントインスタンスに混ぜ合わせるメソッドを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **詳細**

  宣言されたメソッドは、コンポーネントインスタンスで直接アクセスしたり、テンプレート内の式で使用できます。すべてのメソッドの `this` コンテキストは、（外から渡されたとしても）コンポーネントのインスタンスにバインドされます。

  アロー関数は `this` を介してコンポーネントのインスタンスにアクセスできないため、メソッドを宣言する際に使用することは避けてください。

- **例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **参照** [イベントハンドリング](/guide/essentials/event-handling)

## watch {#watch}

データ変更時に呼び出されるウォッチコールバックを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > 読みやすくするため、型は単純化されています。

- **詳細**

  `watch` オプションは、キーが監視対象のリアクティブコンポーネントのインスタンスのプロパティ（たとえば `data` や `computed` で宣言されたプロパティ）で、値が対応するコールバックであるオブジェクトを受け付けます。コールバックは、監視対象のソースの新しい値と古い値を受け取ります。

  ルートレベルのプロパティに加えて、キーはシンプルなドット区切りのパス、例えば `a.b.c` も使用できます。この使い方は、複雑な式をサポートして**いない**ことに注意してください - ドット区切りのパスのみがサポートされています。もし、複雑なデータソースを監視する必要がある場合は、代わりに命令型の [`$watch()`](/api/component-instance#watch) API を使ってください。

  値は、（`methods` で宣言した）メソッド名の文字列や、追加のオプションを含むオブジェクトにもできます。オブジェクト構文を使用する場合、コールバックは `handler` フィールドの下で宣言する必要があります。追加のオプションは以下のとおりです:

  - **`immediate`**: ウォッチャーが作成されるとすぐにコールバックをトリガーします。最初の呼び出しでは、古い値は `undefined` になります。
  - **`deep`**: ソースがオブジェクトまたは配列の場合、深い探索を強制し、深部の変更の際にコールバックが発生するようにします。[ディープ・ウォッチャー](/guide/essentials/watchers#deep-watchers)を参照してください。
  - **`flush`**: コールバックの実行タイミングを調整します。[コールバックが実行されるタイミング](/guide/essentials/watchers#callback-flush-timing)と [`watchEffect()`](/api/reactivity-core#watcheffect) を参照してください。
  - **`onTrack / onTrigger`**: ウォッチャーの依存関係をデバッグします。[ウォッチャーのデバッグ](/guide/extras/reactivity-in-depth#watcher-debugging)を参照してください。

  アロー関数は `this` を介してコンポーネントのインスタンスにアクセスできないため、ウォッチコールバックを宣言する際に使用することは避けてください。

- **例**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // トップレベルのプロパティを監視
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // 文字列のメソッド名
      b: 'someMethod',
      // ネストの深さに関係なく、監視対象オブジェクトのプロパティが変更されるたびにコールバックが呼び出されます
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // 単一のネストされたプロパティを監視する:
      'c.d': function (val, oldVal) {
        // 何かする
      },
      // コールバックは、監視開始直後に呼び出されます
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // コールバックの配列を渡すことができ、それらは一つずつ呼び出されます
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **参照** [ウォッチャー](/guide/essentials/watchers)

## emits {#emits}

コンポーネントによって発行されるカスタムイベントを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **詳細**

  発行されるイベントは、次の 2 つの形式で宣言できます:

  - 文字列の配列を使用したシンプルな形式
  - 各プロパティのキーがイベントの名前で、値が `null` またはバリデータ関数のいずれかであるオブジェクトを使用した完全な形式。

  バリデーション関数は、コンポーネントの `$emit` 呼び出しに渡された追加の引数を受け取ります。 たとえば、`this.$emit('foo', 1)` が呼び出された場合、対応する `foo` のバリデータは引数 `1` を受け取ります。バリデータ関数は、イベントの引数が妥当かどうかを示す真偽値を返す必要があります。

  `emits` オプションは、どのイベントリスナーが（ネイティブ DOM イベントリスナーではなく）コンポーネントイベントリスナーと見なされるかに影響することに注意してください。宣言されたイベントのリスナーは、コンポーネントの `$attrs` オブジェクトから削除されるため、コンポーネントのルート要素には渡されません。 詳細については、[フォールスルー属性](/guide/components/attrs) を参照してください。

- **例**

  配列の構文:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  オブジェクトの構文:

  ```js
  export default {
    emits: {
      // バリデーションなし
      click: null,

      // バリデーションあり
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

* **参照**
  - [ガイド - フォールスルー属性](/guide/components/attrs)
  - [ガイド - コンポーネントの emits の型付け](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

コンポーネントインスタンスがテンプレート参照を介して親からアクセスされるときに公開されるパブリックプロパティを宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **詳細**

  デフォルトでは、コンポーネントインスタンスは `$parent` や `$root` 、テンプレート参照を介してアクセスしたときに、すべてのインスタンスプロパティを親に公開します。コンポーネントには、密結合を避けるために非公開にしておくべき内部状態またはメソッドが含まれている可能性が高いため、これは望ましくない場合があります。

  `expose` オプションは、プロパティ名の文字列のリストを想定しています。`expose` を使用すると、明示的にリストアップされたプロパティのみが、コンポーネントのパブリックインスタンスで公開されます。

  `expose` は、ユーザー定義のプロパティにのみ作用し、組み込みのコンポーネントインスタンスプロパティは除外しません。

- **例**

  ```js
  export default {
    // パブリックインスタンスでは `publicMethod` だけが利用可能
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
