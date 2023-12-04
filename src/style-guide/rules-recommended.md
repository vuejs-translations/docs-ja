# 優先度 C: 推奨 {#priority-c-rules-recommended}

同じくらい良いオプションが複数ある場合、一貫性を確保するために任意の選択をできます。これらのルールでは、それぞれ許容可能なオプションを説明し、既定の選択を提案します。つまり、一貫性があり、良い理由を持ち続ける限り、独自のコードベースで自由に異なる選択肢を作ることができます。ですが、良い理由はあるのでしょうか！コミュニティーの標準に合わせることで、あなたは:

1. 直面するコミュニティーのコードを容易に理解できるように脳を慣れさせます。
2. ほとんどのコミュニティーのコードサンプルを変更なしにコピーして貼り付ける事ができます。
3. 少なくとも Vue に関しては、ほとんどの場合、新たな人材はあなたのコーディングスタイルよりも既に慣れ親しんだものを好みます。

## コンポーネント/インスタンスオプションの順番 {#component-instance-options-order}

**コンポーネント/インスタンスのオプションは、一貫した順序で並べる必要があります**

これは、コンポーネントのオプションに推奨されるデフォルトの順序です。カテゴリーに分かれているので、プラグインから新しいプロパティを追加する場所がわかるでしょう。

1. **グローバルな意識** (コンポーネントを超えた知識を必要とする)

   - `name`

2. **テンプレートコンパイラのオプション** (テンプレートのコンパイル方法を変更する)

   - `compilerOptions`

3. **テンプレートの依存関係** (テンプレートで使用されているアセット)

   - `components`
   - `directives`

4. **構成** (プロパティをオプションにマージする)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **インターフェース** (コンポーネントへのインタフェース)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (Composition API を使用するためのエントリーポイント)

   - `setup`

7. **ローカルステート** (ローカルのリアクティブなプロパティ)

   - `data`
   - `computed`

8. **イベント** (リアクティブイベントにトリガーされるコールバック)

   - `watch`
   - ライフサイクルイベント (呼び出される順番)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **リアクティブでないプロパティ** (リアクティビティーシステムに依存しないインスタンスプロパティ)

   - `methods`

10. **レンダリング** (コンポーネント出力の宣言的記述)
    - `template`/`render`

## 要素属性の順序 {#element-attribute-order}

**要素（構成要素を含む）の属性は、一貫した順序で並べる必要があります。**

これは、コンポーネント・オプションに推奨されるデフォルトの順序です。カテゴリーに分かれているので、カスタム属性やディレクティブをどこに追加すればいいのかがわかります。

1. **定義** (コンポーネント・オプションを提供する)

   - `is`

2. **リストレンダリング** (同じ要素を複数のバリエーションで作成する)

   - `v-for`

3. **条件分岐** (要素がレンダリング/表示されているかどうか)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **レンダリングモディファイア** (要素のレンダリング方法を変更する)

   - `v-pre`
   - `v-once`

5. **グローバルアウェアネス** (コンポーネントを超えた知識を必要とします)

   - `id`

6. **ユニークな属性** (一意な値を必要とする属性)

   - `ref`
   - `key`

7. **双方向バインディング** (バインディングとイベントの組み合わせ)

   - `v-model`

8. **その他の属性** (すべての不特定のバインドされた/バインドされない属性)

9. **イベント** (コンポーネントイベントリスナー)

   - `v-on`

10. **コンテンツ** (要素の内容を上書きする)
    - `v-html`
    - `v-text`

## コンポーネント/インスタンスのオプションに空白行がある {#empty-lines-in-component-instance-options}

**特に、スクロールしないと画面に収まらないようなオプションの場合、複数行のプロパティの間に 1 行空行を追加するとよいでしょう。**

コンポーネントが窮屈に感じられたり、読みにくくなったりした場合、複数行のプロパティの間にスペースを追加することで、再び読み飛ばしやすくできます。Vim などのエディターでは、このような書式設定オプションにより、キーボードでの操作を容易にすることもできます。

<div class="options-api">

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
// コンポーネントが読みやすく操作しやすければ、
// スペースなしでも構いません。
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## 単一ファイルコンポーネントのトップレベル要素の順序 {#single-file-component-top-level-element-order}

**[単一ファイルコンポーネント](/guide/scaling-up/sfc)では、 `<script>`, `<template>`, `<style>` タグの順番は常に一定で、 `<style>` は最後にする必要があります。なぜなら他の二つのうち少なくとも一つは常に必要だからです。**

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
