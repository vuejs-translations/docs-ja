# アプリケーション API {#application-api}

## createApp() {#createapp}

アプリケーションインスタンスを作成します。

- **型**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **詳細**

  第 1 引数はルートコンポーネントです。第 2 引数（省略可能）は、ルートコンポーネントに渡される props です。

- **例**

  インラインルートコンポーネントを用いる場合:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ルートコンポーネントオプション */
  })
  ```

  インポートしたコンポーネントを用いる場合:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **参照** [ガイド - Vue アプリケーションの作成](/guide/essentials/application)

## createSSRApp() {#createssrapp}

[SSR hydration（ハイドレーション）](/guide/scaling-up/ssr#client-hydration)モードでアプリケーションインスタンスを作成します。使用法は `createApp()` と全く同じです。

## app.mount() {#app-mount}

コンテナ要素にアプリケーションインスタンスをマウントします。

- **型**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **詳細**

  引数は、実際の DOM 要素または CSS セレクターのいずれかにすることができます（最初にマッチした要素を使用します）。ルートコンポーネントのインスタンスを返します。

  コンポーネントにテンプレートがあるか、レンダー関数を定義している場合、コンテナ内の既存の DOM ノードを置換します。それ以外の場合は、実行時コンパイラーが使用可能であれば、コンテナの `innerHTML` がテンプレートとして使用されます。

  SSR ハイドレーションモードでは、コンテナ内の既存の DOM ノードをハイドレートします。[ミスマッチ](/guide/scaling-up/ssr#hydration-mismatch)があった場合、既存の DOM ノードは期待される結果に合うよう変化されます。

  アプリケーションのインスタンス毎に、`mount()` は一度だけ呼び出すことができます。

- **例**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  実際の DOM 要素にマウントすることもできます:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

マウントしたアプリケーションインスタンスをアンマウントし、アプリケーションのコンポーネントツリーにあるすべてのコンポーネントに対して、ライフサイクルフックの unmount を呼び出します。

- **型**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.onUnmount() <sup class="vt-badge" data-text="3.5+" /> {#app-onunmount}

アプリケーションがアンマウントされたときに呼び出されるコールバックを登録します。

- **型**

  ```ts
  interface App {
    onUnmount(callback: () => any): void
  }
  ```

## app.component() {#app-component}

名称文字列とコンポーネント定義を両方渡す場合、グローバルコンポーネントとして登録し、名称のみ渡す場合、登録済みのコンポーネントを取得します。

- **型**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // オプションオブジェクトを登録します。
  app.component('my-component', {
    /* ... */
  })

  // 登録されたコンポーネントを取得します。
  const MyComponent = app.component('my-component')
  ```

- **参照** [コンポーネントの登録](/guide/components/registration)

## app.directive() {#app-directive}

名称文字列およびディレクティブ定義を両方渡す場合、グローバルカスタムディレクティブを登録し、名称のみの場合は、登録済みのディレクティブを取得します。

- **型**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // 登録（オブジェクトディレクティブ）
  app.directive('my-directive', {
    /* カスタムディレクティブのフック */
  })

  // 登録（関数ディレクティブの省略記法）
  app.directive('my-directive', () => {
    /* ... */
  })

  // 登録済ディレクティブの取得
  const myDirective = app.directive('my-directive')
  ```

- **参照** [カスタムディレクティブ](/guide/reusability/custom-directives)

## app.use() {#app-use}

[プラグイン](/guide/reusability/plugins)をインストールします。

- **型**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **詳細**

  第 1 引数にはプラグイン、第 2 引数には任意でプラグインのオプションを期待します。

  プラグインは、`install()` メソッドがあるオブジェクト、または単に `install()` メソッドとして使用される関数のいずれかにできます。オプション（`app.use()` の第 2 引数）はプラグインの `install()` メソッドに渡されます。

  同じプラグインから `app.use()` が複数回呼び出される場合、プラグインは一度だけインストールされます。

- **例**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **参照** [プラグイン](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

グローバルミックスイン（スコープがアプリケーション）を適用します。グローバルミックスインは、インクルードされたオプションをアプリケーションの全コンポーネントインスタンスに適用します。

:::warning 非推奨
ミックインはエコシステムのライブラリーで幅広く使用されていることから、主に後方互換性のため、Vue 3 でサポートしています。ミックイン（特にグローバルミックスイン）はアプリケーションコードでは避けるべきです。

ロジックを再利用するには、代わりに[コンポーザブル](/guide/reusability/composables)を使用してください。
:::

- **型**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

アプリケーション内のすべての子孫コンポーネントに注入できる値を提供します。

- **型**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **詳細**

  第 1 引数にはインジェクションキー、第 2 引数には提供される値を期待します。アプリケーションインスタンス自身を返します。

- **例**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  アプリケーションのコンポーネント内部:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **参照**
  - [Provide / Inject](/guide/components/provide-inject)
  - [アプリケーションレベルの Provide](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext() {#app-runwithcontext}

- 3.3 以上でのみサポートされています

現在のアプリをインジェクションコンテキストとしてコールバックを実行します。

- **型**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **詳細**

  コールバック関数を受け取り、即座に実行します。コールバックの同期呼び出しの間、`inject()` 呼び出しは、現在アクティブなコンポーネントインスタンスがない場合でも、現在のアプリが提供する値からインジェクションを検索できます。また、コールバックの戻り値も返されます。

- **例**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

アプリケーションを作成した Vue のバージョンを提供します。Vue のバージョンの違いに応じた条件付きロジックが必要となる[プラグイン](/guide/reusability/plugins)内で有用となります。

- **型**

  ```ts
  interface App {
    version: string
  }
  ```

- **例**

  プラグイン内でバージョンチェックを行います:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
    }
  }
  ```

- **参照** [グローバル API - バージョン](/api/general#version)

## app.config {#app-config}

すべてのアプリケーションインスタンスは、アプリケーションの構成設定を含む `config` オブジェクトを公開しています。アプリケーションをマウントする前であれば、プロパティ（以下で記載）を修正することができます。

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

アプリケーション内から伝播する未捕捉のエラーに対して、グローバルハンドラーを割り当てます。

- **型**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` は Vue 特有のエラー情報です。
      // 例 エラーが throw されたのはどのライフサイクルフックか
      info: string
    ) => void
  }
  ```

- **詳細**

  エラーハンドラーは、エラー、エラーを起こしたコンポーネントインスタンス、エラーのソースの種類を指定した情報の文字列という 3 つの引数を受け取ります。

  以下のソースから、エラーを捕捉することができます:

  - コンポーネントレンダラ
  - イベントハンドラ
  - ライフサイクルフック
  - `setup()` 関数
  - ウォッチャ
  - カスタムディレクティブフック
  - トランジションフック

  :::tip
  プロダクションでは、第 3 引数（`info`）は完全な情報の文字列ではなく、短縮されたコードになります。コードと文字列のマッピングは[プロダクションエラーコードのリファレンス](/error-reference/#runtime-errors)にあります。
  :::

- **例**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // エラー処理（例 サービスに報告）
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Vue からの実行時警告に対して、カスタムハンドラーを割り当てます。

- **型**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **詳細**

  警告ハンドラーは、第 1 引数として警告メッセージ、第 2 引数としてソースコンポーネントのインスタンス、第 3 引数としてコンポーネントトレースの文字列を受け取ります。

  特定の警告をフィルタリングし、コンソールの詳細度を下げるために、使用することもできます。すべての Vue の警告は開発中に対応すべきで、多くの警告の中で特定の警告に集中するのはデバッグ期間のみ推奨されており、デバッグ完了時には解除すべきです。

  :::tip
  警告は開発環境でのみ動作しますので、この設定はプロダクションモードでは無視されます。
  :::

- **例**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` はコンポーネント階層のトレースです。
  }
  ```

## app.config.performance {#app-config-performance}

これを `true` に設定することで、ブラウザーの開発ツールの performance/timeline パネルで、コンポーネントの初期化、コンパイル、レンダリング、パッチについてのパフォーマンスのトレースが有効となります。 開発モードおよび [performance.mark](https://developer.mozilla.org/ja/docs/Web/API/Performance/mark) API をサポートするブラウザーでのみ動作します。

- **型:** `boolean`

- **参照** [ガイド - パフォーマンス](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

実行時コンパイラーのオプションを設定します。このオブジェクトに設定される値はブラウザー内のテンプレートコンパイラーに渡され、設定されたアプリケーションのコンポーネントすべてに影響を与えます。[`compilerOptions` オプション](/api/options-rendering#compileroptions)を使用することで、コンポーネント毎のオプションを上書きすることも可能となることに注意してください。

::: warning 重要
この設定オプションは、フルビルド（つまり、ブラウザー上でテンプレートをコンパイルできるスタンドアロンの `vue.js`）を使っているときだけ反映されます。ビルド設定で、実行時のみビルドを使用している場合は代わりに、ビルドツール設定により、`@vue/compiler-dom` にコンパイラオプションを渡さなければなりません。

- `vue-loader` の場合: [`compilerOptions` ローダーオプションによって渡す](https://vue-loader.vuejs.org/options.html#compileroptions)。[`vue-cli` での設定方法](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)も参照してください。

- `vite` の場合: [`@vitejs/plugin-vue` オプションによって渡す](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

ネイティブカスタム要素を認識するためのチェックメソッドを指定する。

- **型:** `(tag: string) => boolean`

- **詳細**

  タグをネイティブカスタム要素として扱う必要がある場合は、`true` を返します。マッチしたタグについては、Vue は Vue コンポーネントとして解決しようとする代わりに、ネイティブ要素としてレンダリングします。

  ネイティブ HTML および SVG は、この機能でマッチする必要はありません。Vue のパーサは自動的にこれらを認識します。

- **例**

  ```js
  // 'ion-'から始まるタグをすべて、カスタム要素として扱います。
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **参照** [Vue および web コンポーネント](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

テンプレートの空白を扱う振る舞いを調整します。

- **型:** `'condense' | 'preserve'`

- **デフォルト:** `'condense'`

- **詳細**

  Vue では、より効率的なコンパイル結果を出力するよう、テンプレートの空白文字の除去・圧縮を行います。デフォルトの戦略は "condense" であり、以下の振る舞いとなります:

  1. 要素内の先頭および末尾の空白文字を 1 つの空白に圧縮します。
  2. 改行を含む要素間の空白文字を除去します。
  3. テキストノード内の連続した空白文字を 1 つの空白に圧縮します。

  このオプションを `'preserve'` に設定することで、（2）および（3）を無効化します。

- **例**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

テンプレート内のテキスト補間に用いるデリミタを調整します。

- **型:** `[string, string]`

- **デフォルト:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **詳細**

  これは通常、マスタッシュ記法も使用するサーバーサイドのフレームワークとの衝突を回避するために使用します。

- **例**

  ```js
  // デリミタを、ES6 テンプレートの文字列スタイルに変更する。
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

テンプレートの HTML コメントの扱い方を調整します。

- **型:** `boolean`

- **デフォルト:** `false`

- **詳細**

  デフォルトでは、Vue はプロダクションでコメントを除去します。このオプションを `true` にすることで、プロダクションでもコメントを保持するよう Vue に強制することができます。開発ではコメントは常に保持されます。このオプションは通常、HTML コメントに依存するその他のライブラリーで Vue を使用する場合に使用します。

- **例**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

アプリケーション内部のコンポーネントインスタンスにアクセス可能なグローバルプロパティを登録するのに使用することができるオブジェクトです。

- **型**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **詳細**

  これは、Vue 3 でなくなった Vue 2 の `Vue.prototype` の代替です。グローバルなものについてはすべて、慎重に使用すべきです。

  グローバルプロパティがコンポーネント自身のプロパティと衝突する場合、コンポーネント自身のプロパティの方が優先度が高くなります。

- **使用法**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  これにより、アプリケーションのコンポーネントテンプレート内およびコンポーネントインスタンスの `this` でも、`msg` を使用できるようになります:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **参照** [ガイド - グローバルなプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

カスタムコンポーネントのオプションにおけるマージ戦略を定義するオブジェクトです。

- **型**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **詳細**

  プラグインやライブラリーには、（グローバルミックインを注入することにより）カスタムコンポーネントのオプションのサポートを追加しているものもあります。複数のソースから同じオプションを "マージ" する必要がある場合（たとえば、ミックスインやコンポーネントの継承）、これらのオプションには特別なマージロジックが必要となる場合があります。

  オプション名をキーとして使用し、`app.config.optionMergeStrategies` オブジェクトを割り当てることで、カスタムオプションにマージ戦略関数を登録することができます。

  マージ戦略関数は、第一引数と第二引数としてそれぞれ、親と子に定義されたオプションの値を受け取ります。

- **例**

  ```js
  const app = createApp({
    // 自身のオプション
    msg: 'Vue',
    // ミックスインからのオプション
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // this.$options に公開されているマージされたオプション
      console.log(this.$options.msg)
    }
  })

  // `msg` に関するカスタムマージ戦略を定義します
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // 'Hello Vue'をログに記録します
  ```

- **参照** [コンポーネントインスタンス - `$options`](/api/component-instance#options)

## app.config.idPrefix <sup class="vt-badge" data-text="3.5+" /> {#app-config-idprefix}

アプリケーション内で [useId()](/api/composition-api-helpers#useid) から生成されるすべての ID に対してプレフィックスを設定します。

- **型:** `string`
- **デフォルト:** `undefined`
- **例**

  ```js
  app.config.idPrefix = 'my-app'
  ```
  ```js
  // コンポーネント内:
  const id1 = useId() // 'my-app:0'
  const id2 = useId() // 'my-app:1'
  ```

## app.config.throwUnhandledErrorInProduction <sup class="vt-badge" data-text="3.5+" /> {#app-config-throwunhandlederrorinproduction}

プロダクションモードで未処理のエラーを強制的にスローします。

- **型:** `boolean`

- **デフォルト:** `false`

- **詳細**

  デフォルトでは、Vue アプリケーション内でスローされたが明示的に処理されていないエラーは、開発モードとプロダクションモードで異なる動作をします:

  - 開発中は、エラーがスローされ、アプリケーションがクラッシュする可能性があります。これは、エラーを目立たせることで、開発中に気づいて修正できるようにするためです。

  - プロダクションでは、エンドユーザーへの影響を最小限に抑えるため、エラーはコンソールにログ出力されるだけです。ただし、これによりプロダクションでのみ発生するエラーがエラー監視サービスで捕捉されない可能性があります。

  `app.config.throwUnhandledErrorInProduction` を `true` に設定することで、プロダクションモードでも未処理のエラーがスローされるようになります。
