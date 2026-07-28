# Mlic — 行銷搬進大程式（Marketing Live in Code）

Ivan（楊超霆）的個人部落格＋線上課程網站，網域 [marketingliveincode.com](https://marketingliveincode.com)。內容以 Python／爬蟲／行銷數據分析／管理思維為主，並有付費／免費線上課程章節。

這是一個**純靜態網站**（Angular 15 + Universal SSR，沒有後端／資料庫），所有文章 metadata 在 `src/assets/config.json`，內文是純 Markdown 檔放在 `src/assets/article/`。給 AI agent 看的完整技術文件在 [`CLAUDE.md`](CLAUDE.md) 跟 [`docs/`](docs/) 資料夾。

## 開發

```bash
npm start        # ng serve，本機開發，開瀏覽器連到 http://localhost:4200/
npm run dev:ssr    # 本機跑 SSR（Angular Universal）
npm test           # 跑單元測試（Karma/Jasmine）
```

## 常用指令一覽

| 指令 | 用途 |
|---|---|
| `npm run generate-sitemap` | 依 `config.json` 重新產生 `src/sitemap.xml`（build 前會自動跑一次） |
| `npm run build` | 純前端 build（`dist/mlic/browser/`），含 `robots.txt`／`sitemap.xml`／`CNAME` |
| `npm run build:ssr` | build 前端＋SSR server bundle |
| `npm run serve:ssr` | 跑編譯好的 SSR server（`dist/mlic/server/main.js`） |
| `npm run deploy` | **一鍵發布到 GitHub Pages**，詳見下方說明 |

## 部署到 GitHub Pages：`npm run deploy`

```bash
npm run deploy
```

這是自動化部署工具（[`scripts/deploy.js`](scripts/deploy.js)），會依序做三件事：

1. **Prerender 全站**：把 `config.json` 裡每一篇文章／每個分類頁都渲染成真正的靜態 HTML（不是只有首頁能用的陽春 CSR build），同時更新 `sitemap.xml`。這一步大概需要 **3～4 分鐘**（147 個路由左右，隨文章數量增加）。
2. **Push 原始碼到 GitHub 的 `main` 分支**（`git push origin HEAD:main`）。
3. **發布打包好的內容到 `gh-pages` 分支**（用 [`gh-pages`](https://www.npmjs.com/package/gh-pages) 套件），GitHub Pages 就會依此更新 `marketingliveincode.com` 正式站。

### 執行前提

- 專案已經設定好 `git remote origin`，指向你的 GitHub repo（`git remote -v` 可以檢查）
- 本機的 `git` 已經能對這個 repo 做 push（Windows 上通常用 Git Credential Manager，只要之前登入過 GitHub 帳號就會自動使用，不需要每次輸入帳密）
- **想發布的變更都已經 `git commit` 好**——這支腳本只會 push 已經 commit 的內容，如果有未 commit 的變更，腳本會印出警告但不會自動幫你 commit

### 執行後會發生什麼事

- 跑完會看到 `✅ 部署完成！` 的訊息
- `marketingliveincode.com` 幾秒到幾分鐘內就會更新成最新內容（GitHub Pages 需要一點時間處理新的部署）
- 自訂網域（Custom domain）設定不會再被重設——`src/CNAME` 已經是每次 build 的固定產物，`gh-pages` 分支會一直帶著它

### 想了解更多細節

- 為什麼需要 prerender（而不是單純 `ng build`）、為什麼自訂網域以前會被重設、跟 SSR 部署的關係——完整說明在 [`docs/deployment.md`](docs/deployment.md)
- 第一次部署後，建議去 GitHub repo 的 `Settings > Pages` 確認一次 Source 是 `gh-pages` 分支、Custom domain 有沒有正確顯示 `marketingliveincode.com`（正常情況下會自動出現）

## 新增文章

不需要任何工具，直接照 [`docs/how-to-add-article.md`](docs/how-to-add-article.md) 的步驟改 `config.json` + 放 Markdown 檔＋圖片即可，改完記得 `npm run deploy` 讓新文章上線。

## 文件索引

| 文件 | 內容 |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | 給 AI agent 看的專案總覽，開始改動前建議先讀 |
| [`docs/architecture.md`](docs/architecture.md) | 前端模組、路由、SSR 架構 |
| [`docs/content-model.md`](docs/content-model.md) | `config.json` schema、文章／課程資料怎麼串起來 |
| [`docs/how-to-add-article.md`](docs/how-to-add-article.md) | 新增一篇文章的完整操作 SOP |
| [`docs/deployment.md`](docs/deployment.md) | `npm run deploy` 的完整原理與細節 |
| [`docs/backend-legacy.md`](docs/backend-legacy.md) | 已移除的 Django 後端，歷史參考用 |
| [`docs/refactor-plan.md`](docs/refactor-plan.md) | 靜態化／SEO 重構的執行記錄 |

---

## Angular CLI 相關指令（本專案由 Angular CLI 15.2.8 產生）

以下是 Angular CLI 內建指令的補充說明：

- `ng generate component component-name`：產生一個新元件，也可以用 `ng generate directive|pipe|service|class|guard|interface|enum|module` 產生其他類型的程式碼
- `ng build`：純 `ng build`（不含本專案的 sitemap/prerender 客製流程），建置產物在 `dist/`
- `ng test`：透過 [Karma](https://karma-runner.github.io) 執行單元測試
- `ng e2e`：執行端對端測試（需要先加入實作端對端測試功能的套件，本專案目前沒有設定）
- `ng help` 或 [Angular CLI 總覽與指令參考](https://angular.io/cli)：更多 Angular CLI 說明
