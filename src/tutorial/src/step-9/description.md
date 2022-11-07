# ライフサイクルとテンプレート参照 {#lifecycle-and-template-refs}

これまで Vue はリアクティビティーと宣言的レンダリングのおかげですべての DOM 更新を処理してくれました。しかし、必然的に DOM を手動で操作する必要がある場合があります。

<a target="_blank" href="/api/built-in-special-attributes.html#ref">特別な `ref` 属性</a>（例：テンプレート内の要素）をつかって、テンプレート参照が要求できます：

```vue-html
<p ref="p">hello</p>
```

<div class="composition-api">

ref にアクセスするには、一致する名前を定義<span class="html">して公開</span>する必要があります：

<div class="sfc">

```js
const p = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const p = ref(null)

  return {
    p
  }
}
```

</div>

ref は `null` で初期化されることに注目してください。これは <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> が実行時に要素がまだ存在されないためです。テンプレート参照はコンポーネントが**マウントした後**でないとアクセスできません。

マウントした後のコードを実施したい場合、`onMounted()` の関数が使えます：

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // コンポーネントがマウントされました。
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // コンポーネントがマウントされました。
    })
  }
})
```

</div>
</div>

<div class="options-api">

要素が `this.$refs` は `this.$refs.p` として公開されますが、コンポーネントが**マウントされた後**でないとにアクセスできません。

マウントした後のコードを実施したい場合、`mounted` の option が使えます：

<div class="sfc">

```js
export default {
  mounted() {
    // コンポーネントがマウントされました。
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // コンポーネントがマウントされました。
  }
})
```

</div>
</div>

これは**ライフサイクルフック**とよばれます。コンポーネントライフサイクルの特定の時に呼び出されるコールバックが登録できます。他にも <span class="options-api">`created` と `updated`</span><span class="composition-api">`onUpdated` と `onUnmounted`</span> があります。詳しくは<a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">ライフサイクルダイアグラム</a>を参照してください。

では、 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> のフックを追加し、`<p>` の要素が<span class="options-api">`this.$refs.p`</span><span class="composition-api">`p.value`</span>でアクセスして直接に DOM の操作（例:`textContent` の変更）をしてみましょう。
