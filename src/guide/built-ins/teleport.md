# Teleport {#teleport}

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Vue.js Teleport の無料レッスン"/>

`<Teleport>` は、コンポーネントにあるテンプレートの一部を、そのコンポーネントの DOM 階層の外側に存在する DOM ノードに「テレポート」できる組み込みコンポーネントです。

## 基本的な使い方 {#basic-usage}

ときどき、次のようなシナリオに遭遇することがあります: 論理的にはコンポーネントのテンプレートの一部は、コンポーネントに属していますが、視覚的な観点からすると、Vue アプリケーション外の DOM のどこかに表示されるべきものです。

もっとも一般的な例は、フルスクリーンのモーダルを構築するときです。理想的には、モーダルのボタンとモーダル自体を同じコンポーネントに収めたいものです。なぜなら、これらは両方ともモーダルの開閉状態に関連しているからです。しかし、これではモーダルがボタンと一緒にレンダリングされ、アプリケーションの DOM 階層に深くネストされることになります。これにより CSS でモーダルを配置する際に、いくつかの厄介な問題を引き起こす可能性があります。

次のような HTML 構造を考えてみましょう。

```vue-html
<div class="outer">
  <h3>Vue Teleport Example</h3>
  <div>
    <MyModal />
  </div>
</div>
```

そして、以下が `<MyModal>` の実装です:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

このコンポーネントには、モーダルを開くためのトリガーとなる `<button>` と、モーダルのコンテンツとセルフクローズするためのボタンを含む `.modal` クラスの `<div>` が含まれています。

このコンポーネントを初期の HTML 構造の中で使う場合、いくつかの問題が生じる可能性があります:

- `position: fixed` は、祖先の要素に `transform`、`perspective`、`filter` プロパティが設定されていない場合、ビューポートに対して相対的に要素を配置するだけです。例えば、祖先である `<div class="outer">` を CSS transform でアニメーションさせようとすると、モーダルレイアウトが崩れてしまいます！

- モーダルの `z-index` は、それを含む要素によって制約されます。もし `<div class="outer">` と重なった、より高い `z-index` の値が設定された別の要素があれば、モーダルコンポーネントを覆ってしまうかもしれません。

`<Teleport>` は、ネストされた DOM 構造から抜け出せるようにすることで、これらの問題を回避するクリーンな方法を提供します。それでは、`<MyModal>` を修正して、 `<Teleport>` を使用するようにしてみましょう:

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

`<Teleport>` の `to` ターゲットには、CSS セレクター文字列か、存在する DOM ノードが必要です。ここでは、Vue に「このテンプレートフラグメントを **テレポート** して、 **`body`** タグに転送する」ように指示しています。

下のボタンをクリックして、ブラウザーの devtools で `<body>` タグを検査できます:

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Open Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Hello from the modal!</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

`<Teleport>` と [`<Transition>`](./transition) を組み合わせると、アニメーションするモーダルを作ることができます - [サンプルはこちら](/examples/#modal) を参照してください。

:::tip
テレポートの `to` ターゲットは、 `<Teleport>` コンポーネントがマウントされたときに、すでに DOM に存在している必要があります。理想的には、Vue アプリケーション全体の外側にある要素であるべきです。Vue でレンダリングされる別の要素をターゲットにする場合は、その要素が `<Teleport>` の前にマウントされていることを確認する必要があります。
:::

## コンポーネントでの使用 {#using-with-components}

`<Teleport>` はレンダリングされた DOM 構造を変更するだけで、コンポーネントの論理的な階層構造には影響を与えません。つまり、`<Teleport>` があるコンポーネントを含む場合、そのコンポーネントは `<Teleport>` を含む親コンポーネントの論理的な子要素であることに変わりはありません。props の受け渡しやイベントの発行は、これまでと同じように動作します。

また、親コンポーネントからの注入は期待通りに動作し、子コンポーネントは実際のコンテンツが移動した場所に配置されるのではなく、Vue Devtools で親コンポーネントの下にネストされることになります。

## Teleport を無効化する {#disabling-teleport}

場合によっては、条件付きで `<Teleport>` を無効にしたいことがあります。例えば、デスクトップではオーバーレイとしてコンポーネントをレンダリングし、モバイルではインラインでレンダリングしたい場合があります。この場合、`<Teleport>` は `disabled` props をサポートし、動的にトグルできます:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

メディアクエリーの変更を検知して `isMobile` の状態によって動的に更新できます。

## 同じターゲットに複数の Teleport {#multiple-teleports-on-the-same-target}

慣用的な例として、再利用可能な `<Modal>` コンポーネントにおいて複数のインスタンスが同時にアクティブになる可能性があります。このようなシナリオの場合、複数の `<Teleport>` コンポーネントが同じターゲット要素にコンテンツをマウントできます。順番は単純な追加で、ターゲット要素内で先にマウントされたものの後に配置されます。

次のような使い方があるとします:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

レンダリング結果はこうなります:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 遅延 Teleport <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

Vue 3.5 以降では、`defer` prop を使用するとアプリケーションの他の部分がマウントされるまで、Teleport のターゲット解決を遅延できます。これにより、Vue によってレンダリングされるコンポーネントツリーの後の方にあるコンテナ要素をターゲットにすることができます：

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- テンプレートの後のほうにあります -->
<div id="late-div"></div>
```

ターゲット要素はテレポートと同じマウント / 更新ティックでレンダリングされる必要があることに注意してください。つまり、`<div>` が 1 秒後にマウントされた場合でも、Teleport はエラーを報告します。defer は `mounted` ライフサイクルフックと同様に動作します。

---

**関連**

- [`<Teleport>` API リファレンス](/api/built-in-components#teleport)
- [SSR における Teleport の扱いについて](/guide/scaling-up/ssr#teleports)
