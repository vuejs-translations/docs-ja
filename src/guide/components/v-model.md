# コンポーネントの v-model {#component-v-model}

## 基本的な使い方 {#basic-usage}

コンポーネント上で `v-model` を使用すると双方向バインディングを実装できます。

<div class="composition-api">

Vue 3.4 以降は、[`defineModel()`](/api/sfc-script-setup#definemodel) マクロを使うことが推奨されています:

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```

親は `v-model` で値をバインドできます:

```vue-html
<!-- Parent.vue -->
<Child v-model="countModel" />
```

`defineModel()` が返す値は ref です。他の ref と同じようにアクセスしたり変更したりできますが、親の値とローカルの値の双方向バインディングとして動作する点が異なります:

- その `.value` は親の `v-model` にバインドされた値と同期される。
- 子が `.value` を変更すると、親にバインドされている値も更新される。

つまり、`v-model` を使ってネイティブの入力要素にこの ref をバインドすることもでき、同じ `v-model` の使い方を提供しながら、ネイティブの入力要素をラップするのが簡単になります:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### 内部の仕組み {#under-the-hood}

`defineModel` は便利なマクロです。コンパイラーはこれを次のように展開します:

- `modelValue` という名前の props: ローカル ref の値が同期されます。
- `update:modelValue` という名前のイベント: ローカル ref の値が変更された時に発行されます。

3.4 以前は、上記の子コンポーネントはこのように実装されていました:

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

すると、親コンポーネントの `v-model="modelValue"` は次のようにコンパイルされます:

```vue-html
<!-- Parent.vue -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

見ての通り、かなり冗長です。ただ、内部で何が起こっているのかを理解するのに役立ちます。

`defineModel` は props を宣言するので、元となる props のオプションを `defineModel` に渡して宣言できます:

```js
// v-model を必須にする
const model = defineModel({ required: true })

// デフォルト値を提供する
const model = defineModel({ default: 0 })
```

:::warning
もし `defineModel` props に `default` 値を指定し、親コンポーネントからこの props に何も値を与えなかった場合、親と子のコンポーネント間で同期が取れなくなる可能性があります。以下の例では、親コンポーネントの `myRef` は undefined ですが、子コンポーネントの `model` は 1 です:

```js
// 子コンポーネント:
const model = defineModel({ default: 1 })

// 親コンポーネント:
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

</div>

<div class="options-api">

最初に、ネイティブ要素で `v-model` がどのように使われるかを再確認してみましょう:

```vue-html
<input v-model="searchText" />
```

テンプレートコンパイラーはその内部で、 `v-model` を冗長な同じ内容に展開してくれます。つまり、上のコードは以下と同じことをするわけです:

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

コンポーネントで使用する場合はその代わり、`v-model` は以下のように展開されます:

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

しかし、これを実際に動作させるためには、`<CustomInput>` コンポーネントは次の 2 つのことをしなければなりません:

1. ネイティブの `<input>` 要素の `value` 属性を、`modelValue` props にバインドする
2. ネイティブの `input` イベントがトリガーされたら、新しい値で `update:modelValue` カスタムイベントを発行する

実際には次のようになります:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

これで `v-model` はこのコンポーネントで完全に動作するはずです:

```vue-html
<CustomInput v-model="searchText" />
```

[Playground で試す](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

このコンポーネントで `v-model` を実装するもう 1 つの方法は、getter と setter の両方を持つ、書き込み可能な `computed` プロパティを使用することです。`get` メソッドは `modelValue` プロパティを返し、`set` メソッドは対応するイベントを発行する必要があります:

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## `v-model` の引数 {#v-model-arguments}

コンポーネントの `v-model` にも引数を指定できます:

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

子コンポーネントでは、`defineModel()` の第一引数に文字列を渡すことで、対応する引数をサポートできます:

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqFU9tu2zAM/RVBKOAWyGIM25PhFbugDxuwC7a+VX3wEiZ1K0uCRHkuDP/7SKlxk16BILbIQ/KcQ3mUn5xb9hFkJeuw8q3DU2XazlmP4vvtF0tvBgyKjbedKJblXozLCmWUgSHB17BpokYxKiPEaocKlRgPOk0Lzq8bbI5PMlYIDxi92Z2E+GvtzXmLGipR9G86uwYtGr+NHTeAoemc5tEMnfhBf/Sry1kBHRAI1SDQSYj66u3pON73FdNUlxRLuX12d9MqZNQHJecKJUVJ8Lqc+8qFfODGgYlPueK8dWTIRZHaF5fJCuhadumiiI5cgTy6uHxVUmtcxGwC3jomizCgkjlU9Y2OKZjZ5+jHVETRI556fDhyIY6gZylIXgMp4g4nufSxdgwrazbtdnkdrCHlSaCSvPhWg//psLUmKEn7z7OVbLS2/76lGPoISX2quYLVzRPx6zBwTMlfHgL4nmTMucwxp8/+/EjK5yTtMLLoF5K/IVgdmWOGfY5mTbT3cInt1/QptGZ7Hs4GBBN2ophounoJryStn+/Cc9Lv6b5bvt9dWTn9B6F1Lrs=)

props のオプションも必要な場合は、モデル名の後に渡します:

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>3.4 以前の使用法</summary>

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

この場合、デフォルトの `modelValue` props と `update:modelValue` イベントの代わりに、子コンポーネントは `title` props を受け取り、親コンポーネントの値を更新するためには `update:title` イベントを発行します:

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## 複数の `v-model` のバインディング {#multiple-v-model-bindings}

先ほど [`v-model` の引数](#v-model-arguments)で学んだように、特定の props とイベントをターゲットにする機能を活用することで、1 つのコンポーネントインスタンスに複数の `v-model` バインディングを作成できるようになりました。

各 `v-model` は、コンポーネントで追加のオプションを必要とせずに、別の props に同期します:

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>3.4 以前の使用法</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## `v-model` 修飾子の処理 {#handling-v-model-modifiers}

フォームの入力バインディングについて学習しているときに、`v-model` には [組み込みの修飾子](/guide/essentials/forms#modifiers)（`.trim`, `.number`, `.lazy`）があることを確認しました。場合によっては、カスタム入力コンポーネントの `v-model` でカスタム修飾子をサポートしたいかもしれません。

カスタム修飾子の例として、`v-model` バインディングによって提供される文字列の最初の文字を大文字にする `capitalize` を作成してみましょう:

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

コンポーネントの `v-model` に追加された修飾子は、`defineModel()` の戻り値を次のように分割代入することで、子コンポーネント内でアクセスできます:

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

修飾子に基づいて値の読み書きを条件付きで調整するために、`defineModel()` に `get` と `set` オプションを渡すことができます。これら 2 つのオプションは、モデルの ref の読み取り・設定時に値を受け取り、変換された値を返す必要があります。以下は `set` オプションを使って `capitalize` 修飾子を実装する方法です:

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

<details>
<summary>3.4 以前の使用法</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

コンポーネント `v-model` に追加された修飾子は、`modelModifiers` props を通じてコンポーネントに提供されます。以下の例では、`modelModifiers` props を含むコンポーネントを作成しています。これはデフォルトでは空のオブジェクトです:

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

コンポーネントの `modelModifiers` props に `capitalize` が含まれており、その値が `true` であることに注目してください。これは、`v-model` バインディングに `v-model.capitalize="myText"` が設定されているためです。

これで props の設定ができたので、`modelModifiers` オブジェクトのキーをチェックして、発行された値を変更するハンドラーを書くことができます。以下のコードでは、`<input />` 要素が `input` イベントを発火するたびに、文字列の最初を大文字にしています。

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### 引数を持つ `v-model` の修飾子 {#modifiers-for-v-model-with-arguments}

<div class="options-api">

引数と修飾子の両方を持つ `v-model` バインディングの場合、生成される props の名前は `arg + "Modifiers"` になります。例えば:

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

対応する宣言は次のとおりです:

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

以下は異なる引数を持つ複数の `v-model` で修飾子を使用するもう 1 つの例です:

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

<details>
<summary>3.4 以前の使用法</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true }
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true }
  }
}
</script>
```

</div>
