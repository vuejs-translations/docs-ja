# 条件付きレンダリング {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

`v-if` ディレクティブは、ブロックを条件に応じてレンダリングしたい場合に使用されます。ブロックは、ディレクティブの式が真を返す場合のみレンダリングされます。

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

`v-if` に対して "else block" を示すために、`v-else` ディレクティブを使用できます:

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYXdlc29tZSA9IHJlZih0cnVlKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgXHRyZXR1cm4ge1xuXHQgICAgYXdlc29tZTogdHJ1ZVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJhd2Vzb21lID0gIWF3ZXNvbWVcIj50b2dnbGU8L2J1dHRvbj5cblxuXHQ8aDEgdi1pZj1cImF3ZXNvbWVcIj5WdWUgaXMgYXdlc29tZSE8L2gxPlxuXHQ8aDEgdi1lbHNlPk9oIG5vIPCfmKI8L2gxPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

</div>

`v-else` 要素は、`v-if` または `v-else-if` 要素の直後になければなりません。それ以外の場合は認識されません。

## `v-else-if` {#v-else-if}

`v-else-if` は、名前が示唆するように、`v-if` の "else if block" として機能します。また、複数回連結することもできます:

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

`v-else` と同様に、`v-else-if` 要素は `v-if` 要素または `v-else-if` 要素の直後になければなりません。

## `<template>` に `v-if` を適用する {#v-if-on-template}

`v-if` はディレクティブなので、単一の要素に付加する必要があります。しかし、1 要素よりも多くの要素と切り替えたい場合はどうでしょうか？このケースでは、非表示ラッパー (wrapper) として提供される、`<template>` 要素で `v-if` を使用できます。最終的にレンダリングされる結果は、`<template>` 要素は含まれません。

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` と `v-else-if` は `<template>` でも使用可能です。

## `v-show` {#v-show}

条件的に要素を表示するための別のオプションは `v-show` です。使用方法はほとんど同じです:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

違いは `v-show` による要素は常にレンダリングされて DOM に残るということです。`v-show` はシンプルに要素の `display` CSS プロパティを切り替えます。

`v-show` は `<template>` 要素をサポートせず、`v-else` とも連動しないということに注意してください。

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` は、イベントリスナと子コンポーネント内部の条件ブロックが適切に破棄され、そして切り替えられるまでの間再作成されるため、”リアル”な条件レンダリングです。

`v-if` はまた **遅延レンダリング (lazy)** でもあります。 初期表示において状態が false の場合、何もしません。つまり条件付きブロックは、条件が最初に true になるまでレンダリングされません。

一方で、`v-show` はとてもシンプルです。要素は初期条件に関わらず常にレンダリングされ、シンプルな CSS ベースの切り替えによって表示されます。

一般的に、`v-if` はより高い切り替えコストを持っているのに対して、 `v-show` はより高い初期レンダリングコストを持っています。 そのため、とても頻繁に何かを切り替える必要があれば `v-show` を選び、条件が実行時に変更することがほとんどない場合は、`v-if` を選びます。

## `v-if` と `v-for` {#v-if-with-v-for}

::: warning Note
暗黙的な優先順位により、 `v-if` と `v-for` を同じ要素で利用することは **推奨されません**。 詳細については [スタイルガイド](/style-guide/rules-essential.html#avoid-v-if-with-v-for) を参照ください。
:::

`v-if` と `v-for` が同じ要素に両方つかわれる場合、 `v-if` が先に評価されます。詳細については [リストレンダリングのガイド](list.html#v-for-と-v-if) を参照してください。
