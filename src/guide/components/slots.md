# スロット {#slots}

> このページは、すでに[コンポーネントの基礎](/guide/essentials/component-basics)を読んでいることを前提にしています。初めてコンポーネントに触れる方は、まずそちらをお読みください。

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="Free Vue.js Slots Lesson"/>

## スロットコンテンツとスロットアウトレット {#slot-content-and-outlet}

これまでに、コンポーネントが props を受け取れること、そして props はどんな型の JavaScript の値でも取りうることを学びました。しかし、テンプレートのコンテンツについてはどうでしょうか？　場合によっては、テンプレートのフラグメントを子コンポーネントに渡して、子コンポーネントに自身のテンプレート内でそのフラグメントをレンダリングしてもらいたい場合があるかもしれません。

たとえば、次のような使い方をサポートする `<FancyButton>` コンポーネントがあるとします:

```vue-html{2}
<FancyButton>
  Click me! <!-- スロットコンテンツ -->
</FancyButton>
```

`<FancyButton>` のテンプレートは次のようになります:

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- スロットアウトレット -->
</button>
```

`<slot>` 要素は、親が提供した **スロットコンテンツ** をレンダリングすべき場所を示す **スロットアウトレット** です。

![slot diagram](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

最終的にレンダリングされた DOM は以下のようになります:

```html
<button class="fancy-btn">Click me!</button>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

スロットを利用することで、`<FancyButton>` は外側の `<button>`（およびファンシーなスタイル）をレンダリングする責務を持ちながらも、内側のコンテンツは親コンポーネントから提供できるようになります。

スロットを理解するもう 1 つの方法は、次のような JavaScript の関数と比べることです:

```js
// 親コンポーネントがスロットコンテンツを渡す
FancyButton('Click me!')

// FancyButton がスロットコンテンツを自身のテンプレート内でレンダリングする
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

スロットコンテンツはテキストだけに限定されるわけではありません。任意の有効なテンプレートコンテンツを渡せます。たとえば、複数の要素を渡したり、さらに他のコンポーネントを渡すことさえできます。

```vue-html
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNptUltu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

スロットを利用することで、`<FancyButton>` はより柔軟で再利用可能になりました。これで、他の場所で異なる内部コンテンツとともに利用できるようになり、すべてのコンテンツには同一のファンシーなスタイルが適用されます。

Vue コンポーネントのスロットの仕組みは、[ネイティブの Web Component の `<slot>` 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/slot)に着想を得たものですが、後で見るように追加の機能もあります。

## レンダースコープ {#render-scope}

スロットコンテンツは親で定義されているため、親コンポーネントのデータスコープへアクセスできます。たとえば、次のような例があるとします:

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

ここでは、両方の <span v-pre>`{{ message }}`</span> が同じコンテンツをレンダリングします。

スロットコンテンツは子コンポーネントのデータへはアクセス**できません**。Vue テンプレート内の式は、JavaScript のレキシカルスコープと同様に、その式が定義されたスコープ内のみアクセスできます:

> 親テンプレートにある式は親のスコープにのみアクセスでき、子のテンプレートにある式は子のスコープにのみアクセスできます。

## フォールバックコンテンツ {#fallback-content}

スロットには、何もコンテンツが与えられなかった場合にのみレンダリングされるフォールバック（つまりデフォルト）コンテンツを指定すると便利な場合があります。たとえば、次のような `<SubmitButton>` コンポーネント内で:

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

スロットコンテンツに何も与えなかった場合に `<button>` 内に "送信" というテキストをレンダリングしたくなるかもしれません。"送信" をフォールバックコンテンツにするには、そのテキストを `<slot>` タグの間に置きます:

```vue-html{3}
<button type="submit">
  <slot>
    送信 <!-- フォールバックコンテンツ -->
  </slot>
</button>
```

これで、スロットに何もコンテンツを提供せずに `<SubmitButton>` を親コンポーネント内で使用すると:

```vue-html
<SubmitButton />
```

フォールバックコンテンツの "送信" がレンダリングされます:

```html
<button type="submit">送信</button>
```

しかし、コンテンツを与えた場合:

```vue-html
<SubmitButton>保存</SubmitButton>
```

与えたコンテンツが代わりにレンダリングされます:

```html
<button type="submit">保存</button>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## 名前付きスロット {#named-slots}

1 つのコンポーネント内に複数のスロットアウトレットがあると便利なときがあります。たとえば、次のようなテンプレートを持つ `<BaseLayout>` コンポーネントがあるとします:

```vue-html
<div class="container">
  <header>
    <!-- ここに header コンテンツが必要 -->
  </header>
  <main>
    <!-- ここに main コンテンツが必要 -->
  </main>
  <footer>
    <!-- ここに footer コンテンツが必要 -->
  </footer>
</div>
```

このような場合のために、`<slot>` 要素には特別な属性 `name` があり、異なるスロットにユニークな ID を割り当てて、コンテンツをレンダリングするべき場所を指定するために使用できます:

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

`name` を持たない `<slot>` アウトレットは、暗黙的に "default" という name を持つものとされます。

`<BaseLayout>` を使用している親コンポーネント内では、それぞれが別のスロットアウトレットをターゲットとする複数のスロットコンテンツのフラグメントを渡す手段が必要です。これこそ **名前付きスロット** が役に立つ場面です。

名前付きスロットを渡すためには、`v-slot` ディレクティブを持つ `<template>` 要素を使い、`v-slot` にスロットの名前を引数として渡す必要があります:

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- header スロットのためのコンテンツ -->
  </template>
</BaseLayout>
```

`v-slot` には専用の省略表記 `#` があるため、`<template v-slot:header>` は単に短く `<template #header>` と書けます。これは「このテンプレートフラグメントを子コンポーネント内の 'header' スロット内にレンダリングする」という意味だと考えてください。

![名前付きスロットのダイアグラム](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

こちらは、省略構文を使用して `<BaseLayout>` の 3 つすべてのスロットに対してコンテンツを渡しているコードです:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

コンポーネントがデフォルトスロットと名前付きスロットの両方を受け入れる場合、すべてのトップレベルの `<template>` 以外のノードは暗黙的にデフォルトスロットに対するコンテンツとして扱われます。そのため、上の例は次のようにも書けます:

```vue-html
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 暗黙的なデフォルトスロット -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

これで `<template>` 要素内のすべては対応するスロットに渡されます。最終的にレンダリングされる HTML は次のようになります:

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

繰り返しになりますが、JavaScript の関数と比べると、名前付きスロットをよりよく理解する助けになるかもしれません:

```js
// 複数のスロットフラグメントを異なる名前で渡す
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> がそれらを異なる場所でレンダリングする
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## 条件付きスロット {#conditional-slots}

スロットにコンテンツが渡されたかどうかに基づいて何かをレンダリングしたい場合があります。

これを実現するには、[$slots](/api/component-instance.html#slots) プロパティと [v-if](/guide/essentials/conditional.html#v-if) を組み合わせて使用します。

以下の例では、`header`, `footer`, `default` の 3 つの条件付きスロットを持つ Card コンポーネントを定義しています。
そしてヘッダー/フッター/デフォルトのコンテンツが存在する場合に、スタイル追加のためにスロットをラップしています:

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[Playground で試す](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## 動的なスロットの名前 {#dynamic-slot-names}

[動的なディレクティブの引数](/guide/essentials/template-syntax.md#dynamic-arguments)は `v-slot` でも機能します。これにより、動的なスロットの名前の定義が可能になります:

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 省略表記 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

式は、動的なディレクティブの引数の[構文上の制約](/guide/essentials/template-syntax.md#dynamic-argument-syntax-constraints)の対象となることに注意してください。

## スコープ付きスロット {#scoped-slots}

[レンダースコープ](#render-scope)で説明したように、スロットのコンテンツは子コンポーネント内の状態にアクセスできません。

しかし、スロットのコンテンツが親のスコープと子のスコープの両方から来たデータを利用できると便利な場合があります。これを実現するためには、レンダリング時に子がデータをスロットに渡す手段が必要です。

実際、まさにその通りのことが可能で、props をコンポーネントに渡すときと同様に、属性をスロットアウトレットに渡すことができます:

```vue-html
<!-- <MyComponent> template -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

スロット props を受け取るのは、デフォルトスロットと名前付きスロットを使用するのとは少し異なります。子コンポーネントのタグ上で `v-slot` を直接使うことによって、単一のデフォルトスロットを使って props を受け取る方法を最初に示します:

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![スコープ付きスロットのダイアグラム](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

子によってスロットに渡された props は、対応する `v-slot` ディレクティブの値として利用できます。この値は、スロット内の式からアクセスできます。

スコープ付きスロットは、子コンポーネントに渡された関数として考えられます。その後、子コンポーネントはその関数を呼び、props を引数として渡します:

```js
MyComponent({
  // デフォルトスロットを関数として渡す
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // スロット関数を props つきで呼びだす！
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

実際、これはスコープ付きスロットがコンパイルされる方法や、スコープ付きスロットを手動で [レンダー関数](/guide/extras/render-function)に渡す方法に非常に近いものです。

`v-slot="slotProps"` がスロット関数のシグネチャーにどのように対応しているかに注目してください。関数の引数のように、`v-slot` でもオブジェクトの分割が利用できます:

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 名前およびスコープ付きスロット {#named-scoped-slots}

名前付きスロットも同じように動作します。スロット props は `v-slot` ディレクティブの値として `v-slot:name="slotProps"` のようにアクセスできます。省略表記を使うと、次のようになります:

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

props は名前付きスロットに次のように渡します:

```vue-html
<slot name="header" message="hello"></slot>
```

スロットの `name` は予約されているため、props には含まれないことに注意してください。そのため、`headerProps` は `{ message: 'hello' }` となります。

名前付きスロットとデフォルトのスコープ付きスロットを混在させる場合は、デフォルトスロットに明示的に `<template>` タグを使用する必要があります。`v-slot` ディレクティブを直接コンポーネントに配置しようとすると、コンパイルエラーになります。これは、デフォルトスロット props のスコープが曖昧にならないようにするためです。例えば:

```vue-html
<!-- <MyComponent> template -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>
```

```vue-html
<!-- このテンプレートはコンパイルされません -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- message はデフォルトスロットに属しており、ここでは使用できません -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

デフォルトスロットに明示的に `<template>` タグを使用することで、`message` props が他のスロット内では使用できないことを明確にできます:

```vue-html
<MyComponent>
  <!-- 明示的なデフォルトスロットを使用する -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</MyComponent>
```

### Fancy List の例 {#fancy-list-example}

スコープ付きスロットのよいユースケースは何かと疑問に思うかもしれません。以下に例を示します: アイテムのリストをレンダリングする `<FancyList>` コンポーネントがあるとします。そのコンポーネントは、リストを表示するのに使用するリモートのデータを読み込むロジックや、ページネーションや無限スクロールのような発展的な機能をカプセル化しているかもしれません。ただし各アイテムのスタイルは、使用する親コンポーネントに任せて柔軟に対応できるようにしたいと考えています。そのため、期待される利用例は次のようになるかもしれません:

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

`<FancyList>` の内側では、同一の `<slot>` を異なるアイテムデータを使用して複数回レンダリングできます（`v-bind` を使用してオブジェクトをスロット props として渡していることに注意してください）:

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### レンダーレスコンポーネント {#renderless-components}

上で説明した `<FancyList>` のユースケースは、再利用可能なロジック（データフェッチやページネーションなど）と視覚的な出力の両方をカプセル化していますが、視覚的な出力の一部は、使用されるコンポーネント側にスコープ付きスロットを介して移譲しています。

この概念をさらに少し広げると、ロジックだけをカプセル化し、自身では何もレンダリングしないコンポーネントを考えることができます。つまり、視覚的な出力を利用する側のコンポーネントに完全に移譲したコンポーネントです。このような種類のコンポーネントを、**レンダーレスコンポーネント**と呼びます。

レンダーレスコンポーネントの一例としては、現在のマウス位置をトラッキングするロジックをカプセル化したコンポーネントがあります:

```vue-html
<MouseTracker v-slot="{ x, y }">
  マウスの座標: {{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[Playground で試す](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[Playground で試す](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

面白いパターンではありますが、レンダーレスコンポーネントで実現できるほとんどのことは、Composition API を利用することで、追加のコンポーネントのネストによるオーバーヘッドを起こすことなく、より効率的な方法で実現できます。後ほど、同様のマウストラッキング機能を[コンポーザブル](/guide/reusability/composables)として実装する方法を説明します。

そうは言っても、スコープ付きスロットは、`<FancyList>` の例のように、ロジックのカプセル化と視覚的な出力の作成の**両方**が必要な場合には十分役に立ちます。
