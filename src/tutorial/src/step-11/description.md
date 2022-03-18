# コンポーネント

ここまでは、1 つのコンポーネントだけを扱ってきました。実際の Vue アプリケーションは、多くはネストされたコンポーネントで作成されます。

親コンポーネントは、そのテンプレートにある別のコンポーネントを子コンポーネントとしてレンダリングすることができます。子コンポーネントを使用するには、まずそれをインポートする必要があります:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

また、`components` オプションを使用して、コンポーネントを登録する必要があります。ここでは、オブジェクトプロパティのショートハンドを使って、 `ChildComp` コンポーネントを `ChildComp` キーの下に登録しています。

</div>
</div>

<div class="sfc">

そして、そのコンポーネントをテンプレート内で次のように使用することができます:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.vue'

createApp({
  components: {
    ChildComp
  }
})
```

また、`components` オプションを使用して、コンポーネントを登録する必要があります。ここでは、オブジェクトプロパティのショートハンドを使用して、 `ChildComp` コンポーネントを `ChildComp` キーに登録しています。

DOM にテンプレートを書いているので、タグ名の大文字と小文字を区別しないブラウザーの解析ルールに従います。そのため、子コンポーネントを参照するには、ケバブケースを使用する必要があります。

```vue-html
<child-comp></child-comp>
```

</div>


今度は自分でやってみましょう - 子コンポーネントをインポートして、テンプレートにレンダリングしてみましょう。
