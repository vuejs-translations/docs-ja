# エミット {#emits}

props を受け取るだけでなく、子コンポーネントは親コンポーネントにイベントを発行することもできます:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// 発行されるイベントを宣言します
const emit = defineEmits(['response'])

// 引数つきで発行
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // 発行されるイベントを宣言します
  emits: ['response'],
  setup(props, { emit }) {
    // 引数つきで発行
    emit('response', 'hello from child')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // 発行されるイベントを宣言します
  emits: ['response'],
  created() {
    // 引数つきで発行
    this.$emit('response', 'hello from child')
  }
}
```

</div>

<span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> の第一引数はイベント名です。追加の引数は、イベントリスナーに渡されます。

親は `v-on` を使って子が発行するイベントを購読できます。ここでは、ハンドラーは子の emit 呼び出しから追加の引数を受け取り、それをローカルステートに割り当てています:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

では、自分でエディターで試してみてください。
