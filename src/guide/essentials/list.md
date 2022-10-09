# リストレンダリング

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Vue.js のリストレンダリングについて学ぶ無料レッスン"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Vue.js のリストレンダリングについて学ぶ無料レッスン"/>
</div>

## `v-for`

配列に基づいて項目のリストをレンダリングするには、`v-for` ディレクティブを使用します。`v-for` ディレクティブでは、`item in items` という形式の特別な構文が必要になります。ここで、`items` は元のデータの配列を指し、`item` は反復処理の対象となっている配列要素の**エイリアス**を指します:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

`v-for` のスコープ内では、テンプレート内の式から親スコープのすべてのプロパティにアクセスできます。さらに、`v-for` では以下のように現在の項目のインデックスを指す、2 つ目の省略可能なエイリアスもサポートされています:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgcGFyZW50TWVzc2FnZSA9IHJlZignUGFyZW50JylcbmNvbnN0IGl0ZW1zID0gcmVmKFt7IG1lc3NhZ2U6ICdGb28nIH0sIHsgbWVzc2FnZTogJ0JhcicgfV0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8bGkgdi1mb3I9XCIoaXRlbSwgaW5kZXgpIGluIGl0ZW1zXCI+XG4gIFx0e3sgcGFyZW50TWVzc2FnZSB9fSAtIHt7IGluZGV4IH19IC0ge3sgaXRlbS5tZXNzYWdlIH19XG5cdDwvbGk+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgcGFyZW50TWVzc2FnZTogJ1BhcmVudCcsXG4gICAgXHRpdGVtczogW3sgbWVzc2FnZTogJ0ZvbycgfSwgeyBtZXNzYWdlOiAnQmFyJyB9XVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGxpIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBpdGVtc1wiPlxuICBcdHt7IHBhcmVudE1lc3NhZ2UgfX0gLSB7eyBpbmRleCB9fSAtIHt7IGl0ZW0ubWVzc2FnZSB9fVxuXHQ8L2xpPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

`v-for` の変数のスコープは、次の JavaScript と同様です:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // ここからスコープの外の `parentMessage` にはアクセスできますが、
  // `item` と `index` はこの中でしか使用できません。
  console.log(parentMessage, item.message, index)
})
```

`v-for` の値が `forEach` のコールバック関数のシグネチャと一致している様子に注目してください。実際、関数の引数で分割代入を使用するときと同様に、`v-for` の item のエイリアスでも分割代入を使用することができます:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- index のエイリアスを伴う場合 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

ネストされた `v-for` でも、スコープの挙動はネストされた関数と同様です。以下のように、それぞれの `v-for` のスコープでは親のスコープにアクセスできます:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

区切り文字として `in` の代わりに `of` を使用して、JavaScript のイテレーター構文に近付けることもできます:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` をオブジェクトに適用する

`v-for` は、オブジェクトの各プロパティを反復処理するのにも使用できます。反復処理の順序は、オブジェクトに対して `Object.keys()` を呼び出した結果に基づきます:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

以下のように 2 つ目のエイリアスを指定すると、プロパティの名前 (「キー」とも呼ばれる) を取り出すことができます:

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

さらに 3 つ目のエイリアスを追加すると、インデックスを取り出せます:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBteU9iamVjdCA9IHJlYWN0aXZlKHtcbiAgdGl0bGU6ICdIb3cgdG8gZG8gbGlzdHMgaW4gVnVlJyxcbiAgYXV0aG9yOiAnSmFuZSBEb2UnLFxuICBwdWJsaXNoZWRBdDogJzIwMTYtMDQtMTAnXG59KVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PHVsPlxuICAgIDxsaSB2LWZvcj1cIih2YWx1ZSwga2V5LCBpbmRleCkgaW4gbXlPYmplY3RcIj5cblx0XHQgIHt7IGluZGV4IH19LiB7eyBrZXkgfX06IHt7IHZhbHVlIH19XG5cdFx0PC9saT5cbiAgPC91bD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSJ9)

</div>
<div class="options-api">

[プレイグラウンドで試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgbXlPYmplY3Q6IHtcbiAgXHQgICAgdGl0bGU6ICdIb3cgdG8gZG8gbGlzdHMgaW4gVnVlJyxcblx0ICAgICAgYXV0aG9yOiAnSmFuZSBEb2UnLFxuICAgICAgXHRwdWJsaXNoZWRBdDogJzIwMTYtMDQtMTAnXG4gICAgXHR9XG4gIFx0fVxuXHR9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8dWw+XG4gICAgPGxpIHYtZm9yPVwiKHZhbHVlLCBrZXksIGluZGV4KSBpbiBteU9iamVjdFwiPlxuXHRcdCAge3sgaW5kZXggfX0uIHt7IGtleSB9fToge3sgdmFsdWUgfX1cblx0XHQ8L2xpPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

## `v-for` で範囲を使用する

`v-for` は、整数を取ることもできます。その場合、`1...n` のような範囲に従って、その回数だけテンプレートが繰り返されます。

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

`n` の値は `0` ではなく `1` から始まることに注意してください。

## `<template>` に `v-for` を適用する

テンプレートに `v-if` を適用する場合と同様に、 `<template>` タグに `v-for` を適用すると、複数の要素からなるブロックをレンダリングできます。例:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` と `v-if` を組み合わせる場合

:::warning 注意
暗黙の優先順位があるため、`v-if` と `v-for` を同一の要素に対して使用することは**推奨されません**。詳しくは[スタイルガイド](/style-guide/rules-essential.html#avoid-v-if-with-v-for)を参照してください。
:::

同じノードに両方が存在する場合、`v-for` よりも `v-if` のほうが優先順位が高くなります。これは、以下のように `v-for` のスコープにある変数には `v-if` の条件式からアクセスできないことを意味します:

```vue-html
<!--
"todo" というプロパティがインスタンスで未定義となるため、
エラーがスローされます。
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

この問題は、以下のようにラップ用の `<template>` タグを設けて、そこに `v-for` を移動することで解決できます (このほうがより明示的でもあります):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## `key` による状態管理

`v-for` でレンダリングされた要素のリストを Vue が更新するとき、デフォルトでは「その場での修繕」(in-place patch) という戦略が用いられます。データ項目の順序が変更された場合、Vue は項目の順序に合うように DOM 要素を移動させるのではなく、個々の要素をその位置のままで修正し、各インデックスでレンダリングされるべきものを反映させます。

このデフォルトのモードは効率性が高いものの、**これが適すのは、リストのレンダリング出力が子コンポーネントの状態や一時的な DOM の状態 (フォームの入力値など) に依存しない場合に限られます**。

Vue に各ノードを一意に追跡するためのヒントを与え、既存の要素を再利用して並べ替えを適用できるようにするには、以下のように各項目に一意の `key` 属性を指定する必要があります:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

`<template v-for>` を例に取ると、`key` は以下のように `<template>` の中に置きます:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip 注意
ここでいう `key` は、`v-bind` でバインドされる特別な属性です。[`v-for` をオブジェクトに適用する](#v-for-with-an-object)ときのプロパティのキーの変数と混同しないように注意してください。
:::

`v-for` の `key` 属性は、可能な場合は必ず指定することが[推奨されます](/style-guide/rules-essential.html#use-keyed-v-for)。ただし、反復処理する DOM の内容が単純なものである (つまりコンポーネントやステートフルな DOM 要素を含まない) 場合、またはパフォーマンス向上のために意図的にデフォルト動作を用いたい場合は、この限りではありません。

`key` のバインディングにはプリミティブ型の値、つまり文字列と数値が想定されます。`v-for` の key にオブジェクトを指定してはいけません。`key` 属性の詳しい使い方については、[`key` API のドキュメント](/api/built-in-special-attributes.html#key)を参照してください。

## `v-for` をコンポーネントに適用する

> このセクションは、[コンポーネント](/guide/essentials/component-basics)についての知識があることを前提にしています。読み飛ばして、後で戻ってくるのでも大丈夫です。

通常の要素と同様に、コンポーネントにも `v-for` を直接適用することができます (`key` を指定するのを忘れないでください):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

ただし、これだけではデータが自動的にコンポーネントに渡されるようにはなりません。なぜなら、コンポーネントはそれ自身の独立したスコープを持つからです。コンポーネントに反復処理対象のデータを渡すには、以下のようにプロパティを併用する必要があります:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

`item` が自動的に注入されないようになっている理由は、そうしてしまうと、コンポーネントが `v-for` の動作と密に結合してしまうためです。データの供給源を明示的に指定することにより、コンポーネントが別の場面でも再利用できるような作りになっています。

<div class="composition-api">

[シンプルな ToDo リストのサンプル](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBUb2RvSXRlbSBmcm9tICcuL1RvZG9JdGVtLnZ1ZSdcbiAgXG5jb25zdCBuZXdUb2RvVGV4dCA9IHJlZignJylcbmNvbnN0IHRvZG9zID0gcmVmKFtcbiAge1xuICAgIGlkOiAxLFxuICAgIHRpdGxlOiAnRG8gdGhlIGRpc2hlcydcbiAgfSxcbiAge1xuICAgIGlkOiAyLFxuICAgIHRpdGxlOiAnVGFrZSBvdXQgdGhlIHRyYXNoJ1xuICB9LFxuICB7XG4gICAgaWQ6IDMsXG4gICAgdGl0bGU6ICdNb3cgdGhlIGxhd24nXG4gIH1cbl0pXG5cbmxldCBuZXh0VG9kb0lkID0gNFxuXG5mdW5jdGlvbiBhZGROZXdUb2RvKCkge1xuICB0b2Rvcy52YWx1ZS5wdXNoKHtcbiAgICBpZDogbmV4dFRvZG9JZCsrLFxuICAgIHRpdGxlOiBuZXdUb2RvVGV4dC52YWx1ZVxuICB9KVxuICBuZXdUb2RvVGV4dC52YWx1ZSA9ICcnXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8Zm9ybSB2LW9uOnN1Ym1pdC5wcmV2ZW50PVwiYWRkTmV3VG9kb1wiPlxuICAgIDxsYWJlbCBmb3I9XCJuZXctdG9kb1wiPkFkZCBhIHRvZG88L2xhYmVsPlxuICAgIDxpbnB1dFxuICAgICAgdi1tb2RlbD1cIm5ld1RvZG9UZXh0XCJcbiAgICAgIGlkPVwibmV3LXRvZG9cIlxuICAgICAgcGxhY2Vob2xkZXI9XCJFLmcuIEZlZWQgdGhlIGNhdFwiXG4gICAgLz5cbiAgICA8YnV0dG9uPkFkZDwvYnV0dG9uPlxuICA8L2Zvcm0+XG4gIDx1bD5cbiAgICA8dG9kby1pdGVtXG4gICAgICB2LWZvcj1cIih0b2RvLCBpbmRleCkgaW4gdG9kb3NcIlxuICAgICAgOmtleT1cInRvZG8uaWRcIlxuICAgICAgOnRpdGxlPVwidG9kby50aXRsZVwiXG4gICAgICBAcmVtb3ZlPVwidG9kb3Muc3BsaWNlKGluZGV4LCAxKVwiXG4gICAgPjwvdG9kby1pdGVtPlxuICA8L3VsPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiVG9kb0l0ZW0udnVlIjoiPHNjcmlwdCBzZXR1cD5cbmRlZmluZVByb3BzKFsndGl0bGUnXSlcbmRlZmluZUVtaXRzKFsncmVtb3ZlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8bGk+XG4gICAge3sgdGl0bGUgfX1cbiAgICA8YnV0dG9uIEBjbGljaz1cIiRlbWl0KCdyZW1vdmUnKVwiPlJlbW92ZTwvYnV0dG9uPlxuICA8L2xpPlxuPC90ZW1wbGF0ZT4ifQ==)で、`v-for` でコンポーネントのリストをレンダリングするとき、各インスタンスに異なるデータをどのように渡せばよいかを確認できます。

</div>
<div class="options-api">

[シンプルな ToDo リストのサンプル](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBUb2RvSXRlbSBmcm9tICcuL1RvZG9JdGVtLnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgVG9kb0l0ZW0gfSxcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3VG9kb1RleHQ6ICcnLFxuICAgICAgdG9kb3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgIHRpdGxlOiAnRG8gdGhlIGRpc2hlcydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgIHRpdGxlOiAnVGFrZSBvdXQgdGhlIHRyYXNoJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgdGl0bGU6ICdNb3cgdGhlIGxhd24nXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBuZXh0VG9kb0lkOiA0XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYWRkTmV3VG9kbygpIHtcbiAgICAgIHRoaXMudG9kb3MucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLm5leHRUb2RvSWQrKyxcbiAgICAgICAgdGl0bGU6IHRoaXMubmV3VG9kb1RleHRcbiAgICAgIH0pXG4gICAgICB0aGlzLm5ld1RvZG9UZXh0ID0gJydcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxmb3JtIHYtb246c3VibWl0LnByZXZlbnQ9XCJhZGROZXdUb2RvXCI+XG4gICAgPGxhYmVsIGZvcj1cIm5ldy10b2RvXCI+QWRkIGEgdG9kbzwvbGFiZWw+XG4gICAgPGlucHV0XG4gICAgICB2LW1vZGVsPVwibmV3VG9kb1RleHRcIlxuICAgICAgaWQ9XCJuZXctdG9kb1wiXG4gICAgICBwbGFjZWhvbGRlcj1cIkUuZy4gRmVlZCB0aGUgY2F0XCJcbiAgICAvPlxuICAgIDxidXR0b24+QWRkPC9idXR0b24+XG4gIDwvZm9ybT5cbiAgPHVsPlxuICAgIDx0b2RvLWl0ZW1cbiAgICAgIHYtZm9yPVwiKHRvZG8sIGluZGV4KSBpbiB0b2Rvc1wiXG4gICAgICA6a2V5PVwidG9kby5pZFwiXG4gICAgICA6dGl0bGU9XCJ0b2RvLnRpdGxlXCJcbiAgICAgIEByZW1vdmU9XCJ0b2Rvcy5zcGxpY2UoaW5kZXgsIDEpXCJcbiAgICA+PC90b2RvLWl0ZW0+XG4gIDwvdWw+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJUb2RvSXRlbS52dWUiOiI8c2NyaXB0PlxuZXhwb3J0IGRlZmF1bHQge1xuXHRwcm9wczogWyd0aXRsZSddLFxuICBlbWl0czogWydyZW1vdmUnXVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGxpPlxuICAgIHt7IHRpdGxlIH19XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgncmVtb3ZlJylcIj5SZW1vdmU8L2J1dHRvbj5cbiAgPC9saT5cbjwvdGVtcGxhdGU+In0=)で、`v-for` でコンポーネントのリストをレンダリングするとき、各インスタンスに異なるデータをどのように渡せばよいかを確認できます。

</div>

## 配列の変更の検出

### ミューテーションメソッド

Vue はリアクティブな配列のミューテーションメソッドが呼び出されたことを検出し、必要な更新をトリガーできます。そのミューテーションメソッドは次の通りです:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### 配列の置き換え

ミューテーションメソッドはその名が示す通り、呼び出し元の配列を変化させるメソッドです。これに対し、`filter()`、`concat()`、`slice()` など、呼び出し元の配列を変化させないメソッドもあります。これらのメソッドは**常に新しい配列を返します**。ミューテーションしないメソッドを扱う場合は、以下のように、古い配列を新しい配列に置き換える必要があります:

<div class="composition-api">

```js
// `items` は配列値の参照です
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

このようにすると、Vue が既存の DOM を破棄してリスト全体を再レンダリングするように思えるかもしれませんが、幸いにもそのようなことはありません。Vue には DOM 要素を最大限に再利用するためのスマートな発見的アルゴリズムが実装されているため、既存の配列を、重複するオブジェクトが含まれる新しい配列に置き換える場合でも、非常に効率的な処理が行われます。

## フィルタリング/並べ替えの結果を表示する

時には、配列の元のデータを実際に変更することやリセットすることなしに、フィルタリングや並べ替えを適用したバージョンを表示したいことがあります。そのような場合には、フィルタリングや並べ替えを適用した配列を返す算出プロパティを作成することができます。

例:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

算出プロパティが使えない場所 (例えばネストされた `v-for` ループの内側) では、以下のようにメソッドを使用できます:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

算出プロパティの中で `reverse()` と `sort()` を使用するときは注意してください！これら 2 つのメソッドには、算出プロパティのゲッターの中では避けるべき、元の配列を変更するという作用があります。以下のように、これらのメソッドを呼び出す前には元の配列のコピーを作成します:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
