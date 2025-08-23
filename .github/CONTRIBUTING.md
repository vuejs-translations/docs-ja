# Vue.js 公式サイト日本語翻訳ガイド

ようこそ、Vue.js 公式サイト日本語翻訳リポジトリーへ！
翻訳プロジェクトに貢献したい方は、以下の内容を一読の上、お願いします。

## 貢献方法

<!--
### 未翻訳ページを翻訳する
1. [GitHub Issues](https://github.com/vuejs-translations/docs-ja/issues) のうち、[翻訳募集中](https://github.com/vuejs-translations/docs-ja/issues?q=is%3Aissue+is%3Aopen+label%3A%E7%BF%BB%E8%A8%B3%E5%8B%9F%E9%9B%86%E4%B8%AD)タグのついている issue を探します
2. 選択した issue の説明文の下にリンクされている「翻訳まとめ」の issue（[#6](https://github.com/vuejs-translations/docs-ja/issues/6) など）で、「〇〇ページの翻訳やります！」などのコメントで宣言します :raising_hand: （`vuejs-translations/docs-ja` のメンテナーの方々は、GitHub の assign 機能で self assign で OK です）
    - その際、`@vuejs-translations/ja` のメンションをつけてください
    - まとめ issue で一元管理しているため、ページ翻訳の issue への直接コメントは無効となります
    - 翻訳希望は一度に 1 つまでとさせていただきます。複数ページ翻訳希望の場合はプルリクエストがマージされてからお願いします
3. このリポジトリー `vuejs-translations/docs-ja` のメンテナーからページ翻訳の issue でコメントで承認されたら、自分が選んだ issue の翻訳担当者として正式にアサインされたことになります
    - 翻訳作業は約 2 週間が目安です。やむを得ず遅くなりそうな場合はページ翻訳の issue にてコメントで知らせてください。連絡がない場合はアサインを取り下げる可能性があります
4. このリポジトリーをフォークします！
    - README に従い、必ずパッケージをインストールしてください（textlint のため）
5. `main` ブランチからトピックブランチを作成します: `git branch my-topic-branch main`
6. 変更をコミットします: `git commit -am 'translate guide/introduction.md'`
7. lint で引っかかる場合は再度修正を行いコミットします
8. フォークした自分のリポジトリーに Push します: `git push origin my-topic-branch`
    - ページ翻訳中に英語版ドキュメントの変更が反映される場合があります。Push する前に `main` ブランチを取り込み、差分が発生してないか確認してください
9. 問題がなければ、プルリクエストを `vuejs-translations/docs-ja` の `main` ブランチに送ります
10. レビュー :eyes: で指摘事項があったら修正し、再度 Push します :pencil:
11. レビュー :eyes: で OK :ok_woman: ならば、マージされて内容がデプロイされてドキュメントに反映されます！　:tada:
-->

### GitHub Issues にある本家ドキュメントの差分更新
英語版ドキュメントが更新されると、自動的に本リポジトリーにも issue が生成されるようになっています（説明文が `New updates on head repo.` となっているもの）。

1. [GitHub Issues](https://github.com/vuejs-translations/docs-ja/issues) から、[このクエリー](https://github.com/vuejs-translations/docs-ja/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc+New+updates+on+head+repo.) でソート & フィルターして、アサインされていない issues 一覧からできるだけ古いものからやりたい issue を選択します
2. 選択した issue で、「対応します！」などのコメントで宣言します（`vuejs-translations/docs-ja` のメンテナーの方々は、GitHub の assign 機能で self assign で OK です）
3. このリポジトリー `vuejs-translations/docs-ja` のメンテナーから同 issue でリアクションされたら、自分が選んだ issue の担当者として正式にアサインされたことになります
4. このリポジトリーをフォークします！
    - README に従い、必ずパッケージをインストールしてください（textlint のため）
5. `main` ブランチからトピックブランチを作成します: `git branch my-topic-branch main`
6. 変更をコミットします: `git commit -am 'docs: fix typo'`
    - コミットメッセージは issue のタイトル（英語版のコミットメッセージ）と同じにしてください
7. textlint で引っかかる場合は再度修正を行いコミットします
8. フォークした自分のリポジトリーに Push します: `git push origin my-topic-branch`
9. 問題がなければ、プルリクエストを `vuejs-translations/docs-ja` の `main` ブランチに送ります
10. レビューで指摘事項があったら修正 + Push し、再レビュー依頼（ :arrows_counterclockwise: ボタン）します
    - 依頼の前に、修正漏れがないか確認してください
11. レビューで OK ならば、マージされてドキュメントに反映されます :tada:

#### Tips: より円滑な Pull Request のコメント記載方法

GitHub の Pull Request には、特定の記法を Pull Request の本文に書くことによって、該当 Pull Request のマージ時に自動的に対応する Issues をクローズできる機能があります。
Pull Request を送るときに、余裕があれば "resolve #123" といった形で、該当する Issues の番号を記載されているとレビュアーが非常に助かります :pray:

### タイポなどの修正

手順は上記の `4.` 以降と同じです。

## 翻訳スタイル

- [JTF 日本語標準スタイルガイド（翻訳用）](https://www.jtf.jp/tips/styleguide) - 基本的な翻訳スタイル。
- [Microsoft ローカリゼーション スタイル ガイド](https://www.microsoft.com/ja-jp/language/styleguides) - 技術文書におけるスタイル。
- [textlint-rule-preset-JTF-style](https://github.com/textlint-ja/textlint-rule-preset-JTF-style) - JTF 日本語標準スタイルガイド（翻訳用）の textlint のルールセット。
- [textlint-rule-preset-vuejs-jp](https://github.com/vuejs-jp/textlint-rule-preset-vuejs-jp) - Vue.js 日本ユーザーグループで一部カスタマイズした textlint のルールセット。

## 翻訳のゆらぎ & トーン

### 文体

「だである」ではなく「ですます」調

> Vue.js is a library for building modern web interfaces.

<!-- textlint-disable -->
- NG : Vue.js はモダンな Web インターフェースを構築するためのライブラリー**である**。
<!-- textlint-enable -->
- OK : Vue.js はモダンな Web インターフェースを構築するためのライブラリー**です**。

### 半角スペースでアルファベット両端を入れて読みやすく！

> Vue.js is a library for building modern web interfaces.

<!-- textlint-disable -->
- NG : Vue.jsはモダンなWebインターフェースを構築するためのライブラリーです。
<!-- textlint-enable -->
- OK : Vue.js はモダンな Web インターフェースを構築するためのライブラリーです。

例外として、句読点の前後にアルファベットがある場合は、スペースを入れなくてもいいです。

- 読点: 技術的に、Vue.js は MVVM パターンの ViewModel レイヤーに注目しています。

### 原則、一語一句翻訳。ただし日本語として分かりにくい場合は読みやすさを優先

> The keys of the object will be the list of classes to toggle based on corresponding values.

- NG: オブジェクトのキーは、クラスのリストは対応する値に基づいてトグルします。
- OK: オブジェクトのキーは、対応する値に基づいてトグルする class のリストになります。

### 原文に使われる ':' や '!' や '?' などの記号は極力残して翻訳

> Example:

- NG: 例
- OK: 例:

ただし、文の途中にハイフン `-` やセミコロン `;` があり、その記号があると理解しづらい訳になる場合は、例外として削除してもよいです。

- 原文:
> Avoid using track-by="$index" in two situations: when your repeated block contains form inputs that can cause the list to re-render; or when you are repeating a component with mutable state in addition to the repeated data being assigned to it.

- 訳文:
> track-by="$index" は 2 つの状況で使用を回避してください。繰り返されたブロックにリストを再描画するために使用することができる form の input を含んでいるとき、または、繰り返されるデータがそれに割り当てられる他に、可変な状態でコンポーネントを繰り返しているときです。

### 単語の統一（特に技術用語）

- 技術用語は基本英語、ただ日本語で一般的に使われている場合は日本語 OK !!
  - 例: 英語の filter 、日本語のフィルター
- 和訳に困った、とりあえず英語
  - 例: expression -> 式、表現
- 和訳にして分かりづらい場合は、翻訳と英語（どちらかに括弧付け）でも OK
  - 例: Two way -> Two way（双方向）

詳細は [用字、用語](https://github.com/vuejs-translations/docs-ja/wiki/%E7%94%A8%E5%AD%97%E3%80%81%E7%94%A8%E8%AA%9E) を参照してください。

### 長音訳について

原則、**長音あり**で翻訳する。

- NG: コンピュータ
- OK: コンピューター

## 注意事項

### 行の追加・削除をしない

行番号が変わってしまうと英語版ドキュメントの変更を取り込む際に対応箇所を探すのが難しくなるので、原文と同じ行に翻訳してください。

原文:

```text
15 | Vue (pronounced /vjuː/, like **view**) is a ...
16 |
17 | Here is a minimal example:
```

NG: 空行がなくなっている

```text
15 | Vue（**view**のように /vjuː/ と発音）は ...
16 | 以下は最小限の例です:
```

NG: 改行が増えている

```text
15 | Vue（**view**のように /vjuː/ と発音）は ...
16 | これは標準的な HTML、CSS、JavaScript の ...
17 |
18 | 以下は最小限の例です:
```

OK: 行がそのまま

```text
15 | Vue（**view**のように /vjuː/ と発音）は ...
16 |
17 | 以下は最小限の例です:
```

