# アクセシビリティ

Web アクセシビリティ（a11y としても知られます）とは、障害のある人、回線速度が遅い人、古かったり壊れたハードウェアを使用している人、単に芳しくない環境にいる人など、誰でも利用できる Web サイトを作成することを指します。例えば、ビデオに字幕をつければ、耳の不自由なユーザーも、大音量の中で電話の音が聞こえないユーザーも、どちらも便利になります。同様に、テキストのコントラストが低すぎないようにすることで、弱視のユーザーにも、明るい日光の下で携帯電話を使おうとしているユーザーにも役立ちます。

始めたいけどどこから始めたらいいか分からない？

[World Wide Web Consortium (W3C)](https://www.w3.org/) が提供する [Web アクセシビリティの計画と管理ガイド](https://www.w3.org/WAI/planning-and-managing/)を確認してください。

## スキップリンク

各ページの上部にメインコンテンツに直接アクセスできるリンクを設け、ユーザーが複数の Web ページで繰り返されるコンテンツを読み飛ばせるようにする必要があります。

通常、これは `App.vue` の上部に置かれ、すべてのページで最初にフォーカス可能な要素になります:

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">メインコンテンツまでスキップする</a>
  </li>
</ul>
```

フォーカスされない限りリンクを非表示にするには、以下のようなスタイルを追加します:

```css
.skipLink {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skipLink:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

ユーザーがルートを変更したら、スキップリンクにフォーカスを戻します。これは、スキップリンクのテンプレート参照でフォーカスを呼び出すことで実現できます（`vue-router` の使用を想定しています）:

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[メインコンテンツへのスキップリンクに関するドキュメントを読む](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## コンテンツ構成

アクセシビリティの最も重要な要素のひとつは、デザインがアクセシブルな実装をサポートできることを確認することです。デザインは、色のコントラスト、フォントの選択、テキストサイズ、言語だけでなく、アプリケーションの中でコンテンツがどのように構成されているかも考慮する必要があります。

### 見出し

ユーザーは、見出しを頼りにアプリケーションを移動することができます。アプリケーションの各セクションに説明的な見出しがあれば、ユーザーは各セクションの内容を容易に予測することができます。見出しに関しては、推奨されるアクセシビリティの実践方法がいくつかあります:

- 見出しをその順番通りにネストさせる: `<h1>` - `<h6>`
- セクション内の見出しをスキップしない
- テキストにスタイリングすることで見出しのような外観を与えるのではなく、実際の見出しタグを使用する

[見出しについてもっと読む](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title">セクションタイトル</h2>
    <h3>セクションサブタイトル</h3>
    <!-- コンテンツ -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title">セクションタイトル</h2>
    <h3>セクションサブタイトル</h3>
    <!-- コンテンツ -->
    <h3>セクションサブタイトル</h3>
    <!-- コンテンツ -->
  </section>
</main>
```

### ランドマーク

[ランドマーク](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role)は、アプリケーション内のセクションへのプログラムによるアクセスを提供します。アシスティブ・テクノロジーに依存するユーザーは、アプリケーションの各セクションに移動し、コンテンツをスキップすることができます。これを実現するために、[ARIA ロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles)を使用できます。

| HTML            | ARIA ロール            | ランドマークの目的                                                                                                 |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | 第一の見出し: ページのタイトル                                                                                 |
| nav             | role="navigation"    | ドキュメントや関連ドキュメントを辿るためのリンク集                           |
| main            | role="main"          | ドキュメントの主要な、または中心となる内容。                                                                     |
| footer          | role="contentinfo"   | 親文章に関する情報: 脚注/著作権情報/プライバシーステートメントへのリンク                           |
| aside           | role="complementary" | メインコンテンツをサポートしつつ、独立して意味を持つコンテンツ                                    |
| _Not available_ | role="search"        | アプリケーションの検索機能を含むセクション                                               |
| form            | role="form"          | フォームに関連する要素のコレクション                                                                           |
| section         | role="region"        | 関連性がありユーザーが移動したくなるであろうコンテンツ。この要素にはラベルを付ける必要がある |

:::tip ヒント:
[HTML5 のセマンティック要素をサポートしていないレガシーブラウザー](https://caniuse.com/html5semantic)との互換性を最大化するために、助長なランドマークロール属性を持つランドマーク HTML 要素を使用することが推奨されています。
:::

[ランドマークについてもっと読む](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## セマンティックフォーム

フォームを作成する際、次の要素を使うことができます: `<form>`、 `<label>`、 `<input>`、 `<textarea>`、 `<button>`

ラベルは通常、フォームフィールドの上部または左側に配置されます:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Simple Form" slug="dyNzzWZ" :height="368" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

form 要素に `autocomplete='on'` を記述すると、フォーム内のすべての入力欄に適用されることに注意してください。各入力欄に対して異なる [autocomplete 属性の値](https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/autocomplete) を設定することもできます。

### ラベル

すべてのフォームコントロールの目的を説明するため、ラベルを用意しましょう。`for` と `id` をリンクします:

```vue-html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<!-- <common-codepen-snippet title="Form Label" slug="XWpaaaj" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Chrome DevTools でこの要素を検査し、Elements タブ内の Accessibility タブを開くと、入力欄がどのようにラベルから名付けられているか確認できます:

![Chrome DevTools が、入力欄がラベルから得たアクセシブルな名前を表示している](./images/AccessibleLabelChromeDevTools.png)

:::warning 注意:
このように入力フィールドをラップするラベルを見たことがあるかもしれません:

```vue-html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

一致する id を持つラベルを明示的に設定する方が、アシスティブ・テクノロジーでより良くサポートされます。
:::

#### `aria-label`

[`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) で入力欄にアクセシブルな名前を与えることもできます。

```vue-html
<label for="name">Name</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

<!-- <common-codepen-snippet title="Form ARIA label" slug="NWdvvYQ" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Chrome DevTools でこの要素を検査し、アクセシブルな名前がどのように変更されたか確認できます:

![Chrome DevTools が、入力欄が aria-label から得たアクセシブルな名前を表示している](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby`

[`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) は `aria-label` と似ていますが、ラベルテキストが画面上に表示されている場合に使用されます。他の要素とは `id` で対になっており、複数の `id` をリンクさせることができます:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Form ARIA labelledby" slug="MWJvvBe" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

![Chrome DevTools が、入力欄が aria-labelledby から得たアクセシブルな名前を表示している](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby`

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) は `aria-labelledby` と同じように使われますが、ユーザーが必要とするかもしれない追加の情報を含む説明を提供します。これはどのような入力欄に対しても、その基準を記述するために使用することができます:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Form ARIA describedby" slug="gOgxxQE" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

Chrome DevTools で検査することで、その説明文を確認することができます:

![Chrome DevTools が、入力欄に設定された aria-labelledby のアクセシブルな名前と、aria-describedby の説明文を表示している](./images/AccessibleARIAdescribedby.png)

### プレースホルダー

多くのユーザーを混乱させる可能性があるため、プレースホルダーの使用は避けてください。

プレースホルダーの問題点の 1 つは、デフォルトでは[カラーコントラスト基準](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)を満たしていないことです。カラーコントラストを修正すると、プレースホルダーは入力フィールドにあらかじめ入力されたデータのように見えるようになります。次の例を見ると、色のコントラスト基準を満たす Last Name プレースホルダーは、あらかじめ入力されたデータのように見えることがわかります:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<!-- <common-codepen-snippet title="Form Placeholder" slug="ExZvvMw" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

ユーザーがフォームを入力するのに必要な情報は、入力欄外で提供するとよいでしょう。

### インストラクション

入力フィールドにインストラクションを追加する場合は、入力欄に正しくリンクさせるようにしてください。
インストラクションを追加し、[`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) の中に複数の id をバインドすることができます。これにより、より柔軟なデザインが可能になります。

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

または、[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) で入力欄に説明文を付けることもできます:

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<!-- <common-codepen-snippet title="Form Instructions" slug="WNREEqv" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

### コンテンツの非表示

通常、たとえ入力欄がアクセシブルな名前を持っていても、ラベルを視覚的に非表示にすることは推奨されません。しかし、入力欄の機能が周囲の内容から理解できるのであれば、視覚的にラベルを非表示にすることができます。

この検索フィールドを見てみましょう:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

非表示にできるのは、検索ボタンが入力フィールドの目的を視覚的に明らかにしているからです。

要素を CSS で視覚的に非表示にしつつ、なおアシスティブ・テクノロジーからはそれを利用できます:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

<!-- <common-codepen-snippet title="Form Search" slug="QWdMqWy" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

#### `aria-hidden="true"`

`aria-hidden="true"` を追加すると、アシスティブ・テクノロジーから要素を隠しますが、その他のユーザーは視覚的に利用できます。フォーカス可能な要素、純粋に装飾的なコンテンツ、複製されたコンテンツ、画面外のコンテンツには使用しないでください。

```vue-html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### ボタン

フォーム内で button を使用する場合、フォームを送信しないようにするため type を設定する必要があります。
またはボタンを作成するために input を使用することもできます:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- ボタン -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input ボタン -->
  <input type="button" value="キャンセル" />
  <input type="submit" value="Submit" />
</form>
```

<!-- <common-codepen-snippet title="Form Buttons" slug="JjEyrYZ" :height="467" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

### 機能的な画像

このテクニックを使って、機能的な画像を作ることができます。

- 入力フィールド

  - これらの画像は、フォーム上で submit type のボタンとして機能します。

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- アイコン

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

<!-- <common-codepen-snippet title="Functional Images" slug="jOyLGqM" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" /> -->

## 標準規格

World Wide Web Consortium (W3C) の Web Accessibility Initiative (WAI) は、さまざまなコンポーネントの Web アクセシビリティ規格を策定しています:

- [ユーザーエージェントアクセシビリティガイドライン (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - Web ブラウザとメディアプレーヤー、アシスティブ・テクノロジーの観点を含む
- [オーサリングツールアクセシビリティガイドライン (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - オーサリングツール
- [Web コンテンツアクセシビリティガイドライン (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - Web コンテンツ - 開発者や、オーサリングツール、アクセシビリティ評価ツールが使用する

### Web コンテンツアクセシビリティガイドライン (WCAG)

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) は、[WCAG 2.0](https://www.w3.org/TR/WCAG20/) を拡張し、Web の変化に対応することで、新しい技術の実装を可能にするものです。W3C は、Web アクセシビリティ方針を策定又は更新する際に、最新版の WCAG を使用することを推奨しています。

#### WCAG 2.1 四つの原則:

- [知覚可能](https://www.w3.org/TR/WCAG21/#perceivable)
  - 表示されている情報は、利用者が知覚できなければならない
- [操作可能](https://www.w3.org/TR/WCAG21/#operable)
  - インターフェースフォーム、コントロール、ナビゲーションは操作可能でなければならない
- [理解可能](https://www.w3.org/TR/WCAG21/#understandable)
  - 情報及びユーザーインターフェースの操作は全ての利用者に理解可能でなければならない
- [堅牢](https://www.w3.org/TR/WCAG21/#robust)
  - テクノロジーが進歩しても、利用者はコンテンツにアクセスできなければならない

#### Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA)

W3C の WAI-ARIA は、動的コンテンツや高度なユーザーインターフェイスコントロールの構築方法に関するガイダンスを提供しています。

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA オーサリングプラクティス 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## リソース

### 資料

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA オーサリングプラクティス 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### アシスティブ・テクノロジー

- スクリーンリーダー
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- 拡大ツール
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.zoomtext.com/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### テスト

- 自動化ツール
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- カラーツール
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- その他の便利なツール
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [Focus Indicator](https://chrome.google.com/webstore/detail/focus-indicator/heeoeadndnhebmfebjccbhmccmaoedlf?hl=en-US…)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)

### ユーザー

世界保健機関 (WHO) は、世界人口の 15% が何らかの障害を持ち、そのうち 2-4% が重度であると推定しています。これは全世界で 10 億人と推定され、障害者は世界最大のマイノリティーグループとなっています。

障害の範囲は非常に多く、大きく 4 つに分類されます。

- _[視覚](https://webaim.org/articles/visual/)_ - このようなユーザーは、スクリーンリーダー、画面拡大表示、画面コントラスト制御、点字表示の使用が有効です。
- _[聴覚](https://webaim.org/articles/auditory/)_ - このようなユーザーには、キャプション、字幕、手話映像が有効です。
- _[肢体](https://webaim.org/articles/motor/)_ - このようなユーザーは、音声認識ソフトウェア、アイトラッキング、シングルスイッチアクセス、頭部装着型指示器、息操作スイッチ、特大トラックボールマウス、アダプティブキーボード、その他のアシスティブ・テクノロジーなど、さまざまな[肢体障害支援技術](https://webaim.org/articles/motor/assistive)の使用が有効です。
- _[認知](https://webaim.org/articles/cognitive/)_ - このようなユーザーには、補足的なメディア、構造的なコンテンツ、明確でシンプルな文章が有効です。

WebAim の以下のリンクをチェックして、ユーザーの理解を深めましょう:

- [Web アクセシビリティの視点: すべての人にとっての影響と利点を探る](https://www.w3.org/WAI/perspective-videos/)
- [Web ユーザーのストーリー](https://www.w3.org/WAI/people-use-web/user-stories/)
