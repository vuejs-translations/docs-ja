# リストレンダリング {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Vue.js のリストレンダリングについて学ぶ無料レッスン"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Vue.js のリストレンダリングについて学ぶ無料レッスン"/>
</div>

## `v-for` {#v-for}

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

[Playground で試す](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

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

## `v-for` をオブジェクトに適用する {#v-for-with-an-object}

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

[Playground で試す](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` で範囲を使用する {#v-for-with-a-range}

`v-for` は、整数を取ることもできます。その場合、`1...n` のような範囲に従って、その回数だけテンプレートが繰り返されます。

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

`n` の値は `0` ではなく `1` から始まることに注意してください。

## `<template>` に `v-for` を適用する {#v-for-on-template}

テンプレートに `v-if` を適用する場合と同様に、 `<template>` タグに `v-for` を適用すると、複数の要素からなるブロックをレンダリングできます。例:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` と `v-if` を組み合わせる場合 {#v-for-with-v-if}

:::warning 注意
暗黙の優先順位があるため、`v-if` と `v-for` を同一の要素に対して使用することは**推奨されません**。詳しくは[スタイルガイド](/style-guide/rules-essential#avoid-v-if-with-v-for)を参照してください。
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

## `key` による状態管理 {#maintaining-state-with-key}

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

`v-for` の `key` 属性は、可能な場合は必ず指定することが[推奨されます](/style-guide/rules-essential#use-keyed-v-for)。ただし、反復処理する DOM の内容が単純なものである (つまりコンポーネントやステートフルな DOM 要素を含まない) 場合、またはパフォーマンス向上のために意図的にデフォルト動作を用いたい場合は、この限りではありません。

`key` のバインディングにはプリミティブ型の値、つまり文字列と数値が想定されます。`v-for` の key にオブジェクトを指定してはいけません。`key` 属性の詳しい使い方については、[`key` API のドキュメント](/api/built-in-special-attributes#key)を参照してください。

## `v-for` をコンポーネントに適用する {#v-for-with-a-component}

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

[シンプルな ToDo リストのサンプル](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=)で、`v-for` でコンポーネントのリストをレンダリングするとき、各インスタンスに異なるデータをどのように渡せばよいかを確認できます。

</div>
<div class="options-api">

[シンプルな ToDo リストのサンプル](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=)で、`v-for` でコンポーネントのリストをレンダリングするとき、各インスタンスに異なるデータをどのように渡せばよいかを確認できます。

</div>

## 配列の変更の検出 {#array-change-detection}

### ミューテーションメソッド {#mutation-methods}

Vue はリアクティブな配列のミューテーションメソッドが呼び出されたことを検出し、必要な更新をトリガーできます。そのミューテーションメソッドは次の通りです:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### 配列の置き換え {#replacing-an-array}

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

## フィルタリング/並べ替えの結果を表示する {#displaying-filtered-sorted-results}

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
