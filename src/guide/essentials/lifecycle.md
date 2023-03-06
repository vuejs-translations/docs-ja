# ライフサイクルフック {#lifecycle-hooks}

各 Vue コンポーネントインスタンスは、生成時に一連の初期化を行います - 例えば、データ監視のセットアップ、テンプレートのコンパイル、インスタンスの DOM へのマウント、データ変更時の DOM の更新が必要になります。その過程で、ライフサイクルフックと呼ばれる関数も実行され、ユーザーは特定の段階で独自のコードを追加することが可能です。

## ライフサイクルフックの登録 {#registering-lifecycle-hooks}

例えば、<span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> フックは、コンポーネントが最初のレンダリングを終了し DOM ノードを生成した後に、コードを実行するのに使用することができます:

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`コンポーネントがマウントされました。`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`コンポーネントがマウントされました。`)
  }
}
```

</div>

インスタンスのライフサイクルのさまざまな段階で呼び出されるフックは他にもあり、最も一般的に使用されるのは <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted)、 [`onUpdated`](/api/composition-api-lifecycle#onupdated) および [`onUnmounted`](/api/composition-api-lifecycle#onunmounted)</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted)、 [`updated`](/api/options-lifecycle#updated) および [`unmounted`](/api/options-lifecycle#unmounted)</span> です。

<div class="options-api">

すべてのライフサイクルフックは、呼び出し元の現在アクティブなインタンスを指す `this` とともに呼び出されます。これはライフサイクルフックを宣言するときにアロー関数の使用を避けるべきであることを意味します。アロー関数を使用した場合、 `this` を介してコンポーネントインスタンスにアクセスできなくなるためです。

</div>

<div class="composition-api">

`onMounted` を呼び出すと、 Vue は登録されたコールバック関数を現在アクティブなコンポーネントインスタンスと自動的に関連づけます。これには、コンポーネントのセットアップ中にこれらのフックが **同期的に** 登録される必要があります。例えば、次のようなことはしないください:

```js
setTimeout(() => {
  onMounted(() => {
    // これは機能しません。
  })
}, 100)
```

これは、ライフサイクルフックの呼び出しを `setup()` や `<script setup>` 内に辞書的に配置しなければならないという意味ではないことに注意してください。`onMounted()` は、コールスタックが同期していて `setup()` 内から発生していれば、外部関数で呼び出すことができます。

</div>

## ライフサイクルダイアグラム {#lifecycle-diagram}

以下は、インスタンスライフサイクルのダイアグラムです。今すべてを完全に理解する必要はありませんが、さらに学習して構築するにつれて、有用なリファレンスになるでしょう。

![Component lifecycle diagram](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

すべてのライフサイクルフックとそれぞれのユースケースの詳細については、<span class="composition-api">[ライフサイクルフック API リファレンス](/api/composition-api-lifecycle)</span><span class="options-api">[ライフサイクルフック API リファレンス](/api/options-lifecycle)</span> を参照してください。
