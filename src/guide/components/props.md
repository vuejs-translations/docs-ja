# props {#props}

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="props について学ぶ Vue.js の無料レッスン"/>
</div>

## props の宣言 {#props-declaration}

Vue のコンポーネントでは、明示的な props の宣言が必要です。これにより Vue は、外部からコンポーネントに渡された props をフォールスルー属性（[専用のセクション](/guide/components/attrs)で説明します）として扱うべきかを知ることができます。

<div class="composition-api">

SFC で `<script setup>` を使用する場合、`defineProps()` マクロを使って props を宣言します:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

`<script setup>` を用いないコンポーネントの場合、[`props`](/api/options-state#props) オプションを使って props を宣言します:

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() は第 1 引数に props を受け取ります。
    console.log(props.foo)
  }
}
```

`defineProps()` に渡している引数と、`props` オプションに渡している値が同じであることに注目してください。同じ props オプションの API が、2 つの宣言スタイル間で共有されています。

</div>

<div class="options-api">

 props は、以下のように [`props`](/api/options-state#props) オプションを使って宣言します:

```js
export default {
  props: ['foo'],
  created() {
    // props は `this` 上で公開されます。
    console.log(this.foo)
  }
}
```

</div>

props の宣言には、文字列の配列に加え、オブジェクト構文を用いることもできます:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// <script setup> 内
defineProps({
  title: String,
  likes: Number
})
```

```js
// <script setup> 以外
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

オブジェクト宣言の構文に含める各プロパティについて、キーには props の名前、値には目的の型のコンストラクター関数を指定します。

これは自分のコンポーネントを文書化するのに役立ちます。また、誤った型を渡した時にブラウザーのコンソールに警告が表示されるようになり、コンポーネントを利用する他の開発者のためにもなります。このページの後半では、[props のバリデーション](#prop-validation)について詳しく説明します。

<div class="options-api">

[コンポーネント props の型付け](/guide/typescript/options-api#typing-component-props)も合わせて参照してください。<sup class="vt-badge ts" />

</div>

<div class="composition-api">

TypeScript と `<script setup>` の組み合わせを用いる場合、型アノテーションをそのまま使って props を宣言することも可能です:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

詳細: [コンポーネント props の型付け](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

## リアクティブな props の分割代入 <sup class="vt-badge" data-text="3.5+" /> \*\* {#reactive-props-destructure}

Vue のリアクティビティシステムは、プロパティアクセスに基づいて状態の使用を追跡します。例えば、算出プロパティやウォッチャーで `props.foo` にアクセスすると、`foo` プロパティが依存関係として追跡されます。

そこで、以下のようなコードを考えます:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 3.5 以前は 1 回だけ実行されます。
  // 3.5 以降は "foo" が変更されるたびに再実行されます。
  console.log(foo)
})
```

バージョン 3.4 以前では、`foo` は実際の定数であり、変更されることはありません。バージョン 3.5 以降では、同じ `<script setup>` ブロック内で `defineProps` から分割代入された変数にアクセスするコードがあると、Vue のコンパイラーは自動的に `props.` を先頭に追加します。したがって、上記のコードは以下のようになります:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` はコンパイラーによって `props.foo` に変換されました。
  console.log(props.foo)
})
```

IDE 上で分割代入された props と通常の変数をより視覚的に区別したい場合、Vue の VSCode 拡張機能には、分割代入された props にインレイヒントを表示する設定があります。

さらに、JavaScript のネイティブなデフォルト値構文を使用して、props のデフォルト値を宣言できます。これは型ベースの props 宣言を使用する場合に特に便利です:

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

### 関数への分割代入 props 渡し {#passing-destructured-props-into-functions}

分割代入された props を関数に渡す場合、例えば：

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

これは期待通りに動作しません。なぜなら、これは `watch(props.foo, ...)` と同等であり、リアクティブなデータソースではなく値を `watch` に渡しているからです。実際、Vue のコンパイラーはこのような場合を検出し、警告を発します。

通常の props を `watch(() => props.foo, ...)` と監視できるのと同様に、分割代入された props もゲッターでラップすることで監視できます：

```js
watch(() => foo, /* ... */)
```

さらに、リアクティビティを保持しながら分割代入された props を外部関数に渡す必要がある場合、これが推奨されるアプローチです：

```js
useComposable(() => foo)
```

外部関数は、提供された props の変更を追跡する必要がある場合（例えば、computed や watcher のゲッター内で）、ゲッターを呼び出す（もしくは [toValue](/api/reactivity-utilities.html#tovalue) で正規化する）ことができます。

</div>

## props 渡しの詳細 {#prop-passing-details}

### props 名の大文字・小文字の使い分け {#prop-name-casing}

長い名での大文字・小文字の使い分け名は、camelCase（キャメルケース）で宣言します。そうすると、プロパティのキーとして使うときに引用符を使わなくて済みます。camelCase は JavaScript の有効な識別子であるため、以下のようにテンプレート内の式で直接参照できます:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

技術的には、子コンポーネントに props を渡すときにも camelCase を用いることができます（ただし [DOM 内テンプレート](/guide/essentials/component-basics#in-dom-template-parsing-caveats)内を除く）。しかし、常に kebab-case（ケバブケース）を用いて HTML の属性に揃える、以下のような表記が慣例となっています:

```vue-html
<MyComponent greeting-message="hello" />
```

[コンポーネントのタグには、可能な限り PascalCase を用いる](/guide/components/registration#component-name-casing)ことが推奨されます。これは Vue コンポーネントとネイティブ要素の区別が付き、テンプレートの可読性が高まるためです。しかし、props を渡すときに camelCase を用いることには、それほど実用的なメリットがありません。そのため、Vue では各言語の規約に従うことが推奨されます。

### 静的な props と動的な props {#static-vs-dynamic-props}

ここまでで、静的な値として渡す props を見てきました。例:

```vue-html
<BlogPost title="My journey with Vue" />
```

`v-bind` またはそのショートカットである `:` を使って、props を動的に割り当てる例も見てきました。例:

```vue-html
<!-- 変数の値を動的に代入 -->
<BlogPost :title="post.title" />

<!-- 複雑な式の値を動的に代入 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### いろいろな種類の値を渡す {#passing-different-value-types}

上の 2 つは、たまたま文字列の値を渡す例ですが、props には**どんな**種類の値も渡すことができます。

#### 数値 {#number}

```vue-html
<!-- `42` は静的な値ですが、これが文字列ではなく JavaScript の        -->
<!-- 式であることを Vue に伝えるため、v-bind を用いる必要があります。 -->
<BlogPost :likes="42" />

<!-- 変数の値に動的に代入します。 -->
<BlogPost :likes="post.likes" />
```

#### 真偽値 {#boolean}

```vue-html
<!-- 値なしで props を指定すると、暗黙で `true` を指定したことになります。 -->
<BlogPost is-published />

<!-- `false` は静的な値ですが、これが文字列ではなく JavaScript の     -->
<!-- 式であることを Vue に伝えるため、v-bind を用いる必要があります。 -->
<BlogPost :is-published="false" />

<!-- 変数の値に動的に代入します。 -->
<BlogPost :is-published="post.isPublished" />
```

#### 配列 {#array}

```vue-html
<!-- 静的な配列でも、これが文字列ではなく JavaScript の         -->
<!-- 式であることを Vue に伝えるため、v-bind を用いる必要があります。 -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- 変数の値に動的に代入します。 -->
<BlogPost :comment-ids="post.commentIds" />
```

#### オブジェクト {#object}

```vue-html
<!-- 静的なオブジェクトでも、これが文字列ではなく JavaScript の -->
<!-- 式であることを Vue に伝えるため、v-bind を用いる必要があります。 -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- 変数の値に動的に代入します。 -->
<BlogPost :author="post.author" />
```

### オブジェクトを利用した複数のプロパティのバインディング {#binding-multiple-properties-using-an-object}

オブジェクトに含まれるすべてのプロパティを props として渡したい場合には、[引数なしの `v-bind`](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) を使用します（`:prop-name` の代わりに `v-bind`）。例えば、以下のような `post` オブジェクトがあるとします:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

このとき、テンプレートでは以下を用いることができます:

```vue-html
<BlogPost v-bind="post" />
```

これは以下の表記と等価です:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## 一方向のデータフロー {#one-way-data-flow}

すべての props では、子のプロパティと親のプロパティとの間に**一方向バインディング**が形成されます。親のプロパティが更新されたときには子にも流れますが、その逆はありません。これにより、親の状態が誤って子コンポーネントによって変更されてアプリのデータフローが把握しにくくなる、といった事態が防がれます。

さらに、親コンポーネントが更新されるたびに、子コンポーネント内のすべての props は最新の値に更新されます。そのため、子コンポーネント内で props の変更を試みては**いけません**。もし試みると、Vue がコンソールで警告を発します:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ 警告、props は読み取り専用です！
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ 警告、 \props は読み取り専用です！
    this.foo = 'bar'
  }
}
```

</div>

通常、props を変更したい状況には以下の 2 つがあります:

1. **props は初期値を渡すために用いて、それ以降、子コンポーネントではローカルのデータプロパティとして利用したい。** この場合、以下のようにローカルのデータプロパティを定義して、その初期値に props を使用するのが最も適切です:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // props.initialCounter は counter の初期値を指定するためだけに
   // 使われ、今後発生する props の更新からは切り離されます。
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // this.initialCounter は counter の初期値を指定するためだけに
         // 使われ、今後発生する props の更新からは切り離されます。
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **props を、変換する必要がある元の値として渡したい。** この場合、以下のような算出プロパティを定義して、その中で props の値を利用するのが最も適切です:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // props が変更されると自動的に更新される算出プロパティ
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // props が変更されると自動的に更新される算出プロパティ
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### オブジェクト/配列のプロップを変更する {#mutating-object-array-props}

オブジェクトや配列を props として渡した場合、子コンポーネントが props のバインディングを変更することはできませんが、オブジェクトや配列のネストされたプロパティを変更することは**可能です**。これは、JavaScript ではオブジェクトや配列が参照渡しであり、Vue がそのような変更を防ぐのにかかるコストが現実的でないためです。

このような変更の主な欠点は、親コンポーネントにとって明瞭でない方法で子コンポーネントが親の状態に影響を与えることを許してしまい、後からデータの流れを見極めるのが難しくなる可能性があることです。親と子を密に結合させる設計でない限り、ベストプラクティスとしてはそのような変更を避けるべきです。ほとんどの場合、子コンポーネントは[イベントを発行](/guide/components/events)して、変更を親コンポーネントに実行してもらう必要があります。

## props のバリデーション {#prop-validation}

先ほど見た型のように、コンポーネントでは props に対する要件を指定できます。要件が合わないと、Vue がブラウザーの JavaScript コンソールで警告を発します。他の人に使ってもらうことを想定したコンポーネントを開発する場合、これはとても便利です。

 props のバリデーションを指定するには、文字列の配列の代わりに <span class="composition-api">`defineProps()` マクロ</span><span class="options-api">`props` オプション</span>を用いて、バリデーションの要件を持たせたオブジェクトを指定します。例:

<div class="composition-api">

```js
defineProps({
  // 基本的な型チェック
  // （`null` 値と `undefined` 値は、任意の型を許可します）
  propA: Number,
  // 複数の型の可能性
  propB: [String, Number],
  // 必須の文字列
  propC: {
    type: String,
    required: true
  },
  // 必須だが null になる可能性がある文字列
  propD: {
    type: [String, null],
    required: true
  },
  // デフォルト値を持つ数値
  propE: {
    type: Number,
    default: 100
  },
  // デフォルト値を持つオブジェクト
  propF: {
    type: Object,
    // オブジェクトと配列のデフォルトは、ファクトリー関数を使って
    // 返す必要があります。ファクトリー関数は、コンポーネントが
    // 受け取った未加工の props を引数として受け取ります。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // カスタムのバリデーター関数
  // 3.4 以降、全ての props が第 2 引数として渡されます
  propG: {
    validator(value, props) {
      // 値が以下の文字列のいずれかに一致する必要がある
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // デフォルト値を持つ関数
  propH: {
    type: Function,
    // オブジェクトや配列のデフォルトと異なり、これは
    // ファクトリー関数ではなく、デフォルト値として機能する関数です
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
`defineProps()` の引数の中のコードは、コンパイル時に式全体が外側の関数スコープに移されるため、**`<script setup>` 内で宣言している他の変数にアクセスできません** 。
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // 基本的な型チェック
    // （`null` 値と `undefined` 値は、任意の型を許可します）
    propA: Number,
    // 複数の型の可能性
    propB: [String, Number],
    // 必須の文字列
    propC: {
      type: String,
      required: true
    },
    // 必須だが null になる可能性がある文字列
    propD: {
      type: [String, null],
      required: true
    },
    // デフォルト値を持つ数値
    propE: {
      type: Number,
      default: 100
    },
    // デフォルト値を持つオブジェクト
    propF: {
      type: Object,
      // オブジェクトと配列のデフォルトは、ファクトリー関数を使って
      // 返す必要があります。ファクトリー関数は、コンポーネントが
      // 受け取った未加工の props を引数として受け取ります。
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // カスタムのバリデーター関数
    // 3.4 以降、全ての props が第 2 引数として渡されます
    propG: {
      validator(value, props) {
        // 値が以下の文字列のいずれかに一致する必要がある
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // デフォルト値を持つ関数
    propH: {
      type: Function,
      // オブジェクトや配列のデフォルトと異なり、これは
      // ファクトリー関数ではなく、デフォルト値として機能する関数です
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

その他の詳細:

- `required: true` が指定されていないすべての props は、デフォルトでオプションです。

- `Boolean` 以外のオプションの props は、値が指定されないと `undefined` 値になります。

- `Boolean` の props は、値が指定されないと `false` に変換されます。これは `default` を設定すると変更できます。例えば `default: undefined` とすると、非真偽値の props として振る舞います。

- `default` の値を指定すると、解決された props の値が `undefined` の場合に使用されます。props が指定されなかった場合と、明示的に `undefined` 値が渡された場合も、これに含まれます。

props のバリデーションに失敗すると、Vue がコンソールに警告を出します（開発ビルドを使用する場合）。

<div class="composition-api">

[型のみの props 宣言](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" /> を使用する場合、Vue は型アノテーションに基づいて、同等のランタイム props 宣言へのコンパイルをベストエフォートで試みます。例えば、`defineProps<{ msg: string }>` は `{ msg: { type: String, required: true }}` にコンパイルされます。

</div>
<div class="options-api">

::: tip 注意
props のバリデーションは、コンポーネントのインスタンスが生成される**前**に実行されます。そのため、`default` や `validator` 関数の中ではインスタンスのプロパティ（例えば `data`、`computed` など）が使用できないことに注意してください。
:::

</div>

### 実行時の型チェック {#runtime-type-checks}

`type` には、以下のネイティブコンストラクターを指定できます:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

加えて、`type` にはカスタムのクラスやコンストラクター関数を指定することもできます。その場合、`instanceof` チェックによってアサーションが行われます。例えば、次のクラスがあったとします:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

これを props の型として用いるとします:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue は `instanceof Person` を使って、`author` props の値が本当に `Person` クラスのインスタンスであるかどうかを検証しています。

## null になる可能性がある型 {#nullable-type}

型が必須だが null になる可能性がある場合、`null` を含む配列構文を使用できます:

<div class="composition-api">

```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```

</div>

もし配列構文を使用せず `type` に `null` だけを指定した場合、任意の型を許可することに注意してください。

## 真偽値の型変換 {#boolean-casting}

`Boolean` 型の props は、ネイティブの真偽値の属性が振る舞う様子を模倣するために、特殊な型変換の規則を持っています。次のような宣言を含む `<MyComponent>` があるとします:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

このコンポーネントは、次のように使用できます:

```vue-html
<!-- :disabled="true" を渡すのと同等 -->
<MyComponent disabled />

<!-- :disabled="false" を渡すのと同等 -->
<MyComponent />
```

props が複数の型を許容するように宣言されている場合、`Boolean` のキャストルールも適用されます。ただし、`String` と `Boolean` の両方が許可されている場合は、Boolean のキャストルールは String の前に Boolean が現れる場合のみ適用されるという特別な状況があります:

<div class="composition-api">

```js
// disabled は true にキャストされます
defineProps({
  disabled: [Boolean, Number]
})

// disabled は true にキャストされます
defineProps({
  disabled: [Boolean, String]
})

// disabled は true にキャストされます
defineProps({
  disabled: [Number, Boolean]
})

// disabled は空文字列としてパースされます（disabled=""）
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled は true にキャストされます
export default {
  props: {
    disabled: [Boolean, Number]
  }
}

// disabled は true にキャストされます
export default {
  props: {
    disabled: [Boolean, String]
  }
}

// disabled は true にキャストされます
export default {
  props: {
    disabled: [Number, Boolean]
  }
}

// disabled は空文字列としてパースされます（disabled=""）
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
