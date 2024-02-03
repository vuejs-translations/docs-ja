# イベントハンドリング {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Vue School のイベントハンドリングの無料動画レッスン"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Vue School のイベントハンドリングの無料動画レッスン"/>
</div>

## イベントの購読 {#listening-to-events}

`v-on` ディレクティブを使用することで、 DOM イベントの購読やイベント発火時にいくつかの JavaScript を実行します。これは通常 @ に省略することができます。使い方は `v-on:click="handler"`、あるいは省略して `@click="handler"` として使用します。

ハンドラーの値は以下のいずれかを指定します:

1. **インラインハンドラー:** イベント発火時に実行されるインライン JavaScript 式 (これはネイディブの `onclick` 属性に似たものです)

2. **メソッドハンドラー:** コンポーネント上で定義されたメソッドを示すプロパティ名またはパス

## インラインハンドラー {#inline-handlers}

インラインハンドラーは、通常、次のような単純なケースで使用されます:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## メソッドハンドラー {#method-handlers}

しかしながら、多くのイベントハンドラーのロジックはより複雑で、インラインハンドラーでは実行できない可能性があります。だからこそ、`v-on` は呼び出したいコンポーネントメソッドの名前やパスで使用することができます。

例:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` はネイディブ DOM イベントです。
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // メソッド内の `this` は、現在、アクティブなインスタンスを示します。
    alert(`Hello ${this.name}!`)
    // `event` はネイティブの DOM イベントです。
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` は上で定義したメソッド名です。 -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

メソッドハンドラーは、トリガーとなるネイティブの DOM イベントオブジェクトを自動的に受け取ります。- 上記の例では、`event.target.tagName` を通してイベントを発信した要素へアクセスすることができます。

<div class="composition-api">

参照: [イベントハンドラーの型付け](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

参照: [イベントハンドラーの型付け](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### メソッド 対 インライン検出 {#method-vs-inline-detection}

テンプレートコンパイラーは、`v-on` の文字列値が JavaScript identifier、あるいはプロパティのアクセスパスとして適切かどうかを検証することで、メソッドハンドラーを検出します。例えば、`foo`、 `foo.bar` さらには `foo['bar']` がメソッドハンドラーとして扱われる一方、`foo()` and `count++` はインラインハンドラーとして扱われます。

## インラインハンドラー下でのメソッドの呼び出し {#calling-methods-in-inline-handlers}

メソッドネームに直接束縛する代わりに、インラインハンドラーのメソッドを呼び出すこともできます。これにより、ネイティブイベントの代わりにカスタムの引数をメソッドに渡すことができます。

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## インラインハンドラーのイベント引数へのアクセス {#accessing-event-argument-in-inline-handlers}

ときどき、インラインハンドラーでオリジナルの DOM イベントへアクセスが必要になる場合もあります。その場合、特別な `$event` 変数を使って DOM イベントをメソッドに渡したり、あるいはインライン上でアロー関数を使用します:

```vue-html
<!-- 特殊変数 $event を使用する場合 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- インラインでアロー関数を使用する場合 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // これでネイティブイベントにアクセスできるようになりました
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // これでネイティブイベントにアクセスできるようになりました
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## イベント修飾子 {#event-modifiers}

イベントハンドラーの中で `event.preventDefault()` あるいは `event.stopPropagation()` を呼び出す必要があるのはよくあることです。たとえメソッド内で簡単に扱うことができるかどうかにかかわらず、メソッドが DOM イベントの詳細を扱うのではなく、純粋にデータロジックに特化したメソッドがより最適です。

この問題を扱うにあたり、Vue は `v-on` のための **イベント修飾子(event modifiers)** を提供します。修飾子は、ドット (.) によって示されるディレクティブの接尾辞であることを思い返してください。

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- クリックイベントの伝搬は停止します -->
<a @click.stop="doThis"></a>

<!-- サブミットイベントはもはやページをリロードしません -->
<form @submit.prevent="onSubmit"></form>

<!-- 修飾子は繋げることができます -->
<a @click.stop.prevent="doThat"></a>

<!-- ただの修飾子として使用できます -->
<form @submit.prevent></form>

<!-- event.target が 要素それ自身であるときだけ ハンドラーが呼び出されます-->
<!-- つまり、子要素である場合 -->
<div @click.self="doThat">...</div>
```

::: tip
関連するコードが同じの順番で生成されるため、修飾子を使用するときには順番は重要です。したがって、`@click.prevent.self` を使うと **要素自身とその子要素に対するクリックのデフォルトアクション** に干渉するのに対して、`@click.self.prevent` は要素自身のクリックのデフォルトアクションにのみに干渉します。
:::

`.capture`、 `.once`、 さらには `.passive` 修飾子は[ネイティブ  `addEventListener` メソッドのオプション](https://developer.mozilla.org/ja/docs/Web/API/EventTarget/addEventListener#options)を反映します:

```vue-html
<!-- イベントリスナーを加えるときにキャプチャーモードを使用します。 -->
<!-- つまり、内側の要素をターゲットにしたイベントは               -->
<!-- その要素で操作される前にここで操作されます。                 -->
<div @click.capture="doThis">...</div>

<!-- クリックイベントは最大で １ 度だけ呼ばれます。 -->
<a @click.once="doThis"></a>

<!-- `event.preventDefault()` が含まれる場合、         -->
<!-- スクロールイベントのデフォルト動作（スクロール）は   -->
<!-- `onScroll` が完了するのを待たずに即座に実行されます -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修飾子は通常、[モバイル機器のパフォーマンスの改善](https://developer.mozilla.org/ja/docs/Web/API/EventTarget/addEventListener#%E3%83%91%E3%83%83%E3%82%B7%E3%83%96%E3%83%AA%E3%82%B9%E3%83%8A%E3%83%BC%E3%81%AB%E3%82%88%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AE%E6%80%A7%E8%83%BD%E6%94%B9%E5%96%84)のためのタッチイベントリスナーで使用します。

::: tip
`.passive` と `.prevent` を一緒に使わないでください。なぜなら、`.passive` はブラウザーですでにイベントのデフォルト動作を干渉「しない」ことを示しているからです。それにより、もしそうした場合においてブラウザーが警告を出す可能性が高いからです。
:::

## キー修飾子 {#key-modifiers}

キーボードイベントを購読しているとき、特定のキーをチェックする必要がある場合があります。キーイベントを購読する際、Vue は `v-on` あるいは `@` にキー修飾子を加えることができます:

```vue-html
<!--`submit`は `key` が `Enter`のときにのみ呼ばれます -->
<input @keyup.enter="submit" />
```

[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)<!-- TODO: 日本語版のページが出来たら URL 差し替え --> を介して公開されている有効なキーネームをケバブケースに変換されることで、直接修飾子として使用することができます。

```vue-html
<input @keyup.page-down="onPageDown" />
```

上記の例では、`$event.key` が `'PageDown'` と等しい場合にのみハンドラーは呼ばれます。

### キーのエイリアス {#key-aliases}

Vue はもっともよく使われるキーのためにエイリアスが提供されます:

- `.enter`
- `.tab`
- `.delete` ( "Delete" と "Backspace" キーの両方をキャプチャします )
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### システムの修飾子 {#system-modifier-keys}

以下の修飾子を使用すると、対応する修飾子が押されたときにのみ、マウスやキーボードのイベントを発火させることができます:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip 注意
Mac キーボードでは、メタキーはコマンドキー (⌘) が使われるのに対して、Windows キーボードでは、メタキーはウィンドウズキー (⊞) が使われます。サンマイクロシステムキーボードでは、メタキーは実線のダイアモンド (◆) がマークとして使われます。特定のキーボード、特に MIT や Lisp マシーンキーボードや、ナイトキーボードやスペースカデットキーボードといった後継機では、メタキーは「META」、または「Meta」と表示されます。
:::

例:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
修飾子キーは通常のキーとは異なり、`keyup` イベントと一緒に使用する時は、イベントが発行された時に押されている必要があることに注意してください。言い換えると、`ctrl` キーを押し続けている間は `keyup.ctrl` はキーを離した時にのみ発火されます。`ctrl` キーだけをを解放したとしてもイベントは発火しません。
:::

### `.exact` 修飾子 {#exact-modifier}

`.exact` 修飾子は、イベントを発火するのに必要なシステム修飾子との正確な組み合わせのコントロールを可能にします。

```vue-html
<!-- これは  たとえ Alt や Shift キーが押されてたとしても発火されます -->
<button @click.ctrl="onClick">A</button>

<!-- これは Ctrl キーが押され、他のキーが押されてないときだけ発行されます -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- これは システム修飾子が押されてないときだけ発行されます -->
<button @click.exact="onClick">A</button>
```

## マウスボタン修飾子 {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

これらの修飾子は特定のマウスボタンが発火したイベントを制御するハンドラーを制限します。
