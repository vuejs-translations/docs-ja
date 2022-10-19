# Composition API: ライフサイクルフック

:::info 使用上の注意
このページに記載されているすべての API は、コンポーネントの `setup()` フェーズで同期的に呼び出される必要があります。詳細については、[ガイド - ライフサイクルフック](/guide/essentials/lifecycle.html)を参照してください。
:::

## onMounted()

コンポーネントがマウントされた後に呼び出されるコールバックを登録します。

- **型**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **詳細**

  コンポーネントがマウントされたとみなされるのは次の場合です:

  - すべての同期的な子コンポーネントがマウントされた時（非同期コンポーネントや `<Suspense>` ツリー内のコンポーネントは含まれません）。

  - そのコンポーネント自身の DOM ツリーが作成され、親コンテナーに挿入された時。アプリケーションのルートコンテナが document 内にある場合のみ、そのコンポーネントの DOM ツリーも document 内にあることを保証することに注意してください。

  このフックは、通常、コンポーネントのレンダリングされた DOM にアクセスする必要がある副作用を実行する場合や、[サーバーレンダリングされるアプリケーション](/guide/scaling-up/ssr.html)において DOM 関連のコードをクライアントに限定する場合に使用されます。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

- **例**

  テンプレート参照による要素へのアクセス:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated()

コンポーネントがリアクティブな状態変更によって DOM ツリーを更新した後に呼び出されるコールバックを登録します。

- **型**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **詳細**

  親コンポーネントの更新フックは、子コンポーネントの更新フックの後に呼び出されます。

  このフックは、様々な状態変更によるコンポーネントの DOM 更新の後に呼び出されます。もし、特定の状態変更の後に更新された DOM へアクセスする必要がある場合は、代わりに [nextTick()](/api/general.html#nexttick) を使用してください。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

  :::warning
  更新フックでコンポーネントの状態を変更しないでください - 無限更新ループになる可能性があります！
  :::

- **例**

  更新された DOM へのアクセス:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // テキストの内容は、現在の `count.value` と同じでしょう
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted()

コンポーネントがアンマウントされた後に呼び出されるコールバックを登録します。

- **型**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **詳細**

  コンポーネントがアンマウントされたとみなされるのは次の場合です:

  - 子コンポーネントがすべてアンマウントされた時。

  - 関連するすべてのリアクティブエフェクト（レンダーエフェクトと `setup()` で作成された computed とウォッチャー）が停止された時。

  タイマー、DOM イベントリスナー、サーバー接続など、手動で作成した副作用をクリーンアップするためにこのフックを使用します。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

- **例**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount()

コンポーネントがマウントされる直前に呼び出されるフックを登録します。

- **型**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **詳細**

  このフックが呼ばれたとき、コンポーネントはリアクティブな状態のセットアップを終えていますが、DOM ノードはまだ作成されていません。コンポーネントが初めて DOM レンダー効果を実行しようとしているところです。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

## onBeforeUpdate()

コンポーネントがリアクティブな状態変更により DOM ツリーを更新しようとする直前に呼び出されるフックを登録します。

- **型**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **詳細**

  このフックは、Vue が DOM を更新する前に DOM の状態にアクセスするために使用できます。このフックの内部でコンポーネントの状態を変更することも安全です。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

## onBeforeUnmount()

コンポーネントインスタンスがアンマウントされる直前に呼び出されるフックを登録します。

- **型**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **詳細**

  このフックが呼ばれたとき、コンポーネントインスタンスはまだ完全に機能しています。

  **このフックはサーバーサイドレンダリング時には呼び出されません。**

## onErrorCaptured()

子孫コンポーネントから伝搬するエラーをキャプチャーしたときに呼び出されるフックを登録します。

- **型**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **詳細**

  エラーは以下のソースからキャプチャーすることがあります:

  - コンポーネントのレンダリング
  - イベントハンドラー
  - ライフサイクルフック
  - `setup()` 関数
  - ウォッチャー
  - カスタムディレクティブフック
  - トランジションフック

  このフックは、エラー、エラーを引き起こしたコンポーネントのインスタンス、およびエラーソースタイプを指定する情報文字列の 3 つの引数を受け取ります。

  エラー状態をユーザーに表示するため、`errorCaptured()` でコンポーネントの状態を変更できます。しかし、エラー状態はエラーの原因となった元のコンテンツをレンダリングしないことが重要です。さもなければ、コンポーネントは無限レンダリングループに放り込まれるでしょう。

  このフックは `false` を返すことで、エラーがそれ以上伝搬しないようにできます。エラーの伝播の詳細については、以下を参照してください。

  **エラー伝搬のルール**

  - アプリケーションレベルの [`app.config.errorHandler`](/api/application.html#app-config-errorhandler) が定義されていれば、デフォルトでそちらにもすべてのエラーが送られるので、これらのエラーを 1 箇所でアナリティクスサービスに報告できます。

  - コンポーネントの継承チェーンや親チェーンに複数の `errorCaptured` フックが存在する場合、同じエラーに対して、下から上への順番ですべてのフックが呼び出されます。これはネイティブ DOM イベントのバブリングの仕組みに似ています。

  - もし `errorCaptured` フック自体がエラーをスローした場合、そのエラーと元のキャプチャーされたエラーの両方が `app.config.errorHandler` に送られます。

  - `errrorCaptured` フックで `false` を返すと、エラーがそれ以上伝搬しないようにできます。これは要するに「このエラーは処理済みなので無視してください」ということです。このエラーに対して、追加の `errorCaptured` フックや `app.config.errorHandler` が呼び出されるのを防ぎます。

## onRenderTracked() <sup class="vt-badge dev-only" />

コンポーネントのレンダーエフェクトによってリアクティブな依存関係が追跡されたときに呼び出されるデバッグフックを登録します。

**このフックは開発モード専用です。また、サーバーサイドレンダリング時には呼び出されません。**

- **型**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **参照:** [リアクティビティーの探求](/guide/extras/reactivity-in-depth.html)

## onRenderTriggered() <sup class="vt-badge dev-only" />

リアクティブな依存関係がコンポーネントのレンダーエフェクトの再実行をトリガーしたときに呼び出されるデバッグフックを登録します。

**このフックは開発モード専用です。また、サーバーサイドレンダリング時には呼び出されません。**

- **型**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **参照:** [リアクティビティーの探求](/guide/extras/reactivity-in-depth.html)

## onActivated()

コンポーネントインスタンスが [`<KeepAlive>`](/api/built-in-components.html#keepalive) によってキャッシュされたツリーの一部として DOM に挿入された後に呼び出されるコールバックを登録します。

**このフックはサーバーサイドレンダリング時には呼び出されません。**

- **型**

  ```ts
  function onActivated(callback: () => void): void
  ```

- **参照:** [ガイド - キャッシュされたインスタンスのライフサイクル](/guide/built-ins/keep-alive.html#キャッシュされたインスタンスのライフサイクル)

## onDeactivated()

コンポーネントインスタンスが [`<KeepAlive>`](/api/built-in-components.html#keepalive) によってキャッシュされたツリーの一部として DOM から削除された後に呼び出されるコールバックを登録します。

**このフックはサーバーサイドレンダリング時には呼び出されません。**

- **型**

  ```ts
  function onDeactivated(callback: () => void): void
  ```

- **参照:** [ガイド - キャッシュされたインスタンスのライフサイクル](/guide/built-ins/keep-alive.html#キャッシュされたインスタンスのライフサイクル)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" />

コンポーネントインスタンスがサーバーでレンダリングされる前に解決される非同期関数を登録します。

- **型**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **詳細**

  コールバックが Promise を返す場合、サーバーレンダラーはコンポーネントをレンダリングする前に Promise が解決されるまで待機します。

  このフックはサーバーサイドレンダリング時にのみ呼び出され、サーバーのみのデータ取得をするために使用できます。

- **例**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // コンポーネントは初期リクエストの一部としてレンダリングされます
    // クライアントよりも高速なので、サーバーでデータをプリフェッチします
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // マウント時に data が null の場合、コンポーネントは
      // クライアントで動的にレンダリングされることを意味します。
      // 代わりにクライアントサイドフェッチを実行します。
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **参照:** [サーバーサイドレンダリング](/guide/scaling-up/ssr.html)
