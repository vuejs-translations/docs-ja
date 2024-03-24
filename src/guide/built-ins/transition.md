<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# トランジション {#transition}

Vue には、状態の変化に応じてトランジションやアニメーションを扱うのに役立つ 2 つの組み込みコンポーネントがあります:

- `<Transition>` は、要素やコンポーネントが DOM に enter (挿入) 、leave (削除) される時にアニメーションを適用するために提供されます。これについては、このページ内で説明しています。

- `<TransitionGroup>` は、要素やコンポーネントが `v-for` で作成されたリスト内に inserted into (追加)、removed from (削除)、moved within (移動) される時にアニメーションを適用するために提供されます。こちらについては、[次の章](/guide/built-ins/transition-group) で説明します。

この 2 つのコンポーネント以外にも、CSS クラスをトグルしたりスタイルバインディングによるステートドリブンアニメーションなど、Vue では他のテクニックを使ってアニメーションを適用することもできます。これらのテクニックは、[アニメーションテクニック](/guide/extras/animation) の章で説明されています。

## `<Transition>` コンポーネント {#the-transition-component}

`<Transition>` は組み込みコンポーネントです: つまり、どのコンポーネントのテンプレートでも、登録することなく利用することができます。これは、デフォルトのスロットで渡された要素やコンポーネントに対して、アニメーションを適用するために使用されます。enter と leave は次のいずれかによってトリガーされます:

- `v-if` による条件付きレンダリング
- `v-show` による条件付きの表示
- `<component>` による、動的コンポーネントの切り替え
- 特別な `key` 属性の変更

以下は、最も一般的な使い方です:

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* これらのクラスが何をするかは後ほど説明します! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip
`<Transition>` はスロットのコンテンツとして、単一の要素またはコンポーネントのみをサポートします。コンテンツがコンポーネントの場合、そのコンポーネントも単一のルート要素のみでなければなりません。
:::

`<Transition>` コンポーネントの要素が挿入または削除されると、以下のようなことが起こります:

1. Vue は、対象の要素に CSS のトランジションやアニメーションが適用されているかどうかを自動的に判別します。それらが適用されている場合は、適切なタイミングで [CSS トランジションクラス](#transition-classes)が追加 / 削除されます。

2. [JavaScript フック](#javascript-hooks)のリスナーが存在する場合、それらのフックが適切なタイミングで呼び出されます。

3. CSS によるトランジション / アニメーションが検出されず、JavaScript のフックも提供されない場合、ブラウザーの次のアニメーションフレームで挿入・削除のための DOM 操作が実行されます。

## CSS でのトランジション {#css-based-transitions}

### トランジションクラス {#transition-classes}

以下は、enter/leave トランジションのために適用される 6 つのクラスです。

![Transition Diagram](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: enter の開始状態。対象の要素が挿入される前に追加され、要素が挿入された 1 フレーム後に削除されます。

2. `v-enter-active`: enter のアクティブ状態。enter のすべてのフェーズで適用されます。対象の要素が挿入される前に追加され、トランジション / アニメーションが終了した時に削除されます。このクラスを使用して、entering トランジションの持続時間、遅延、イージング関数を定義することができます。

3. `v-enter-to`: enter の終了状態。要素が挿入された 1 フレーム後 (`v-enter-from` の削除と同時) に追加され、トランジション / アニメーションが終了したときに削除されます。

4. `v-leave-from`: leave の開始状態。leave トランジションが発生するとすぐに追加され、1 フレーム後に削除されます。

5. `v-leave-active`: leave のアクティブ状態。leave のすべてのフェーズで適用されます。leaving トランジションが発生するとすぐに追加され、トランジション / アニメーションが終了すると削除されます。このクラスを使用して、entering トランジションの持続時間、遅延、イージング関数を定義することができます。

6. `v-leave-to`: leave の終了状態。leave トランジションが発生した 1 フレーム後 (`v-leave-from` の削除と同時) に追加され、トランジション / アニメーションが終了したときに削除されます。

後のセクションの例にもありますが、`v-enter-active` と `v-leave-active` を利用して、enter / leave トランジションに異なるイージング関数を設定できます。

### 名前付きトランジション {#named-transitions}

`name` props を設定することでトランジションに名前をつけられます:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

名前付きトランジションの場合、トランジションクラスには `v` の代わりに、その名前がプレフィックスとして付きます。例えば、上記のトランジションに適用されるクラスは `v-enter-active` ではなく、`fade-enter-active` となります。フェードトランジションの CSS は次のようになります:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS トランジション {#css-transitions}

`<Transition>` は、上記の基本的な例に見られるように、[ネイティブの CSS トランジション](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) と組み合わせて使用するのが最も一般的です。CSS プロパティ `transition` は、アニメーションを適用する CSS プロパティ、トランジションのの持続時間、[イージング関数](https://developer.mozilla.org/ja/docs/Web/CSS/easing-function) など、複数の設定を一括で指定することができるショートハンドです。

以下は、より高度な例として、複数のプロパティをトランジションさせ、enter と leave で異なる持続時間とイージング関数を設定した例です:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*
  enter および leave アニメーションでそれぞれ異なる
  持続時間とタイミング関数を利用できます
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS アニメーション {#css-animations}

[ネイティブの CSS アニメーション](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Animations/Using_CSS_animations) は CSS トランジションと同様に適用されますが、`*-enter-from` は要素が挿入された直後には削除されていませんが、`animationend` イベント時には削除されているという違いがあります。

多くの CSS アニメーションは、シンプルに `*-enter-active` と `*-leave-active` クラスで宣言することができます。以下はその例です:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### カスタムトランジションクラス {#custom-transition-classes}

`<Transition>` に以下の props を渡すことで、カスタムトランジションクラスを指定できます:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

これらは、従来のクラス名を上書きします。これは、Vue のトランジションシステムを、[Animate.css](https://daneden.github.io/animate.css/) などの既存の CSS アニメーションライブラリーと組み合わせたい場合に特に便利です:

```vue-html
<!-- Animate.css が読み込まれているページ -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### トランジションとアニメーションの併用 {#using-transitions-and-animations-together}

Vue では、トランジションが終了したことを検知するために、イベントリスナーを登録する必要があります。イベントは、適用される CSS ルールに応じて、`transitionend` または `animationend` になります。どちらか一方だけを使用している場合、Vue は自動的に正しいタイプを検出できます。

しかし、いくつかのケースではトランジションとアニメーションを同じ要素に適用したい場合があります。例えば Vue がトリガーする CSS アニメーションと一緒にホバー時の CSS トランジション効果を持たせる場合などです。そのような場合は、Vue に関心を持ってもらいたいタイプを `type` props で明示的に宣言するべきです。 この属性の値は `animation` または `transition` を取ります:

```vue-html
<Transition type="animation">...</Transition>
```

### ネストされたトランジションと明示的なトランジション期間の設定 {#nested-transitions-and-explicit-transition-durations}

トランジションのクラスは `<Transiotion>` の直接の子要素のみに適用されますが、ネストされた CSS セレクターを使ってネストされた要素をトランジションできます:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* ネストされた要素を対象にしたルール */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... その他の必要な CSS は省略 */
```

さらに、enter の際にネストされた要素にトランジションの遅延を追加することで、交互の enter アニメーションシーケンスを作成することも可能です:

```css{3}
/* ネストされた要素の、交互アニメーション効果の enter の遅延 */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

しかし、これにはちょっとした問題があります。デフォルトでは、`<Transition>` コンポーネントは、ルートトランジションエレメントの **最初の** `transitionend` または `animationend` イベントを購読することによって、トランジションがいつ終了したかを自動的に把握しようと試みます。しかし、ネストされたトランジションでは、すべてのネストされた要素のトランジションが終了するまで待つことが望ましい動作です。

このような場合、`<transition>` コンポーネントの `duration` props を利用することで、明示的にトランジションにかかる時間（ミリ秒単位）を指定することができます。合計の時間は、遅延と内側の要素のトランジションにかかる時間に一致しているべきです:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Playground で試す](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

必要に応じて、enter / leave のトランジションにかかる時間を個別に指定することができます:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### パフォーマンスに関する考慮事項 {#performance-considerations}

上に示したアニメーションは、ほとんどが `transform` や `opacity` といったプロパティを使っていることにお気づきかもしれません。これらのプロパティはアニメーションを行うのに効率的です、なぜなら:

1. これらはアニメーション中のドキュメントレイアウトに影響を与えないので、アニメーションフレームごとにコストのかかる CSS レイアウトの計算を引き起こすことはありません。

2. ほとんどのモダンブラウザーでは `transform` をアニメーション化する際に GPU ハードウェアアクセラレーションを活用することができます。

それに対して、`height` や `margin` といったプロパティは CSS レイアウトを引き起こすので、アニメーションさせるのにかなりコストがかかるため、注意して使用する必要があります。[CSS-Triggers](https://csstriggers.com/) のようなリソースで、どのプロパティがアニメーションするとレイアウトが引き起こされるかを確認できます。

## JavaScript フック {#javascript-hooks}

JavaScript で `<Transition>` コンポーネントのイベントを購読することで、トランジション処理にフックすることができます。

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// 要素が DOM に挿入される前に呼ばれる
// 要素の "enter-from" 状態を設定するために使用する
function onBeforeEnter(el) {}

// 要素が DON に挿入された次のフレームで呼ばれる
// アニメーションを開始するときに使用する
function onEnter(el, done) {
  // トランジションの終了を示すために done コールバックを呼ぶ
  // CSS と組み合わせて使う場合は省略可能
  done()
}

// enter トランジションが完了したときに呼ばれる
function onAfterEnter(el) {}

// enter トランジションが完了前にキャンセルされたときに呼ばれる
function onEnterCancelled(el) {}

// leave フックの前に呼ばれる
// 大体の場合は、leave フックだけ使用するべき
function onBeforeLeave(el) {}

// leave トランジションの開始時に呼ばれる
// leave アニメーションを開始する時に使用する
function onLeave(el, done) {
  // トランジションの終了を示すために done コールバックを呼ぶ
  // CSS と組み合わせて使う場合は省略可能
  done()
}

// leave トランジションが完了して
// 要素が DOM から取り除かれた時に呼ばれる
function onAfterLeave(el) {}

// v-show トランジションでのみ有効
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // 要素が DOM に挿入される前に呼ばれる
    // 要素の "enter-from" 状態を設定するために使用する
    onBeforeEnter(el) {},

    // 要素が DON に挿入された次のフレームで呼ばれる
    // アニメーションを開始するときに使用する
    onEnter(el, done) {
      // トランジションの終了を示すために done コールバックを呼ぶ
      // CSS と組み合わせて使う場合は省略可能
      done()
    },

    // enter トランジションが完了したときに呼ばれる
    onAfterEnter(el) {},

    // enter トランジションが完了する前にキャンセルされたときに呼ばれる
    onEnterCancelled(el) {},

    // leave フックの前に呼ばれる
    // 大体の場合は、leave フックだけ使用するべき
    onBeforeLeave(el) {},

    // leave トランジションの開始時に呼ばれる
    // leave アニメーションを開始する時に使用する
    onLeave(el, done) {
      // トランジションの終了を示すために done コールバックを呼ぶ
      // CSS と組み合わせて使う場合は省略可能
      done()
    },

    // leave トランジションが完了して
    // 要素が DOM から取り除かれた時に呼ばれる
    onAfterLeave(el) {},

    // v-show トランジションでのみ有効
    onLeaveCancelled(el) {}
  }
}
```

</div>

これらのフックは、CSS のトランジション / アニメーションと組み合わせて、あるいは単独で使用することができます。

JavaScript のみでトランジションを利用する場合、通常は `:css="false"` props を追加するのがよいでしょう。これは、CSS トランジションの自動検出をスキップするよう、Vue に明示的に指示します。これによって、パフォーマンスが若干向上するだけでなく、CSS ルールの誤ったトランジションへの干渉を防ぐことができます:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

`:css="false"` を利用する場合は、トランジションがいつ終了するかを完全に制御する責任があります。この場合、 `done` コールバックを `@enter` と `@leave` フックで呼ぶ必要があります。呼ばない場合は、フックは同期的に呼び出され、トランジションは直ちに終了します。

ここでは、[GSAP ライブラリー](https://gsap.com/)を使ってアニメーションを行うデモを紹介します。もちろん、[Anime.js](https://animejs.com/) や [Motion One](https://motion.dev/) など、他のアニメーションライブラリーも利用可能です:

<JsHooks />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## トランジションの再利用 {#reusable-transitions}

トランジションは、Vue のコンポーネントシステムによって再利用できます。再利用可能なトランジションを作成するには、`<Transition>` コンポーネントをラップしたコンポーネントを作成し、スロットコンテンツを受け渡します:

```vue{5}
<!-- MyTransition.vue -->
<script>
// JavaScript フックのロジックを記載 ...
</script>

<template>
  <!-- 組み込みトランジションコンポーネントをラップ -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- スロットコンテンツを渡す -->
  </Transition>
</template>

<style>
/*
  必要な CSS を記載 ...
  注意: スロットコンテンツに適用されないので
  <style scoped> はここでは使用しない
*/
</style>
```

これで `MyTransition` をインポートして、組み込みのトランジションと同じように使用することができます:

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## 出現時のトランジション {#transition-on-appear}

ノードの初期レンダリング時にもトランジションを適用したい場合は、`appear` props を追加します:

```vue-html
<Transition appear>
  ...
</Transition>
```

## 要素間のトランジション {#transition-between-elements}

`v-if` / `v-show` による要素の切り替えに加えて、常に 1 つの要素のみ表示されるのを確信できる限り、`v-if` / `v-else` / `v-else-if` を使って 2 つの要素間を遷移させることもできます:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

<BetweenElements />

[Playground で試す](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## トランジションモード {#transition-modes}

上記の例では、enter と leave を同時にアニメーションさせ、両方の要素が DOM に同時に存在するときのレイアウトの問題を避けるために、それらの要素について `position: absolute` にする必要がありました。

しかし、その選択を取れない、あるいはそれが望ましい動作ではない場合があります。例えば leave を先にアニメーションさせて、leave アニメーションが終了した**後**にのみ enter を実行するようにしたいかもしれません。そのようなアニメーションを手動で調整することは非常に複雑ですが、幸い `<Transition>` に `mode` props を渡すことで、そのような挙動を有効にすることができます:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

以下は 1 つ前のデモで `mode="out-in"` を利用した場合の例です:

<BetweenElements mode="out-in" />

`<Transition>` では、あまり使われませんが `mode="in-out"` もサポートしています。

## コンポーネント間のトランジション {#transition-between-components}

`<Transition>` は [動的コンポーネント](/guide/essentials/component-basics#dynamic-components) でも使用することができます:

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## 動的トランジション {#dynamic-transitions}

`name` のような `<Transition>` の props は動的にすることもできます ! 　これにより、状態の変化に応じて異なるトランジションを動的に適用することができます:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

これは、Vue のトランジションクラスの規約を使って CSS トランジション / アニメーションを定義し、それらを切り替えて使用したい場合に便利です。

また、JavaScript のトランジションフックでは、コンポーネントの現在の状態に応じて異なる動作を適用することもできます。最後に、動的なトランジションを作成する究極の方法は、トランジションの性質を変更する props を受け取る[再利用可能なトランジション](#reusable-transitions)を利用することです。安っぽく聞こえるかもしれませんが、制限はあなたの想像力だけです。

## キー属性によるトランジション {#transitions-with-the-key-attribute}

トランジションを発生させるために、DOM 要素を強制的に再レンダリングする必要がある場合もあります。

このカウンターコンポーネントを例に考えてみましょう:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null 
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

もし `key` 属性がなかったら、テキストノードだけが更新されトランジションは発生しません。しかし、`key` 属性があることで、Vue は `count` が変更されるたびに新しい `span` 要素を作成するように認識するので、`Transition` コンポーネントは 2 つの異なる要素間のトランジションを実行できます。

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**関連**

- [`<Transition>` API リファレンス](/api/built-in-components#transition)
