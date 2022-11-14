# Composition API: <br>依存関係の注入 {#composition-api-dependency-injection}

## provide() {#provide}

子孫コンポーネントから注入可能な値を提供する。

- **型**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **詳細**

  `provide()` はキー（文字列またはシンボル）と注入される値の 2 つの引数を取ります。

  TypeScript を使用する場合、キーは `InjectionKey` としてキャストされたシンボルにできます。これは `Symbol` を継承した Vue のユーティリティー型で、 `provide()` と `inject()` の間で値の型を同期するために使用されます。

  ライフサイクルフック登録 API と同様に、`provide()` はコンポーネントの `setup()` フェーズで同期的に呼び出される必要があります。

- **例**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // 静的な値を提供
  provide('foo', 'bar')

  // リアクティブな値を提供
  const count = ref(0)
  provide('count', count)

  // シンボルのキーを使って提供
  provide(fooSymbol, count)
  </script>
  ```

- **参照**:
  - [ガイド - Provide / Inject](/guide/components/provide-inject.html)
  - [ガイド - Provide / Inject の型付け](/guide/typescript/composition-api.html#typing-provide-inject)

## inject() {#inject}

祖先のコンポーネントや（`app.provide()` 経由で）アプリケーションから提供された値を注入します。

- **型**

  ```ts
  // デフォルト値なし
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // デフォルト値あり
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // ファクトリーを使用
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **詳細**

  最初の引数は、注入キーです。Vue は、キーに一致する提供された値を見つけるために親チェーンを探索します。親チェーンにある複数のコンポーネントが同じキーを提供する場合、注入するコンポーネントに最も近いものが、より上位のコンポーネントを「シャドウ」します。キーに一致する値が見つからなかった場合、`inject()` はデフォルト値が提供されていない限り `undefined` を返します。

  第 2 引数は省略可能で、一致する値が見つからなかった場合に使用されるデフォルト値です。また、作成に手間がかかる値を返すために、ファクトリー関数を指定できます。デフォルト値が関数の場合、ファクトリーの代わりに関数を値として使用することを示すために、3 番目の引数として `false` を渡す必要があります。

  ライフサイクルフック登録 API と同様に、`inject()` はコンポーネントの `setup()` フェーズで同期的に呼び出される必要があります。

  TypeScript を使用する場合、キーは `InjectionKey` 型にできます。これは `Symbol` を継承した Vue のユーティリティー型で、 `provide()` と `inject()` の間で値の型を同期するために使用されます。

- **例**

  前の `provide()` の例で示したように、親コンポーネントが値を提供したと仮定します:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { fooSymbol } from './injectionSymbols'

  // デフォルトの静的な値を注入
  const foo = inject('foo')

  // リアクティブな値を注入
  const count = inject('count')

  // シンボルのキーを使って注入
  const foo2 = inject(fooSymbol)

  // デフォルト値ありで注入
  const bar = inject('foo', 'default value')

  // デフォルト値のファクトリーを使って注入
  const baz = inject('foo', () => new Map())

  // 第 3 引数を渡して、関数のデフォルト値を使って注入
  const fn = inject('function', () => {}, false)
  </script>
  ```

- **参照**:
  - [ガイド - Provide / Inject](/guide/components/provide-inject.html)
  - [ガイド - Provide / Inject の型付け](/guide/typescript/composition-api.html#typing-provide-inject)
