# サーバーサイドレンダリング API {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **例**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR コンテキスト {#ssr-context}

  省略可能なコンテキストオブジェクトを渡すと、レンダリング中に追加データを記録するために使用できます。例えば、[テレポートのコンテンツにアクセスする](/guide/scaling-up/ssr#teleports)には:

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  このページにある他のほとんどの SSR API も、省略可能なコンテキストオブジェクトを受け付けます。[useSSRContext](#usessrcontext) ヘルパーを使うことで、コンポーネントコード内でコンテキストオブジェクトにアクセスできます。

- **参照** [ガイド - サーバーサイドレンダリング](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

入力を [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) としてレンダリングします。

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **例**

  ```js
  // Node.js http handler の内部
  renderToNodeStream(app).pipe(res)
  ```

  :::tip 注意
  このメソッドは、Node.js 環境から切り離されている `vue/server-renderer` の ESM ビルドではサポートされていません。代わりに [`pipeToNodeWritable`](#pipetonodewritable) を使用してください。
  :::

## pipeToNodeWritable() {#pipetonodewritable}

既存の [Node.js Writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) インスタンスにパイプしてレンダリングします。

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **例**

  ```js
  // Node.js http handler の内部
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

入力を [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) としてレンダリングします。

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **例**

  ```js
  // ReadableStream がサポートされている環境の内部
  return new Response(renderToWebStream(app))
  ```

  :::tip 注意
  グローバルスコープで `ReadableStream` コンストラクターを公開しない環境では、代わりに [`pipeToWebWritable()`](#pipetowebwritable) を使用する必要があります。
  :::

## pipeToWebWritable() {#pipetowebwritable}

既存の [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) インスタンスにパイプしてレンダリングします。

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **例**

  これは通常、[`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) と組み合わせて使用されます:

  ```js
  // TransformStream は、CloudFlare のワーカーなどの環境で利用できます。
  // Node.js では、'stream/web' から明示的にインポートする必要があります
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

シンプルで読みやすいインターフェイスを使用して、ストリーミングモードで入力をレンダリングします。

- **`vue/server-renderer` からエクスポート**

- **型**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **例**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // 完了
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // エラーが発生
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

`renderToString()` やその他のサーバー レンダリング API に渡されるコンテキストオブジェクトを取得するために使用するランタイム API。

- **型**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **例**

  取得したコンテキストを使用して、最終的な HTML をレンダリングするために必要な情報（ヘッドメタデータなど）を添付できます。

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // SSR の時だけ呼び出すようにする
  // https://ja.vitejs.dev/guide/ssr.html#条件付きロジック
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...コンテキストにプロパティを付加する
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

[ハイドレーション・ミスマッチ](/guide/scaling-up/ssr#hydration-mismatch) の警告を抑制するために使用できる特別な属性です。

- **例**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  この値で特定のタイプのミスマッチを許可することができます。指定できる値は以下の通りです:

  - `text`
  - `children`（直下の子要素に対してのみミスマッチを許可します）
  - `class`
  - `style`
  - `attribute`

  値を指定しない場合、すべてのタイプのミスマッチが許可されます。
