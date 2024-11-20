# よくある質問 {#frequently-asked-questions}

## Vue をメンテナンスしているのは誰ですか？ {#who-maintains-vue}

Vue は、独立した、コミュニティー主導のプロジェクトです。2014 年に [Evan You](https://twitter.com/youyuxi) によって個人のサイドプロジェクトとして作成されました。現在、Vue は[世界中のフルタイムおよびボランティアのメンバーからなるチーム](/about/team)によって活発にメンテナンスされており、Evan がプロジェクトのリーダーを務めています。Vue のストーリーについては、こちらの[ドキュメンタリー](https://www.youtube.com/watch?v=OrxmtDw4pVI)で詳しくご紹介しています。

Vue の開発は主にスポンサーシップを通じて資金提供されており、2016 年以降、財政的に持続可能な状態にあります。もしあなたやあなたのビジネスが Vue から利益を得ているのであれば、Vue の開発を支援するため[スポンサーになること](/sponsor/)をご検討ください！

## Vue 2 と Vue 3 の違いは何ですか？ {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 は、Vue の現在の最新メジャーバージョンです。Teleport、Suspense、テンプレートの複数ルート要素など、Vue 2 にはない新しい機能が含まれています。また、Vue 2 と互換性のない破壊的な変更も含まれています。詳細については、[Vue 3 移行ガイド](https://v3-migration.vuejs.org/ja/)に記載されています。

違いはあるものの、Vue API の大部分は 2 つのメジャーバージョン間で共有されているため、Vue 2 の知識のほとんどは Vue 3 でも引き続き使用できます。特に、Composition API はもともと Vue 3 のみの機能でしたが、現在は Vue 2 にバックポートされ、[Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01) で利用可能になっています。

一般的に、Vue 3 は、バンドルサイズが小さくなり、パフォーマンスが向上し、スケーラビリティが向上し、TypeScript / IDE のサポートが向上します。現在、新しいプロジェクトを開始する場合、Vue 3 をお勧めします。現時点で、Vue 2 を検討する理由はほんの少ししかありません:

- IE11 をサポートする必要がある場合。Vue 3 はモダンな JavaScript の機能を活用しているため、IE11 をサポートしていません。

既存の Vue 2 アプリを Vue 3 に移行する場合は、[移行ガイド](https://v3-migration.vuejs.org/ja/)を参照してください。

## Vue 2 はまだサポートされているのでしょうか？ {#is-vue-2-still-supported}

2022 年 7 月に出荷された Vue 2.7 は、Vue 2 のバージョン範囲における最後のマイナーリリースとなります。Vue 2 は現在メンテナンスモードに移行しており、新しい機能は出荷されませんが、2.7 のリリース日から 18 か月間、重要なバグ修正とセキュリティアップデートが継続されます。これは、**Vue 2 が 2023 年 12 月 31 日に End of Life に到達することを意味します**。

これは、ほとんどのエコシステムが Vue 3 に移行するための十分な時間を提供するものだと考えています。しかし、セキュリティーおよびコンプライアンス要件を満たす必要がありながら、このスケジュールまでにアップグレードできないチームやプロジェクトがあることも理解しています。私たちは業界の専門家と提携し、そのようなニーズを持つチームのために Vue 2 の拡張サポートを提供しています。もしあなたのチームが 2023 年末以降も Vue 2 を使用する予定であれば、前もって計画を立て、[Vue 2 Extended LTS](https://v2.vuejs.org/lts/) について詳細を学んでください。

## Vue はどのようなライセンスを使用していますか？ {#what-license-does-vue-use}

Vue は、[MIT License](https://opensource.org/licenses/MIT) のもとで公開されている無料のオープンソースのプロジェクトです。

## Vue はどのブラウザーをサポートしていますか？ {#what-browsers-does-vue-support}

Vue の最新バージョン（3.x）は、[ES2016 をネイティブサポートしているブラウザー](https://caniuse.com/es2016)のみをサポートしています。これには IE11 は含まれません。Vue 3.x はレガシーブラウザーでポリフィルできない ES2016 の機能を使用しているので、レガシーブラウザーをサポートする必要がある場合は代わりに Vue 2.x を使用する必要があります。

## Vue は信頼できますか？ {#is-vue-reliable}

Vue は、実戦でテスト済みの成熟したフレームワークです。現在、プロダクション環境で最も広く使われている JavaScript フレームワークの 1 つで、世界中に 150 万人以上のユーザーがおり、npm では毎月 1,000 万回近くダウンロードされています。

Vue は、Wikimedia Foundation、NASA、Apple、Google、Microsoft、GitLab、Zoom、Tencent、Weibo、Bilibili、Kuaishou など、世界中の有名企業によってさまざまな用途でプロダクション運用に使用されています。

## Vue は速いですか？ {#is-vue-fast}

Vue 3 は、最もパフォーマンスの高い主流のフロントエンドフレームワークの 1 つであり、手動で最適化することなく、ほとんどの Web アプリケーションのユースケースを簡単に処理します。

ストレステストのシナリオでは、Vue は [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) で React と Angular をかなりの差で上回ります。また、このベンチマークでは、最速のプロダクションレベルの非仮想 DOM フレームワークのいくつかと接戦状態です。

上記のような統合的なベンチマークは、専用の最適化による未加工のレンダリングパフォーマンスに焦点を当てており、実際のパフォーマンス結果を完全には表していない可能性があることに注意してください。ページ読み込みのパフォーマンスがさらに気になる場合は、[WebPageTest](https://www.webpagetest.org/lighthouse) や [PageSpeed Insights](https://pagespeed.web.dev/) を使用して、今見ているこの Web サイトを検査してみてください。このウェブサイトは、SSG プリレンダリング、ページ全体のハイドレーション、SPA クライアントサイドナビゲーションなど、Vue そのものを使用しています。低速の 4G ネットワークと 4 倍の CPU スロットリングのエミュレートされた Moto G4 で、100 点のパフォーマンスを記録しています。

[レンダリングの仕組み](/guide/extras/rendering-mechanism)のセクションでは Vue が自動的に実行時のパフォーマンスを最適化する方法、[パフォーマンス最適化ガイド](/guide/best-practices/performance)では特に要求の厳しいケースで Vue アプリを最適化する方法については詳しく説明されています。

## Vue は軽量ですか？ {#is-vue-lightweight}

ビルドツールを使用する場合、Vue の API の多くは[「ツリーシェイク可能」](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)です。例えば、組み込みの `<Transition>` コンポーネントを使用しない場合、最終的なプロダクションバンドルには含まれません。

最小限の API のみを使用する Hello World の Vue アプリのベースラインサイズは、ミニファイと brotli 圧縮を使用すると、わずか約 **16kb** になります。アプリケーションの実際のサイズは、フレームワークのオプション機能をどれだけ使用するかに依存します。Vue が提供するすべての機能を使用するアプリの場合、実行時の合計サイズは約 **27kb** になります。

ビルドツールなしで Vue を使用する場合、ツリーシェイキングされないだけでなく、テンプレートコンパイラをブラウザーに送信する必要があります。このため、サイズが約 **41kb** にまで肥大化します。したがって、Vue を主にプログレッシブエンハンスメントのためにビルドステップなしで使用している場合は、代わりに [petite-vue](https://github.com/vuejs/petite-vue)（わずか **6kb**）を使用することを検討してください。

Svelte のような一部のフレームワークは、単一コンポーネントのシナリオで非常に軽量な出力を生成するコンパイル戦略を使用しています。しかし、[私たちの研究](https://github.com/yyx990803/vue-svelte-size-analysis)では、サイズの違いはアプリケーション内のコンポーネント数に大きく依存することが分かっています。Vue は、ベースラインサイズが重い一方で、コンポーネントごとに生成されるコードは少なくなります。実際のシナリオでは、Vue のアプリの方が軽量になる可能性が非常に高いのです。

## Vue はスケールしますか？ {#does-vue-scale}

はい。Vue は単純なユースケースにしか適していないというよくある誤解にもかかわらず、Vue は大規模なアプリケーションを扱うのに完全に適しています。

- [単一ファイルコンポーネント](/guide/scaling-up/sfc)は、アプリケーションのさまざまな部分を分離して開発することを可能にするモジュール化された開発モデルを提供します。

- [Composition API](/guide/reusability/composables) は、ファーストクラスの TypeScript 統合を提供し、複雑なロジックを整理、抽出、再利用するためのクリーンなパターンを可能にします。

- [包括的なツールサポート](/guide/scaling-up/tooling)により、アプリケーションの成長に伴うスムーズな開発体験を保証します。

- 参入障壁の低さと優れたドキュメントにより、新しい開発者のためのオンボーディングとトレーニングのコストが削減されます。

## Vue に貢献するにはどうすればよいですか？ {#how-do-i-contribute-to-vue}

ご興味をお持ちいただき、ありがとうございます！　[コミュニティーガイド](/about/community-guide)をご覧ください。

## Options API と Composition API のどちらを使うべきですか？ {#should-i-use-options-api-or-composition-api}

Vue を初めて使用する場合は、[こちら](/guide/introduction#which-to-choose)で 2 つのスタイルの高いレベルでの比較をご紹介しています。

Options API を使用したことがあり、現在 Composition API を試している場合は、[この FAQ](/guide/extras/composition-api-faq) をチェックしてください。

## Vue では、JavaScript と TypeScript の どちらを使うべきですか？ {#should-i-use-javascript-or-typescript-with-vue}

Vue 自体は TypeScript で実装されており、ファーストクラスの TypeScript サポートを提供していますが、ユーザーとして TypeScript を使うべきかどうかという意見を強制するものではありません。

Vue に新機能が追加されるとき、TypeScript のサポートは重要な考慮事項です。TypeScript を念頭に設計された API は一般的に、たとえ自分が TypeScript を使っていなくても、IDE やリンターが理解しやすくなります。誰もが得をするのです。Vue の API は、JavaScript と TypeScript の両方で可能な限り同じように動作するようにも設計されています。

TypeScript を採用することは、オンボーディングの複雑さと長期的な保守性の向上とのトレードオフを伴います。そのようなトレードオフが正当化されるかどうかは、チームの背景やプロジェクトの規模によって異なりますが、Vue はその決定をする上で影響を与える要因ではありません。

## Vue は Web コンポーネントと比べてどうですか？ {#how-does-vue-compare-to-web-components}

Vue は、Web コンポーネントがネイティブで利用可能になる前に作成され、Vue の設計のいくつかの側面（スロットなど）は、Web コンポーネントのモデルに触発されたものです。

Web コンポーネントの仕様は、カスタム要素の定義が中心であるため、比較的低レベルです。フレームワークとしての Vue は、効率的な DOM レンダリング、リアクティブな状態管理、ツール、クライアントサイドルーティング、サーバーサイドレンダリングなど、より高いレベルの関心事に対処しています。

また、Vue は、ネイティブのカスタム要素の使用やエクスポートも完全にサポートしています。詳細は、[Vue と Web コンポーネントのガイド](/guide/extras/web-components)を参照してください。

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
