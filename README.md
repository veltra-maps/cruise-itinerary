# 🚢 Cruise Itinerary

このリポジトリは、クルーズ旅程（Itinerary）を地図上に可視化するための静的 Web サイトです。`route.html` に旅程番号（ItineraryNo）とクルーズ船 ID（ship）を指定することで、寄港地のルート表示ができます。

---

## 📁 ディレクトリ構成とファイルの説明（ローカル & GitHub Pages）

```
cruise-itinerary/
├── .gitignore               # Gitが追跡しないファイルを指定（node_modules, .DS_Storeなど）
├── itinerary_schedules/    # 旅程JSONファイルの保管場所（ローカル開発用、Gitには含めない）
├── index.html              # メインのHTMLファイル。旅程ルートを描画する
├── ship.json               # 旅程データの集約ファイル（CloudflareやGitHubに設置可能）
├── port.json               # 港マスタ（Cloudflareまたは静的ファイル）
├── images/                 # マーカー画像やアイコン（VT_symbol など）
├── README.md               # このファイル（構成や使い方の説明）

├── package.json            # npm構成ファイル（ローカル開発用、Gitには含めない）
├── package-lock.json       # npm依存関係のロック（Gitには含めない）
├── node_modules/           # npmライブラリ群（Gitには含めない）
```

---

## 🌐 公開 URL（GitHub Pages）

https://veltra-maps.github.io/cruise-itinerary/route.html?ship=622_Celebrity-Millennium&ItineraryNo=4149492

---

## 📝 注意

- `.gitignore` により以下のファイル・フォルダは Git から除外されています：
  - `node_modules/`
  - `.DS_Store`
  - `package.json`
  - `package-lock.json`
  - `.env`
- `itinerary_schedules/` はローカル開発中のみ使用され、`ship.json` にまとめた後、GitHub や Cloudflare にアップロードされます。

---

## 📤 GitHub へのアップ手順（ローカル → GitHub）

以下の手順でローカルプロジェクトを GitHub に初回アップロードできます：

````bash
cd ~/ProjectsDesktop/cruise-itinerary

# Git 初期化（初回のみ）
git init

# GitHub リモートリポジトリを指定
git remote add origin https://github.com/veltra-maps/cruise-itinerary.git

# ファイルをすべて追加してコミット
git add .
git commit -m "Initial commit"

# main ブランチとして指定
git branch -M main

# GitHub に push（初回）
git push -u origin main
## 「ローカルの main ブランチの差分（＝変更・追加・削除されたファイル）を GitHub の main に反映する」**というコマンド

もしすでに GitHub 上に main ブランチが存在していて push が拒否された場合は、以下を使用して上書きできます（慎重に）：

```bash
git push -f origin main
````

# ファイル追加・変更後（まとめて差分全部アップ）

git add .
git commit -m "Update project files"
git push origin main

```
# ファイル追加・変更後 （個別でアップする場合 例：README.md）
git add README.md
git commit -m "Update README with latest project setup"
git push origin main
```
