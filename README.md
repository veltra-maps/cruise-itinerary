# 🚢 Cruise Itinerary

このリポジトリは、クルーズ旅程（Itinerary）を地図上に可視化するための静的 Web サイトです。
`route.html` に旅程番号（ItineraryNo）とクルーズ船 ID（ship）を指定することで、寄港地のルート表示ができます。

---

## 📁 ディレクトリ構成とファイルの説明（ローカル & GitHub Pages）

```
cruise-itinerary/
├── .gitignore              # Gitが追跡しないファイルを指定（node_modules, .DS_Storeなど）
├── index.html              # メインのHTMLファイル。旅程ルートを描画する
├── itinerary_schedules/    # 各クルーズの旅程JSONファイルの保管場所
│ ├── {クルーズ別}.json　　　　# {Cruise-Ship-Code}_{Cruise-Name}.jsonで各クルーズの旅程を管理
│ ├── port-by-country.json  # 各港の緯度経度マスタ。この緯度経度でルートを作成する
├── ship.json               # 旅程データの集約ファイル（CloudflareやGitHubに設置可能）
├── port.json               # 港マスタ（Cloudflareまたは静的ファイル）
├── images/                 # マーカー画像やアイコン（VT_symbol など）
├── README.md               # このファイル（構成や使い方の説明）

（ローカル開発用、Gitには含めない）
├── CheckGAS.js             #
├── node_modules/           # npmライブラリ群
├── package.json            # npm構成ファイル
├── package-lock.json       # npm依存関係のロック
├── csv_convert.js          # (オプション) Jasonファイルの形式の内容をCSVにしてチェックしやすくする補助スクリプト。jsonファイルならなんでもOK
├── csv_convert_files/      # (オプション) 出力されたCSVファイルの保存場所

```

## port-by-country.json の更新および作成方法

GoogleSpleadSheet の AppsScript - 「Port by Country (put - GoogleDrive port-by-country.json).gs」を実行

---

## 📝 日常の更新時のルーティン手順

### 🔄 変更をアップロードする（2 回目以降）

#### ✅ すべての差分をまとめてアップする場合：

```bash
git add .
git commit -m "Update project files"
git push origin main
```

#### ✅ 特定ファイルだけをアップする場合（例：README.md のみ）：

```bash
git add README.md
git commit -m "Update README with latest project setup"
git push origin main
```

---

## 🌐 公開 URL 表示例 （GitHub Pages）

https://veltra-maps.github.io/cruise-itinerary/?ship=1359_MSC-Bellissima&ItineraryNo=4247417

---

## 📝 注意

- `.gitignore` により以下のファイル・フォルダは Git から除外されています：
  - `node_modules/`
  - `.DS_Store`
  - `package.json`
  - `package-lock.json`
  - `.env`
- 追加で Git にアップしたくないファイルやフォルダがある場合は、`.gitignore` ファイルを編集し、1 行ずつパスを追記してください（例：`secret.txt` や `temp/` など）。
- `itinerary_schedules/` はローカル開発中のみ使用され、`ship.json` にまとめた後、GitHub や Cloudflare にアップロードされます。

---

## 📤 GitHub へのアップ手順（ローカル → GitHub）

以下の手順でローカルプロジェクトを GitHub に初回アップロードできます：

```bash
cd ~/ProjectsDesktop/cruise-itinerary

# Git 初期化（初回のみ）
git init

# GitHub リモートリポジトリを指定
git remote add origin git@github.com:veltra-maps/cruise-itinerary.git

# ファイルをすべて追加してコミット
git add .
git commit -m "Initial commit"

# main ブランチとして指定
git branch -M main

# GitHub に push（初回）
git push -u origin main
```

もしすでに GitHub 上に main ブランチが存在していて push が拒否された場合は、以下を使用して上書きできます（慎重に）：

```bash
git push -f origin main
```

---
