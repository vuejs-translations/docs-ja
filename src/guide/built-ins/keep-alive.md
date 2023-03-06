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

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHNoYWxsb3dSZWYgfSBmcm9tICd2dWUnXG5pbXBvcnQgQ29tcEEgZnJvbSAnLi9Db21wQS52dWUnXG5pbXBvcnQgQ29tcEIgZnJvbSAnLi9Db21wQi52dWUnXG5cbmNvbnN0IGN1cnJlbnQgPSBzaGFsbG93UmVmKENvbXBBKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRlbW9cIj5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgOnZhbHVlPVwiQ29tcEJcIiAvPiBCPC9sYWJlbD5cbiAgICA8S2VlcEFsaXZlPlxuICAgICAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50XCI+PC9jb21wb25lbnQ+XG4gICAgPC9LZWVwQWxpdmU+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cbiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDb21wQS52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBjb3VudCA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPHA+Q3VycmVudCBjb21wb25lbnQ6IEE8L3A+XG4gIDxzcGFuPmNvdW50OiB7eyBjb3VudCB9fTwvc3Bhbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJjb3VudCsrXCI+KzwvYnV0dG9uPlxuPC90ZW1wbGF0ZT5cbiIsIkNvbXBCLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5jb25zdCBtc2cgPSByZWYoJycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBDb21wQSBmcm9tICcuL0NvbXBBLnZ1ZSdcbmltcG9ydCBDb21wQiBmcm9tICcuL0NvbXBCLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQ29tcEEsIENvbXBCIH0sXG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6ICdDb21wQSdcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkZW1vXCI+XG4gICAgPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiB2LW1vZGVsPVwiY3VycmVudFwiIHZhbHVlPVwiQ29tcEFcIiAvPiBBPC9sYWJlbD5cbiAgICA8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIHYtbW9kZWw9XCJjdXJyZW50XCIgdmFsdWU9XCJDb21wQlwiIC8+IEI8L2xhYmVsPlxuICAgIDxLZWVwQWxpdmU+XG4gICAgICA8Y29tcG9uZW50IDppcz1cImN1cnJlbnRcIj48L2NvbXBvbmVudD5cbiAgICA8L0tlZXBBbGl2ZT5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkNvbXBBLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQTwvcD5cbiAgPHNwYW4+Y291bnQ6IHt7IGNvdW50IH19PC9zcGFuPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj4rPC9idXR0b24+XG48L3RlbXBsYXRlPlxuIiwiQ29tcEIudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXNnOiAnJ1xuICAgIH1cbiAgfVxufVxuPC9zY3JpcHQ+XG5cblxuPHRlbXBsYXRlPlxuICA8cD5DdXJyZW50IGNvbXBvbmVudDogQjwvcD5cbiAgPHNwYW4+TWVzc2FnZSBpczoge3sgbXNnIH19PC9zcGFuPlxuICA8aW5wdXQgdi1tb2RlbD1cIm1zZ1wiPlxuPC90ZW1wbGF0ZT5cbiJ9)

</div>

:::tip
[DOM テンプレート](/guide/essentials/component-basics#dom-template-parsing-caveats)内で使用する場合は `<keep-alive>` として参照する必要があります。
:::

## Include / Exclude {#include-exclude}

デフォルトでは、`<KeepAlive>` はコンポーネント内のどんなコンポーネントでもキャッシュします。この動作は `include` と `exclude` プロパティを使用してカスタマイズできます。どちらのプロパティにも、カンマ区切りの文字列、`RegExp`、あるいは、そのいずれかの型を含む配列を指定できます:

```vue-html
<!-- カンマ区切りの文字列 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正義表現 (`v-bind` を使用) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 配列 (`v-bind` を使用) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

一致するかどうかは、コンポーネントの [`name`](/api/options-misc#name) オプションに対してチェックされます。よって、`KeepAlive` により条件付きでキャッシュされるコンポーネントには、明示的に `name` オプションを宣言する必要があります。

:::tip
バージョン 3.2.34 以降、`<script setup>` を使った単一ファイルコンポーネントは、ファイル名から `name` オプションを自動的に推測し、手動で名前を宣言する必要がなくなりました。
:::

## キャッシュインスタンスの最大数 {#max-cached-instances}

`max` prop を使うと、キャッシュできるコンポーネントインスタンスの最大数を制限することができます。`max` が指定された場合、`<KeepAlive>` は [LRU キャッシュ](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>) のように動作します。つまり、キャッシュインスタンスの数が指定された最大数を越えようとした時点で、最も過去にアクセスされたキャッシュインスタンスが破棄され、新しいキャッシュ用のスペースが作られます。

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## キャッシュされたインスタンスのライフサイクル {#lifecycle-of-cached-instance}

コンポーネントインスタンスが DOM から削除されても `<KeepAlive>` によってコンポーネントツリーのキャッシュの一部である場合、コンポーネントインスタンスはアンマウントされる代わりに**非アクティブ化**状態に移行します。コンポーネントインスタンスが DOM にキャッシュツリーの一部として挿入されると、**アクティブ化**されます。

<div class="composition-api">

kept-alive コンポーネントは、これら 2 つの状態に対して、[`onActivated()`](/api/composition-api-lifecycle#onactivated) と [`onDeactivated()`](/api/composition-api-lifecycle.html#ondeactivated) を使用してライフサイクルフックを登録できます:

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

kept-alive コンポーネントは、これら 2 つの状態に対して、[`activated`](/api/options-lifecycle#activated) と [`deactivated`](/api/options-lifecycle.html#deactivated) のフックを使用してライフサイクルフックを登録できます:

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
