# オプション: その他 {#options-misc}

## name {#name}

コンポーネントの表示名を明示的に宣言します。

- **型**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **詳細**

  コンポーネントの名称は以下のように使用されます:

  - コンポーネント自身のテンプレートで再帰的な自己参照
  - Vue DevTools のコンポーネントインスペクションツリーでの表示
  - 警告のコンポーネントトレースでの表示

  単一ファイルコンポーネントを使用する場合、コンポーネントはすでにファイル名から自身の名前を推測しています。例えば、`MyComponent.vue` という名前のファイルは、推測された表示名 "MyComponent" を持つことになります。

  また、[`app.component`](/api/application#app-component) でコンポーネントをグローバル登録すると、グローバル ID が名前として自動的に設定されるケースもあります。

  `name` オプションは、推測された名前を上書きしたり、名前が推測できないとき（例: ビルドツールを使用していないときや、インラインの非 SFC コンポーネント）に明示的に名前を指定したりできます。

  `name` が明示的に必要となるケースがひとつあります: [`<KeepAlive>`](/guide/built-ins/keep-alive) のキャッシュ可能なコンポーネントに対して、`include / exclude` プロパティでマッチングする場合です。

  :::tip
  バージョン 3.2.34 以降、`<script setup>` を使用した単一ファイルコンポーネントは、ファイル名から `name` オプションを自動的に推測します。これにより、`<KeepAlive>` と共に使用した場合でも、手動で名前を宣言する必要がなくなりました。
  :::

## inheritAttrs {#inheritattrs}

デフォルトのコンポーネント属性のフォールスルー動作を有効にするかどうかを制御します。

- **型**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **詳細**

  デフォルトでは、prop として認識されない親スコープ属性のバインディングは「フォールスルー」されます。つまり、単一ルートコンポーネントの場合、これらのバインディングは通常の HTML 属性として子コンポーネントのルート要素に適用されます。ターゲット要素や他のコンポーネントをラップするコンポーネントを作成する場合、これは必ずしも望ましい動作とは限りません。`inheritAttrs` を `false` に設定することで、このデフォルトの挙動を無効にできます。属性は `$attrs` インスタンスプロパティを介して利用でき、`v-bind` を使用して非ルート要素に明示的にバインドできます。

- **例**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  `<script setup>` を使用するコンポーネントでこのオプションを宣言する場合、別の `<script>` ブロックが必要です:

  ```vue
  <script>
  export default {
    inheritAttrs: false
  }
  </script>

  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  3.3 以降では、`<script setup>` で直接 `defineOptions` を使用することもできます:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({ inheritAttrs: false })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **参照** [フォールスルー属性](/guide/components/attrs)

## components {#components}

コンポーネントインスタンスで利用できるようにするコンポーネントを登録するオブジェクト。

- **型**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **例**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // ショートハンド
      Foo,
      // 別名で登録
      RenamedBar: Bar
    }
  }
  ```

- **参照** [コンポーネントの登録](/guide/components/registration)

## directives {#directives}

コンポーネントインスタンスで利用できるようにするディレクティブを登録するオブジェクト。

- **型**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **例**

  ```js
  export default {
    directives: {
      // テンプレート内で v-focus を有効化する
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

  コンポーネントインスタンスで使用可能なディレクティブのハッシュ。

- **参照** [カスタムディレクティブ](/guide/reusability/custom-directives)
