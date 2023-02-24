---
outline: deep
---

# フォールスルー属性 {#fallthrough-attributes}

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

## 属性の継承 {#attribute-inheritance}

"フォールスルー属性"とは、あるコンポーネントに渡されたものの、受け取ったコンポーネントの [props](./props) や [emits](./events.html#declaring-emitted-events) で明確に宣言されていない属性、または `v-on` イベントリスナーを指します。よくある例としては、`class`、`style`、`id` 属性などがあります。

コンポーネントが単一のルート要素をレンダリングする時、フォールスルー属性は自動的にルート要素の属性に追加されます。例えば、次のようなテンプレートを持つ `<MyButton>` コンポーネントがあったとします:

```vue-html
<!-- <MyButton> のテンプレート -->
<button>click me</button>
```

そして、このコンポーネントを使う親が以下です:

```vue-html
<MyButton class="large" />
```

最終的に DOM は以下のようにレンダリングされます:

```html
<button class="large">click me</button>
```

ここで、`<MyButton>` は `class` を受け入れ可能なプロパティとして宣言していません。そのため、`class` はフォールスルー属性として扱われ、自動的に `<MyButton>` のルート要素に追加されます。

### `class` と `style` のマージ {#class-and-style-merging}

もし、子コンポーネントのルート要素にすでに `class` や `style` 属性がある場合は、親から継承された `class` や `style` の値にマージされます。先ほどの例の `<MyButton>` のテンプレートを次のように変更するとします:

```vue-html
<!-- <MyButton> の テンプレート -->
<button class="btn">click me</button>
```

そうすると、最終的にレンダリングされる DOM は、こうなります:

```html
<button class="btn large">click me</button>
```

### `v-on` リスナーの継承 {#v-on-listener-inheritance}

同じルールが `v-on` イベントリスナーにも適用されます:

```vue-html
<MyButton @click="onClick" />
```

`click` リスナーは `<MyButton>` のルート要素、つまりネイティブの `<button>` 要素に追加されます。ネイティブの `<button>` がクリックされた時、親コンポーネントの `onClick` メソッドがトリガーされます。もし、ネイティブの `<button>` が既に `v-on` でバインドされた `click` リスナーを持っている場合、両方のリスナーがトリガーされます。

### ネストされたコンポーネントの継承 {#nested-component-inheritance}

あるコンポーネントが他の 1 つのコンポーネントをルートノードとしてレンダリングする場合を考えてみましょう。例として、`<MyButton>` をルートとして `<BaseButton>` をレンダリングするようにリファクタリングしました:

```vue-html
<!-- シンプルに他の 1 つのコンポーネントをレンダリングする <MyButton/> のテンプレート -->
<BaseButton />
```

この時、`<MyButton>` が受け取ったフォールスルー属性は、自動的に `<BaseButton>` に転送されます。

以下の点に注意してください:

1. 転送された属性には、`<MyButton>` がプロパティとして宣言した属性や、宣言したイベントの `v-on` リスナーは含まれません。言い換えると、宣言したプロパティとリスナーは `<MyButton>` によって "消費" されています。

2. 転送された属性は、 `<BaseButton>` が宣言していれば、プロパティとして受け取ることができます。

## 属性の継承の無効化 {#disabling-attribute-inheritance}

コンポーネントに自動的な属性の継承をさせたく**ない**場合は、コンポーネントのオプションで `inheritAttrs: false` を設定することができます。

<div class="composition-api">

`<script setup>` を使用するなら、このオプションは別の通常の `<script>` ブロックを使って宣言する必要があります:

```vue
<script>
// 通常の <script> でオプションを宣言
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ロジックのセットアップ
</script>
```

</div>

属性の継承を無効にする一般的なシナリオは、ルートノード以外の要素に属性を適用する必要がある場合です。 `inheritAttrs` オプションを `false` に設定することで、フォールスルー属性を適用する場所を完全に制御することができます。

これらのフォールスルー属性は、テンプレート内の式で `$attrs` として直接アクセスすることができます:

```vue-html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

`$attrs` オブジェクトには、コンポーネントの `props` や `emits` オプションで宣言されていないすべての属性 (例えば `class`, `style`, `v-on` リスナーなど) が含まれます。

備考:

- プロパティとは異なり、フォールスルー属性は JavaScript では元のケーシングを保持します。したがって、 `foo-bar` のような属性は `$attrs['foo-bar']` としてアクセスされる必要があります。

- `@click` のような `v-on` イベントリスナーは、オブジェクトで `$attrs.onClick` という関数として公開されます。

[前のセクション](#attribute-inheritance)で紹介した `<MyButton>` コンポーネントの例では、スタイリングのために実際の `<button>` 要素を `<div>` でラップする必要がある場合があります:

```vue-html
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
```

`class` や `v-on` リスナーなどのすべてのフォールスルー属性を、外側の `<div>` ではなく、内側の `<button>` に適用されるようにしたいです。これは、 `inheritAttrs: false` と `v-bind="$attrs"` で実現できます:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

[引数なしの `v-bind`](/guide/essentials/template-syntax.html#dynamically-binding-multiple-attributes) はオブジェクトのすべてのプロパティをターゲット要素の属性としてバインドすることを覚えておきましょう。

## 複数のルートノードでの属性継承 {#attribute-inheritance-on-multiple-root-nodes}

ルートノードが 1 つのコンポーネントと異なり、複数のルートノードを持つコンポーネントは、自動的に属性をフォールスルーするふるまいがありません。 `$attrs` が明示的にバインドされていない場合は、実行時に警告が出ます。

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

もし `<CustomLayout>` が以下のようなマルチルートのテンプレートを持っている場合、 Vue はどこにフォールスルー属性を適用すればよいか分からないため、警告されます:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

警告は `$attrs` が明示的にバインドされている場合は抑制されます:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## JavaScript 内でフォールスルー属性にアクセスする {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

必要であれば、`<script setup>` 内で `useAttrs()` API を使用してコンポーネントのフォールスルー属性にアクセスすることができます:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

もし `<script setup>` を使用していない場合、 `attrs` は `setup()` コンテキストのプロパティとして公開されます:

```js
export default {
  setup(props, ctx) {
    // フォールスルー属性が ctx.attrs として公開される
    console.log(ctx.attrs)
  }
}
```

ここで `attrs` オブジェクトは常に最新のフォールスルー属性を反映していますが、リアクティブではないことに注意してください（パフォーマンス上の理由です）。ウォッチャーを使ってその変更を監視することはできません。リアクティビティーが必要であれば、 prop を使ってください。または、 `onUpdated()` を使用して、更新されるたびに最新の `attrs` による副作用を実行することもできます。

</div>

<div class="options-api">

必要であれば、`$attrs` インスタンスプロパティを介して、コンポーネントのフォールスルー属性にアクセスすることができます:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
