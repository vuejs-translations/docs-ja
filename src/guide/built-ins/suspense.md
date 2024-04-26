---
outline: deep
---

# Suspense {#suspense}

:::warning 実験的な機能
`<Suspense>` は実験的な機能です。stable になることは保証されていませんし、stable になる前に API が変更される可能性もあります。
:::

`<Suspense>` はコンポーネントツリー内の非同期な依存関係を処理する組み込みコンポーネントです。コンポーネントツリー内にある複数のネストされた非同期な依存関係が解決されるのを待っている間、ローディング状態をレンダリングできます。

## 非同期な依存関係 {#async-dependencies}

`<Suspense>` が解決しようとしている問題と、`<Suspense>` が非同期な依存関係と相互作用する方法について説明するために、以下のようなコンポーネント階層を想像してみましょう:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus>（async setup() を使用したコンポーネント）
   └─ <Content>
      ├─ <ActivityFeed>（非同期コンポーネント）
      └─ <Stats>（非同期コンポーネント）
```

コンポーネントツリーには、レンダリング時に最初に解決される必要がある非同期リソースに依存している、複数のネストされたコンポーネントがあります。`<Suspense>` がなければ、それぞれのコンポーネントが独自のローディング中 / エラー / ローディング完了状態を処理する必要があります。最悪の場合、ページ上に 3 つのローディングスピナーが表示され、コンテンツがバラバラのタイミングで表示されるかもしれません。

`<Suspense>` コンポーネントは、ネストされた非同期な依存関係が解決されるのを待つ間、トップレベルのローディング中 / エラー状態を表示する機能を提供します。

`<Suspense>` が待ち受けることができる非同期な依存関係は 2 種類あります:

1. 非同期 `setup()` フックを持つコンポーネント。これには、トップレベルの `await` がある `<script setup>` を使用したコンポーネントも含まれます。

2. [非同期コンポーネント](/guide/components/async).

### `async setup()` {#async-setup}

Composition API のコンポーネントの `setup()` フックは非同期にすることができます:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

`<script setup>` を使用する場合は、トップレベルの `await` があると、そのコンポーネントは自動的に非同期な依存関係になります:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### 非同期コンポーネント {#async-components}

非同期コンポーネントはデフォルトで **"suspensible"** です。これは、もし親のチェーンに `<Suspense>` が有る場合、その `<Suspense>` の非同期な依存コンポーネントとして扱われることを意味します。この場合、ローディング状態は親チェーンの `<Suspense>` によってコントロールされ、コンポーネント自身のローディング、エラー、遅延、タイムアウトのオプションは無視されます。

非同期コンポーネントでは、`suspensible: false` をオプションで設定することで `suspense` の制御をオプトアウトして、コンポーネントが常に自身のローディング状態を制御できるようにすることができます。

## ローディング状態 {#loading-state}

`<Suspense>` コンポーネントには `#default` と `#fallback` という 2 つのスロットがあります。どちらのスロットも直下の子ノードは **一つ** しか置けません。可能であればデフォルトのスロットのノードが表示されます。そうでない場合は、フォールバックスロットのノードが代わりに表示されます。

```vue-html
<Suspense>
  <!-- ネストされた非同期な依存関係を持つコンポーネント -->
  <Dashboard />

  <!-- #fallback スロットでローディング状態を表す -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

初回レンダリング時に、`<Suspense>` はデフォルトのスロットのコンテンツをメモリー上にレンダリングします。その処理の過程で非同期な依存関係が有った場合、**pending（未解決）** の状態になります。pending 状態の間は、フォールバックのコンテンツが表示されます。全ての非同期な依存関係が解決されると、`<Suspense>` は **resolved（解決）** 状態になり、デフォルトスロットのコンテンツが表示されます。

初回レンダリングの処理中に非同期な依存関係が無い場合は、`<Suspense>` は直接 resolved 状態になります。

一旦 resolved 状態になった `<Suspense>` は、 `#default` スロットのルートノードが置換された場合のみ、pending 状態に戻ります。ツリーの深いところにある新しい非同期な依存関係は `<Suspense>` を pending 状態に戻す原因には **なりません**。

pending 状態に戻った場合、フォールバックのコンテンツはすぐには表示されません。代わりに `<Suspense>` は新しいコンテンツとその非同期な依存関係が解決されるのを待つ間、以前の `#default` コンテンツを表示します。この動作は `timeout` props で設定することができます: `<Suspense>` は新しいデフォルトコンテンツのレンダリングに `timeout` よりも時間がかかった場合、フォールバックコンテンツに切り替わります。`timeout` に `0` を指定すると、デフォルトのコンテンツが置き換わったときに、すぐにフォールバックコンテンツが表示されます。

## イベント {#events}

`<Suspense>` コンポーネントは `pending` `resolve` `fallback` の 3 種類のイベントを発行します。 `pending` イベントは pending 状態になったときに発行されます。`resolve` イベントは `default` スロットで新しいコンテンツの依存関係の解決が完了したときに発行されます。`fallback` イベントは `fallback` スロットのコンテンツが表示されたときに発行されます。

これらのイベントは、例えば、新しいコンポーネントがロードされている間、古い DOM の前面にローディングの表示をするためなどに使用することができます。

## エラーハンドリング {#error-handling}

`<Suspense>` は現在のところ、それ自身ではエラーハンドリングは提供していません。ただし、`<Suspense>` の親コンポーネントで [`errorCaptured`](/api/options-lifecycle#errorcaptured) オプションや [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) フックを使って非同期なエラーを補足して処理することができます。

## 他のコンポーネントとの組み合わせ {#combining-with-other-components}

`<Suspense>` を [`<Transition>`](./transition) や [`<KeepAlive>`](./keep-alive) と組み合わせて使用したい場合はよくあります。これらのコンポーネントを正しく動作させるためには、ネストの順番が重要です。

また、これらのコンポーネントは [Vue Router](https://router.vuejs.org/) の `<RouterView>` コンポーネントと組み合わせて使われることもよくあります。

以下の例では、これらのコンポーネントをネストして全てが期待通りに動作する方法をしめしています。より単純な組み合わせの場合は、不要なコンポーネントを取り除くことができます:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- main content -->
          <component :is="Component"></component>

          <!-- loading state -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router には、動的インポートを使用した [lazily loading components（遅延ローディングコンポーネント）](https://router.vuejs.org/guide/advanced/lazy-loading.html) が組み込まれています。これらは非同期コンポーネントとは異なり、現在のところ `<Suspense>` をトリガーすることはありません。しかし、非同期コンポーネントを子コンポーネントとして持つことは可能で、その場合は通常の方法で `<Suspense>` をトリガーすることができます。

## ネストした Suspense {#nested-suspense}

次のように複数の非同期コンポーネントがある場合（ネストされたルートやレイアウトベースのルートによくあります）:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` は期待通り、ツリーの下にあるすべての非同期コンポーネントを解決する境界を作成します。ただし、`DynamicAsyncOuter` を変更すると、`<Suspense>` は正しく待機しますが、ネストした `DynamicAsyncInner` を変更した場合は解決されるまで（以前の状態やフォールバックスロットではなく）空のノードをレンダリングします。

これを直すには、ネストしたコンポーネントのパッチを処理するネストしたサスペンスを作成します:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- this -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

もし `suspensible` プロパティを設定しなかった場合、内側の `<Suspense>` は親の `<Suspense>` から同期コンポーネントとして扱われます。つまり、独自のフォールバックスロットを持つことになり、両方の `Dynamic` コンポーネントが同時に変更された場合、子の `<Suspense>` が自身の依存関係ツリーをロードしている間に、空のノードや複数のパッチサイクルが発生する可能性があり、これは望ましくありません。`suspensible` が設定されていると、非同期な依存処理はすべて親の `<Suspense>` に委ねられ（発行されるイベントも含まれます）、内側の `<Suspense>` は依存関係の解決とパッチのための別の境界としてのみ機能します。

---

**関連**

- [`<Suspense>` API リファレンス](/api/built-in-components#suspense)
