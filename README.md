# イネブラ（Enabler）

イネブラ（Enabler）は、Next.js、React、Tailwind CSSを使用して構築されたウェブアプリケーションです。民泊・簡易宿泊事業のデジタル化と空間プロデュースのパイオニアとして、物件管理やデジタル化支援、空間デザイン、運営サポートなどのサービスを提供しています。

## 特徴

- 物件管理システム
- デジタル化支援サービス
- 空間デザインサービス
- 運営サポート
- 物件検索と詳細表示機能
- サービス紹介ページ
- お問い合わせフォーム

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [React](https://reactjs.org/) - ユーザーインターフェース構築のためのJavaScriptライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストのCSSフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型付きJavaScriptのスーパーセット
- [React Icons](https://react-icons.github.io/react-icons/) - アイコンライブラリ

## はじめ方

### ���提条件

- Node.js（バージョン14以降推奨）
- npm（Node.jsに付属）

### インストール

1. リポジトリをクローンします：
   ```
   git clone https://github.com/yourusername/enabler.git
   cd enabler
   ```

2. 依存関係をインストールします：
   ```
   npm install
   ```

### アプリケーションの実行

開発サーバーを起動します：

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認します。

`app/page.tsx`を編集することでページの編集を開始できます。ファイルを編集すると、ページは自動的に更新されます。

## プロジェクト構造

```
enabler/
├── app/
│   ├── components/
│   │   └── Layout.tsx
│   ├── properties/
│   ├── services/
│   ├── contact/
│   ├── about/
│   ├── team/
│   ├── careers/
│   ├── news/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── images/
├── styles/
├── .eslintrc.json
├── next.config.mjs
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 主要なコンポーネント

- ヒーローセクション：動的な背景画像スライドショー付き
- 注目の物件セクション
- サービス紹介セクション
- イネブラの強みセクション
- お客様の声セクション
- お問い合わせセクション
- フッター

## カスタマイズ

`app/page.tsx`ファイルを編集して、ホームページの内容やレイアウトを変更できます。各セクションは独立したコンポーネントとして実装されているため、必要に応じて追加、削除、または修正が可能です。

## デプロイ

このプロジェクトは、[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用して簡単にデプロイできます。詳細は[Next.js deployment documentation](https://nextjs.org/docs/deployment)を参照してください。