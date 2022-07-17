# プラグイン

## はじめに

プラグインは通常、 Vue にアプリケーションレベルの機能を追加する自己完結的なコードです。プラグインをインストールする方法は次の通りです:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 省略可能なオプション */
})
```

プラグインの定義は `install()` メソッドを公開するオブジェクトか、あるいは単にインストール関数として動作する関数です。インストール関数は[アプリケーションインスタンス](/api/application.html)と、`app.use()` に渡された追加のオプション（もしあれば）を受け取ります:

```js
const myPlugin = {
  install(app, options) {
    // アプリの設定をする
  }
}
```

厳密に定義されたプラグインの適用範囲はありませんが、プラグインが役立つ一般的なシナリオは以下の通りです:

1. [`app.component()`](/api/application.html#app-component) や [`app.directive()`](/api/application.html#app-directive) を使って、1 つもしくは複数のグローバルなコンポーネントやカスタムディレクティブを登録する。

2. [`app.provide()`](/api/application.html#app-provide) を呼び出して、アプリケーション全体でリソースを[注入できる](/guide/components/provide-inject.html)ようにする。

3. [`app.config.globalProperties`](/api/application.html#app-config-globalproperties) にグローバルなインスタンスプロパティやメソッドを追加する。

4. 上記のいくつかの組み合わせを実行する必要があるライブラリー（例: [vue-router](https://github.com/vuejs/vue-router-next)）。

## プラグインの書き方

独自の Vue.js プラグインの作り方をもっとよく理解するために、`i18n`（[Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization) の略）文字列を表示するプラグインの非常に単純化したバージョンを作成します。

まずはプラグインオブジェクトの設定から始めましょう。以下のように別のファイルに作ってエクスポートするのがおすすめです。ロジックを封じ込めて分離させるためです。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // プラグインのコードが入る
  }
}
```

キーを変換する関数をアプリケーション全体で利用できるようにしたいので、`app.config.globalProperties` を使って公開します。この関数はドットで区切られた `key` 文字列を受け取ります。これを使用して、ユーザーが提供したオプション内にある翻訳後の文字列をルックアップします。

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

このプラグインは、ユーザーがプラグインを使用する際、翻訳済みのキーが入っているオブジェクトをオプションによって渡すことを想定しているので、次のように使う必要があります:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

この `$translate` 関数は `greetings.hello` のような文字列を受け取り、ユーザーが提供した設定を探索し、翻訳された値（この場合は `Bonjour!`）を返します:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

参照: [グローバルなプロパティの拡張](/guide/typescript/options-api.html#グローバルなプロパティの拡張) <sup class="vt-badge ts" />

:::tip
グローバルプロパティはほとんど使わないようにしてください。様々なプラグインから注入された多くのグローバルプロパティがアプリケーション全体で使われていると、すぐに混乱してしまいます。
:::

### プラグインを使った Provide / Inject

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
