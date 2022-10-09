# クラスとスタイルのバインディング

データバインディングは、HTML 要素に持たせる CSS クラスのリストやインラインのスタイルを自在に操作したいという、よくあるニーズに応えます。`class` と `style` はどちらも属性なので、他の属性と同じように `v-bind` を使用して動的に文字列の値を割り当てることができます。しかし、文字列の連結を使ってこれらの値を生成しようとすると、手間がかかり、間違いが起きやすくなるものです。そこで、Vue では `class` や `style` に対して `v-bind` を用いるとき、特別な拡張が利用できるようになっています。文字列のほかに、オブジェクトまたは配列として評価される式も利用できます。

## HTML クラスのバインディング

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Vue.js の動的 CSS クラスについて学ぶ無料レッスン"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Vue.js の動的 CSS クラスについて学ぶ無料レッスン"/>
</div>

### オブジェクトへのバインディング

`:class` (`v-bind:class` の省略記法) では、オブジェクトを渡して CSS クラスを動的に切り替えることができます:

```vue-html
<div :class="{ active: isActive }"></div>
```

上の構文は、コンポーネントのデータの `isActive` というプロパティが[真値](https://developer.mozilla.org/ja/docs/Glossary/Truthy)であるかどうかによって `active` という CSS クラスを含めるかどうかを決定する、という意味になります。

オブジェクトのフィールドを増やせば、複数のクラスをトグルすることができます。さらに、`:class` ディレクティブは通常の `class` 属性と共存させることもできます。例えば、次のような状態があるとします:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

そしてテンプレートが次のようになっているとします:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

このとき、レンダリング結果は次のようになります:

```vue-html
<div class="static active"></div>
```

`isActive` や `hasError` が変化すると、それに合わせてクラスのリストも更新されます。例えば、`hasError` が `true` になればクラスのリストは `"static active text-danger"` に変わります。

バインドするオブジェクトはインラインにしなくても構いません:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

これも、同じレンダリング結果を得られます。オブジェクトを返す[算出プロパティ](./computed)にクラスをバインドすることも可能です。次の例は、よく使われる強力なパターンです:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### 配列へのバインディング

次のように `:class` を配列にバインドすると、クラスのリストを適用することができます:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

レンダリング結果は次のようになります:

```vue-html
<div class="active text-danger"></div>
```

リストに含まれる特定のクラスを条件に基づいて切り替えたい場合には、三項演算子を使えば実現できます:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

この場合、`errorClass` は常に適用され、`activeClass` は `isActive` が真のときだけ適用されます。

しかし、条件を付けたいクラスが複数あると、これでは少し冗長になります。そこで、配列構文の中でオブジェクト構文を使うこともできるようになっています:

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### コンポーネントでの使用

> このセクションは、[コンポーネント](/guide/essentials/component-basics)についての知識があることを前提にしています。読み飛ばして、後で戻ってくるのでも大丈夫です。

ルート要素が 1 つだけのコンポーネントで `class` 属性を使用すると、そこで指定したクラスがコンポーネントのルート要素に追加され、すでに指定されている既存のクラスとマージされます。

例えば、`MyComponent` という名前のコンポーネントがあり、次のようなテンプレートになっているとします:

```vue-html
<!-- 子コンポーネントのテンプレート -->
<p class="foo bar">Hi!</p>
```

そして、コンポーネントを使う際にクラスをいくつか追加します:

```vue-html
<!-- コンポーネントを使用する時点 -->
<MyComponent class="baz boo" />
```

レンダリングされる HTML は次のようになります:

```vue-html
<p class="foo bar baz boo">Hi</p>
```

クラスバインディングでも同様です:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

`isActive` が真値のとき、レンダリングされる HTML は次のようになります:

```vue-html
<p class="foo bar active">Hi</p>
```

コンポーネントに複数のルート要素を持たせているときは、どの要素にクラスを渡すか指定する必要があります。これは、以下のように `$attrs` コンポーネントプロパティを使って行います:

```vue-html
<!-- $attrs を使った MyComponent のテンプレート -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

レンダリング結果は次のようになります:

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

コンポーネントの属性の継承については、[フォールスルー属性](/guide/components/attrs.html)のセクションで詳しく説明しています。

## インラインスタイルのバインディング

### オブジェクトへのバインディング

`:style` では次のような JavaScript のオブジェクト値へのバインディングがサポートされ、[HTML 要素の `style` プロパティ](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/style) に対応します:

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

CSS プロパティのキーにはキャメルケース (camelCase) が推奨されますが、`:style` では CSS の実際の書き方に対応するケバブケース (kebab-cased) のキーもサポートされています。例:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

テンプレートをすっきりさせるため、多くの場合、次のようにスタイルオブジェクトを直接バインドするとよいでしょう:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

スタイルへのオブジェクトのバインディングも、オブジェクトを返す算出プロパティと組み合わせて使用することが多くあります。

### 配列へのバインディング

`:style` は、複数のスタイルオブジェクトからなる配列にバインドすることができます。各オブジェクトはマージされ、同じ要素に適用されます:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自動プレフィックス

`:style` で [ベンダープレフィックス](https://developer.mozilla.org/ja/docs/Glossary/Vendor_Prefix)を必要とする CSS プロパティを指定すると、Vue が適切なプレフィックスを自動的に追加します。Vue は、実行時にブラウザーでどのスタイルプロパティがサポートされているかをチェックして、適切なものを追加します。特定のプロパティがブラウザーでサポートされていない場合、Vue はさまざまなプレフィックスのバリエーションをテストし、サポートされているものを見つけようと試みます。

### 複数の値

style プロパティには、プレフィックス付きを含む複数の値を、配列で指定することができます。例:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

このように指定すると、配列に含まれる値のうち、ブラウザーでサポートされる最後の値のみがレンダリングに使われます。この例では、接頭辞なしのバージョンのフレックスボックスをサポートするブラウザーでは、`display: flex` がレンダリングに使われます。
