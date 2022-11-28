# ビルトインのディレクティブ {#built-in-directives}

## v-text {#v-text}

要素のテキスト内容を更新します。

- **期待する値:** `string`

- **詳細**

  `v-text` は要素の [textContent](https://developer.mozilla.org/ja/docs/Web/API/Node/textContent) プロパティをセットする動作なので、要素内の既存のコンテンツはすべて上書きされます。`textContent` の一部を更新する必要がある場合は、代わりに[マスタッシュ展開](/guide/essentials/template-syntax.html#text-interpolation)を使用します。

- **例**

  ```vue-html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **参照:** [テンプレート構文 - テキスト展開](/guide/essentials/template-syntax.html#text-interpolation)

## v-html {#v-html}

要素の [innerHTML](https://developer.mozilla.org/ja/docs/Web/API/Element/innerHTML) を更新します。

- **期待する値:** `string`

- **詳細:**

  `v-html` の内容は、プレーンな HTML として挿入されます - Vue テンプレートの構文は処理されません。もし、`v-html` を使ってテンプレートを構成しようとしているのであれば、代わりにコンポーネントを使うなどして解決策を見直してみてください。

  ::: warning セキュリティーに関する注意
  ウェブサイト上で任意の HTML を動的にレンダリングすることは、[XSS 攻撃](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)につながりやすいため、非常に危険です。信頼できるコンテンツにのみ `v-html` を使用し、ユーザーが提供するコンテンツには**絶対に**使用しないでください。
  :::

  [単一ファイルコンポーネント](/guide/scaling-up/sfc)では、`scoped` スタイルは `v-html` 内のコンテンツには適用されません。これは、その HTML が Vue のテンプレートコンパイラーによって処理されないからです。もし `v-html` のコンテンツにスコープ付き CSS を適用したい場合は、代わりに [CSS modules](./sfc-css-features.html#css-modules) を使ったり、BEM などの手動スコープ戦略を持つ追加のグローバル `<style>` 要素を使用可能です。

- **例:**

  ```vue-html
  <div v-html="html"></div>
  ```

- **参照:** [テンプレート構文 - 生の HTML](/guide/essentials/template-syntax.html#raw-html)

## v-show {#v-show}

式の値の真偽に基づいて、要素の可視性を切り替えます。

- **期待する値:** `any`

- **詳細**

  `v-show` はインラインスタイルで `display` CSS プロパティをセットする動作で、要素が表示されている場合は `display` の初期値を尊重しようとします。また、その状態が変化したときにトランジションを引き起こします。

- **参照:** [条件付きレンダリング - v-show](/guide/essentials/conditional.html#v-show)

## v-if {#v-if}

式の値の真偽に基づいて、要素またはテンプレートフラグメントを条件付きでレンダリングします。

- **期待する値:** `any`

- **詳細**

  `v-if` 要素がトグルされると、要素とそれに含まれるディレクティブ/コンポーネントは破棄され、再構築されます。初期条件が falsy な場合、内部のコンテンツは全くレンダリングされません。

  `<template>` に使用すると、テキストのみ、または複数の要素を含む条件ブロックを表すことができます。

  このディレクティブは、条件が変化したときにトランジションをトリガーします。

  一緒に使用した場合、 `v-if` は `v-for` よりも高い優先度を持ちます。この 2 つのディレクティブを 1 つの要素で同時に使うことはお勧めしません。詳しくは [リストレンダリングガイド](/guide/essentials/list.html#v-for-with-v-if) を参照してください。

- **参照:** [条件付きレンダリング - v-if](/guide/essentials/conditional.html#v-if)

## v-else {#v-else}

`v-if` または `v-if` / `v-else-if` チェーンの「else ブロック」を表します。

- **式を受け取りません**

- **詳細**

  - 制限: 直前の兄弟要素には `v-if` または `v-else-if` が必要です。

  - `<template>` に使用すると、テキストのみ、または複数の要素を含む条件ブロックを表すことができます。

- **例**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **参照:** [条件付きレンダリング - v-else](/guide/essentials/conditional.html#v-else)

## v-else-if {#v-else-if}

`v-if` の「else if ブロック」を表します。連鎖させることができます。

- **期待する値:** `any`

- **詳細**

  - 制限: 直前の兄弟要素には `v-if` または `v-else-if` が必要です。

  - `<template>` に使用すると、テキストのみ、または複数の要素を含む条件ブロックを表すことができます。

- **例**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **参照:** [条件付きレンダリング - v-else-if](/guide/essentials/conditional.html#v-else-if)

## v-for {#v-for}

元となるデータに基づいて、要素またはテンプレートブロックを複数回レンダリングします。

- **期待する値:** `Array | Object | number | string | Iterable`

- **詳細**

  ディレクティブの値は、反復処理されている現在の要素のエイリアスを提供するために、特別な構文 `エイリアス in 式` を使用する必要があります:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  または、インデックス（Object で使用する場合はキー）のエイリアスも指定できます:

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` のデフォルトの動作は、要素を移動することなく、その場でパッチを適用しようとします。強制的に要素を並べ替えるには、特別な属性 `key` で順番のヒントを指定する必要があります:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  また、`v-for` はネイティブの `Map` や `Set` を含む、[反復処理プロトコル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)を実装した値に対しても動作させることができます。

- **参照:**
  - [リストレンダリング](/guide/essentials/list.html)

## v-on {#v-on}

要素にイベントリスナーを追加します。

- **省略記法:** `@`

- **期待する値:** `Function | Inline Statement | Object (without argument)`

- **引数:** `event`（オブジェクト構文を使用する場合は省略可能）

- **修飾子:**

  - `.stop` - `event.stopPropagation()` を呼び出します。
  - `.prevent` - `event.preventDefault()` を呼び出します。
  - `.capture` - キャプチャーモードでイベントリスナーを追加します。
  - `.self` - イベントがこの要素からディスパッチされた場合にのみハンドラーをトリガーします。
  - `.{keyAlias}` - 特定のキーでのみハンドラーをトリガーします。
  - `.once` - 一度だけハンドラーをトリガーします。
  - `.left` - 左ボタンのマウスイベントに対してのみ、ハンドラーをトリガーします。
  - `.right` - 右ボタンのマウスイベントに対してのみ、ハンドラーをトリガーします。
  - `.middle` - 中央ボタンのマウスイベントに対してのみ、ハンドラーをトリガーします。
  - `.passive` - DOM イベントを `{ passive: true }` で追加します。

- **詳細**

  イベントの種類は引数で示されます。式はメソッド名かインラインステートメントで、修飾子が存在する場合は省略可能です。

  通常の要素で使用する場合、[**ネイティブ DOM イベント**](https://developer.mozilla.org/ja/docs/Web/Events)のみを購読します。カスタム要素コンポーネントで使用された場合、その子コンポーネントで発行された**カスタムイベント**を購読します。

  ネイティブ DOM イベントを購読する場合、このメソッドは唯一の引数としてネイティブイベントを受け取ります。インラインステートメントを使用する場合、ステートメントは特別な `$event` プロパティにアクセスできます: `v-on:click="handle('ok', $event)"`

  `v-on` は引数なしで、イベントとリスナーのペアのオブジェクトにバインドすることもサポートしています。オブジェクト構文を使用する場合、修飾子をサポートしないことに注意してください。

- **例:**

  ```vue-html
  <!-- メソッドハンドラー -->
  <button v-on:click="doThis"></button>

  <!-- 動的イベント -->
  <button v-on:[event]="doThis"></button>

  <!-- インラインステートメント -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- 省略記法 -->
  <button @click="doThis"></button>

  <!-- 動的イベントの省略記法 -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- 式なしで prevent default -->
  <form @submit.prevent></form>

  <!-- 修飾子の連鎖 -->
  <button @click.stop.prevent="doThis"></button>

  <!-- キーのエイリアスを用いたキー修飾子 -->
  <input @keyup.enter="onEnter" />

  <!-- 一度だけトリガーされるクリックイベント -->
  <button v-on:click.once="doThis"></button>

  <!-- オブジェクト構文 -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  子コンポーネントのカスタムイベントを購読する（子コンポーネントで "my-event" が発行されたときにハンドラーが呼び出される）:

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- インラインステートメント -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **参照:**
  - [イベントハンドリング](/guide/essentials/event-handling.html)
  - [コンポーネント - カスタムイベント](/guide/essentials/component-basics.html#listening-to-events)

## v-bind {#v-bind}

1 つ以上の属性やコンポーネントのプロパティを式に動的にバインドします。

- **省略記法:** `:` or `.`（`.prop` 修飾子使用時）

- **期待する値:** `any（引数ありの場合） | Object（引数なしの場合）`

- **引数:** `attrOrProp（省略可能）`

- **修飾子:**

  - `.camel` - kebab-case の属性名を camelCase に変換します。
  - `.prop` - バインディングを DOM プロパティとして設定するよう強制します。<sup class="vt-badge">3.2+</sup>
  - `.attr` - バインディングを DOM 属性として設定するよう強制します。<sup class="vt-badge">3.2+</sup>

- **使用法:**

  `class` や `style` 属性をバインドする際に使用する `v-bind` は、Array や Object などの追加の値の型をサポートします。詳しくは、以下のリンク先のガイドを参照してください。

  要素にバインディングを設定するとき、Vue はデフォルトで、`in` 演算子チェックを使用して、プロパティとして定義されたキーが要素にあるかどうかを確認します。プロパティが定義されている場合、Vue はその値を属性ではなく DOM プロパティとして設定します。これはほとんどの場合において有効ですが、`.prop` や `.attr` という修飾子を明示的に使用することでこの動作をオーバーライドできます。これは、特に[カスタム要素を扱う](/guide/extras/web-components.html#passing-dom-properties)ときに必要になることがあります。

  コンポーネントのプロパティをバインドするために使用する場合、そのプロパティは子コンポーネントで適切に宣言されている必要があります。

  引数なしで使用する場合、属性の名前と値のペアを含むオブジェクトをバインドするために使用できます。

- **例:**

  ```vue-html
  <!-- 属性をバインドする -->
  <img v-bind:src="imageSrc" />

  <!-- 動的な属性名 -->
  <button v-bind:[key]="value"></button>

  <!-- 省略記法 -->
  <img :src="imageSrc" />

  <!-- 動的な属性名の省略記法 -->
  <button :[key]="value"></button>

  <!-- インラインの文字列連結 -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- クラスのバインド -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- スタイルのバインド -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- 属性のオブジェクトをバインド -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- プロパティのバインド。"prop" は子コンポーネントで宣言する必要があります。 -->
  <MyComponent :prop="someThing" />

  <!-- 親のプロパティを子コンポーネントと共有するために渡す -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  `.prop` 修飾子には、専用の短縮形 `.` もあります:

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- 以下とと同じ -->
  <div .someProperty="someObject"></div>
  ```

  `.camel` 修飾子は、DOM 内テンプレートを使用する際に、 `v-bind` 属性名をキャメル化できます（例: SVG の `viewBox` 属性）:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  文字列テンプレートを使用する場合や、ビルドステップでテンプレートを事前コンパイルする場合は、`.camel` は必要ありません。

- **参照:**
  - [クラスとスタイルのバインディング](/guide/essentials/class-and-style.html)
  - [コンポーネント - プロパティ渡しの詳細](/guide/components/props.html#prop-passing-details)

## v-model {#v-model}

フォーム入力要素またはコンポーネントに双方向バインディングを作成します。

- **期待する値:** フォームの入力要素の値や構成要素の出力によって異なります

- **以下に限定:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - コンポーネント

- **修飾子:**

  - [`.lazy`](/guide/essentials/forms.html#lazy) - `input` の代わりに `change` イベントを購読する
  - [`.number`](/guide/essentials/forms.html#number) - 有効な入力文字列を数値に変換する
  - [`.trim`](/guide/essentials/forms.html#trim) - 入力をトリムする

- **参照:**

  - [フォーム入力バインディング](/guide/essentials/forms.html)
  - [コンポーネントのイベント - `v-model` での使用](/guide/components/events.html#usage-with-v-model)

## v-slot {#v-slot}

props の受け取りを期待する名前付きスロットまたはスコープ付きスロットを表します。

- **省略記法:** `#`

- **期待する値:** 関数の引数の位置で有効な JavaScript 式（分割代入のサポートを含む）。省略可能 - props がスロットに渡されることを期待している場合のみ必要です。

- **引数:** スロット名（省略可能で、デフォルトは `default`）

- **以下に限定:**

  - `<template>`
  - [コンポーネント](/guide/components/slots.html#scoped-slots)（props ありの単独のデフォルトスロット用）

- **例:**

  ```vue-html
  <!-- 名前付きスロット -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- props を受け取る名前付きスロット -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- props を受け取るデフォルトスロット、分割代入あり -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **参照:**
  - [コンポーネント - スロット](/guide/components/slots.html)

## v-pre {#v-pre}

この要素とすべての子要素のコンパイルをスキップします。

- **式を受け取りません**

- **詳細**

  `v-pre` を指定した要素の内部では、Vue テンプレートの構文はすべて維持され、そのままレンダリングされます。この最も一般的な使用例は、未加工のマスタッシュタグを表示することです。

- **例:**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once {#v-once}

要素やコンポーネントを一度だけレンダリングし、その後の更新はスキップします。

- **式を受け取りません**

- **詳細**

  その後の再レンダリングでは、要素/コンポーネントとそのすべての子要素は静的コンテンツとして扱われ、スキップされます。これは、更新のパフォーマンスを最適化するために使用できます。

  ```vue-html
  <!-- 単一要素 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 子要素を持つ要素 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- コンポーネント -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- `v-for` ディレクティブ -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  3.2 以降では、[`v-memo`](#v-memo) を使って、テンプレートの一部を無効化する条件付きでメモ化できます。

- **参照:**
  - [データバインディング構文 - 展開](/guide/essentials/template-syntax.html#text-interpolation)
  - [v-memo](#v-memo)

## v-memo <sup class="vt-badge" data-text="3.2+" /> {#v-memo}

- **期待する値:** `any[]`

- **詳細**

  テンプレートのサブツリーをメモ化します。要素とコンポーネントの両方で使用できます。このディレクティブは、メモ化のために比較する依存関係の値の固定長の配列を受け取ります。配列内のすべての値が直前のレンダリングと同じであった場合、サブツリー全体の更新はスキップされます。たとえば:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  コンポーネントの再レンダリング時に、 `valueA` と `valueB` の両方が同じであれば、この `<div>` とその子のすべての更新はスキップされます。実際には、仮想 DOM の VNode の生成もスキップされます。なぜなら、サブツリーのメモ化されたコピーを再利用できるからです。

  メモ化の配列を正しく指定することは重要であり、そうでない場合は、実際に適用されるべき更新をスキップしてしまう可能性があります。依存関係の配列を空にした `v-memo`（`v-memo="[]"`）は、機能的には `v-once` と同等です。

  **`v-for` での使用**

  `v-memo` は、パフォーマンスが重要なシナリオでのミクロな最適化を行うためにのみ提供されており、ほとんど必要ありません。この機能が役に立つ最も一般的なケースは、大きな `v-for` リスト（`length > 1000`）をレンダリングするときです:

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  コンポーネントの `selected` 状態が変化すると、ほとんどの項目がまったく同じままであっても、大量の VNode が作成されます。ここでの `v-memo` の使い方は、基本的に「非選択状態から選択状態になった場合のみ、またはその逆の場合のみ、この項目を更新する」というものです。これにより、影響を受けない項目はすべて以前の VNode を再利用し、差分を完全にスキップできます。メモの依存関係の配列に `item.id` を含める必要はないことに注意してください。Vue は自動的に項目の `:key` から推測します。

  :::warning
  `v-memo` と `v-for` を併用する場合は、同じ要素で使用されているか確認してください。**`v-memo` は `v-for` の中では動作しません。**
  :::

  子コンポーネントの更新チェックが最適化されていない特定のエッジケースで、不要な更新を手動で防ぐために `v-memo` をコンポーネントに使用できます。しかし、ここでも、必要な更新をスキップしないように正しい依存関係を指定するのは、開発者の責任です。

- **参照:**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

コンパイルされていないテンプレートを、準備が整うまで非表示にするために使用します。

- **式を受け取りません**

- **詳細**

  **このディレクティブは、ビルドステップがないセットアップでのみ必要です。**

  DOM 内テンプレートを使用する場合、「コンパイルされていないテンプレートのフラッシュ」が発生することがあります。マウントされたコンポーネントがそれをレンダリングされたコンテンツに置き換えるまで、未加工のマスタッシュタグがユーザーに表示される場合があります。

  `v-cloak` は関連するコンポーネントインスタンスがマウントされるまで、その要素に残ります。`[v-cloak] { display: none }` のような CSS ルールと組み合わせることで、コンポーネントの準備が整うまで未加工のテンプレートを非表示にできます。

- **例:**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  この `<div>` はコンパイルが完了するまで表示されません。
