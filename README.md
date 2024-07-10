# イネブラ（Enabler）

イネブラは、民泊・簡易宿泊事業のデジタル化と空間プロデュースを支援するウェブアプリケーションです。Next.js、React、Tailwind CSSを使用して構築されています。

## 主な機能

- 物件管理システム
- デジタル化支援
- 空間デザイン
- 運営サポート
- 物件検索・詳細表示
- サービス紹介
- お問い合わせフォーム

## 技術スタック

- Next.js
- React
- Tailwind CSS
- TypeScript
- React Icons

## セットアップ

1. リポジトリのクローン：
   ```
   git clone https://github.com/yourusername/enabler-fun.git
   cd enabler-fun
   ```

2. 依存関係のインストール：
   ```
   npm install
   ```

3. 開発サーバーの起動：
   ```
   npm run dev
   ```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて確認してください。

## 主要コンポーネント

- ヒーローセクション
- 注目の物件
- サービス紹介
- イネブラの強み
- お客様の声
- お問い合わせ

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

│   ├── dashboard/
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