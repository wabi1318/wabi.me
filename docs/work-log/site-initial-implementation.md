# wabi.me 初期実装

## 目的と完了条件

- VB6風の見た目を持つ個人サイトの土台を作る。
- `/`、`/blog`、`/works`、`/talks`、`/about`をブラウザで表示でき、`pnpm build`が通る。

## 現状

- ローカル`main`と`feature/initial-site`の既存6コミットを修正し、作者とコミッターを`wabi <118988588+wabi1318@users.noreply.github.com>`へ統一した。全コミットのファイル内容・メッセージ・日時と、対応する親子関係が維持されたことを検証済み。
- 修正後の初期コミットは`8339e4358326e6eb8807282acea7c1e45b847a1a`、修正後の既存実装履歴の先端は`93adc63f2b57e79fe7259c9ef58104a8a4ae5cd9`。この記録はその後続の追加コミットとする。
- 修正前の復旧用bundleは`.git/identity-backup.RUm65W/before.bundle`に保存済み（Git管理外・非公開）。ローカルの旧履歴はbundleから別名ブランチへ取り出せる。
- 今後のコミット用の`wabi.me`ローカル設定は`wabi`と上記メールへ変更済み。`git var GIT_AUTHOR_IDENT`と`GIT_COMMITTER_IDENT`でも確認した。
- ユーザーが実行スクリプトを完了した。`work`配下の既存12リポジトリ＋1追加worktreeで、実効的な作者・コミッターが`wabi`であることを再確認した。`~/.gitconfig`の条件付きincludeで`/Users/kokoro036/work/.gitconfig-wabi`を読み込むため、新規リポジトリにも同じ設定が継承される。個別のuser設定を持たない検証用リポジトリでも確認済み。
- ユーザーによる両ブランチ同時の履歴反映が成功した。GitHub APIで`main`と`feature/initial-site`の全コミットが作者・コミッターともに`wabi1318`へ紐付くことを確認した。旧履歴を持つ別コピーがある場合は通常のmergeで取り込まない。
- 確認済み: GitHub公開リポジトリは`wabi1318/wabi.me`。pnpmのロックファイルを生成した。サイト構成変更後はTypeScript検査と一時出力先へのViteビルドに成功した。
- リモートの履歴反映時点で`feature/initial-site`は`7156de2`、`main`は`8339e43`。upstreamは`origin/feature/initial-site`。GitHubのデフォルトブランチは`main`。
- PR #1「VB6風の個人サイトを追加する」を作成した: https://github.com/wabi1318/wabi.me/pull/1 。比較元は`main`、実装ブランチは`feature/initial-site`。ブラウザの動作確認項目は未確認として記載している。
- 履歴反映後の初回確認ではPR #1がOPENのまま旧base/headを参照していた。ブランチの履歴とは分けて、通常のfeatureブランチへのpush後にPR参照とPR内コミットを再確認する。
- 仮定: React、TypeScript、Viteを採用し、プロフィール本文と作品データは公開前に差し替えるプレースホルダーとする。

## 完了した実装と検証

- `/`、`/profile`、`/works`、`/links`、未定義URL用の404画面を追加した。
- `components/legacy`にVB6風ウィンドウ、`components/site`にサイト共通部品を配置した。
- `content/`へプロフィール、作品、リンクの編集対象データを分離した。
- `BLOG`、`TALKS`、`ABOUT`を追加し、`PROFILE`と`LINKS`を置き換えた。記事は`src/content/blog/`のMarkdownで管理する。
- pnpmへ切り替え、`pnpm-lock.yaml`を生成した。`package-lock.json`は削除した。
- サイト構成変更前の`pnpm build`は成功。変更後のTypeScript検査と一時出力先へのViteビルドも成功した。通常の`dist/`出力はCodex実行環境から削除できず、未再確認。
- Viteの開発用依存関係キャッシュを`.vite-cache/`へ変更した。Codex実行環境ではキャッシュ更新時に権限エラーとなるため、ユーザー端末でキャッシュを削除して`pnpm dev`を実行する必要がある。
- `public/favicon.svg`へVB6風の小窓アイコンを追加し、`index.html`から参照するようにした。
- 生成したVB6風キャラクター画像を`public/favicon-vb6-character.png`へ追加し、faviconとして参照するようにした。既存のSVG faviconは代替案として残す。
- 同じキャラクター画像をトップと`ABOUT`のプロフィール画像として表示するようにした。
- HOMEを親画面として維持し、HOME内のボタンから子フォームを開く。HOMEの実際の位置を基準に、右上・左下・右下・左上へ少しずらして配置する。画面端では全体が収まる位置へ調整し、画面サイズやHOMEの位置の変化にも追従する。
- 子フォームのタイトルバーをマウス・タッチでドラッグして移動する処理を追加した。移動後はHOMEへの追従を止め、そのフォームを閉じるまで手動位置を保持する。画面サイズ変更時には画面内に収まる位置へ調整する。HOME自体は固定する。
- 閉じるボタンからは移動を開始しない。ドラッグ中にタイトルバーの外へ移動しても追従し、指・ボタンを離す／操作が中断されると移動を終了する。前面化による要素の並べ替えが完了してから移動を開始する。
- 既存フォームの再選択は位置を変えずに前面化し、子フォームだけ閉じられる。配置番号は表示順と分離し、閉じたフォームの番号を再利用する。狭い画面では画面内に収めるためフォーム同士の重なりを許容する。直接URLのページ表示も維持する。
- 閉じる記号を中央配置の10px SVGへ変更した。HOMEを含む単独ページの閉じるボタンは無効、子フォームでは有効にする。
- HOME基準の配置へ変更後、TypeScript検査とViteビルド（`/private/tmp/wabi-me-home-around.JzuLV6`）が成功。配置計算では四隅への分散、HOME移動への追従、画面幅・高さ・スクロール位置を変えた864通りの画面内配置を確認した。
- ドラッグ処理追加後のTypeScript検査、`git diff --check`、Viteビルド（`/private/tmp/wabi-me-form-drag.ZxsdwV`）が成功。手動位置を再計算しても変わらないこと、画面縮小時の補正、画面寸法と移動先を変えた1,176通りの境界計算を確認した。実際のドラッグ開始・終了・中断はブラウザ未検証。
- ブラウザによる開閉・前面化・見た目の確認は未実施（このセッションではローカルURLへのブラウザ操作が管理ポリシーで禁止）。

## 次の作業

- 次の1手: PR #1のbase/headとコミット一覧が新履歴に更新されたか再確認する。履歴更新後も旧SHAへの直接アクセスやPR内の参照がGitHub側に残る可能性があり、完全な消去を保証しない。
- 復旧が必要な場合は`.git/identity-backup.RUm65W/before.bundle`から別名のローカルブランチへ旧履歴を取り出して比較する。リモートの再更新は現在のSHAを確認して別途判断する。復旧用bundleとGitのreflogには旧情報を残している。
- 手元のブラウザで、背面フォームのタイトルバーからのドラッグ、枠外までの移動、ボタンを離した後の停止、前面化・スクロール後の位置保持、閉じる操作を確認する。
- PR #1の動作確認項目を手元で確認する。実データへの差し替えと公開設定は未完了。Markdown本文の表示は段落と第2階層見出しのみ対応する。

- `src/content/profile.ts`、`src/content/works.ts`、`src/content/talks.ts`と`src/content/blog/`のプレースホルダーを実データへ置き換える。
- GitHubPagesなど公開先を決め、SPAの直接URLアクセスに対応する設定を追加する。
