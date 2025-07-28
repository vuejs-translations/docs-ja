# 本番デプロイ {#production-deployment}

## 開発と本番の違い {#development-vs-production}

開発時において、Vue は開発体験を向上させるための様々な機能を提供します:

- よくあるエラーや落とし穴に対する警告
- props やイベントに対するバリデーション
- [リアクティビティーのデバッグのためのフック](/guide/extras/reactivity-in-depth#reactivity-debugging)
- 開発者ツールとの連携

しかし、これらの機能は本番では役に立ちません。警告の検査の中には、わずかなパフォーマンスのオーバーヘッドを発生させるものもあります。本番へのデプロイ時には、ペイロードサイズを小さくしてパフォーマンスを向上させるために、使用されていない開発専用のコードブランチをすべて削除する必要があります。

## ビルドツールなし {#without-build-tools}

CDN やセルフホストのスクリプトからロードして、ビルドツールなしで Vue を使用している場合、本番にデプロイする時は必ず本番向けビルド（末尾が `.prod.js` である dist ファイル）を使用してください。本番向けビルドは、開発専用のコードブランチがすべて削除され事前に最小化されています。

- グローバルビルドを使用している場合（`Vue` グローバル経由でアクセスしている場合）: `vue.global.prod.js` を使用してください。
- ESM ビルドを使用している場合（ネイティブの ESM インポートでアクセスしている場合）: `vue.esm-browser.prod.js` を使用してください。

詳しくは、[dist ファイルガイド](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)をご覧ください。

## ビルドツールあり {#with-build-tools}

`create-vue`（Vite ベース）または Vue CLI（webpack ベース）で生成されたプロジェクトは、本番ビルド用にあらかじめ設定がされています。

カスタムセットアップを使用している場合は、以下を確認してください:

1. `vue` が `vue.runtime.esm-bundler.js` で解決される。
2. [コンパイル時の機能フラグ](/api/compile-time-flags)が適切に設定されている。
3. <code>process.env<wbr>.NODE_ENV</code> がビルド時に `"production"` に置き換わる。

その他の参考文献:

- [Vite 本番環境用のビルドガイド](https://ja.vitejs.dev/guide/build.html)
- [Vite デプロイガイド](https://ja.vitejs.dev/guide/static-deploy.html)
- [Vue CLI デプロイガイド](https://cli.vuejs.org/guide/deployment.html)

## ランタイムエラーの追跡 {#tracking-runtime-errors}

[アプリケーションレベルのエラーハンドラー](/api/application#app-config-errorhandler) は、トラッキングサービスへエラーを報告するために使用できます:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // トラッキングサービスへエラーを報告する
}
```

[Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) や [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) などのサービスも、Vue の公式連携を提供しています。
