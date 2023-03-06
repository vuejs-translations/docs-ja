# プラグイン {#plugins}

## はじめに {#introduction}

プラグインは通常、 Vue にアプリケーションレベルの機能を追加する自己完結的なコードです。プラグインをインストールする方法は次の通りです:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 省略可能なオプション */
})
```

プラグインの定義は `install()` メソッドを公開するオブジェクトか、あるいは単にインストール関数として動作する関数です。インストール関数は[アプリケーションインスタンス](/api/application)と、`app.use()` に渡された追加のオプション（もしあれば）を受け取ります:

```js
const myPlugin = {
  install(app, options) {
    // アプリの設定をする
  }
}
```

厳密に定義されたプラグインの適用範囲はありませんが、プラグインが役立つ一般的なシナリオは以下の通りです:

1. [`app.component()`](/api/application#app-component) や [`app.directive()`](/api/application.html#app-directive) を使って、1 つもしくは複数のグローバルなコンポーネントやカスタムディレクティブを登録する。

2. [`app.provide()`](/api/application#app-provide) を呼び出して、アプリケーション全体でリソースを[注入できる](/guide/components/provide-inject)ようにする。

3. [`app.config.globalProperties`](/api/application#app-config-globalproperties) にグローバルなインスタンスプロパティやメソッドを追加する。

4. 上記のいくつかの組み合わせを実行する必要があるライブラリー（例: [vue-router](https://github.com/vuejs/vue-router-next)）。

## プラグインの書き方 {#writing-a-plugin}

独自の Vue.js プラグインの作り方をもっとよく理解するために、`i18n`（[Internationalization](https://ja.wikipedia.org/wiki/%E5%9B%BD%E9%9A%9B%E5%8C%96%E3%81%A8%E5%9C%B0%E5%9F%9F%E5%8C%96) の略）文字列を表示するプラグインの非常に単純化したバージョンを作成します。

まずはプラグインオブジェクトの設定から始めましょう。以下のように別のファイルに作ってエクスポートするのがおすすめです。ロジックを封じ込めて分離させるためです。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // プラグインのコードが入る
  }
}
```

翻訳関数を作りたいと思います。この関数はドット区切りの `key` 文字列を受け取り、それを使ってユーザーが提供するオプションの中から翻訳された文字列を検索します。これはテンプレートでの使用を想定しています:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

この関数はすべてのテンプレートでグローバルに利用できる必要があるので、プラグインの `app.config.globalProperties` にアタッチして、それを実現します:

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // グローバルに利用可能な $translate() メソッドを注入
    app.config.globalProperties.$translate = (key) => {
      // `key` をパスとして使用して
      // `options` 内のネストしたプロパティを取得
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

この `$translate` 関数は `greetings.hello` のような文字列を受け取り、ユーザーが提供した設定を調べて、翻訳された値を返します。

翻訳されたキーを含むオブジェクトは、インストール時に `app.use()` の追加パラメーターとしてプラグインに渡す必要があります:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

これで、最初の式 `$translate('greetings.hello')` は、実行時に `Bonjour!` に置き換えられます。

参照: [グローバルなプロパティの拡張](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
グローバルプロパティはほとんど使わないようにしてください。様々なプラグインから注入された多くのグローバルプロパティがアプリケーション全体で使われていると、すぐに混乱してしまいます。
:::

### プラグインを使った Provide / Inject {#provide-inject-with-plugins}

プラグインは `inject` を使用して、ユーザーに関数や属性を提供することもできます。例えば、翻訳オブジェクトを使用できるようにするため、アプリケーションが `options` 引数へアクセスできるようにします。

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  }
}
```

これでプラグインユーザーは `i18n` キーを使ってコンポーネント内にプラグインのオプションを注入できるようになりました:

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
