# Options API とともに TypeScript を使用する

> このページは [TypeScript で Vue を使用する](./overview) ページの内容をすでに読んでいることを前提にしています。

:::tip
Vue は Options API での TypeScript の使用をサポートしていますが、よりシンプルで効率的、かつ堅牢な型推論を提供するため、Composition API で TypeScript と一緒に Vue を使用することが推奨されます。
:::

## コンポーネントの props の型付け

Options API における props の型推論は、コンポーネントを `defineComponent()` でラップする必要があります。そうすることで、Vue は `props` オプションを元に、`required: true` や、 `default` などの追加のオプションを考慮した上で、props の型を推論することができるようになります。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 型推論が有効
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // type: string | undefined
    this.id // type: number | string | undefined
    this.msg // type: string
    this.metadata // type: any
  }
})
```

しかし、ランタイムの `props` オプションは、prop の型としてコンストラクタを使用することのみをサポートしており、ネストされたプロパティや function call signature を持つオブジェクトなどのような複雑な型を指定する方法はありません。

それらの複雑な props の型注釈をつけるには、`PropType` ユーティリティーを使用します:

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // `Object` に、より詳細な型を提供する
      type: Object as PropType<Book>,
      required: true
    },
    // 関数も同様に型付けできる
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: argument of type 'string' is not
    // assignable to parameter of type 'number'
    this.callback?.('123')
  }
})
```

### 注意事項

TypeScript の [設計上の制限](https://github.com/microsoft/TypeScript/issues/38845) により、`validator` と `default` の prop オプションに関数を使用する場合は注意が必要です - 必ずアロー関数を使うようにしてください:

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 必ずアロー関数を使用する
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

これにより、TypeScript はこれらの関数内で `this` の型を推論する必要がなくなり、それによって、残念ながら型推論に失敗するかもしれません。

## コンポーネントの emit の型付け

`emits` オプションのオブジェクトシンタックスを使うことで、発行されたイベントに期待されるペイロードの型を宣言することができます。また、宣言されていないイベントの発行は、以下のように型エラーになります:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // ランタイムでバリデーションが実行される
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 型エラー!
      })

      this.$emit('non-declared-event') // 型エラー!
    }
  }
})
```

## 算出プロパティの型付け

算出プロパティは、戻り値によって型が推論されます:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // type: string
  }
})
```

場合によっては、算出プロパティに明示的に型注釈を行って、実装が正しいことを確認したい場合があります:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 戻り値の明示的な型付け
    greeting(): string {
      return this.message + '!'
    },

    // 書き込み可能な算出プロパティの型付け
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

また、TypeScript が循環推論ループのために算出プロパティの型を推論できないようなエッジケースでも、明示的な型注釈が必要になる場合があります。

## イベントハンドラーの型付け

ネイティブ DOM イベントを扱う場合、イベントハンドラーに渡す引数を正しく型付けしておくと便利な場合があります。次の例を見てみましょう:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` は、暗黙の `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

type annotation (型注釈) が無い場合、`event` 引数は暗黙の `any` 型になります。`tsconfig.json` で `"strict": true` や `"noImplicitAny": true` にしている場合、これは型エラーになります。そのため、明示的にイベントハンドラーの引数を型付けすることが推奨されます。加えて、`event` のプロパティを明示的に型アサーションする必要があるかもしれません:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## グローバルなプロパティの拡張

プラグインによっては、[`app.config.globalProperties`](/api/application.html#app-config-globalproperties) を通じて、すべてのコンポーネントインスタンスにグローバルに利用可能なプロパティを追加するものがあります。例えば、データ取得のために `this.$http` をインストールしたり、国際化のために `this.$translate` を追加したりすることができます。これを TypeScript とうまく連携させるために、Vue は [TypeScript のモジュール拡張 (TypeScript module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) で拡張できるように設計された `ComponentCustomProperties` インターフェイスを公開しています。

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

参照:

- [コンポーネントの型拡張の TypeScript の単体テスト](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)

### 型拡張の配置

この型拡張は `.ts` ファイルに入れるか、プロジェクト全体の `*.d.ts` ファイルに入れることができます。どちらにしても、必ず `tsconfig.json` でそのファイルが include されているようにしてください。ライブラリやプラグインの作者の場合、このファイルは `package.json` の `types` プロパティで指定されている必要があります。

モジュール拡張を利用するためには、拡張が [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html) に配置されている必要があります。つまり、そのファイルには少なくとも 1 つのトップレベルの `import` または `export` (単なる `export {}` であったとしても) が含まれている必要があります。もし拡張がモジュールの外に置かれた場合、元の型を拡張するのではなく、上書きしてしまいます !

## カスタムオプションの拡張

例えば `vue-router` のようなプラグインは `beforeRouteEnter` のようなカスタムコンポーネントオプションを提供します:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

適切に型の拡張がされないと、このフックの引数は暗黙の `any` 型を持つことになります。これらのカスタムオプションをサポートするために、 `ComponentCustomOptions` インターフェースを拡張することができます。

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

これで `beforeRouteEnter` オプションが適切に型付けされるようになります。これは単なる例であり、 `vue-router` のような型付けのしっかりしたライブラリーは、自動的にこれらの拡張を自身の型定義で行うはずであることに注意してください。

この拡張の配置は、グローバルプロパティの拡張と [同じ制限](#グローバルなプロパティの拡張) に従います。

参照:

- [コンポーネントの型拡張の TypeScript の単体テスト](https://github.com/vuejs/core/blob/main/test-dts/componentTypeExtensions.test-d.tsx)
