---
outline: deep
---

# レンダリングの仕組み {#rendering-mechanism}

Vue はどのようにしてテンプレートを取得して実際の DOM に変換しているのでしょうか？　Vue はどうやって DOM ノードを効率的に更新しているのでしょうか？ここでは Vue 内部のレンダリングのメカニズムに踏み込んで、これらの疑問に光を当ててみたいと思います。

## 仮想 DOM {#virtual-dom}

Vue のレンダリングシステムがベースとしている「仮想 DOM」という言葉を聞いたことはあるかと思います。

仮想 DOM（VDOM）とは、UI の理想的な、または"仮想"表現をメモリー内に保持し、"実際の" DOM と同期させるというプログラミングの概念です。このコンセプトは [React](https://reactjs.org/) によって開拓され、Vue を含む他の多くのフレームワークで、異なる実装で採用されています。

仮想 DOM は特定の技術というよりパターンなので、1 つの標準的な実装というものはありません。簡単な例を使って、その考え方を説明しましょう:

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 多くの vnode */
  ]
}
```

ここで、`vnode` は `<div>` 要素を表すプレーンな JavaScript オブジェクト（"仮想ノード"）です。これは、実際の要素を作成するために必要なすべての情報を含んでいます。さらに、子ノードも含んでいて、仮想 DOM ツリーのルートとなります。

ランタイムのレンダラーは、仮想 DOM ツリー内を走査して、実際の DOM ツリーを構築することができます。この処理を**マウント**と呼びます。

仮想 DOM ツリーのコピーが 2 つある場合、レンダラーは 2 つのツリーを走査して比較し、その違いを把握して、その変更を実際の DOM に適用することもできます。このプロセスは**パッチ**と呼ばれ、または"差分"や"リコンシリエーション"とも呼ばれます。

仮想 DOM の主な利点は、DOM の直接的な操作はレンダラーに任せ、開発者は宣言的な方法で希望する UI 構造をプログラム的に作成、検査、合成できることです。

## レンダーパイプライン {#render-pipeline}

大まかには、Vue のコンポーネントがマウントされると、以下のようなことが起こります:

1. **コンパイル**: Vue のテンプレートは、仮想 DOM ツリーを返す関数である **レンダー関数**にコンパイルされます。このステップは、ビルドステップで事前に行うか、ランタイムコンパイラーを使用してその場で行うことができます。

2. **マウント**: ランタイムレンダラーはレンダー関数を呼び出し、返された仮想 DOM ツリーを走査して、それに基づいて実際の DOM ノードを作成します。このステップは、[リアクティブエフェクト](./reactivity-in-depth) として実行されるため、使用されたすべてのリアクティブな依存関係を追跡します。

3. **パッチ**: マウント中に使用される依存関係が変更されると、エフェクトが再実行されます。このとき、更新された新しい仮想 DOM ツリーが作成されます。ランタイムレンダラーは新しいツリーを走査して、古いツリーと比較し、必要な更新を実際の DOM に適用します。

![レンダーパイプライン](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## テンプレート vs. レンダー関数 {#templates-vs-render-functions}

Vue のテンプレートは、仮想 DOM レンダー関数にコンパイルされます。また、Vue はテンプレートのコンパイルステップをスキップしてレンダー関数を直接書ける API を提供しています。レンダー関数は、JavaScript のパワーすべてを使って vnode を操作できます。そのため、高度に動的なロジックを扱う場面において、テンプレートよりも柔軟性があります。

では、なぜ Vue はデフォルトでテンプレートを推奨しているのでしょうか？理由はいくつかあります:

1. テンプレートは、実際の HTML に近いものになっています。これにより、既存の HTML スニペットの再利用、アクセシビリティーベストプラクティスの適用、CSS によるスタイル付け、デザイナーが理解し修正することが容易になります。

2. テンプレートは、より決定論的な構文であるため、より静的な解析がしやすくなっています。これにより、Vue のテンプレートコンパイラーは多くのコンパイル時の最適化を適用でき、仮想 DOM のパフォーマンスを向上させることができます（これについては後ほど説明します）。

実際、アプリケーションのほとんどのユースケースはテンプレートで十分です。通常、レンダー関数は高度に動的なレンダリングロジックを扱う必要がある再利用可能なコンポーネントでのみ使用されます。レンダー関数の使用法については、[レンダー関数と JSX](./render-function) で詳しく説明しています。

## コンパイラー情報に基づく仮想 DOM {#compiler-informed-virtual-dom}

React の仮想 DOM 実装や他のほとんどの仮想 DOM 実装は完全にランタイムです:照合アルゴリズムは入力される仮想 DOM ツリーを予想できないため、正確さの確保のためにツリー全体をトラバースして、すべての vnode の props の差分を比較する必要があります。加えて、ツリーの一部が変更されない場合でも再レンダリングのたびに新しい vnode が作成されるため、不要なメモリー負荷が発生します。これは仮想 DOM の最も批判される点の 1 つです:やや強引な照合プロセスは、宣言性と正確さと引き換えに効率を犠牲にしているのです。

ですが、このようにする必要はないのです。Vue では、フレームワークがコンパイラーとランタイムの両方を制御します。これにより、緊密に結合されたレンダラーだけが利用できる、多くのコンパイル時の最適化を実装することができます。コンパイラーは、テンプレートを静的に解析し、生成されたコードにヒントを残して、ランタイムが可能な限りショートカットを行えるようにすることができます。同時に、エッジケースでより直接的に制御するために、ユーザーがレンダー関数レイヤーにドロップダウンする機能も残しています。このハイブリッドなアプローチを **コンパイラー情報に基づく仮想 DOM** と呼びます。

以下では、Vue テンプレートコンパイラーが仮想 DOM の実行時パフォーマンスを向上させるために行った、主要な最適化についていくつか解説します。

### 静的な部分のキャッシュ {#cache-static}

テンプレートには、動的バインディングを含まない部分がよくあります:

```vue-html{2-3}
<div>
  <div>foo</div> <!-- cached -->
  <div>bar</div> <!-- cached -->
  <div>{{ dynamic }}</div>
</div>
```

[テンプレートエクスプローラーで観察する](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGNhY2hlZCAtLT5cbiAgPGRpdj5iYXI8L2Rpdj4gPCEtLSBjYWNoZWQgLS0+XG4gIDxkaXY+e3sgZHluYW1pYyB9fTwvZGl2PlxuPC9kaXY+XG4iLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)

`foo` と `bar` の div は静的なので、再レンダリングのたびに vnode を再作成して差分を取ることは不要です。レンダラーは、最初のレンダリング時にこれらの vnode を作成し、キャッシュして、その後の再レンダリングのたびに同じ vnode を再利用します。レンダラーは古い vnode と新しい vnode が同じものであることに認識した場合、それらの差分比較を完全にスキップすることもできます。

加えて、連続する静的要素が十分にある場合、これらのノードのプレーンな HTML 文字列を含む単一の "静的 vnode" に凝縮されます（[例](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)）。これらの静的 vnode は、`innerHTML` を直接設定してマウントされます。

### パッチフラグ {#patch-flags}

動的バインディングを持つ単一の要素については、コンパイル時にそこから多くの情報を推論することもできます:

```vue-html
<!-- クラスバインディングのみ -->
<div :class="{ active }"></div>

<!-- id と value バインディングのみ -->
<input :id="id" :value="value">

<!-- text の子のみ -->
<div>{{ dynamic }}</div>
```

[テンプレートエクスプローラーで覗いてみる](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

これらの要素のレンダー関数のコードを生成するとき、Vue は、各要素が必要とする更新の型を、vnode の作成呼び出しに直接エンコードします:

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

最後の引数 `2` は[patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts) です。1 つの要素は複数のパッチフラグを持つことができ、1 つの数値にマージされます。ランタイムレンダラーは[ビット演算](https://en.wikipedia.org/wiki/Bitwise_operation)を使ってフラグをチェックし、特定の作業を行う必要があるかどうかを判断します:

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // 要素の class を更新
}
```

ビット単位のチェックはとても高速です。パッチフラグにより、Vue は動的バインディングを持つ要素を更新する際に、必要最小限の作業を行うことができるようになりました。

Vue は、vnode が持つ子の型もエンコードします。例えば、複数のルートノードを持つテンプレートは、フラグメント（fragment）として表現されます。ほとんどの場合、これらのルートノードの順序が決して変わらないことが確実に分かっているため、この情報をパッチフラグとしてランタイムに提供することも可能です。

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* 子要素 */
  ], 64 /* STABLE_FRAGMENT */))
}
```

このため、ランタイムはルートフラグメントの子要素の順序照合を完全にスキップすることができます。

### ツリーのフラット化 {#tree-flattening}

先ほどの例で生成されたコードをもう一度見てみると、返された仮想 DOM ツリーのルートは特別な `createElementBlock()` 呼び出しを使って作成されていることに気がつくかと思います:

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* 子要素 */
  ], 64 /* STABLE_FRAGMENT */))
}
```

概念的には、"ブロック"は安定した内部構造を持つテンプレートの一部分です。この場合、`v-if` や `v-for` といったディレクティブを含まないため、テンプレート全体が 1 つのブロックになっています。

各ブロックは、パッチフラグを持つ子孫ノード（直接の子ノードだけではありません）を追跡します。例えば:

```vue-html{3,5}
<div> <!-- root block -->
  <div>...</div>         <!-- 追跡しない -->
  <div :id="id"></div>   <!-- 追跡する -->
  <div>                  <!-- 追跡しない -->
    <div>{{ bar }}</div> <!-- 追跡する -->
  </div>
</div>
```

結果として、動的な子孫ノードのみを含むフラット化された配列ができあがります:

```
div (block root)
- div with :id binding
- div with {{ bar }} binding
```

このコンポーネントに再レンダリングが必要な場合、完全なツリーではなく、フラット化されたツリーを走査するだけでいいです。これは **ツリーのフラット化** と呼ばれ、仮想 DOM 照合時に走査する必要のあるノードの数を大幅に削減します。テンプレートの静的な部分は、すべて効果的にスキップされます。

`v-if` と `v-for` ディレクティブは新しいブロックノードを生成します:

```vue-html
<div> <!-- ルートブロック -->
  <div>
    <div v-if> <!-- if ブロック -->
      ...
    </div>
  </div>
</div>
```

子ブロックは、親ブロックの動的な子孫配列の内部で追跡されます。これにより、親ブロックの安定した構造が保たれます。

### SSR ハイドレーションへの影響 {#impact-on-ssr-hydration}

パッチフラグとツリーのフラット化により、Vue の[SSR ハイドレーション](/guide/scaling-up/ssr#client-hydration) のパフォーマンスが大幅に改善されます:

- 単一要素ハイドレーションは対応する vnode パッチフラグに基づき高速にパスを取得できます。

- ハイドレーション中は、ブロックノードとその動的な子孫ノードのみを走査すればよく、テンプレートレベルでの部分的なハイドレーションが効果的に実現されています。
