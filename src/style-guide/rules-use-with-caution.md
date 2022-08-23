# 優先度D: 注意深く使用する

Vue のいくつかの機能は、まれなエッジケースに対応するため、またはレガシーコードベースからの移行をよりスムーズにするために存在します。しかし使いすぎると、コードのメンテナンスが難しくなったり、バグの原因になったりすることがあります。これらのルールは、潜在的にリスクの高い機能に注目し、いつ、なぜ、それらを避けるべきかを説明します。

## `scoped` 付きの要素セレクター

**要素セレクターは `scoped` で使わないようにしてください。**

大量の要素セレクターは遅いので `scoped` スタイルでは要素セレクターよりもクラスセレクターを使うようにしてください。

::: details 詳しい説明
scope スタイルに対し、Vue はコンポーネント要素に `data-v-f3f3eg9` のようなユニークな属性を追加します。そしてセレクターはこの属性にマッチする要素のみが選択されるように修正されます（例: `button[data-v-f3f3eg9]`）。

大量の要素属性セレクター（例: `button[data-v-f3f3eg9]`）はクラス属性セレクター（例: `.btn-close[data-v-f3f3eg9]`）に比べてかなり遅いという問題があるので、できる限りクラスセレクターを使うようにしてください。
:::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## 暗黙の親子間通信

**親子間のコンポーネントの通信には `this.$parent` や props を変更するかわりに props と event を使うようにしてください。**

理想的な Vue アプリケーションは props が下で events が上です。この規約に従うことでコンポーネントはより理解しやしくなります。しかし、prop の変更や `this.$parent` を使うことですでに深く結合している 2 つのコンポーネントを単純化できるようなエッジケースが存在します。

問題はこれらのパターンが便利になる _シンプル_ なケースも多く存在することです。注意: 短期的な利便性（少ないコードを書くこと）のために単純な取引（状態の流れを理解できること）するよう誘惑されないでください。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>
