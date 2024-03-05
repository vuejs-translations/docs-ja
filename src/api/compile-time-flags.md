---
outline: deep
---

# コンパイル時フラグ {#compile-time-flags}

:::tip
コンパイル時フラグは Vue の `esm-bundler` ビルド（すなわち `vue/dist/vue.esm-bundler.js`）を使用する場合にのみ適用されます。
:::

ビルドステップで Vue を使用する場合、特定の機能を有効 / 無効にするために、いくつかのコンパイル時フラグを設定することができます。コンパイル時フラグを使用する利点は、この方法で無効にした機能を、ツリーシェイキングによって最終的なバンドルから削除できることです。

これらのフラグが明示的に設定されていなくても、Vue は動作します。しかし、関連する機能を可能な限り適切に削除できるように、常にこれらのフラグを設定することをお勧めします。

ビルドツールに応じた設定方法については、[設定ガイド](#configuration-guides)を参照してください。

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **デフォルト:** `true`

  Options API サポートを有効 / 無効にします。無効にするとバンドルが小さくなりますが、サードパーティーのライブラリーが Options API に依存している場合、互換性に影響する可能性があります。

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **デフォルト:** `false`

  本番ビルドにおける devtools サポートを有効 / 無効にします。バンドルに含まれるコードが増えるので、デバッグ目的でのみ有効にすることをお勧めします。

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` <sup class="vt-badge" data-text="3.4+" /> {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **デフォルト:** `false`

  本番ビルドにおけるハイドレーションの不一致についての詳細な警告を有効 / 無効にします。バンドルに含まれるコードが増えるので、デバッグ目的でのみ有効にすることをお勧めします。

## 設定ガイド {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` はこれらのフラグのデフォルト値を自動的に提供します。デフォルト値を変更するには、Vite の [`define` 設定オプション](https://vitejs.dev/config/shared-options.html#define)を使用してください:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // 本番ビルドにおけるハイドレーションの不一致についての詳細を有効にする
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` はこれらのフラグのデフォルト値を自動的に提供します。値を設定 / 変更するには:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

フラグは webpack の [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) を使って定義します:

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

フラグは [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) を使って定義します:

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```