# 非同期コンポーネント

## 基本的な使い方

大規模なアプリケーションでは、アプリを小さなチャンクに分割し、必要なときにのみサーバーからコンポーネントを読み込む必要があるかもしれません。これを実現するために、Vue には [`defineAsyncComponent`](/api/general.html#defineasynccomponent) 関数があります:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...サーバーからコンポーネントを読み込む
    resolve(/* 読み込まれたコンポーネント */)
  })
})
// ... `AsyncComp` を普通のコンポーネントと同じように使用する
```

このように、`defineAsyncComponent` は Promise を返すローダー関数を受け取ります。Promise の `resolve` コールバックは、コンポーネントの定義をサーバーから取得したときに呼ばれます。読み込みが失敗したことを示すために、`reject(reason)` を呼ぶこともできます。 

[ES モジュールの動的インポート](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) も Promise を返すため、ほとんどの場合には `defineAsyncComponent` と合わせて使用します。Vite や webpack などのバンドラーもこの構文をサポートしているため、の Vue SFC をインポートするためにも使用できます。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

結果的に得られる `AsyncComp` は、実際にページ上にレンダリングされるときにローダー関数を呼ぶだけのラッパーコンポーネントです。さらに、内側のコンポーネントに任意の props を渡せるため、非同期ラッパーを使用すると、コンポーネントをシームレスに置換するとともに、遅延読み込みも実現できます。

<div class="options-api">

[コンポーネントをローカルに登録する](/guide/components/registration.html#local-registration)ときには、`defineAsyncComponent` も利用できます:

```js
import { defineAsyncComponent } from 'vue'

export default {
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
}
```

</div>

## ローディングとエラーの状態

非同期の操作は必然的にローディングとエラーの状態に関係してきます。そのため、`defineAsyncComponent()` ではこれらの状態のハンドリングを高度なオプションによりサポートしています。

```js
const AsyncComp = defineAsyncComponent({
  // ローダー関数
  loader: () => import('./Foo.vue'),

  // 非同期コンポーネントの読み込み中に使用するコンポーネント
  loadingComponent: LoadingComponent,
  // ローディングコンポーネント表示前の遅延。デフォルト: 200ms。
  delay: 200,

  // 読み込みに失敗した場合に使用するコンポーネント
  errorComponent: ErrorComponent,
  // エラーコンポーネントは timeout が与えられて
  // その時間を超えた場合に表示される。デフォルト: Infinity。  
  timeout: 3000
})
```
ローディングコンポーネントが与えられた場合、内側のコンポーネントが読み込まれている間に表示されます。ローディングコンポーネントが表示されるまでに、デフォルトで 200ms の遅延があります。このようになっているのは、高速なネットワークではローディング状態が短く、置き換えが速すぎて、ちらつきのように見えてしまう恐れがあるためです。

エラーコンポーネントが与えられた場合、ローダー関数から返された Promise が reject されたときに表示されます。リクエストが長すぎる場合にエラーコンポーネントを表示するために、timeout を指定することもできます。

## Suspense とともに使用する

非同期コンポーネントは、ビルトインコンポーネント `<Suspense>` とともに使用することもできます。`<Suspense>` と非同期コンポーネント間のインタラクションについては、[`<Suspense>` のページ](/guide/built-ins/suspense.html) にドキュメントがあります。
