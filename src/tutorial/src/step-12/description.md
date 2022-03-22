# Props

子コンポーネントは、親コンポーネントから **props** を介して入力を受け取ることができます。 まず、受け入れる props を宣言する必要があります:

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

`defineProps()` はコンパイル時マクロで、インポートする必要もないことに注意してください。一度宣言すると、`msg` プロパティは子コンポーネントのテンプレートで使用することができます。また `defineProps()`の返すオブジェクトを介して、JavaScript でアクセスすることができます。

</div>

<div class="html">

```js
// in child component
export default {
  props: {
    msg: String
  },
  setup(props) {
    // access props.msg
  }
}
```

一度宣言すると、`msg` プロパティは `this` に出力され、子コンポーネントのテンプレートで使用できるようになります。受け取った props は `setup()` に第一引数として渡されます。

</div>

</div>

<div class="options-api">

```js
// in child component
export default {
  props: {
    msg: String
  }
}
```

一旦宣言されると、 `msg` プロパティは `this` に出力され、子コンポーネントのテンプレートで使用することができるようになります。

</div>

親は属性と同じように、prop を子に渡すことができます。動的な値を渡すには、`v-bind` という構文も使えます。

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

今度は自分でエディターで試してみてください。
