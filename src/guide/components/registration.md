# コンポーネントの登録 {#component-registration}

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="コンポーネントの登録について学ぶ Vue.js の無料レッスン"/>

Vue のコンポーネントをテンプレートで使用する時は、それがどこで実装されているかを Vue に知らせるため、「登録」を行う必要があります。コンポーネントの登録方法には、グローバルとローカルの 2 つがあります。

## グローバル登録 {#global-registration}

開発中の [Vue アプリケーション](/guide/essentials/application)でグローバルにコンポーネントを利用できるようにするには、以下に示す `app.component()` メソッドを使用します:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 登録名
  'MyComponent',
  // 実装
  {
    /* ... */
  }
)
```

SFC を使用する場合は、インポートした `.vue` ファイルを登録します:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

`app.component()` メソッドはチェーンにすることができます:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

グローバル登録したコンポーネントは、アプリケーション内の任意のコンポーネントのテンプレートで使用することができます:

```vue-html
<!-- これはアプリ内のどのコンポーネントでも動作します -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

これは、サブコンポーネントにも漏れなく適用されます。そのため、上の 3 つのコンポーネントはすべて _各コンポーネント内でも互いに_ 使える、ということになります。

## ローカル登録 {#local-registration}

グローバル登録は便利な反面、以下に示すいくつかの欠点があります:

1. グローバル登録では、未使用のコンポーネントを削除してくれるビルドシステムの処理 (いわゆる「ツリーシェイク」) が阻害されます。グローバル登録したコンポーネントは、最後までアプリのどこにも用いなかった場合でも、最終的なバンドルには含まれてしまいます。

2. グローバル登録では、大規模なアプリケーションでの依存関係の分かりやすさが低下します。グローバル登録では、子コンポーネントを使っている親コンポーネントから、子コンポーネントの実装部分を探し出すことが難しくなります。きわめて多くのグローバル変数が使われている状況と同じように、これは長期的な保守性に影響を与える可能性があります。

ローカルでの登録を利用すると、登録したコンポーネントを使えるスコープが現在のコンポーネントのみに限定されます。これによって依存関係が分かりやすくなり、ツリーシェイクが働きやすくなります。

<div class="composition-api">

SFC を `<script setup>` と共に使用する場合、インポートしたコンポーネントを登録なしでローカルに使用できるようになります:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

 `<script setup>` を用いない場合は、以下のように `components` オプションを使用する必要があります:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

ローカル登録は、以下のように `components` オプションを使って行います:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

`components` オブジェクトのプロパティそれぞれについて、キーがコンポーネントの登録名になります。そして、値にコンポーネントの実装が保持されます。上の例では ES2015 のプロパティの省略記法を使っていて、これは次の表記と等価です:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

ただし、 **ローカル登録されたコンポーネントが子孫のコンポーネントでも利用できるようにはならない**ことに注意してください。上の場合、`ComponentA` は現在のコンポーネントのみで利用可能になり、その子や子孫のコンポーネントで利用可能になるわけではありません。

## コンポーネント名での大文字・小文字の使い方 {#component-name-casing}

このガイドでは、コンポーネントを登録する際に PascalCase の名前を用いています。これは次の理由によります:

1. PascalCase の名前は JavaScript の識別子として有効です。そのため、JavaScript でコンポーネントをインポートしたり登録したりするのが容易になります。また、IDE のオートコンプリートも働きやすくなります。

2. テンプレートで `<PascalCase />` を用いると、これがネイティブの HTML 要素ではなく、Vue のコンポーネントであることがより明確になります。また、Vue コンポーネントとカスタム要素（Web コンポーネント）を区別することも可能になります。

このスタイルは、SFC や文字列テンプレートを合わせて使う時に推奨されるスタイルです。ただし、[DOM 内テンプレート解析の注意点](/guide/essentials/component-basics#in-dom-template-parsing-caveats) で説明しているように、DOM 内テンプレートの中では PascalCase のタグが使えません。

幸いなことに、Vue は PascalCase で登録したコンポーネントから kebab-case 形式のタグへの解決をサポートしています。これにより、`MyComponent` として登録したコンポーネントは、`<MyComponent>` と `<my-component>` のどちらを使ってもテンプレート内で参照できます。そのため、テンプレートの出どころに関わらず、JavaScript のコンポーネント登録のコードには同じものを用いることができます。
