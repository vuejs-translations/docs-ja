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

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgY291bnRlciA9IHJlZigwKVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcblx0ICByZXR1cm4ge1xuICAgIFx0Y291bnRlcjogMFxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJjb3VudGVyKytcIj5BZGQgMTwvYnV0dG9uPlxuXHQ8cD5UaGUgYnV0dG9uIGFib3ZlIGhhcyBiZWVuIGNsaWNrZWQge3sgY291bnRlciB9fSB0aW1lcy48L3A+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

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

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbmFtZSA9IHJlZignVnVlLmpzJylcblxuZnVuY3Rpb24gZ3JlZXQoZXZlbnQpIHtcbiAgYWxlcnQoYEhlbGxvICR7bmFtZS52YWx1ZX0hYClcbiAgLy8gYGV2ZW50YCBpcyB0aGUgbmF0aXZlIERPTSBldmVudFxuICBpZiAoZXZlbnQpIHtcbiAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgfVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJncmVldFwiPkdyZWV0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1Z1ZS5qcydcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBncmVldChldmVudCkge1xuICAgICAgLy8gYHRoaXNgIGluc2lkZSBtZXRob2RzIHBvaW50cyB0byB0aGUgY3VycmVudCBhY3RpdmUgaW5zdGFuY2VcbiAgICAgIGFsZXJ0KGBIZWxsbyAke3RoaXMubmFtZX0hYClcbiAgICAgIC8vIGBldmVudGAgaXMgdGhlIG5hdGl2ZSBET00gZXZlbnRcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBhbGVydChldmVudC50YXJnZXQudGFnTmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG5cdDxidXR0b24gQGNsaWNrPVwiZ3JlZXRcIj5HcmVldDwvYnV0dG9uPlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59In0=)

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

[Playground で試す](https://sfc.vuejs.org/#eNp9kN1uwjAMhV8l8g1Dos191aHtGXabm7QzUNb8yHaYKtR3X0KnCoHEnY/j88XHV/iMsb4khAZa7mmIohglxb3xh+R7GYJXbKc3h8z2iFt1NV4pOyLJ2jN+Nr7Viz0bsxB0cbSCRUnbJZHM+ejHof95N1CAmxOOY9hsDey/7KRuqtXL5AtXN+HqyfWdo9Xrp7CDwcVAUjkb6zMHn+PdFjf/D2ygWaKUXs5ftIGTSORGaz705ShnrgMdda5qSl4GhzWyqzoKv4yUwQZ2dwydmxekitB/IyG9Yj6MPnELNl91hvkPugmTrw==)

</div>
<div class="options-api">

[Playground で試す](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0aG9kczoge1xuXHQgIHNheShtZXNzYWdlKSB7XG4gICAgXHRhbGVydChtZXNzYWdlKVxuICBcdH1cblx0fVxufVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cblx0PGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ2hpJylcIj5TYXkgaGk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBAY2xpY2s9XCJzYXkoJ3doYXQnKVwiPlNheSB3aGF0PC9idXR0b24+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0ifQ==)

</div>

## インラインハンドラーのイベント引数へのアクセス {#accessing-event-argument-in-inline-handlers}

ときどき、インラインハンドラーでオリジナルの DOM イベントへアクセスする必要な場合もあります。その場合、特別な `$event` 変数を使用するメソッドに渡したり、あるいはインライン上でアロー関数を使用します:

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
<!-- イベントリスナーを加えるときはキャプチャーモードを使用してください。 -->
<!-- つまり、内側の要素をターゲットにしたイベントはその要素で操作される前にここで操作されます。 -->
<div @click.capture="doThis">...</div>

<!-- クリックイベントは最大で１回は呼ばれます。 -->
<a @click.once="doThis"></a>

<!-- `event.preventDefault()` が含まれる場合、 -->
<!-- `onScroll`が完了するのを待っている代わりに -->
<!-- スクロールイベントのデフォルト動作 (scrolling) が即座に実行されます -->
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

上記の例では、`$event.key` が `'PageDown'` が等しい場合にのみハンドラーは呼ばれます。

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

以下の修飾子を使用すると、対応する修飾子が押されたときにのみ、マウスやキーボードのイベントがが発火することができます:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip 注意
Mac キーボードでは、メタキーはコマンドキー (⌘) が使われるのに対して、Windows キーボードでは、メタキーはウィンドウズキー (⊞) が使われる。サンマイクロシステムキーボードでは、メタキーは実線のダイアモンド (◆) がマークとして使われます。特定のキーボード、特に MIT や Lisp マシーンキーボードや、ナイトキーボードやスペースカデットキーボードといった後継機では、メタキーは「META」、または「Meta」と表示されます。
:::

例:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
修飾子キーは通常のキーとは異なり、`keyup` イベントと一緒に使用する時は、イベントが発行された時に押されているる必要があることに注意してください。言い換えると、`ctrl` キーを押し続けている間は `keyup.ctrl` はキーを離した時にのみ発火されます。`ctrl` キーだけをを解放したとしてもイベントは発火しません。
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
