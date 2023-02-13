# コンポーネントの基礎 {#components-basics}

コンポーネントによって UI を独立した再利用可能なピースに分割し、それぞれのピースを切り離して考えることができるようになります。アプリケーションはネストされたコンポーネントのツリーによって構成されているのが一般的です:

![コンポーネントツリー](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

これは、ネイティブの HTML 要素をネストする方法ととてもよく似ていますが、Vue は独自のコンポーネントモデルを実装しており、各コンポーネントのカスタムコンテンツとロジックをカプセル化することができます。 Vue はまた、ネイティブの Web コンポーネントとうまく連携しています。 Vue コンポーネントとネイティブの Web コンポーネントの関係について興味があるようでしたら[こちらを参照してください](/guide/extras/web-components.html)。

## コンポーネントの定義 {#defining-a-component}

ビルドステップを使用する場合は通常、各 Vue コンポーネントは専用のファイルで `.vue` 拡張子を使用して定義します。これは [単一ファイルコンポーネント](/guide/scaling-up/sfc.html)（略して SFC）として知られています:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

ビルドステップを使用しない場合、Vue コンポーネントは Vue 固有のオプションを含むプレーンな JavaScript オブジェクトとして定義することができます:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // もしくは `template: '#my-template-element'`
}
```

</div>

テンプレートは、ここで JavaScript の文字列としてインライン化され、Vue がその場でコンパイルします。また、ID セレクターを使って要素を指定（通常はネイティブの `<template>` 要素）することもできます。 Vue はそのコンテンツをテンプレート・ソースとして使用します。

上記の例では 1 つのコンポーネントを定義し、それを `.js` ファイルのデフォルトエクスポートとしてエクスポートしていますが、名前付きエクスポートを使用すると、同じファイルから複数のコンポーネントをエクスポートすることができます。

## コンポーネントの使用 {#using-a-component}

:::tip
このガイドの残りの部分では SFC 構文を使用します。コンポーネントに関するコンセプトは、ビルドステップを使用するかどうかに関係なく、同じものです。[サンプル](/examples/)セクションでは、両方のシナリオでのコンポーネントの使い方をお見せしています。
:::

子コンポーネントを使用するには、親コンポーネントでインポートする必要があります。カウントするコンポーネントを `ButtonCounter.vue` というファイル内に配置したとすると、このコンポーネントはそのファイルのデフォルトエクスポートとして公開されます:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

インポートしたコンポーネントをテンプレートに公開するには、`components` オプションでコンポーネントを[登録](/guide/components/registration.html)する必要があります。これにより、そのコンポーネントは登録されたキーを使ってタグとして利用できるようになります。

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

`<script setup>` と共に使用すると、インポートしたコンポーネントは自動的にテンプレートで使用できるようになります。

</div>

また、コンポーネントをグローバル登録することで、インポートすることなくアプリケーション内のすべてのコンポーネントで利用できるようにすることもできます。グローバル登録とローカル登録のメリットとデメリットは、専用の[コンポーネントの登録](/guide/components/registration.html)セクションで説明されています。

コンポーネントは好きなだけ、何度でも再利用可能です:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG4gIFxuZXhwb3J0IGRlZmF1bHQge1xuICBjb21wb25lbnRzOiB7XG4gICAgQnV0dG9uQ291bnRlclxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50OiAwXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBCdXR0b25Db3VudGVyIGZyb20gJy4vQnV0dG9uQ291bnRlci52dWUnXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8aDE+SGVyZSBhcmUgbWFueSBjaGlsZCBjb21wb25lbnRzITwvaDE+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG5cdDxCdXR0b25Db3VudGVyIC8+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJCdXR0b25Db3VudGVyLnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGNvdW50ID0gcmVmKDApXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8YnV0dG9uIEBjbGljaz1cImNvdW50KytcIj5cbiAgICBZb3UgY2xpY2tlZCBtZSB7eyBjb3VudCB9fSB0aW1lcy5cbiAgPC9idXR0b24+XG48L3RlbXBsYXRlPiJ9)

</div>

ボタンをクリックすると、それぞれが別の `count` を維持することに注意してください。これは、コンポーネントを使用するたびに、新しい**インスタンス**が作成されるからです。

SFC では、ネイティブの HTML 要素と区別するために、子コンポーネントに `パスカルケース` のタグ名を使用することが推奨されます。ネイティブの HTML のタグ名は大文字小文字を区別しませんが、Vue の SFC はコンパイルされたフォーマットなので、大文字小文字を区別するタグ名を使うことができます。また、タグを閉じるために `/>` を使用することができます。

テンプレートを DOM で直接作成する場合（例えば、ネイティブの `<template>` 要素のコンテンツとして）、テンプレートはブラウザのネイティブな HTML パース動作に従います。そのような場合には、`ケバブケース` を使用してコンポーネントにクロージングタグを明示する必要があります:

```vue-html
<!-- DOM の中にテンプレートが書かれた場合 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

詳細は [DOM テンプレート解析の注意点](#dom-テンプレート解析の注意点)を参照ください。

## プロパティの受け渡し {#passing-props}

ブログを構築する場合、ブログの記事を表示するコンポーネントが必要になるかと思います。すべてのブログ記事が同じレイアウトで表示されるようにしたいのですが、コンテンツは異なっています。このようなコンポーネントは、表示したい特定の記事のタイトルや内容などのデータを渡すことができない限り役に立ちません。そこでプロパティの出番です。

プロパティはコンポーネントに登録できるカスタム属性のことです。ブログ記事コンポーネントにタイトルを渡すには、<span class="options-api">[`props`](/api/options-state.html#props) オプション</span><span class="composition-api">[`defineProps`](/api/sfc-script-setup.html#defineprops-defineemits) マクロ</span>を使って、このコンポーネントが受け取るプロパティのリストを宣言する必要があります:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

props 属性に値が渡されると、その値はコンポーネントインスタンスのプロパティになります。プロパティの値は、他のコンポーネントプロパティと同様に、テンプレートの中やコンポーネントの `this` コンテキストでアクセスすることができます。

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` はコンパイル時のマクロで `<script setup>` 内でのみ利用可能であり、明示的にインポートする必要はありません。宣言されたプロパティは、自動的にテンプレートに公開されます。また、`defineProps` はコンポーネントに渡されたすべてのプロパティを含むオブジェクトを返すので、必要に応じて JavaScript 内でアクセスすることができます:

```js
const props = defineProps(['title'])
console.log(props.title)
```

参照:[コンポーネントプロパティの型付け](/guide/typescript/composition-api.html#typing-component-props) <sup class="vt-badge ts" />

`<script setup>` を使わない場合、プロパティは `props` オプションで宣言する必要があり、props オブジェクトは `setup()` の第 1 引数として渡されます:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

コンポーネントは好きなだけプロパティを持つことができ、デフォルトでどんな値でも、どのプロパティにも渡すことができます。

プロパティが登録されると、以下のようにカスタム属性としてデータを渡すことができるようになります:

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

しかしながら、一般的なアプリケーションでは親コンポーネントに投稿の配列があることが多いでしょう:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

</div>

このように各コンポーネントをレンダリングしたい場合は、`v-for` を使用します:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQ+XG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BzOiBbJ3RpdGxlJ11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoND57eyB0aXRsZSB9fTwvaDQ+XG48L3RlbXBsYXRlPiJ9)

</div>
<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxCbG9nUG9zdFxuICBcdHYtZm9yPVwicG9zdCBpbiBwb3N0c1wiXG5cdCAgOmtleT1cInBvc3QuaWRcIlxuICBcdDp0aXRsZT1cInBvc3QudGl0bGVcIlxuXHQ+PC9CbG9nUG9zdD5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

動的なプロパティの値を渡すために `v-bind` がどう使用されているかに注目してください。これは、レンダリングするコンテンツを事前に正確に把握していない場合に特に役立ちます。

プロパティについては以上となりますが、このページを読み終え内容に慣れてきたら、後ほど[プロパティ](/guide/components/props.html)の完全ガイドを読みにくることをおすすめします。

## イベントの購読 {#listening-to-events}

`<BlogPost>` コンポーネントを開発していく中で、いくつかの機能については、親コンポーネントへの通信が必要になるかもしれません。例えば、ブログ記事のテキストを拡大し、ページの残りの部分はデフォルトのサイズのままにしておくアクセシビリティー機能を含めることにするかもしれません。

親コンポーネントの中では、`postFontSize` という <span class="options-api">data property</span><span class="composition-api">ref</span> を追加することで、この機能をサポートできます:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

これは、テンプレート内で使用することができ、すべてのブログ記事のフォントサイズを制御することができます:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

では、`<BlogPost>` コンポーネントのテンプレートにボタンを追加してみましょう:

```vue{5}
<!-- BlogPost.vue, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

ボタンはまだ何もしません。クリックするとすべての投稿のテキストを拡大表示するように親に伝達したいです。この問題を解決するために、コンポーネントはカスタムイベントシステムを提供します。親は子コンポーネントインスタンス上の任意のイベントを、ちょうどネイティブの DOM イベントのように `v-on` または `@` で購読できます:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

そして、子コンポーネントは組み込みの [**`$emit`** メソッド](/api/component-instance.html#emit)を呼び出し、イベント名を渡すことによって自身のイベントを発行することができます:

```vue{5}
<!-- BlogPost.vue, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

`enlarge-text="postFontSize += 0.1"` リスナーのおかげで、親はイベントを受け取り `postFontSize` の値を更新することができます。

<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHtcbiAgICBCbG9nUG9zdFxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0czogW1xuICAgICAgICB7IGlkOiAxLCB0aXRsZTogJ015IGpvdXJuZXkgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDIsIHRpdGxlOiAnQmxvZ2dpbmcgd2l0aCBWdWUnIH0sXG4gICAgICAgIHsgaWQ6IDMsIHRpdGxlOiAnV2h5IFZ1ZSBpcyBzbyBmdW4nIH1cbiAgICAgIF0sXG4gICAgICBwb3N0Rm9udFNpemU6IDFcbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgOnN0eWxlPVwieyBmb250U2l6ZTogcG9zdEZvbnRTaXplICsgJ2VtJyB9XCI+XG4gICAgPEJsb2dQb3N0XG4gICAgICB2LWZvcj1cInBvc3QgaW4gcG9zdHNcIlxuICAgICAgOmtleT1cInBvc3QuaWRcIlxuICAgICAgOnRpdGxlPVwicG9zdC50aXRsZVwiXG4gICAgICBAZW5sYXJnZS10ZXh0PVwicG9zdEZvbnRTaXplICs9IDAuMVwiXG4gICAgPjwvQmxvZ1Bvc3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQmxvZ1Bvc3QudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcHM6IFsndGl0bGUnXSxcbiAgZW1pdHM6IFsnZW5sYXJnZS10ZXh0J11cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJibG9nLXBvc3RcIj5cblx0ICA8aDQ+e3sgdGl0bGUgfX08L2g0PlxuXHQgIDxidXR0b24gQGNsaWNrPVwiJGVtaXQoJ2VubGFyZ2UtdGV4dCcpXCI+RW5sYXJnZSB0ZXh0PC9idXR0b24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>
<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBCbG9nUG9zdCBmcm9tICcuL0Jsb2dQb3N0LnZ1ZSdcbiAgXG5jb25zdCBwb3N0cyA9IHJlZihbXG4gIHsgaWQ6IDEsIHRpdGxlOiAnTXkgam91cm5leSB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMiwgdGl0bGU6ICdCbG9nZ2luZyB3aXRoIFZ1ZScgfSxcbiAgeyBpZDogMywgdGl0bGU6ICdXaHkgVnVlIGlzIHNvIGZ1bicgfVxuXSlcblxuY29uc3QgcG9zdEZvbnRTaXplID0gcmVmKDEpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuXHQ8ZGl2IDpzdHlsZT1cInsgZm9udFNpemU6IHBvc3RGb250U2l6ZSArICdlbScgfVwiPlxuICAgIDxCbG9nUG9zdFxuICAgICAgdi1mb3I9XCJwb3N0IGluIHBvc3RzXCJcbiAgICAgIDprZXk9XCJwb3N0LmlkXCJcbiAgICAgIDp0aXRsZT1cInBvc3QudGl0bGVcIlxuICAgICAgQGVubGFyZ2UtdGV4dD1cInBvc3RGb250U2l6ZSArPSAwLjFcIlxuICAgID48L0Jsb2dQb3N0PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkJsb2dQb3N0LnZ1ZSI6IjxzY3JpcHQgc2V0dXA+XG5kZWZpbmVQcm9wcyhbJ3RpdGxlJ10pXG5kZWZpbmVFbWl0cyhbJ2VubGFyZ2UtdGV4dCddKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImJsb2ctcG9zdFwiPlxuICAgIDxoND57eyB0aXRsZSB9fTwvaDQ+XG4gICAgPGJ1dHRvbiBAY2xpY2s9XCIkZW1pdCgnZW5sYXJnZS10ZXh0JylcIj5FbmxhcmdlIHRleHQ8L2J1dHRvbj5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPiJ9)

</div>

オプションとして <span class="options-api">[`emits`](/api/options-state.html#emits) オプション</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup.html#defineprops-defineemits) マクロ</span>を使って発行するイベントを宣言することができます:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

コンポーネントが発行する全てのイベントをドキュメント化することで、必要に応じてそれらを[バリデーション](/guide/components/events.html#events-validation)しています。また、これは Vue が暗黙的に子コンポーネントのルート要素にイベントをネイティブリスナーとして適用するのを避けることにもなります。

<div class="composition-api">

`defineProps` と同様に `defineEmits` も `<script setup>` 内でのみ使用することができ、インポートする必要はありません。これは、`$emit` メソッドと同等の `emit` 関数を返します。これは、コンポーネントの `<script setup>` セクション（`$emit` に直接アクセスできない）で、イベントを発行させるために使用します:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

参照:[コンポーネントの emit の型付け](/guide/typescript/composition-api.html#typing-component-emits) <sup class="vt-badge ts" />

`<script setup>` を使用していない時は `emits` オプションを使用してイベント発行を宣言することができます。setup コンテキスト (`setup()` に第 2 引数として渡されます) のプロパティとして `emit` 関数にアクセスすることができます:

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

カスタムコンポーネントについては以上となりますが、このページを読み終え内容に慣れてきたら、後ほど[カスタムイベント](/guide/components/events)の完全ガイドを読みにくることをおすすめします。

## スロットを使ったコンテンツ配信 {#content-distribution-with-slots}

HTML 要素と同じように、以下のようにコンポーネントにコンテンツを渡すことができると便利なことがよくあります:

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

これは以下のようなレンダリングがされるかもしれません:

:::danger これはデモ目的のエラーです
何らかのエラーが発生しました。
:::

これは Vue のカスタム要素 `<slot>` を用いて実現することができます:

```vue{4}
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

上で見たように、コンテンツを配置するプレースホルダーとして `<slot>` を使う - それだけです。これで完了です！

<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbiAgXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBvbmVudHM6IHsgQWxlcnRCb3ggfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PEFsZXJ0Qm94PlxuICBcdFNvbWV0aGluZyBiYWQgaGFwcGVuZWQuXG5cdDwvQWxlcnRCb3g+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJBbGVydEJveC52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJhbGVydC1ib3hcIj5cbiAgICA8c3Ryb25nPkVycm9yITwvc3Ryb25nPlxuICAgIDxici8+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuLmFsZXJ0LWJveCB7XG4gIGNvbG9yOiAjNjY2O1xuICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmODtcbn1cbiAgXG5zdHJvbmcge1xuXHRjb2xvcjogcmVkOyAgICBcbn1cbjwvc3R5bGU+In0=)

</div>
<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBbGVydEJveCBmcm9tICcuL0FsZXJ0Qm94LnZ1ZSdcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxBbGVydEJveD5cbiAgXHRTb21ldGhpbmcgYmFkIGhhcHBlbmVkLlxuXHQ8L0FsZXJ0Qm94PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQWxlcnRCb3gudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnQtYm94XCI+XG4gICAgPHN0cm9uZz5FcnJvciE8L3N0cm9uZz5cbiAgICA8YnIvPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5hbGVydC1ib3gge1xuICBjb2xvcjogIzY2NjtcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG59XG4gIFxuc3Ryb25nIHtcblx0Y29sb3I6IHJlZDsgICAgXG59XG48L3N0eWxlPiJ9)

</div>

スロットについては以上となりますが、このページを読み終え内容に慣れてきたら、後ほど[スロット](/guide/components/slots)の完全ガイドを読みにくることをおすすめします。

## 動的コンポーネント {#dynamic-components}

ときどきタブ付きインターフェイスのような、コンポーネントを動的な切り替えが役立つ時があります:

<div class="options-api">

[Playground のサンプルを開く](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuICBcbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcG9uZW50czoge1xuICAgIEhvbWUsXG4gICAgUG9zdHMsXG4gICAgQXJjaGl2ZVxuICB9LFxuICBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50VGFiOiAnSG9tZScsXG4gICAgICB0YWJzOiBbJ0hvbWUnLCAnUG9zdHMnLCAnQXJjaGl2ZSddXG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cInRhYiBpbiB0YWJzXCJcbiAgICAgICA6a2V5PVwidGFiXCJcbiAgICAgICA6Y2xhc3M9XCJbJ3RhYi1idXR0b24nLCB7IGFjdGl2ZTogY3VycmVudFRhYiA9PT0gdGFiIH1dXCJcbiAgICAgICBAY2xpY2s9XCJjdXJyZW50VGFiID0gdGFiXCJcbiAgICAgPlxuICAgICAge3sgdGFiIH19XG4gICAgPC9idXR0b24+XG5cdCAgPGNvbXBvbmVudCA6aXM9XCJjdXJyZW50VGFiXCIgY2xhc3M9XCJ0YWJcIj48L2NvbXBvbmVudD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGU+XG4uZGVtbyB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIHBhZGRpbmc6IDIwcHggMzBweDtcbiAgbWFyZ2luLXRvcDogMWVtO1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cblxuLnRhYi1idXR0b24ge1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogM3B4O1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogM3B4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQ6ICNmMGYwZjA7XG4gIG1hcmdpbi1ib3R0b206IC0xcHg7XG4gIG1hcmdpbi1yaWdodDogLTFweDtcbn1cbi50YWItYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWItYnV0dG9uLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICNlMGUwZTA7XG59XG4udGFiIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgcGFkZGluZzogMTBweDtcbn1cbjwvc3R5bGU+IiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9zZmMudnVlanMub3JnL3Z1ZS5ydW50aW1lLmVzbS1icm93c2VyLmpzXCJcbiAgfVxufSIsIkhvbWUudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgSG9tZSBjb21wb25lbnRcbiAgPC9kaXY+XG48L3RlbXBsYXRlPiIsIlBvc3RzLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIFBvc3RzIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiQXJjaGl2ZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBBcmNoaXZlIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+In0=)

</div>
<div class="composition-api">

[Playground のサンプルを開く](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBIb21lIGZyb20gJy4vSG9tZS52dWUnXG5pbXBvcnQgUG9zdHMgZnJvbSAnLi9Qb3N0cy52dWUnXG5pbXBvcnQgQXJjaGl2ZSBmcm9tICcuL0FyY2hpdmUudnVlJ1xuaW1wb3J0IHsgcmVmIH0gZnJvbSAndnVlJ1xuIFxuY29uc3QgY3VycmVudFRhYiA9IHJlZignSG9tZScpXG5cbmNvbnN0IHRhYnMgPSB7XG4gIEhvbWUsXG4gIFBvc3RzLFxuICBBcmNoaXZlXG59XG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGVtb1wiPlxuICAgIDxidXR0b25cbiAgICAgICB2LWZvcj1cIihfLCB0YWIpIGluIHRhYnNcIlxuICAgICAgIDprZXk9XCJ0YWJcIlxuICAgICAgIDpjbGFzcz1cIlsndGFiLWJ1dHRvbicsIHsgYWN0aXZlOiBjdXJyZW50VGFiID09PSB0YWIgfV1cIlxuICAgICAgIEBjbGljaz1cImN1cnJlbnRUYWIgPSB0YWJcIlxuICAgICA+XG4gICAgICB7eyB0YWIgfX1cbiAgICA8L2J1dHRvbj5cblx0ICA8Y29tcG9uZW50IDppcz1cInRhYnNbY3VycmVudFRhYl1cIiBjbGFzcz1cInRhYlwiPjwvY29tcG9uZW50PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZT5cbi5kZW1vIHtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgcGFkZGluZzogMjBweCAzMHB4O1xuICBtYXJnaW4tdG9wOiAxZW07XG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuXG4udGFiLWJ1dHRvbiB7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAzcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgbWFyZ2luLWJvdHRvbTogLTFweDtcbiAgbWFyZ2luLXJpZ2h0OiAtMXB4O1xufVxuLnRhYi1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kOiAjZTBlMGUwO1xufVxuLnRhYi1idXR0b24uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2UwZTBlMDtcbn1cbi50YWIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBwYWRkaW5nOiAxMHB4O1xufVxuPC9zdHlsZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiSG9tZS52dWUiOiI8dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJ0YWJcIj5cbiAgICBIb21lIGNvbXBvbmVudFxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+IiwiUG9zdHMudnVlIjoiPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwidGFiXCI+XG4gICAgUG9zdHMgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJBcmNoaXZlLnZ1ZSI6Ijx0ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInRhYlwiPlxuICAgIEFyY2hpdmUgY29tcG9uZW50XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4ifQ==)

</div>

上記は Vue の `<component>` 要素の特別な属性 `is` で実現されています:

<div class="options-api">

```vue-html
<!-- currentTab 変更時にコンポーネントが変わります -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- currentTab 変更時にコンポーネントが変わります -->
<component :is="tabs[currentTab]"></component>
```

</div>

上の例では、`:is` に渡される値に以下のいずれかを含めることができます:

- 登録されたコンポーネントの文字列、もしくは
- 実際にインポートされたコンポーネントオブジェクト

また、`is` 属性を使って、通常の HTML 要素を作成することもできます。

複数のコンポーネントを `<component :is="...">` で切り替えた場合、切り変えられたコンポーネントがアンマウントされます。組み込みの [`<KeepAlive>` コンポーネント](/guide/built-ins/keep-alive.html) を使用すれば、アクティブでないコンポーネントを強制的に "生きて" いる状態にすることができます。

## DOM テンプレート解析の注意点 {#dom-template-parsing-caveats}

Vue のテンプレートを DOM に直接記述する場合、Vue は DOM からテンプレート文字列を取得する必要があります。これはブラウザのネイティブな HTML パースのふるまいに、いくつかの注意点をもたらします。

:::tip
以下で説明する制限事項は、DOM に直接テンプレートを記述する場合にのみ適用されます。以下のソースからの文字列テンプレートを使用する場合は適用されません:

- 単一ファイルコンポーネント
- インラインのテンプレート文字列（例: `template: '...'`）
- `<script type="text/x-template">`
  :::

### 大文字小文字の区別 {#case-insensitivity}

HTML タグや属性名は大文字と小文字を区別しないので、ブラウザーはどの大文字も小文字として解釈します。つまり、DOM 内テンプレートを使用する場合、パスカルケースのコンポーネント名、キャメルケースの props 名、`v-on` イベント名は、すべてケバブケース（ハイフン区切り）を使用する必要があるということになります:

```js
// JavaScript 内ではキャメルケース
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- HTML 内ではケバブケース -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### 自己クロージングタグ {#self-closing-tags}

これまでのコードサンプルでは、コンポーネントに自己クロージング (self-closing) タグを使用していました:

```vue-html
<MyComponent />
```

これは、Vue のテンプレートパーサーが `/>` を、タグの種類に関係なく任意のタグを終了する指示として尊重するためです。

しかし、DOM テンプレートでは必ず明示的なクロージングタグを入れる必要があります:

```vue-html
<my-component></my-component>
```

これは HTML の仕様では、[いくつかの特定の要素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)でのみ自己クロージングタグの省略が認められているからです。最も一般的なのは `<input>` と `<img>` です。他のすべての要素では、自己クロージングタグを省略すると、ネイティブの HTML パーサーは開始タグを終了させなかったと判断します。例えば、次のようなスニペットです:

```vue-html
<my-component /> <!-- ここがクロージングタグのつもりです -->
<span>hello</span>
```

このようにパースされます:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- ですが、ブラウザーはここでクローズします -->
```

### 要素の配置制限 {#element-placement-restrictions}

`<ul>` 、 `<ol>` 、 `<table>` 、 `<select>` など、一部の HTML 要素には内部に表示できる要素に制限があります。例えば `<li>` などの一部の要素には、 `<tr>` 、および `<option>` は特定の要素内にのみ表示できます。

このような制限のある要素でコンポーネントを使用する場合に問題が発生します。例えば:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

カスタムコンポーネント `<blog-post-row>` は無効なコンテンツとして巻き上げられ、最終的なレンダリング出力でエラーが発生します。回避策として、特別な [`is` 属性](/api/built-in-special-attributes.html#is) を使用することができます:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
ネイティブの HTML 要素で使用する場合、Vue コンポーネントとして解釈されるためには `is` の値の前に `vue:` を付けなければなりません。これはネイティブの[組み込みのカスタマイズ要素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)との混同を避けるために必要となります。
:::

DOM テンプレート解析の注意点については、以上で終わりです。そして実は、Vue の _Essentials_（エッセンス集）はこれで終わりです。おめでとうございます！まだ学ぶことはありますが、ひとまずは休みをいれて、あなた自身が Vue で遊び、何か楽しいものを作ってみることをおすすめします。もしくは、[サンプル集](/examples/)をまだ見ていないようであれば、チェックしてください。

いま受けたダイジェストの知識に慣れてきたと感じたら、ガイドを進めてコンポーネントについてより深く学んでみましょう。
