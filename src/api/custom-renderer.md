# カスタムレンダラー API {#custom-renderer-api}

## createRenderer() {#createrenderer}

カスタムレンダラーを作成します。プラットフォーム固有のノード作成・操作 API を提供することで、Vue のコアランタイムを活用して非 DOM 環境をターゲットにできます。

- **型**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      namespace?: ElementNamespace,
      parentComponent?: ComponentInternalInstance | null,
    ): void
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
    remove(el: HostNode): void
    createElement(
      type: string,
      namespace?: ElementNamespace,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      namespace: ElementNamespace,
      start?: HostNode | null,
      end?: HostNode | null,
    ): [HostNode, HostNode]
  }
  ```

- **例**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` は低レベルの API
  // `createApp` はアプリのインスタンスを返す
  export { render, createApp }

  // Vue のコア API を再エクスポート
  export * from '@vue/runtime-core'
  ```

  Vue 独自の `@vue/runtime-dom` は [同じAPIを使って実装されています](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts)。よりシンプルな実装については、Vue 自体のユニットテスト用のプライベートパッケージである [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts) を確認してください。
