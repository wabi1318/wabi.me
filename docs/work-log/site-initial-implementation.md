# wabi.me 初期実装

## 目的と完了条件

- VB6風の見た目を持つ個人サイトの土台を作る。
- `/`、`/blog`、`/works`、`/talks`、`/about`をブラウザで表示でき、`pnpm build`が通る。

## 現状

- 確認済み: GitHub公開リポジトリは`wabi1318/wabi.me`。pnpmのロックファイルを生成した。サイト構成変更後はTypeScript検査と一時出力先へのViteビルドに成功した。
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
- ユーザーの依頼で複数ウィンドウ化を取り消し、メニューから各ページへ移動する構成に戻した。プロフィール画像とfaviconは維持した。

## 次の作業

- 初回PRは`main`を比較元、`feature/initial-site`を実装ブランチとして準備する。GitHubは空のため、空の初期コミットを持つ`main`をユーザー端末から先にpushする必要がある。共有基幹ブランチへの直接pushはAGENTS.mdで禁止されているため、Codexでは実行しない。
- PR案: 「VB6風の個人サイトを追加する」。実データへの差し替え、ブラウザ動作確認、公開設定は未完了。Markdown本文の表示は段落と第2階層見出しのみ対応する。

- `src/content/profile.ts`、`src/content/works.ts`、`src/content/talks.ts`と`src/content/blog/`のプレースホルダーを実データへ置き換える。
- GitHubPagesなど公開先を決め、SPAの直接URLアクセスに対応する設定を追加する。
