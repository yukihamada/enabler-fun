# シェフキャリア

シェフキャリアは、Next.js、React、Tailwind CSSを使用して構築されたウェブアプリケーションです。料理業界でのキャリア機会やリソースを探索するためのプラットフォームを提供することを目的としています。

## 特徴

- 求人リストと応募機能
- シェフのプロフィールとポートフォリオ
- 雇用主向けダッシュボード
- シェフと雇用主のコミュニケーションのためのメッセージングシステム
- 料理業界のニュースやヒントを提供するブログ
- ネットワーキングと専門能力開発のためのイベントカレンダー
- シェフのためのリソースライブラリ（レシピ、テクニックなど）
- 興味のある求人やプロフィールを保存するお気に入りシステム

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [React](https://reactjs.org/) - ユーザーインターフェース構築のためのJavaScriptライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型付きJavaScriptのスーパーセット
- [ESLint](https://eslint.org/) - JavaScriptのパターンを識別・報告するツール

## はじめ方

### 前提条件

- Node.js（バージョン14以降推奨）
- npm（Node.jsに付属）

### インストール

1. リポジトリをクローンします：
   ```
   git clone https://github.com/yourusername/chef-career.git
   cd chef-career
   ```

2. 依存関係をインストールします：
   ```
   npm install
   ```

### アプリケーションの実行

開発サーバーを起動します：

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認します。

`app/page.tsx`を編集することでページの編集を開始できます。ファイルを編集すると、ページは自動的に更新されます。

## スクリプト

- `npm run dev`: 開発サーバーを起動します
- `npm run build`: プロダクション用にアプリケーションをビルドします
- `npm start`: プロダクションサーバーを起動します
- `npm run lint`: コード品質の問題をチェックするためのリンターを実行します

## プロジェクト構造

```
chef-career/
├── app/                    # Next.js 13のApp Routerを使用したメインアプリケーションコード
│   ├── about/              # 「About」ページ
│   ├── admin/              # 管理者ダッシュボード関連のコンポーネントとページ
│   │   ├── components/     # 管理画面用の共通コンポーネント
│   │   │   ├── Footer.tsx  # フッターコンポーネント
│   │   │   ├── Header.tsx  # ヘッダーコンポーネント
│   │   │   ├── Loader.module.css # ローダーのスタイル
│   │   │   └── Loader.tsx  # ローディングコンポーネント
│   │   ├── employers/      # 雇用主管理ページ
│   │   │   └── page.tsx    # 雇用主一覧・管理ページ
│   │   ├── jobs/           # 求人管理ページ
│   │   │   └── page.tsx    # 求人一覧・管理ページ
│   │   ├── members/        # メンバー管理ページ
│   │   │   └── page.tsx    # メンバー一覧・管理ページ
│   │   ├── settings/       # 管理画面設定ページ
│   │   │   └── page.tsx    # 管理画面設定ページ
│   │   ├── storage/        # ストレージ管理ページ
│   │   │   └── page.tsx    # ファイルストレージ管理ページ
│   │   ├── admin.css       # 管理画面用のスタイルシート
│   │   ├── layout.tsx      # 管理画面のレイアウトコンポーネント
│   │   └── page.tsx        # 管理画面のメインダッシュボード
│   ├── applications/       # 求人応募関連のページ
│   ├── blog/               # ブログページ
│   ├── contact/            # 問い合わせページ
│   ├── dashboard/          # ユーザーダッシュボード
│   ├── employers/          # 雇用主向けページ
│   ├── events/             # イベント関連ページ
│   ├── faq/                # よくある質問ページ
│   ├── favorites/          # お気に入り機能関連ページ
│   ├── help/               # ヘルプ・サポートページ
│   ├── interviews/         # 面接関連ページ
│   ├── jobs/               # 求人リストと詳細ページ
│   ├── login/              # ログインページ
│   ├── messages/           # メッセージング機能ページ
│   ├── notifications/      # 通知機能ページ
│   ├── partners/           # パートナー企業ページ
│   ├── post-job/           # 求人投稿ページ
│   ├── privacy/            # プライバシーポリシーページ
│   ├── profile/            # ユーザープロフィールページ
│   ├── register/           # 新規登録ページ
│   ├── services/           # サービス紹介ページ
│   ├── settings/           # ユーザー設定ページ
│   ├── terms/              # 利用規約ページ
│   ├── testimonials/       # 推薦文・評価ページ
│   ├── favicon.ico         # サイトのファビコン
│   ├── globals.css         # グローバルCSSファイル
│   ├── layout.tsx          # アプリケーション全体のレイアウト
│   └── page.tsx            # メインランディングページ
├── components/             # 再利用可能なReactコンポーネント
│   └── Layout.tsx          # 共通レイアウトコンポーネント
├── lib/                    # ユーティリティ関数や共通ロジック
│   └── firebase.ts         # Firebase設定と初期化
├── public/                 # 静的アセット（画像、フォントなど）
│   ├── kokon.png           # サイトロゴ
│   ├── next.svg            # Next.jsロゴ
│   └── vercel.svg          # Vercelロゴ
├── types/                  # TypeScript型定義
│   └── formTypes.ts        # フォーム関連の型定義
├── .eslintrc.json          # ESLint設定ファイル
├── next-env.d.ts           # Next.js用のTypeScript宣言ファイル
├── next.config.mjs         # Next.js設定ファイル
├── package-lock.json       # npm依存関係のロックファイル
├── package.json            # プロジェクトの依存関係とスクリプト
├── postcss.config.mjs      # PostCSS設定ファイル
├── README.md               # プロジェクトの説明書（このファイル）
├── tailwind.config.ts      # Tailwind CSS設定ファイル
└── tsconfig.json           # TypeScript設定ファイル
```

## 主要なディレクトリの説明

- `app/`: Next.js 13のApp Routerを使用したアプリケーションのメインコード。各サブディレクトリは特定の機能やページに対応しています。
  - `admin/`: 管理者ダッシュボード関連のコンポーネントとページ
    - `components/`: 管理画面専用の再利用可能なコンポーネント
    - `employers/`: 雇用主の管理ページ
    - `jobs/`: 求人の管理ページ
    - `members/`: メンバー（ユーザー）の管理ページ
    - `settings/`: 管理画面の設定ページ
    - `storage/`: ファイルストレージの管理ページ
- `components/`: アプリケーション全体で再利用可能なReactコンポーネント
- `lib/`: ユーティリティ関数や共通ロジックを含むディレクトリ
- `public/`: 静的アセット（画像、フォントなど）を格納
- `types/`: TypeScriptの型定義ファイルを含むディレクトリ
