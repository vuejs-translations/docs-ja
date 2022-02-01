# Vue.js 公式サイト日本語翻訳ガイド

ようこそ、Vue.js 公式サイト日本語翻訳レポジトリへ！
翻訳プロジェクトに貢献したい方は、以下の内容を一読の上、お願いします。

## 貢献方法

### GitHub Issues にある本家ドキュメントの差分更新内容を翻訳して貢献する

1. [GitHub Issues](https://github.com/vuejs-translations/docs-ja/issues) から、[このクエリー](https://github.com/vuejs-translations/docs-ja/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc) でソート & フィルターして、アサインされていない issues 一覧からできるだけ古いものからやりたい issue を選択します
2. 選択した issue で、「翻訳やります！」的なコメントで宣言します :raising_hand: (`vuejs-translations/docs-ja` のメンテナーの方々は、GitHub の assign 機能で self assign で OK です)
3. このレポジトリ `vuejs-translations/docs-ja` のメンテナーから同 issue でコメントで承認されたら、正式に自分が選んだ issue の翻訳担当者としてアサインされたことになります
4. このレポジトリをフォークします！
5. `main` ブランチからトピックブランチを作成します: `git branch my-topic-branch main`
6. 変更をコミットします: `git commit -am 'Fix some files'`
7. lint で引っかかる場合は再度修正を行いコミットします
8. フォークした自分のレポジトリに Push します: `git push origin my-topic-branch`
9. 問題がなければ、プルリクエストを `vuejs-translations/docs-ja` の `main` ブランチに送ります
10. レビュー :eyes: で指摘事項があったら修正し、再度 Push します :pencil:
11. レビュー :eyes: で OK :ok_woman: ならば、マージされて内容がデプロイされてドキュメントに反映されます！　:tada:

#### Tips: より円滑な Pull Request のコメント記載方法

GitHub の Pull Request には、特定の記法を Pull Request の本文に書くことによって、該当 Pull Request のマージ時に自動的に対応する Issues をクローズできる機能があります。
Pull Request を送るときに、余裕があれば "resolve #123" といった形で、該当する Issues の番号を記載されているとレビュアーが非常に助かります :pray:

### GitHub Issues とは別のものについて貢献する

手順は上記の `4.` 以降と同じです。

## 翻訳スタイル

- [JTF日本語標準スタイルガイド（翻訳用）](https://www.jtf.jp/tips/styleguide) - 基本的な翻訳スタイル。
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

### 原則、一語一句翻訳、ただ日本語として分かりにくい場合は読みやすさを優先

> Alternatively, you can bind the directive directly to an Object. The keys of the object will be the list of classes to toggle based on corresponding values.

- NG: 別な方法としては、直接ディレクティブをオブジェクトにバインドできます。オブジェクトのキーは、クラスのリストは対応する値に基づいてトグルします。
- OK: 別な方法としては、直接ディレクティブをオブジェクトにバインドできます。オブジェクトのキーは、対応する値に基づいてトグルする class のリストになります。

### 原文に使われる ':' や '!' や '?' などの記号は極力残して翻訳

> Example:

- NG: 例
- OK: 例:

ただし、文の途中にハイフン `-` やセミコロン `;` がある場合は、その記号があると理解しづらい訳になる場合は、例外として削除してもよいです。

- 原文:
> Avoid using track-by="$index" in two situations: when your repeated block contains form inputs that can cause the list to re-render; or when you are repeating a component with mutable state in addition to the repeated data being assigned to it.

- 訳文:
> track-by="$index" は2つの状況で使用を回避してください。繰り返されたブロックにリストを再描画するために使用することができる form の input を含んでいるとき、または、繰り返されるデータがそれに割り当てられる他に、可変な状態でコンポーネントを繰り返しているときです。

### 単語の統一 (特に技術用語)

- 技術用語は基本英語、ただ日本語で一般的に使われている場合は日本語 OK !!
  - 例: 英語の filter 、日本語のフィルター
- 和訳に困った、とりあえず英語
  - 例: expression -> 式、表現
- 和訳にして分かりづらい場合は、翻訳と英語(どちらかに括弧付け)でも OK
  - 例: Two way -> Two way (双方向)

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
15 | Vue （**view**のように /vjuː/ と発音）は ...
16 | 以下は最小限の例です:
```

NG: 改行が増えている

```text
15 | Vue （**view**のように /vjuː/ と発音）は ...
16 | これは標準的な HTML、CSS、JavaScript の ...
17 |
18 | 以下は最小限の例です:
```

OK: 行がそのまま

```text
15 | Vue （**view**のように /vjuː/ と発音）は ...
16 |
17 | 以下は最小限の例です:
```

