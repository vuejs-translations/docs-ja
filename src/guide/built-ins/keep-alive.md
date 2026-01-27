<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` は、複数のコンポーネント間を動的に切り替えるときに、コンポーネントインスタンスを条件付きでキャッシュ可能にするビルトインコンポーネントです。

## 基本的な使い方 {#basic-usage}

「コンポーネントの基礎」の章で、特別な要素 `<component>` を使用する、[動的コンポーネント](/guide/essentials/component-basics#dynamic-components)のための構文を導入しました:

```vue-html
<component :is="activeComponent" />
```

デフォルトでは、アクティブなコンポーネントのインスタンスは、別のコンポーネントに切り替えられたときにアンマウントされます。これにより、保持している変更された状態は失われてしまいます。このコンポーネントを再度表示すると、初期状態のみを持つ新しいインスタンスが作成されます。

下の例では、ステートフルなコンポーネントが 2 つあります。A にはカウンターがあり、B には `v-model` 経由でメッセージが同期された input があります。いずれかの状態を更新してコンポーネントを切り替えたあと、もう一度元のコンポーネントに切り替えてみてください:

<SwitchComponent />

もう一度切り替えたとき、以前の状態がリセットされたことに気が付くと思います。

切り替え時に新しいコンポーネントインスタンスを作成するというのは、通常は役に立つ動作です。しかし、この場合には、2 つのコンポーネントインスタンスはアクティブでなくなった後にも状態を保持するのが望ましいです。この問題を解決するために、動的コンポーネントを `<KeepAlive>` というビルトインコンポーネントで包むことができます:

```vue-html
<!-- 非アクティブなコンポーネントはキャッシュされます！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

これで、コンポーネントを切り替えても状態が永続化されます。

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
[DOM 内テンプレート](/guide/essentials/component-basics#in-dom-template-parsing-caveats)内で使用する場合は `<keep-alive>` として参照する必要があります。
:::

## Include / Exclude {#include-exclude}

デフォルトでは、`<KeepAlive>` はコンポーネント内のどんなコンポーネントでもキャッシュします。この動作は `include` と `exclude` props を使用してカスタマイズできます。どちらの props にも、カンマ区切りの文字列、`RegExp`、あるいは、そのいずれかの型を含む配列を指定できます:

```vue-html
<!-- カンマ区切りの文字列 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正規表現（`v-bind` を使用）-->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 配列（`v-bind` を使用）-->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

一致するかどうかは、コンポーネントの [`name`](/api/options-misc#name) オプションに対してチェックされます。よって、`KeepAlive` により条件付きでキャッシュされるコンポーネントには、明示的に `name` オプションを宣言する必要があります。

:::tip
バージョン 3.2.34 以降、`<script setup>` を使った単一ファイルコンポーネントは、ファイル名から `name` オプションを自動的に推測し、手動で名前を宣言する必要がなくなりました。
:::

## キャッシュインスタンスの最大数 {#max-cached-instances}

`max` props を使うと、キャッシュできるコンポーネントインスタンスの最大数を制限することができます。`max` が指定された場合、`<KeepAlive>` は [LRU キャッシュ](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_(LRU)>) のように動作します。つまり、キャッシュインスタンスの数が指定された最大数を越えようとした時点で、最も過去にアクセスされたキャッシュインスタンスが破棄され、新しいキャッシュ用のスペースが作られます。

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## キャッシュされたインスタンスのライフサイクル {#lifecycle-of-cached-instance}

コンポーネントインスタンスが DOM から削除されても `<KeepAlive>` によってコンポーネントツリーのキャッシュの一部である場合、コンポーネントインスタンスはアンマウントされる代わりに**非アクティブ化**状態に移行します。コンポーネントインスタンスが DOM にキャッシュツリーの一部として挿入されると、**アクティブ化**されます。

<div class="composition-api">

kept-alive コンポーネントは、これら 2 つの状態に対して、[`onActivated()`](/api/composition-api-lifecycle#onactivated) と [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated) を使用してライフサイクルフックを登録できます:

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 最初のマウントと
  // キャッシュからの再挿入のたびに呼ばれる
})

onDeactivated(() => {
  // DOM から削除されてキャッシュに挿入されるときと
  // アンマウントされるときにも呼ばれる
})
</script>
```

</div>
<div class="options-api">

kept-alive コンポーネントは、これら 2 つの状態に対して、[`activated`](/api/options-lifecycle#activated) と [`deactivated`](/api/options-lifecycle#deactivated) のフックを使用してライフサイクルフックを登録できます:

```js
export default {
  activated() {
    // 最初のマウントと
    // キャッシュからの再挿入のたびに呼ばれる
  },
  deactivated() {
    // DOM から削除されてキャッシュに挿入されるときと
    // アンマウントされるときにも呼ばれる
  }
}
```

</div>

次のことに注意してください:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> はマウント時にも呼ばれ、 <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> はアンマウント時にも呼ばれる。

- 両方のフックは、`<KeepAlive>` でキャッシュされたルートコンポーネントだけではなく、キャッシュツリー内の子孫コンポーネントに対しても機能する。

---

**関連ページ**

- [`<KeepAlive>` API リファレンス](/api/built-in-components#keepalive)
