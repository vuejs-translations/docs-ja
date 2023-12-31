# 算出プロパティ {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Vue School の算出プロパティの無料動画レッスン"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Vue School の算出プロパティの無料動画レッスン"/>
</div>

## 基本的な例 {#basic-example}

テンプレート内に式を書けるのはとても便利ですが、非常に簡単な操作しかできません。テンプレート内に多くのロジックを詰め込むと、コードが肥大化し、メンテナンスが難しくなります。例えば、配列が入れ子になっているオブジェクトがあった場合:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

</div>

そして、`author` がすでにいくつかの `books` を持っているかどうかによって、異なるメッセージを表示したいとします:

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

この時点で、テンプレートが少しごちゃごちゃしてきました。しばらく眺めて、やっとこれが `author.books` に依存した計算をしていることに気づくでしょう。さらに重要なことは、同じ計算をテンプレートの中で複数回使う場合、おそらく繰り返して使いたくはないでしょう。

上記の理由から、リアクティブなデータを含む複雑なロジックには**算出プロパティ**を使用すべきです。以下は上記と同じ例をリファクタリングしたものです:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // 算出プロパティの getter 関数
    publishedBooksMessage() {
      // `this` はコンポーネントのインスタンスを指します
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Playground で試す](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

ここでは、`publishedBooksMessage` という算出プロパティを宣言しています。

アプリケーションの `data` プロパティ内の `books` 配列の値を変更してみると、それに応じて `publishedBooksMessage` の結果がどのように変化しているかがわかります。

通常のプロパティと同じように、テンプレート内の算出プロパティにデータバインドすることもできます。Vue は `this.publishedBooksMessage` が `this.author.books` に依存していることを知っているので、`this.author.books` が変わると `this.publishedBooksMessage` に依存する全てのバインディングを更新します。

参照: [算出プロパティの型付け](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 算出プロパティの参照
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

ここでは、`publishedBooksMessage` という算出プロパティを宣言しています。`computed()` 関数は getter 関数が渡されることを想定しており、返り値は **算出された ref** となります。通常の ref と同様に、`publishedBooksMessage.value` で算出結果を参照することができます。また、算出結果はテンプレート内では自動的にアンラップされるため、テンプレート内では `.value` なしで参照することができます。

算出プロパティは、自動的にリアクティブな依存関係を追跡します。Vue は `publishedBooksMessage` の算出が `author.books` に依存することを知っているので、`author.books` が変わると `publishedBooksMessage` に依存する全てのバインディングを更新します。

参照: [`computed()` の型付け](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## 算出プロパティ vs. メソッド {#computed-caching-vs-methods}

こういった式を持つメソッドを呼び出すことで、同じ結果が実現できることに気付いたかもしれません:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// コンポーネント内
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// コンポーネント内
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

</div>

算出プロパティの代わりに、同じような関数をメソッドとして定義することもできます。最終的には、2 つのアプローチは完全に同じ結果になります。しかしながら、**算出プロパティはリアクティブな依存関係にもとづきキャッシュされる**という違いがあります。算出プロパティは、リアクティブな依存関係が更新されたときにだけ再評価されます。これはつまり、 `author.books` が変わらない限りは、`publishedBooksMessage` に何度アクセスしても、getter 関数を再び実行することなく、以前計算された結果を即時に返すということです。

`Date.now()` はリアクティブな依存ではないため、次の算出プロパティは二度と更新されないことを意味します:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

対称的に、メソッド呼び出しは、再描画が起きると**常に**関数を実行します。

なぜキャッシングが必要なのでしょうか？巨大な配列をループしたり多くの計算を必要とする、コストの高い `list` という算出プロパティがあることを想像してみてください。`list` に依存する他の算出プロパティもあるかもしれません。その場合、キャッシングがなければ必要以上に `list` の getter を実行することになってしまいます。キャッシングしたくない場合は、代わりにメソッドを使いましょう。

## 書き込み可能な 算出関数 {#writable-computed}

算出プロパティは、デフォルトでは getter 関数のみです。算出プロパティに新しい値を代入しようとすると、ランタイム警告が表示されます。まれに「書き込み可能な」算出プロパティが必要な場合があります。その場合は getter 関数と setter 関数の両方を提供することで、それを作成することができます:

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter 関数
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter 関数
      set(newValue) {
        // 注意: ここでは、分割代入構文を使用しています。
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

`this.fullName = 'John Doe'` を呼ぶと、setter 関数が呼び出され、`this.firstName` と `this.lastName` が適切に更新されます。

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter 関数
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter 関数
  set(newValue) {
    // 注意: ここでは、分割代入構文を使用しています。
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

`fullName = 'John Doe'` を呼ぶと、setter 関数が呼び出され、`firstName` と `lastName` が適切に更新されます。

</div>

## ベストプラクティス {#best-practices}

### getter 関数は副作用のないものでなければならない {#getters-should-be-side-effect-free}

算出プロパティにおける getter 関数は計算のみを行い、副作用がないようにすることが重要です。例えば、**算出プロパティの getter の内部で他のステートを変更したり、非同期リクエストを実行したり、DOM を変更したりしないようにしましょう！** 算出プロパティは他の値に基づいて計算する方法を宣言的に記述していると考えてください。その唯一の責任は、値を計算して返すことでなければなりません。このガイドの後半では、 [ウォッチャー](./watchers) を使って、状態の変化に反応して副作用を実行する方法について説明します。

### 算出した値の変更を避ける {#avoid-mutating-computed-value}

算出プロパティから返る値は、派生した状態です。一時的なスナップショットとして考えてください。ソースの状態が変わるたびに、新しいスナップショットが作成されます。スナップショットの値を変更することは意味がないため、計算された結果は読み取り専用として扱い、変更しないようにします。その代わり、新しい計算結果が必要な場合は、依存するソースの状態を更新します。
