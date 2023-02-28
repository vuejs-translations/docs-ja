# 優先度A: 必須 {#priority-a-rules-essential}

これらのルールはエラーを防ぐのに役立ちますので、何としても学んで守ってください。例外はありますが、非常にまれで、 JavaScript と Vue の両方の専門的な知識を持つ人のみが行うべきことです。

## 複数単語のコンポーネント名を使用する {#use-multi-word-component-names}

ユーザーコンポーネントの名前は、ルートの `App` コンポーネントを除いて、常に複数単語であるべきです。これは、すべての HTML 要素が一語であるため、既存および将来の HTML 要素との[衝突を防ぐ](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)ためです。

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<!-- プリコンパイルされたテンプレート -->
<Item />

<!-- in-DOM テンプレート -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<!-- プリコンパイルされたテンプレート -->
<TodoItem />

<!-- in-DOM テンプレート -->
<todo-item></todo-item>
```

</div>

## 詳細なプロパティ定義を使用する {#use-detailed-prop-definitions}

コミットされたコードでは、プロパティの定義は可能な限り詳細に、少なくとも型は指定する必要があります。

::: details 詳しい説明
詳細な[プロパティ定義](/guide/components/props.html#prop-validation)には、2 つの利点があります。

- それらはコンポーネントの API を文書化し、コンポーネントがどのように使用されることを意図しているかを容易に理解できるようにします。
- 開発では、コンポーネントが不適切な形式のプロパティを提供された場合に Vue が警告を発し、潜在的なエラー源を捕らえるのに役立ちます。
  :::

<div class="options-api">
<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
// これはプロトタイピングの時だけ OK です
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
props: {
  status: String
}
```

```js
// さらに良くなりました!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>
</div>

<div class="composition-api">
<div class="style-example style-example-bad">
<h3>悪い例</h3>

```js
// これはプロトタイピングの時だけ OK です
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// さらに良くなりました!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>
</div>

## キー付きの `v-for` を使用する {#use-keyed-v-for}

サブツリー内のコンポーネントの状態を維持するために、`key` と `v-for` はコンポーネントに対して常に要求されます。しかし、要素であっても、アニメーションの[オブジェクトの不変性](https://bost.ocks.org/mike/constancy/) など、予測可能な動作を維持するためには良い習慣です。

::: details 詳しい説明
例えば、TODO のリストがあるとします:

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

そして、アルファベット順に並べ替えます。DOM を更新するとき、Vue はレンダリングを最適化し、最も低コストな DOM の操作を実行します。つまり、最初の todo 要素を削除して、リストの最後に再び追加するということかもしれません。

問題は、DOM に残る要素を削除しないことが重要な場合があることです。たとえば、`<transition-group>` を使用してリストのソートをアニメーション化したり、レンダリングされた要素が `<input>` である場合にフォーカスを維持したりしたい場合があります。このような場合、各項目に一意のキー（例えば `:key="todo.id"`) を追加すると、Vue に対してより予測可能な動作を指示することができます。

私たちの経験では、常に一意なキーを追加して、あなたやチームがこのようなエッジケースについて心配する必要がないようにする方がよいです。そして、まれにパフォーマンスが重要なシナリオで、オブジェクトの不変性が必要でない場合は、意識的に例外を作ることができます。
:::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## `v-for` で `v-if` を避ける {#avoid-v-if-with-v-for}

**決して `v-if` を `v-for` と同じ要素に使ってはいけません。**

これが魅力的なのは、よくある 2 つのケースです:

- リスト内の項目をフィルタリングする場合（例： `v-for="user in users" v-if="user.isActive"`）は、 `users` を新しい算出プロパティに置き換えて、フィルタリングされたリスト (例: `activeUsers`) を返してください。

- 非表示にすべきリストをレンダリングしないようにする (例: `v-for="user in users" v-if="shouldShowUsers"`)には、 `v-if` をコンテナ要素 (例: `ul`, `ol`) に移動してください。

::: details 詳しい説明
Vue がディレクティブを処理する際、 `v-if` は `v-for` よりも高い優先度を持つので、このテンプレートは次のようになります:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

`v-if` ディレクティブが最初に評価され、イテレーション変数 `user` がこの時点では存在しないため、エラーがスローされます。

これは、次のように、算出プロパティに対して反復処理を行うことで解決できます:

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

また、`<template>` タグを `v-for` と一緒に使って、`<li>` 要素をラップすることもできます:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## コンポーネント・スコープのスタイリングを使用する {#use-component-scoped-styling}

アプリケーションの場合、トップレベルの `App` コンポーネントとレイアウトコンポーネントのスタイルはグローバルであってもかまいませんが、その他のコンポーネントは常にスコープされるべきです。

これは、[単一ファイルコンポーネント](/guide/scaling-up/sfc.html) にのみ関連しています。これは、[`scoped` 属性](https://vue-loader.vuejs.org/en/features/scoped-css.html) を使用することを必要としません。スコープは、[CSS モジュール](https://vue-loader.vuejs.org/en/features/css-modules.html) や [BEM](http://getbem.com/) のようなクラスベースの戦略、あるいは他のライブラリーや規約を利用することができます。

**しかし、コンポーネントライブラリーは `scoped` 属性を使用する代わりに、クラスベースの戦略を取るべきです。**

これにより、内部スタイルのオーバーライドが容易になり、人間が読みやすいクラス名で、あまり高い特異性を持たなくなり、衝突の可能性が非常に低くなります。

::: details 詳しい説明
大規模なプロジェクトや他の開発者と共同作業をしている場合、あるいはサードパーティーの HTML/CSS（例：Auth0）を含むことがある場合、一貫したスコープを設定することで、スタイルが対象となるコンポーネントにのみ適用されることを保証します。

`scoped` 属性以外にも、ユニークなクラス名を使用することで、サードパーティーの CSS があなたの HTML に適用されないようにすることができます。例えば、多くのプロジェクトでは `button`、`btn` または `icon` というクラス名を使用しています。BEM などの戦略を使用しない場合でも、アプリ固有またはコンポーネント固有のプレフィックス（例えば `ButtonClose-icon`）をつけておけば、ある程度の保護が可能でしょう。
:::

<div class="style-example style-example-bad">
<h3>悪い例</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>良い例</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- `scoped` 属性の使用 -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- CSS モジュールの使用 -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- BEM 規約の使用 -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
