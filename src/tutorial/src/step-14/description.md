# スロット {#slots}

props を経由したデータの受け渡しだけでなく、親コンポーネントはテンプレートフラグメントを **スロット** を経由して子コンポーネントへ渡すこともできます:

<div class="sfc">

```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```

</div>

子コンポーネントでは、 `<slot>` 要素をアウトレットとして使用し、親コンポーネントからのスロットコンテンツをレンダリングできます:

<div class="sfc">

```vue-html
<!-- in child template -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- in child template -->
<slot></slot>
```

</div>

`<slot>` アウトレット内のコンテンツは、"フォールバック" コンテンツとして扱われます。親コンポーネントがスロットコンテンツを渡さなかった場合に表示されます:

```vue-html
<slot>Fallback content</slot>
```

現在は `<ChildComp>` へスロットコンテンツを渡していないので、フォールバックの内容が確認できるはずです。親コンポーネントの `msg` の状態を利用しつつ、子コンポーネントにいくつかスロットコンテンツを提供してみましょう。
