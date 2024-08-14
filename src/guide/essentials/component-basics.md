# コンポーネントの基礎 {#components-basics}

コンポーネントによって UI を独立した再利用可能なピースに分割し、それぞれのピースを切り離して考えることができるようになります。アプリケーションはネストされたコンポーネントのツリーによって構成されているのが一般的です:

![コンポーネントツリー](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

これは、ネイティブの HTML 要素をネストする方法ととてもよく似ていますが、Vue は独自のコンポーネントモデルを実装しており、各コンポーネントのカスタムコンテンツとロジックをカプセル化することができます。 Vue はまた、ネイティブの Web コンポーネントとうまく連携しています。 Vue コンポーネントとネイティブの Web コンポーネントの関係について興味があるようでしたら[こちらを参照してください](/guide/extras/web-components)。

## コンポーネントの定義 {#defining-a-component}

ビルドステップを使用する場合は通常、各 Vue コンポーネントは専用のファイルで `.vue` 拡張子を使用して定義します。これは [単一ファイルコンポーネント](/guide/scaling-up/sfc)（略して SFC）として知られています:

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
  // DOM 内テンプレートをターゲットにすることもできます
  // template: '#my-template-element'
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

インポートしたコンポーネントをテンプレートに公開するには、`components` オプションでコンポーネントを[登録](/guide/components/registration)する必要があります。これにより、そのコンポーネントは登録されたキーを使ってタグとして利用できるようになります。

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

また、コンポーネントをグローバル登録することで、インポートすることなくアプリケーション内のすべてのコンポーネントで利用できるようにすることもできます。グローバル登録とローカル登録のメリットとデメリットは、専用の[コンポーネントの登録](/guide/components/registration)セクションで説明されています。

コンポーネントは好きなだけ、何度でも再利用可能です:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

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

詳細は [DOM 内テンプレート解析の注意点](#in-dom-template-parsing-caveats)を参照ください。

## props の受け渡し {#passing-props}

ブログを構築する場合、ブログの記事を表示するコンポーネントが必要になるかと思います。すべてのブログ記事が同じレイアウトで表示されるようにしたいのですが、コンテンツは異なっています。このようなコンポーネントは、表示したい特定の記事のタイトルや内容などのデータを渡すことができない限り役に立ちません。そこで props の出番です。

props はコンポーネントに登録できるカスタム属性のことです。ブログ記事コンポーネントにタイトルを渡すには、<span class="options-api">[`props`](/api/options-state#props) オプション</span><span class="composition-api">[`defineProps`](/api/sfc-script-setup#defineprops-defineemits) マクロ</span>を使って、このコンポーネントが受け取る props のリストを宣言する必要があります:

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

`defineProps` はコンパイル時のマクロで `<script setup>` 内でのみ利用可能であり、明示的にインポートする必要はありません。宣言された props は、自動的にテンプレートに公開されます。また、`defineProps` はコンポーネントに渡されたすべての props を含むオブジェクトを返すので、必要に応じて JavaScript 内でアクセスすることができます:

```js
const props = defineProps(['title'])
console.log(props.title)
```

参照:[コンポーネント props の型付け](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

`<script setup>` を使わない場合、props は `props` オプションで宣言する必要があり、props オブジェクトは `setup()` の第 1 引数として渡されます:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

コンポーネントは好きなだけ props を持つことができ、デフォルトでどんな値でも、どの props にも渡すことができます。

props が登録されると、以下のようにカスタム属性としてデータを渡すことができるようになります:

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

[Playground で試す](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

動的な props の値を渡すための [`v-bind` 構文](/api/built-in-directives#v-bind)（`:title="post.title"`）の使い方に注目してください。これは、レンダリングするコンテンツを事前に正確に把握していない場合に特に役立ちます。

props については以上となりますが、このページを読み終え内容に慣れてきたら、後ほど[props](/guide/components/props)の完全ガイドを読みにくることをおすすめします。

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

そして、子コンポーネントは組み込みの [**`$emit`** メソッド](/api/component-instance#emit)を呼び出し、イベント名を渡すことによって自身のイベントを発行することができます:

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

[Playground で試す](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

オプションとして <span class="options-api">[`emits`](/api/options-state#emits) オプション</span><span class="composition-api">[`defineEmits`](/api/sfc-script-setup#defineprops-defineemits) マクロ</span>を使って発行するイベントを宣言することができます:

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

コンポーネントが発行する全てのイベントをドキュメント化することで、必要に応じてそれらを[バリデーション](/guide/components/events#events-validation)しています。また、これは Vue が暗黙的に子コンポーネントのルート要素にイベントをネイティブリスナーとして適用するのを避けることにもなります。

<div class="composition-api">

`defineProps` と同様に `defineEmits` も `<script setup>` 内でのみ使用することができ、インポートする必要はありません。これは、`$emit` メソッドと同等の `emit` 関数を返します。これは、コンポーネントの `<script setup>` セクション（`$emit` に直接アクセスできない）で、イベントを発行させるために使用します:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

参照:[コンポーネントの emit の型付け](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

`<script setup>` を使用していない時は `emits` オプションを使用してイベント発行を宣言することができます。setup コンテキスト（`setup()` に第 2 引数として渡されます）のプロパティとして `emit` 関数にアクセスすることができます:

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
<!-- AlertBox.vue -->
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

[Playground で試す](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

スロットについては以上となりますが、このページを読み終え内容に慣れてきたら、後ほど[スロット](/guide/components/slots)の完全ガイドを読みにくることをおすすめします。

## 動的コンポーネント {#dynamic-components}

タブ付きインターフェイスのように、コンポーネントを動的に切り替えると便利な場合があります:

<div class="options-api">

[Playground のサンプルを開く](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Playground のサンプルを開く](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

上記は、特別な `is` 属性を持つ Vue の `<component>` 要素によって可能になります:

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

- 登録されたコンポーネントの名前文字列、または
- 実際にインポートされたコンポーネントオブジェクト

`is` 属性を使用して通常の HTML 要素を作成することもできます。

複数のコンポーネントを `<component :is="...">` で切り替えた場合、切り変えられたコンポーネントはアンマウントされます。組み込みの [`<KeepAlive>` コンポーネント](/guide/built-ins/keep-alive) を使用すれば、アクティブでないコンポーネントを強制的に "生きて" いる状態にすることができます。

## DOM 内テンプレート解析の注意点 {#in-dom-template-parsing-caveats}

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

これまでのコードサンプルでは、コンポーネントに自己クロージング（self-closing）タグを使用していました:

```vue-html
<MyComponent />
```

これは、Vue のテンプレートパーサーが `/>` を、タグの種類に関係なく任意のタグを終了する指示として尊重するためです。

しかし、DOM 内テンプレートでは必ず明示的なクロージングタグを入れる必要があります:

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

`<ul>`、`<ol>`、`<table>`、`<select>` などの一部の HTML 要素には、その内部に表示できる要素に制限があり、`<li>`、`<tr>`、`<option>` などの一部の要素は、他の特定の要素内にのみ表示できます。

このような制限のある要素でコンポーネントを使用する場合に問題が発生します。例えば:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

カスタムコンポーネント `<blog-post-row>` は無効なコンテンツとして巻き上げられ、最終的なレンダリング出力でエラーが発生します。回避策として、特別な [`is` 属性](/api/built-in-special-attributes#is) を使用することができます:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
ネイティブの HTML 要素で使用する場合、Vue コンポーネントとして解釈されるためには `is` の値の前に `vue:` を付けなければなりません。これはネイティブの[組み込みのカスタマイズ要素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)との混同を避けるために必要となります。
:::

DOM 内テンプレート解析の注意点については、以上で終わりです。そして実は、Vue の _Essentials_（エッセンス集）はこれで終わりです。おめでとうございます！まだ学ぶことはありますが、ひとまずは休みをいれて、あなた自身が Vue で遊び、何か楽しいものを作ってみることをおすすめします。もしくは、[サンプル集](/examples/)をまだ見ていないようであれば、チェックしてください。

いま受けたダイジェストの知識に慣れてきたと感じたら、ガイドを進めてコンポーネントについてより深く学んでみましょう。
