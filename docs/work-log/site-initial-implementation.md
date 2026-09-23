# wabi.me サイト構成の移行

## PR #1の指摘対応

- 目的: フォームの前面化によるフォーカス消失と、縦スクロールバーがある画面での幅の食い違いの2点だけを修正する。説明コメントの割合に関する警告は対象外。
- 依頼・権限: ユーザーが自動テストによる修正を承認し、その後commit・pushを依頼した。反映先はorigin/feature/initial-siteと既存PR #1。PR本文の変更・レビューへの返信・スレッドの解決操作は行わない。
- 公開前確認: local branchはfeature/initial-site、upstreamはorigin/feature/initial-site、remoteの更新前commitはf4210580bfc806daf23bb0fe0fe71a1aea3cac78。mainへ直接pushせず、競合時は停止する。
- 開始時点: feature/initial-site@f4210580bfc806daf23bb0fe0fe71a1aea3cac78。未コミット変更はなかった。activateFormと既存フォームのopenFormが配列を並べ替え、幅は100vw、位置計算はdocument.documentElement.clientWidthを参照していた。
- テスト順: 背面フォーム内へのフォーカス移動、閉じた後の背面リンクへの復帰、幅の基準と画面端の位置計算、既存の開閉・前面化・ドラッグ。
- 再現手順: BLOGとWORKSを順に開き、背面のBLOG内リンクへクリックせずフォーカスを移す。選択位置と要素の並びを確認する。別途、BLOGから記事を開き、他フォームを前面に出した後で記事を閉じる。
- 修正前の確認: 既存9テストは成功した。追加テストは、要素の並びが[記事一覧, 制作物一覧]から[制作物一覧, 記事一覧]へ変わるため失敗した。jsdomではフォーカス消失自体は再現しておらず、実ブラウザの症状は未確認として扱う。
- 修正前の幅検証: CSS指定を読むテストで、期待する100%に対し100vwのため失敗した。これは指定の検証であり、実ブラウザでスクロールバーに隠れる現象を再現したものではない。
- 変更: フォームは開いた順のまま保持し、重なり順をformStackで管理してz-indexへ渡す。既存フォームの再選択でも要素を移動しない。ドラッグ開始時のflushSyncは不要になったため削除した。
- 変更: .home-formの幅だけをmin(640px, calc(100% - 24px))へ変更し、位置計算と同じ表示可能な幅を基準にした。根拠: https://www.w3.org/TR/css-values-4/#viewport-relative-lengths 、https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth 。
- 最終検証: 同一ソースの検証用コピーでpnpm check（35ファイル、エラー・警告・ヒント0件）、pnpm build（8ページ）、pnpm test（13件）が成功した。src・tests・publicと主要設定・lockfileの一致、git diff --checkも確認した。依存パッケージzodの既知のビルド警告は残る。
- 追加した回帰検証: フォーカスだけの前面化と要素順の維持、背面リンクへの復帰、既存フォームの再利用・閉じて再オープン、幅の基準を確認する4件。クリック補助関数もフォーカス移動とクリックを分けて処理するようにした。新しい依存関係は追加していない。
- 実ブラウザ・スクリーンショット: ローカルURL操作の管理ポリシー制限のため未実施。Node上のDOMテストとCSS指定の検証を実機確認と混同しない。
- 次の1手: 手元の実ブラウザでTab移動、閉じた後の選択位置、縦スクロールバーが出る狭い画面での右端・閉じるボタンを確認する。commit・pushの反映確認とは別の検証として扱う。
- コミット候補: フォーム前面化時の要素移動と狭い画面でのはみ出しを防ぐ

## Goal

- ページとMarkdown記事をAstroで静的生成し、VB6風UIには元のReact＋Tailwind CSS部品を使用する。
- 既存の8ページ、プロフィール画像、HOMEを残す子フォームの開閉・前面化・ドラッグを維持する。
- 完了条件: 型検査、静的ビルド、HOME操作の自動テストを通す。実ブラウザの見た目は別途確認する。

## Decisions

- 2026-09-23: ユーザーがAstro＋元のReact/Tailwind構成を選択。Widely available限定と素のWeb Components移植は取り下げる。
- HOMEだけを1つのReactコンポーネントとして起動する。その他のページのReact部品はビルド時にHTML化する。
- ABOUT・WORKS・TALKSの本文はAstroで共用し、HOMEには名前付きの差し込み領域として渡す。
- 記事本文はローカルMarkdownをAstroで変換したHTMLだけを渡す。外部から渡されたHTMLは扱わない。
- 元部品: https://github.com/murasuke/legacy-react-form/tree/26550c760915aaf71f5b0792ac21c521062364ac 。必要な5部品とCSSを取り込み、MITライセンスをsrc/components/vb/LICENSEに残す。
- 元部品への拡張は埋め込み表示、閉じるボタン、ドラッグ用の入力イベント。配置と状態はサイト側が持つ。
- 新しいforkへの移植、パッケージ公開、サイトのデプロイは行わない。既存のプロフィールと記事はサンプルのまま。
- 2026-09-23: ユーザーがcommit・push・PR作成を依頼した後、既存PR #1への追加を選択した。新規PRは作らず、feature/initial-siteへ移行差分を反映する。mainへの直接pushは行わない。

## Changed files

- commit対象として確認した差分を示す。Astro移行済みのf421058から、冒頭の2件の修正と検証記録だけを追加する。
- Changed files: ["docs/work-log/site-initial-implementation.md","src/components/site/HomeForm.tsx","src/components/site/HomeWorkspace.tsx","src/styles/site.css","tests/home-workspace.test.mjs"]

## Evidence

- 確認済み: 元部品のReactソース・Tailwind CSS・MITライセンスを元commitから読み込んだ。
- 確認済み: Astro公式のReact連携と名前付き差し込み領域の仕様を確認した。
- Astro移行時の検証: Node.js24.16.0でpnpm check（35ファイル、エラー・警告・ヒント0件）、pnpm build（8ページ）、pnpm test（9件）が成功した。今回の指摘対応後の13テストは冒頭に記載する。
- 自動検証: HOMEの無効な閉じるボタン、4方向の子フォーム配置、再選択・前面化、記事表示、閉じた後の入力位置復帰、ドラッグの開始・停止・中断、画面縮小後の位置補正、修飾キー付きリンク操作を確認した。
- 接続検証: 生成したHOMEのHTMLにReactを接続し、AstroのABOUT・WORKS本文とMarkdown記事を子フォームで開けた。HTMLの不一致エラーなし。HOMEだけがReactを起動し、他の7ページに起動用スクリプトがないことを確認した。
- 検証コピーのsrc・public・tests、package.json・pnpm-lock.yaml・astro.config.mjs・tsconfig.jsonは作業先と一致する。git diff --checkも成功。
- 確認済み: pnpm install --frozen-lockfile --offlineで再現性を確認し、配布用のMITライセンスもdist/licenses/legacy-react-form.txtへ出力された。
- ビルド時に依存パッケージzodのコメント注釈に関する警告が出るが、ビルドは成功する。miseの設定追跡用ファイルへの書き込み警告も実行環境によるもので、検査結果とは分ける。
- 実ブラウザ検証: 未実施。ローカルURLのブラウザ操作が管理ポリシーにより禁止されており、別経路では試さない。
- 依存関係はリリース7日制限（2026-09-16T00:00:00Z）で解決し、pnpmに固定する。

## Session

- 作業先: /Users/kokoro036/work/wabi.me 。現在のbranch: feature/initial-site、upstream: origin/feature/initial-site。
- 実装commit: e817c88f1ced11524bf65472a79b982ef74f35ea「ページを静的生成し既存UIを再利用するためAstroへ移行する」。作者・コミッターはいずれもwabi。GitHubへのpushとPR #1への反映を確認済み。
- PR #1: https://github.com/wabi1318/wabi.me/pull/1 。baseはmain、headはfeature/initial-site。更新前のremote commitは398c68e4b1add76696c21f329575908ba1e0a0e5。feature/astro-reactは同じ更新前commitを指すローカルブランチとして残す。
- PR本文をユーザー承認済みのAstro構成の説明へ更新し、GitHub APIで本文の一致を確認した。base=main、タイトル「VB6風の個人サイトを追加する」、レビュアーなしを維持した。新規PRの作成・mergeは行っていない。
- PR反映時にmainのremote commitが8339e4358326e6eb8807282acea7c1e45b847a1aのままであることを確認した。既存履歴の書き換えは行っていない。その後に届いたCodeRabbitの2件の指摘が今回の対象であり、GitHub上の解決操作は行っていない。
- 元リポジトリのnode_modules更新は権限昇格後も拒否されたため再試行しない。検証用コピー: /private/tmp/wabi-me-astro-react.uVuzfM 。
- Node.js24.16.0、pnpm9.13.0を使用。Node22.15.0では依存関係の要求を満たさない。
- 取り下げたWeb Components試作は /private/tmp/wabi-me-astro-validation.S39ser と /private/tmp/legacy-web-components.9Gd6aN/repo に保存している。GitHub fork wabi1318/legacy-web-componentsへ試作コードは未反映。
- サイトに残っていた未使用の試作tgzは /private/tmp/wabi-native-vendor.tmIneJ/wabi1318-legacy-web-components-0.1.0.tgz へ退避した。サイトの依存関係から外しており、必要なら復元できる。
- 過去の作者修正: wabi <118988588+wabi1318@users.noreply.github.com>へ統一済み。復旧用bundleは.git/identity-backup.RUm65W/before.bundle（非公開）に保持。今回は作者履歴を操作しない。

## Next step

- 次の1手: ユーザー端末で起動し、今回の修正の実ブラウザ確認と差分レビューを行う。commit・pushは依頼済みで、反映結果はPR #1のheadとローカルcommitの一致で確認する。
- 公開先は既存のwabi1318/wabi.me。remote更新が競合した場合は停止し、force-pushやmainへのpushに切り替えない。
- 続いてユーザー端末で依存関係を更新し、HOMEの子フォーム操作と見た目を確認する。下記は /Users/kokoro036/work/wabi.me で実行する。

```sh
mise x node@24.16.0 -- corepack pnpm install --frozen-lockfile
mise x node@24.16.0 -- corepack pnpm dev
```

- 合格条件: HOMEの閉じるボタンが無効、各メニューから子フォームが開く、タイトルバーから移動できる、同じフォームは増殖せず前面に出る、子フォームだけ閉じられる。ABOUT・記事の直接URLも確認する。
- Nodeの依存更新を無理に回避する設定は追加しない。元のnode_modules・distはこの実行環境から更新していないため、既存の出力を今回の実装結果として扱わない。
- 復旧が必要なら、今回の開始時点f421058との5ファイルの差分を確認し、ユーザーの確認なしに破棄しない。
- 依存関係の再インストールと手元ブラウザ確認、公開先の決定は保留。
