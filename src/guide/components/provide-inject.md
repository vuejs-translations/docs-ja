# Provide / Inject

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

## Prop のバケツリレー（Prop Drilling）

通常、親コンポーネントから子コンポーネントにデータを渡す必要がある場合、[props](/guide/components/props) を使用します。ですが、大きなコンポーネントツリーがあり、深くネストされたコンポーネントが遠い祖先のコンポーネントから何かしらを必要とするケースを想像してみてください。props だけだと、親コンポーネントのチェーン全体に同じ prop を渡さなければなりません:

![prop バケツリレーダイアグラム](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

`<Footer>` コンポーネントはこれらの props を全く気にしないかもしれませんが、`<DeepChild>` がそれらにアクセスできるように宣言して渡す必要があることに注意してください。さらに長い親チェーンがある場合、より多くのコンポーネントが影響を受けることになります。これは "props のバケツリレー（Prop Drilling）" と呼ばれていて、対処するのが楽しいことでないことは明らかです。

props のバケツリレーは `provide` と `inject` で解決できます。親コンポーネントは、そのすべての子孫コンポーネントに対して **依存関係を提供するプロバイダー (dependency provider)** として機能することができます。子孫ツリー内のどのコンポーネントも、その深さに関係なく、親チェーン内の上位コンポーネントが提供する依存関係を**注入 (inject)** することができます。

![Provide/inject スキーマ](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide

<div class="composition-api">

コンポーネントの子孫にデータを提供するには [`provide()`](/api/composition-api-dependency-injection.html#provide) 関数を使います:

```vue
<script setup>
import { provide } from 'vue'

provide(/* key */ 'message', /* value */ 'hello!')
</script>
```

`<script setup>` を使わない場合、`setup()` 内で `provide()` が同期的に呼び出されていることを確認してください:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* key */ 'message', /* value */ 'hello!')
  }
}
```

`provide()` 関数は 2 つの引数を受け付けます。第 1 引数は**インジェクションキー**と呼ばれ、文字列または `Symbol` となります。インジェクションキーは、子孫のコンポーネントが、インジェクション（注入）に必要な値を探すのに使われます。1 つのコンポーネントが異なる値を提供するために、異なるインジェクションキーで `provide()` を複数回呼び出すことができます。

第 2 引数は提供される値です。この値は refs のようなリアクティブな状態を含む、任意の型にすることができます:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

リアクティブな値を提供することで、提供された値を使用する子孫コンポーネントが、プロバイダーコンポーネントとのリアクティブな接続を確立することができます。

</div>

<div class="options-api">

コンポーネントの子孫にデータを提供するには、[`provide`](/api/options-composition.html#provide) オプションを使用します:

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

`provide` オブジェクトの各プロパティについて、キーは子コンポーネントが注入する正しい値を見つけるために使用され、最終的に値が注入されます。

インスタンスごとの状態、例えば `data()` を経由して宣言されたデータなどを提供する必要がある場合、 `provide` は関数の値を使用しなければなりません:

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // `this` にアクセスできるように関数構文を使用します
    return {
      message: this.message
    }
  }
}
```

しかし、これはインジェクションをリアクティブにするものでは**ない**ことに注意してください。[インジェクションをリアクティブにする](#working-with-reactivity)ことについては後ほど説明します。

</div>

## アプリケーションレベルの Provide

コンポーネント内だけでなく、アプリケーションレベルでデータを提供することも可能です:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* key */ 'message', /* value */ 'hello!')
```

アプリケーションレベルの Provide は、アプリケーションでレンダリングされるすべてのコンポーネントで利用可能です。これは特に[プラグイン](/guide/reusability/plugins.html)を書くときに便利です。プラグインは通常、コンポーネントを使って値を提供することができないからです。

## Inject

<div class="composition-api">

祖先コンポーネントが提供するデータを注入するには [`inject()`](/api/composition-api-dependency-injection.html#inject) 関数を使用します:

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

提供された値が ref である場合、そのまま注入され、自動的にアンラップされることは**ありません**。これにより、インジェクターコンポーネントはプロバイダーコンポーネントとのリアクティビティーの接続を保持することができます。

[リアクティビティーのある provide と inject の完全なサンプル](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgcHJvdmlkZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcblxuLy8gYnkgcHJvdmlkaW5nIGEgcmVmLCB0aGUgR3JhbmRDaGlsZFxuLy8gY2FuIHJlYWN0IHRvIGNoYW5nZXMgaGFwcGVuaW5nIGhlcmUuXG5jb25zdCBtZXNzYWdlID0gcmVmKCdoZWxsbycpXG5wcm92aWRlKCdtZXNzYWdlJywgbWVzc2FnZSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxpbnB1dCB2LW1vZGVsPVwibWVzc2FnZVwiPlxuICA8Q2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNoaWxkLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgR3JhbmRDaGlsZCBmcm9tICcuL0dyYW5kQ2hpbGQudnVlJ1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgaW5qZWN0IH0gZnJvbSAndnVlJ1xuXG5jb25zdCBtZXNzYWdlID0gaW5qZWN0KCdtZXNzYWdlJylcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxwPlxuICAgIE1lc3NhZ2UgdG8gZ3JhbmQgY2hpbGQ6IHt7IG1lc3NhZ2UgfX1cbiAgPC9wPlxuPC90ZW1wbGF0ZT4ifQ==)

繰り返しますが、もし `<script setup>` を使用しないのであれば、`inject()` は `setup()` の内部でのみ同期的に呼び出す必要があります:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

祖先コンポーネントが提供するデータを注入するには、[`inject`](/api/options-composition.html#inject) オプションを使用します:

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // 注入された値
  }
}
```

インジェクションはコンポーネント自身の状態よりも**先に**解決されるので、`data()` で注入されたプロパティにアクセスすることができます:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // 注入された値による初期 data
      fullMessage: this.message
    }
  }
}
```

[provide と inject の完全なサンプル](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7IENoaWxkIH0sXG4gIHByb3ZpZGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICdoZWxsbydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxDaGlsZCAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ2hpbGQudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBHcmFuZENoaWxkIGZyb20gJy4vR3JhbmRDaGlsZC52dWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEdyYW5kQ2hpbGRcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBpbmplY3Q6IFsnbWVzc2FnZSddXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBNZXNzYWdlIHRvIGdyYW5kIGNoaWxkOiB7eyBtZXNzYWdlIH19XG4gIDwvcD5cbjwvdGVtcGxhdGU+In0=)

### Injection エイリアス \*

配列構文で `inject` を使用した場合、注入されたプロパティは同じキーを使用してコンポーネントインスタンス上で公開されます。上の例では、プロパティは `"message"` というキーで提供され、`this.message` という名前で注入されます。ローカルのキーは、インジェクションキーと同じです。

もし、別のローカルキーを使ってプロパティを注入したい場合は、`inject` オプションにオブジェクト構文を使う必要があります:

```js
export default {
  inject: {
    /* ローカルキー */ localMessage: {
      from: /* インジェクションキー */ 'message'
    }
  }
}
```

ここでは、コンポーネントが `"message"` というキーで提供されるプロパティを見つけ、`this.localMessage` として公開します。

</div>

### インジェクションのデフォルト値

デフォルトでは、`inject` は注入されるキーが親チェーンのどこかで提供されることを想定しています。キーが提供されていない場合、実行時に警告が表示されます。

インジェクトされたプロパティをオプションのプロバイダーで動作させたい場合は、props と同様にデフォルト値を宣言する必要があります:

<div class="composition-api">

```js
// もし "message" にマッチするデータがなかった場合は、
// `value` は "default value" になります
const value = inject('message', 'default value')
```

場合によっては、関数を呼び出したり、新しいクラスをインスタンス化したりして、デフォルト値を作成する必要があるかもしれません。オプションの値が使用されないケースで不要な計算や副作用を避けるために、デフォルト値を作成するためのファクトリー関数を使用することができます:

```js
const value = inject('key', () => new ExpensiveClass())
```

</div>

<div class="options-api">

```js
export default {
  // インジェクションのデフォルト値を宣言する時は、
  // オブジェクト構文が必要です
  inject: {
    message: {
      from: 'message', // 同じキーで注入する場合、これは省略可能です
      default: 'default value'
    },
    user: {
      // 作成に手間がかかる非プリミティブな値や、
      // コンポーネントインスタンスごとに一意であるべき値には、ファクトリー関数を使用します
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## リアクティビティーと共に利用する

<div class="composition-api">

リアクティブな値を provide / inject する場合、**可能な限り、リアクティブな状態への変更を _provider_ の内部で維持することが推奨されます**。これは、提供されるステートとその可能な変更が同じコンポーネントに配置されることを保証し、将来のメンテナンスをより容易にしてくれます。

インジェクターコンポーネントからデータを更新する必要がある場合があります。そのような場合は、状態の変更を担当する関数を提供することをおすすめします:

```vue{7-9,13}
<!-- プロバイダーコンポーネント内部 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- インジェクターコンポーネント内部 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

最後に、`provide` を通して渡されたデータが注入されたコンポーネントによって変更されないようにしたい場合は、提供された値を [`readonly()`](/api/reactivity-core.html#readonly) でラップすることができます。

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

インジェクションをプロバイダーとリアクティブに連携させるためには、[computed()](/api/reactivity-core.html#computed) 関数を使って、computed プロパティを提供する必要があります:

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // 算出プロパティを明示的に提供する
      message: computed(() => this.message)
    }
  }
}
```

[リアクティブな provide と inject のフルガイド](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ2hpbGQgfSxcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogJ2hlbGxvJ1xuICAgIH1cbiAgfSxcbiAgcHJvdmlkZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZTogY29tcHV0ZWQoKCkgPT4gdGhpcy5tZXNzYWdlKVxuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGlucHV0IHYtbW9kZWw9XCJtZXNzYWdlXCI+XG4gIDxDaGlsZCAvPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ2hpbGQudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBHcmFuZENoaWxkIGZyb20gJy4vR3JhbmRDaGlsZC52dWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEdyYW5kQ2hpbGRcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPEdyYW5kQ2hpbGQgLz5cbjwvdGVtcGxhdGU+IiwiR3JhbmRDaGlsZC52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuICBpbmplY3Q6IFsnbWVzc2FnZSddXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5cbiAgICBNZXNzYWdlIHRvIGdyYW5kIGNoaWxkOiB7eyBtZXNzYWdlIH19XG4gIDwvcD5cbjwvdGVtcGxhdGU+In0=)

`computed()` 関数は、通常 Composition API のコンポーネントで使用されますが、Options API の特定のユースケースを補完するために使用することもできます。API 選択を Composition API に設定して[リアクティビティーの基礎](/guide/essentials/reactivity-fundamentals.html)と[算出プロパティ](/guide/essentials/computed.html)を読むと、より詳しい使い方を学ぶことができます。

:::warning 一時的な設定が必要
上記の使い方では、`app.config.unwrapInjectedRef = true` を設定して、インジェクションが自動的に算出 ref をアンラップするようにする必要があります。これは Vue 3.3 でデフォルトの動作になり、この設定は破損を避けるために一時的に導入されています。3.3 以降では不要になります。
:::

</div>

## シンボルキーと共に利用する

今までの例では、文字列のインジェクションキーを使っていました。もしあなたが多くの依存関係を提供するプロバイダーを持つ大規模なアプリケーションで作業していたり、他の開発者が使用する予定のコンポーネントを作成している場合は、衝突の危険性を避けるためにシンボルインジェクションキーを使用するのがベストです。

シンボルは専用のファイルに書き出しておくことをおすすめします:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// プロバイダーコンポーネント内
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* 提供するデータ */
})
```

```js
// インジェクターコンポーネント内
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

参照: [Provide / Inject の型付け](/guide/typescript/composition-api.html#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// プロバイダーコンポーネント内
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* 提供するデータ */
      }
    }
  }
}
```

```js
// インジェクターコンポーネント内
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
