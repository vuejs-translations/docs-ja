# 優先度B: 強く推奨 {#priority-b-rules-strongly-recommended}

これらのルールは、ほとんどのプロジェクトで可読性や開発者の使い勝手を向上させることが分かっています。これらのルールに違反した場合でも、あなたのコードは動作しますが、違反はごく少数で十分に正当な理由がなければいけません。

## コンポーネントのファイル {#component-files}

**ファイルを結合してくれるビルドシステムがあるときは、各コンポーネントはそれぞれ別のファイルにするべきです。**

そうすれば、コンポーネントを編集したり、使い方を確認したりするときに、より素早く見つけることができるようになります。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## 単一ファイルコンポーネントのファイル名の形式 {#single-file-component-filename-casing}

**[単一ファイルコンポーネント](/guide/scaling-up/sfc.html) のファイル名は、すべてパスカルケース (PascalCase) にするか、すべてケバブケース (kebab-case) にするべきです。**

パスカルケース (PascalCase) は、JS(X) やテンプレートでの中でコンポーネントの参照する方法と一致しているため、コードエディターでの自動補完に最も適しています。しかし、大文字と小文字が混ざったファイル名は、大文字と小文字を区別しないファイルシステムで問題を引き起こすことがあります。そのため、ケバブケース (kebab-case) も完全に許容されます。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## 基底コンポーネントの名前 {#base-component-names}

**アプリ特有のスタイルやルールを適用する基底コンポーネント (またはプレゼンテーションコンポーネント: Presentation Components、ダムコンポーネント: Dumb Components、純粋コンポーネント: Pure Components とも) は、すべて `Base`、`App`、`V` などの特定のプレフィックスで始まる必要があります。**

::: details 詳しい説明
これらのコンポーネントは、あなたのアプリに一貫したスタイルやふるまいをもたせる基礎として位置づけられます。これらは、おそらく以下のもの**だけ**を含むでしょう:

- HTML 要素
- 別の基底コンポーネント
- サードパーティー製の UI コンポーネント

しかし、それらにはグローバルな状態(例:[Pinia](https://pinia.vuejs.org/)からのストア)は**含まれません**。

これらの名前には、ラップする要素の名前が含まれることが多いです (例: `BaseButton`、`BaseTable` など)。ただし、特定の目的のための要素が存在しない場合(例: `BaseIcon`)はこの限りではありません。もし、より具体的なコンテキストで同様のコンポーネントを作成する場合には、ほとんどの場合にこれらのコンポーネントを使うことになるでしょう。(例えば、 `BaseButton` は `ButtonSubmit` で使用されるかもしれません)。

このルールの長所はいくつかあります:

- エディターでアルファベット順に並べられた時に、アプリの基本コンポーネントはすべて一緒にリストされ、識別しやすくなります。

- コンポーネントの名前は常に複数単語にするべきなので、このルールによって、シンプルなコンポーネントラッパーに任意のプレフィックスを選ばなければならない（例：`MyButton`、`VueButton`）ということがなくなります。

- これらのコンポーネントは頻繁に使用されるので、あらゆる場所で import するのではなく、単純にグローバル化してしまいたいと思うかもしれません。プレフィックスを利用すれば、Webpack で以下ができるようになります:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## 単一インスタンスのコンポーネント名 {#single-instance-component-names}

**常に1つのアクティブなインスタンスしかもたないコンポーネントは、1つしか存在しえないことをを示すために `The` という接頭辞で始めるべきです。**

これは、そのコンポーネントが 1 つのページでしか使われないということを意味するのではなく、 _ページごと_ に 1 回しか使われないという意味です。これらのコンポーネントは、アプリ内のコンテキストではなく、アプリに対して固有であるため、決してプロパティを受け入れることはありません。もしプロパティを追加する必要性があることに気づいたのなら、それは _現時点_ でページごとに 1 回しか使われていないだけで、実際には再利用可能なコンポーネントだということを示すよい目印です。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- Heading.vue
|- MySidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

</div>

## 密結合コンポーネントの名前 {#tightly-coupled-component-names}

**親コンポーネントと密結合した子コンポーネントには、親コンポーネントの名前をプレフィックスとして含むべきです。**

あるコンポーネントが、単一の親コンポーネントとの関係でのみ意味を持つ場合、その関係性はその名前からもわかるようにすべきです。エディターは通常、ファイルをアルファベット順に整理するため、関連するファイルを隣り合わせにすることもできます。

::: details 詳しい説明
この問題を、子コンポーネントを親コンポーネントと同じ名前のディレクトリーに入れ子にすることで解決したいと思うかもしれません。例えば:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

または:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

これは推奨されません。以下のような結果を生むからです:

- 同じような名前のファイルがたくさんできてしまい、コードエディター上で素早くファイルを切り替えるのが難しくなります。
- ネストしたサブディレクトリーがたくさんできてしまい、エディターのサイドバーでコンポーネントを参照するのに時間がかかるようになります。
  :::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## コンポーネント名における単語の順番 {#order-of-words-in-component-names}

**コンポーネント名は、最高レベルの(たいていは最も一般的な)単語から始めて、説明的な修飾語で終わるべきです。**

::: details 詳しい説明
あなたは疑問に思うかもしれません:

> "なぜコンポーネント名に自然な言語でないものを使うように強制するのですか？"

自然な英語では、形容詞やその他の記述子は一般的に名詞の前に置かれ、そうでない場合にはコネクターワードが必要になります。例えば:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

必要であれば、コンポーネント名にこれらのコネクターワードを含めてもかまいませんが、やはり順番が重要です。

また、**何を「最高レベル」として尊重するかは、アプリの文脈に依存することに注意してください**。例えば、検索フォームを持つアプリを想像してください。このようなコンポーネントが含まれるかもしれません:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

お気づきのように、どのコンポーネントが検索に特化しているかを確認するのはかなり困難です。では、ルールに従ってコンポーネントの名前を変えてみましょう。

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

一般的にエディターではファイルはアルファベット順に並ぶので、コンポーネント間のあらゆる重要な関連性はひと目ではっきりと分かります。

この問題を解決するために、すべての検索コンポーネントを「search」ディレクトリーの下に入れ、すべての設定コンポーネントを「settings」ディレクトリーの下に入れるという方法を取りたくなることがあります。この方法は、以下の理由から、非常に大規模なアプリ（例: 100 以上のコンポーネント）でのみ検討することをお勧めします。

- 一般的に、入れ子になったサブディレクトリーを移動するのは、単一の `components` ディレクトリをスクロールするよりも時間がかかります。
- 名前の衝突（例: 複数の `ButtonDelete.vue` コンポーネント）により、コードエディターで特定のコンポーネントに素早く移動することが難しくなります。
- 移動したコンポーネントへの相対参照を更新するには、検索と置換だけでは不十分な場合が多いため、リファクタリングはより困難になります。
  :::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## 自己終了形式のコンポーネント {#self-closing-components}

**コンテンツを持たないコンポーネントは、[単一ファイルコンポーネント](/guide/scaling-up/sfc.html)、文字列テンプレート、および [JSX](/guide/extras/render-function.html#jsx-tsx) では自己閉鎖されるべきですが、DOMテンプレート内ではそうしてはいけません。**

自己終了形式のコンポーネントは、単に中身を持たないだけでなく、中身を持たないことを**意図した**ことだとはっきりと表現します。これは、本の中にある白紙のページと、「このページは意図的に白紙のままにしてあります」と書かれたページとの違いです。また、不要な閉じタグがなくなるため、コードもすっきりします。

残念ながら、HTML はカスタム要素の自己終了形式を許可しているのは、[公式の「空」要素](https://www.w3.org/TR/html/syntax.html#void-elements)だけです。これが、Vue のテンプレートコンパイラーが DOM よりも先にテンプレートにアクセスして、その後 DOM の仕様に準拠した HTML を出力することができる場合にだけこの方策を使うことができる理由です。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<!-- 単一ファイルコンポーネント、文字列テンプレート、JSX の中 -->
<MyComponent></MyComponent>
```

```vue-html
<!-- DOM テンプレートの中 -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<!-- 単一ファイルコンポーネント、文字列テンプレート、JSX の中 -->
<MyComponent/>
```

```vue-html
<!-- DOM テンプレートの中 -->
<my-component></my-component>
```

</div>

## テンプレート内でのコンポーネント名の形式 {#component-name-casing-in-templates}

**ほとんどのプロジェクトにおいて、[単一ファイルコンポーネント](/guide/scaling-up/sfc.html)と文字列テンプレートの中では、コンポーネント名は常にパスカルケース(PascalCase)になるべきです。しかし、 DOM テンプレートの中ではケバブケース(kebab-case)です。**

パスカルケース（PascalCase）はケバブケース（kebab-case）に比べ、いくつかの利点があります:

- パスカルケースは JavaScript でも使用されるため、エディターはテンプレート内のコンポーネント名をオートコンプリートすることができます。
- `<MyComponent>` は ` <my-component>` よりも一単語の HTML 要素との見分けがつきやすいです。なぜなら、ハイフン 1 文字だけの違いではなく 2 文字(2 つの大文字) の違いがあるからです。
- もし、テンプレート内で、Vue 以外のカスタム要素(例: Web コンポーネントなど)を使っていたとしても、パスカルケースは Vue コンポーネントがはっきりと目立つことを保証します。

残念ですか、HTML は大文字と小文字の区別をしないため、DOM テンプレートではまだケバブケースを使用する必要があります。

ただし、もしあなたが既にケバブケースを大量に使っているのなら、HTML の規約との整合性や、すべてのプロジェクトで同じケーシングを使用できることが、上記の利点よりも重要な場合があることに注意してください。このような状況では、 **あらゆる場所でkebab-caseを使うことも許容されます。**

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<mycomponent/>
```

```vue-html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<myComponent/>
```

```vue-html
<!-- DOM テンプレートの中 -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<!-- 単一ファイルコンポーネント、文字列テンプレートの中 -->
<MyComponent/>
```

```vue-html
<!-- DOM テンプレートの中 -->
<my-component></my-component>
```

または

```vue-html
<!-- どこでも -->
<my-component></my-component>
```

</div>

## JS/JSX 内でのコンポーネント名の形式 {#component-name-casing-in-js-jsx}

**JS/[JSX](/guide/extras/render-function.html#jsx-tsx)内でのコンポーネント名は常にパスカルケース(PascalCase)にするべきです。ただし、`app.component` で登録したグローバルコンポーネントしか使わないような単純なアプリケーションでは、ケバブケース(kebab-case)を含む文字列になるかもしれません。**

::: details 詳しい説明
JavaScript では、クラスやプロトタイプのコンストラクターなど、基本的に個別のインスタンスを持つことができるすべてのもののためにパスカルケースを利用します。Vue のコンポーネントもインスタンスを持つので、パスカルケースを使用するのは理にかなっています。さらに、JSX（およびテンプレート）内でパスカルケースを使用すると、コードを読む人がコンポーネントと HTML 要素をより簡単に区別することができます。

しかし、`app.component` によるグローバルなコンポーネント定義**のみ**を使用するアプリケーションでは、代わりにケバブケース(kebab-case)を使用することをお勧めします。理由は以下の通りです。

- JavaScript でグローバルコンポーネントを参照することは稀であり、JavaScript の規約に従うことはあまり意味がありません。
- そのようなアプリケーションはたくさんの DOM 内テンプレートをもつのが常ですが、 そこでは [ケバブケースを**必ず**使う必要があります](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## 完全な単語によるコンポーネント名 {#full-word-component-names}

**コンポーネント名には、略語よりも完全な単語を使うべきです。**

長い名前によってもたらされる明快さは非常に貴重ですし、それをタイプする労力はエディターの自動補完によってとても小さくなります。特に、一般的でない略語は常に避けるべきです。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## プロパティ名の型式 {#prop-name-casing}

**プロパティ名は、定義の時は常にキャメルケース（camelCase）にするべきですが、テンプレートや[JSX](/guide/extras/render-function.html#jsx-tsx)ではケバブケース（kebab-case）にするべきです。**

私たちは単に各言語の慣習に従っているだけです。JavaScript の中ではキャメルケースがより自然で、HTML の中ではケバブケースが自然です。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
props: {
  'greeting-text': String
}
```

```vue-html
<WelcomeMessage greetingText="hi"/>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
props: {
  greetingText: String
}
```

```vue-html
<WelcomeMessage greeting-text="hi"/>
```

</div>

## 複数の属性をもつ要素 {#multi-attribute-elements}

**複数の属性をもつ要素は、1 行に 1 要素ずつ、複数の行にわたって書くべきです。**

JavaScript では、複数のプロパティをもつ要素を複数の行に分けて書くことはよい慣習だと広く考えられています。なぜなら、その方がより読みやすいからです。Vue のテンプレートや [JSX](/guide/extras/render-function.html#jsx-tsx)  も同じように考えることがふさわしいです。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## テンプレート内での単純な式 {#simple-expressions-in-templates}

**複雑な式は算出プロパティかメソッドにリファクタリングして、コンポーネントのテンプレートには単純な式だけを含むようにするべきです。**

テンプレート内に複雑な式があると、テンプレートが宣言的ではなくなります。私たちは**どのように**その値を算出するかではなく、**何が**表示されるべきかを記述するように努力するべきです。また、算出プロパティやメソッドによってコードが再利用できるようになります。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<!-- テンプレート内 -->
{{ normalizedFullName }}
```

```js
// 複雑な式を算出プロパティに移動
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

## 単純な算出プロパティ {#simple-computed-properties}

**複雑な算出プロパティは、できる限りたくさんの単純なプロパティに分割するべきです。**

::: details 詳しい説明
単純な、よい名前を持つ算出プロパティは:

- **テストしやすい**

  それぞれの算出プロパティが、依存がとても少ないごく単純な式だけを含む場合、それが正しく動くことを確認するテストを書くのがより簡単になります。

- **読みやすい**

  算出プロパティを単純にするということは、たとえそれが再利用可能ではなかったとしても、それぞれに分かりやすい名前をつけることになります。それによって、他の開発者(そして未来のあなた)が、注意を払うべきコードに集中し、何が起きているかを把握することがより簡単になります。

- **要求の変更を受け入れやすい**

  名前をつけることができる値は何でも、ビューでも役に立つ可能性があります。例えば、いくら割引になっているかをユーザーに知らせるメッセージを表示することに決めたとします。 また、消費税も計算して、最終的な価格の一部としてではなく、別々に表示することにします。

  小さく焦点が当てられた算出プロパティは、どのように情報が使われるかの決めつけをより少なくし、少しのリファクタリングで要求の変更を受け入れられます。
  :::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

## 引用符付きの属性値 {#quoted-attribute-values}

**空ではない HTML 属性の値は常に引用符(シングルコーテーションかダブルコーテーション、 JS の中で使われていない方)でくくるべきです。**

HTML では、空白を含まない属性値は引用符でくくらなくてもよいことになっていますが、そのせいで空白の使用を _避けてしまい_ 属性値が読みづらくなりがちです。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## ディレクティブの短縮記法 {#directive-shorthands}

**ディレクティブの短縮記法 (`v-bind:` に対する `:`、`v-on:` に対する `@`、`v-slot` に対する `#`)は、常に使うか、まったく使わないかのどちらかにするべきです。**

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```vue-html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```

</div>
