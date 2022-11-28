# SFC CSS 機能 {#sfc-css-features}

## スコープ付き CSS {#scoped-css}

`<style>` タグに `scoped` 属性が指定されている場合、その CSS は現在のコンポーネントの要素のみに適用されます。これは、Shadow DOM に見られるスタイルのカプセル化に似ています。これはいくつかの注意点がありますが、ポリフィルは必要ありません。これは、PostCSS を使って変換することで実現されます。次のコードは:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

以下のように変換されます:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### 子コンポーネントのルート要素 {#child-component-root-elements}

`scoped` を使用すると、親コンポーネントのスタイルが子コンポーネントに漏れることはありません。しかし、子コンポーネントのルートノードは親のスコープ付き CSS と子のスコープ付き CSS の両方の影響を受けることになります。これは、親コンポーネントがレイアウトのために子コンポーネントのルート要素のスタイルを設定できるようにするための設計です。

### deep セレクター {#deep-selectors}

`scoped` スタイルのセレクターを "deep" にしたい場合、つまり子コンポーネントに影響を与えたい場合は、`:deep()` 擬似クラスを使用できます:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

上記は次のようにコンパイルされます:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
`v-html` で作成された DOM コンテンツは、スコープ付きスタイルの影響を受けませんが、deep セレクターを使用してスタイルを設定可能です。
:::

### slotted セレクター {#slotted-selectors}

`<slot/>` によってレンダリングされるコンテンツは、デフォルトでは親コンポーネントによって所有されていると見なされるため、スコープ付きスタイルの影響を受けません。明示的にスロットのコンテンツをターゲットにするには、`:slotted` 疑似クラスを使用します:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### global セレクター {#global-selectors}

もし 1 つのルールだけをグローバルに適用したい場合は、別の `<style>` を作成するかわりに、`:global` 疑似クラスを使用できます（以下を参照）:

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### ローカルスタイルとグローバルスタイルの混在 {#mixing-local-and-global-styles}

スコープ付きスタイルとスコープなしスタイルの両方を同じコンポーネントに含めることもできます:

```vue
<style>
/* グローバルスタイル */
</style>

<style scoped>
/* ローカルスタイル */
</style>
```

### スコープ付きスタイルのヒント {#scoped-style-tips}

- **スコープ付きスタイルでクラスが不要になるわけではありません**。ブラウザーの様々な CSS セレクターのレンダリング方法により、`p { color: red }` をスコープ付きにした場合（つまり属性セレクターと組み合わせた場合）、何倍も遅くなります。その代わり、`.example { color: red }` のようにクラスや ID を使用すれば、このパフォーマンス低下をほぼ排除できます。

- **再帰的コンポーネントでの子孫セレクターに注意！** `.a .b` というセレクターがある CSS ルールにおいて、`.a` にマッチする要素が再帰的な子コンポーネントを含む場合、その子コンポーネントのすべての `.b` がルールにマッチされます。

## CSS モジュール {#css-modules}

`<style module>` タグは [CSS モジュール](https://github.com/css-modules/css-modules)としてコンパイルされ、結果として得られる CSS クラスを `$style` というキーの下にオブジェクトとしてコンポーネントに公開します:

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

生成されたクラスは衝突を避けるためにハッシュ化され、CSS を現在のコンポーネントのみにスコープするのと同じ効果を得ることができます。

[グローバルの例外](https://github.com/css-modules/css-modules#exceptions)や[コンポジション](https://github.com/css-modules/css-modules#composition)などの詳細は、[CSS モジュールの仕様](https://github.com/css-modules/css-modules)を参照してください。

### カスタム注入名 {#custom-inject-name}

`module` 属性に値を与えることで、注入されるクラスオブジェクトのプロパティキーをカスタマイズできます:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Composition API での使用 {#usage-with-composition-api}

注入されたクラスは、`useCssModule` API を介して `setup()` や `<script setup>` の中でアクセスできます。カスタム注入名を持つ `<style module>` ブロックの場合、`useCssModule` は最初の引数としてマッチする `module` 属性の値を受け取ります:

```js
import { useCssModule } from 'vue'

// setup() スコープの内側...
// デフォルトでは <style module> のクラスを返します
useCssModule()

// 名前付きの例、<style module="classes"> のクラスを返します
useCssModule('classes')
```

## CSS の `v-bind()` {#v-bind-in-css}

SFC の `<style>` タグでは `v-bind` という CSS 関数を使用して、CSS の値をコンポーネントの動的な状態にリンクすることをサポートします:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

この構文は [`<script setup>`](./sfc-script-setup) で動作し、JavaScript の式（引用符で囲む必要あり）をサポートします:

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

実際の値は、ハッシュ化された CSS カスタムプロパティにコンパイルされるため、CSS は静的なままです。カスタムプロパティは、インラインスタイルによってコンポーネントのルート要素に適用され、ソース値が変更されるとリアクティブに更新されます。
