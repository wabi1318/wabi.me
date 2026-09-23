# wabi.me サイト構成の移行

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

- Changed files: [".gitignore","docs/work-log/site-initial-implementation.md","index.html","package.json","pnpm-lock.yaml","src/App.tsx","src/components/legacy/Window.tsx","src/components/site/HomeForm.tsx","src/components/site/PageTitle.tsx","src/components/site/PostList.tsx","src/components/site/SiteLayout.tsx","src/components/site/WorkList.tsx","src/content/posts.ts","src/content/works.ts","src/index.css","src/main.tsx","src/pages/AboutPage.tsx","src/pages/BlogPage.tsx","src/pages/BlogPostPage.tsx","src/pages/HomePage.tsx","src/pages/NotFoundPage.tsx","src/pages/TalksPage.tsx","src/pages/WorksPage.tsx","src/pages/index.ts","tsconfig.app.json","tsconfig.json","tsconfig.node.json","vite.config.ts",".node-version","astro.config.mjs","public/licenses/legacy-react-form.txt","src/components/AboutContent.astro","src/components/PostList.astro","src/components/Profile.astro","src/components/TalksContent.astro","src/components/WorksContent.astro","src/components/site/HomeWorkspace.tsx","src/components/site/SiteNavigation.tsx","src/components/site/index.ts","src/components/vb/LICENSE","src/components/vb/VBButton.tsx","src/components/vb/VBMenuBar.tsx","src/components/vb/VBStatusBar.tsx","src/components/vb/VBTitleBar.tsx","src/components/vb/VBWindow.tsx","src/components/vb/index.ts","src/content.config.ts","src/layouts/DocumentLayout.astro","src/layouts/SiteLayout.astro","src/pages/404.astro","src/pages/about.astro","src/pages/blog/[slug].astro","src/pages/blog/index.astro","src/pages/index.astro","src/pages/talks.astro","src/pages/works.astro","src/styles/site.css","src/styles/vb.css","tests/home-workspace.test.mjs","tests/site-output.test.mjs"]

## Evidence

- 確認済み: 元部品のReactソース・Tailwind CSS・MITライセンスを元commitから読み込んだ。
- 確認済み: Astro公式のReact連携と名前付き差し込み領域の仕様を確認した。
- 確認済み: Node.js24.16.0でpnpm check（35ファイル、エラー・警告・ヒント0件）、pnpm build（8ページ）、pnpm test（9件）が成功した。
- 自動検証: HOMEの無効な閉じるボタン、4方向の子フォーム配置、再選択・前面化、記事表示、閉じた後の入力位置復帰、ドラッグの開始・停止・中断、画面縮小後の位置補正、修飾キー付きリンク操作を確認した。
- 接続検証: 生成したHOMEのHTMLにReactを接続し、AstroのABOUT・WORKS本文とMarkdown記事を子フォームで開けた。HTMLの不一致エラーなし。HOMEだけがReactを起動し、他の7ページに起動用スクリプトがないことを確認した。
- 検証コピーのsrc・public・tests、package.json・pnpm-lock.yaml・astro.config.mjs・tsconfig.jsonは作業先と一致する。git diff --checkも成功。
- 確認済み: pnpm install --frozen-lockfile --offlineで再現性を確認し、配布用のMITライセンスもdist/licenses/legacy-react-form.txtへ出力された。
- ビルド時に依存パッケージzodのコメント注釈に関する警告が出るが、ビルドは成功する。miseの設定追跡用ファイルへの書き込み警告も実行環境によるもので、検査結果とは分ける。
- 実ブラウザ検証: 未実施。ローカルURLのブラウザ操作が管理ポリシーにより禁止されており、別経路では試さない。
- 依存関係はリリース7日制限（2026-09-16T00:00:00Z）で解決し、pnpmに固定する。

## Session

- 作業先: /Users/kokoro036/work/wabi.me 。現在のbranch: feature/initial-site、upstream: origin/feature/initial-site。移行差分のcommit・pushを準備中。
- PR #1: https://github.com/wabi1318/wabi.me/pull/1 。baseはmain、headはfeature/initial-site。更新前のremote commitは398c68e4b1add76696c21f329575908ba1e0a0e5。feature/astro-reactは同じ更新前commitを指すローカルブランチとして残す。
- 元リポジトリのnode_modules更新は権限昇格後も拒否されたため再試行しない。検証用コピー: /private/tmp/wabi-me-astro-react.uVuzfM 。
- Node.js24.16.0、pnpm9.13.0を使用。Node22.15.0では依存関係の要求を満たさない。
- 取り下げたWeb Components試作は /private/tmp/wabi-me-astro-validation.S39ser と /private/tmp/legacy-web-components.9Gd6aN/repo に保存している。GitHub fork wabi1318/legacy-web-componentsへ試作コードは未反映。
- サイトに残っていた未使用の試作tgzは /private/tmp/wabi-native-vendor.tmIneJ/wabi1318-legacy-web-components-0.1.0.tgz へ退避した。サイトの依存関係から外しており、必要なら復元できる。
- 過去の作者修正: wabi <118988588+wabi1318@users.noreply.github.com>へ統一済み。復旧用bundleは.git/identity-backup.RUm65W/before.bundle（非公開）に保持。今回は作者履歴を操作しない。

## Next step

- 次の1手: 移行差分をcommitし、remote refを再確認してorigin/feature/initial-siteへpushする。PR本文を確認後、新構成に合わせて更新する。
- 公開先は既存のwabi1318/wabi.me。remote更新が競合した場合は停止し、force-pushやmainへのpushに切り替えない。復旧が必要なら追加commitで戻す。
- 続いてユーザー端末で依存関係を更新し、HOMEの子フォーム操作と見た目を確認する。下記は /Users/kokoro036/work/wabi.me で実行する。

```sh
mise x node@24.16.0 -- corepack pnpm install --frozen-lockfile
mise x node@24.16.0 -- corepack pnpm dev
```

- 合格条件: HOMEの閉じるボタンが無効、各メニューから子フォームが開く、タイトルバーから移動できる、同じフォームは増殖せず前面に出る、子フォームだけ閉じられる。ABOUT・記事の直接URLも確認する。
- Nodeの依存更新を無理に回避する設定は追加しない。元のnode_modules・distはこの実行環境から更新していないため、既存の出力を今回の実装結果として扱わない。
- 提案コミットメッセージ: ページを静的生成し既存UIを再利用するためAstroへ移行する
- 復旧は移行前のfeature/initial-siteとの比較から行い、未コミットの移行差分を確認なしに破棄しない。
- 依存関係の再インストールと手元ブラウザ確認、公開先の決定は保留。
