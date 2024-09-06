# Composition API: ヘルパー {#composition-api-helpers}

## useAttrs() {#useattrs}

現在のコンポーネントの[フォールスルー属性](/guide/components/attrs#fallthrough-attributes)を含む、[Setup Context](/api/composition-api-setup#setup-context) からの `attrs` オブジェクトを返します。これは Setup Context オブジェクトが利用できない `<script setup>` での利用を意図しています。

- **型**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

仮想 DOM ノードを返す呼び出し可能な関数として、親に渡されたスロットを含む [Setup Context](/api/composition-api-setup#setup-context) か `slots` オブジェクトを返します。これは Setup Context オブジェクトが利用できない `<script setup>` での利用を意図しています。

TypeScript を使用する場合は、代わりに [`defineSlots()`](/api/sfc-script-setup#defineslots) を優先すべきです。

- **型**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

これは、[`defineModel()`](/api/sfc-script-setup#definemodel) を動かすための基礎となるヘルパーです。`<script setup>` を使用する場合は、`defineModel()` を使用することを推奨します。

- 3.4+から使用可能

- **型**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  )

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }
  ```

- **例**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **詳細**

  `useModel()` は、例えば生の `setup()` 関数を使用する場合など、SFC 以外のコンポーネントで使用することができます。第一引数として `props` オブジェクトを、第二引数としてモデル名を指定します。オプションの第三引数は、結果の ref モデルに対してカスタムゲッターとカスタムセッターを宣言するために使われます。`defineModel()` とは異なり、props や emits の宣言は自身で行うことに注意してください。

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

一致する ref 属性を持つテンプレート要素、またはコンポーネントと値が同期される shallow ref を返します。

- **型**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **例**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **参照**
  - [ガイド - テンプレート参照](/guide/essentials/template-refs)
  - [ガイド - テンプレート参照の型付け](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [ガイド - コンポーネントのテンプレート参照の型付け](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

アクセシビリティ属性やフォーム要素に対して、アプリケーションごとに一意な ID を生成するために使用します。

- **型**

  ```ts
  function useId(): string
  ```

- **例**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **詳細**

  `useId()` で生成された ID はアプリケーションごとに一意なものになります。フォーム要素やアクセシビリティ属性の ID を生成するために使用できます。同じコンポーネントで複数回呼び出すと、異なる ID が生成されます。`useId()` を呼び出す同じコンポーネントの複数のインスタンスも、異なる ID を持つことになります。

  `useId()` で生成された ID は、サーバとクライアントのレンダー間で安定していることが保証されているため、SSR アプリケーションでもハイドレーションミスマッチを起こすことなく使用できます。

  同じページ内に複数の Vue アプリケーションのインスタンスがある場合、[`app.config.idPrefix`](/api/application#app-config-idprefix)を使用して各アプリケーションに ID プレフィックスを与えることで、ID の衝突を避けることができます。
