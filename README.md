# レポートアプリ

## 概要
ホームページの保守・運用レポートをWEB上で一元管理できるシステムです。
・管理画面では、顧客情報の管理やレポート更新通知メールの送信、操作ログの管理を行うことができます。
・レポート画面では、Google Analyticsのデータを自動取得し、アクセス状況をグラフや表で分かりやすく表示します。
　さらに、AIによるサイト分析・評価機能や、レポートのPDFダウンロード機能にも対応しています。

## Next.js のインストール方法

1. Node.js の公式サイトから LTS版 をダウンロード  
   [:contentReference[oaicite:0]{index=0}](https://nodejs.org/ja?utm_source=chatgpt.com)
<img width="1491" height="1080" alt="image" src="https://github.com/user-attachments/assets/a3929242-85b2-44ed-909e-4db1bd71d452" />

2. ダウンロードした `node-v○○○-x64.msi` を起動

3. 「Next」を押し続けてインストール

4. ターミナルで以下を実行し、バージョンが表示されれば完了

```bash
node -v
npm -v
```
## 起動方法

```bash
cd プロジェクトの場所
npm run dev
```

## 管理画面（admin）

・URL
```bash
http://localhost:3000/admin
```
・ログイン情報
```bash
ID：admin
PASSWORD：admin
```
## レポート画面

・URL
```bash
http://localhost:3000/login
```
・テスト環境ユーザー<br>
 ユーザー情報は以下で編集可能です。<br>
  管理画面<br>
　 http://localhost:3000/admin/customers<br>
  JSONファイル<br>
　 report-app/data/users.json<br>

bears
```bash
ID：bear
PASSWORD：1234
```
bundbakery
```bash
ID：bundbakery
PASSWORD：4567
```
いなばん
```bash
ID：inaban
PASSWORD：1234
```
