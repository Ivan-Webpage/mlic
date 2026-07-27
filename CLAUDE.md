# CLAUDE.md — 行銷搬進大程式（Marketing Live in Code）

給 AI agent 的專案總覽。本檔案是進入點，細節分散在 [`docs/`](docs/) 資料夾，開始工作前請先讀完本檔，再依任務讀對應的 docs。

## 這是什麼專案

Ivan（楊超霆）的個人部落格＋線上課程網站，網域 `marketingliveincode.com`。內容以 Python／爬蟲／行銷數據分析／管理思維為主，並有付費／免費線上課程章節。網站語言為繁體中文（`zh-Hant`）。

## ⚠️ 目前最重要的事實：前端已經是「靜態內容」驅動

這點會大幅影響重構策略，務必先理解：

- 前端**完全沒有**在 runtime 呼叫 `mlic_backend-main` 的任何 API（已用 grep 全面確認過，找不到 `HttpClient` 打 API、`fetch`、表單送出等行為）。
- 所有文章 metadata 其實已經寫死在 [`src/assets/config.json`](src/assets/config.json)，文章內文是純 Markdown 檔放在 [`src/assets/article/`](src/assets/article/)，圖片放在 `src/assets/images/`。
- Django 後端（`mlic_backend-main/`）目前的真實角色，比較像是**過去用來管理／上傳文章內容的 CMS 後台**（透過 Django Admin 上傳文章 Markdown 檔、封面圖片），其上傳結果（`static/upload/markdown/`、`static/upload/image/`）才是內容的「原始資料來源」，之後被人工搬到前端 `src/assets/`。並沒有自動同步腳本。
- 因此「移除後端、改全靜態」這件事，**難度遠低於一般「拔掉後端 API」的重構**——前端本來就不吃後端資料。真正要解決的是：**內容更新／新增文章的工作流程，之後要怎麼做**（見 [`docs/refactor-plan.md`](docs/refactor-plan.md)）。

## 技術棧

- **前端（本目錄）**：Angular 15 + Angular Universal SSR（`@nguniversal/express-engine`），Angular Material、ng-bootstrap、mdb-angular-ui-kit、ngx-markdown（渲染文章 `.md`）、ngx-masonry（About 頁相片牆）、Font Awesome。
- **後端（`mlic_backend-main/`，即將移除）**：Django 4.2 + Django REST Framework，SQLite，部署在 Zeabur（gunicorn + whitenoise）。詳見 [`docs/backend-legacy.md`](docs/backend-legacy.md)。

## Repo 結構

```
mlic/                          ← 本目錄，Angular 前端
├── src/app/                   ← 元件（見 docs/architecture.md）
├── src/assets/config.json     ← 所有文章／課程 metadata（見 docs/content-model.md）
├── src/assets/article/*.md    ← 文章內文
├── src/assets/images/         ← 封面圖／內文圖
├── server.ts                  ← Angular Universal 的 Express SSR server
├── docs/                      ← 給 AI agent 看的詳細文件（本次新增）
└── mlic_backend-main/         ← Django 後端原始碼（僅供參考，重構後會整包移除）
```

## 常用指令

```bash
npm start          # ng serve，本機開發 (http://localhost:4200)
npm run build       # ng build，純前端 build
npm run dev:ssr      # 本機跑 SSR
npm run build:ssr    # build 前端 + server bundle
npm run serve:ssr    # 跑編譯好的 SSR server
npm test             # Karma/Jasmine 單元測試
```

## 重構目標（進行中）

目標：拿掉 Django 後端，讓網站變成**完全靜態網站**。重構前請先讀：

1. [`docs/architecture.md`](docs/architecture.md) — 前端模組、路由、SSR 架構
2. [`docs/content-model.md`](docs/content-model.md) — `config.json` schema、文章／課程資料怎麼串起來、怎麼新增一篇文章
3. [`docs/backend-legacy.md`](docs/backend-legacy.md) — Django 後端的 models／API／admin，做為移除前的參考文件
4. [`docs/refactor-plan.md`](docs/refactor-plan.md) — 拔後端的具體階段、待確認事項、已發現的資料落差

## 專案慣例

- 元件採 Angular 傳統 NgModule 架構（非 standalone），每個 feature 一個 module（`about.module.ts`、`home.module.ts` 等），共用元件集中在 [`src/app/shared.module.ts`](src/app/shared.module.ts)。
- SEO/social meta tag 統一由 [`src/app/makeMeta.ts`](src/app/makeMeta.ts) 的 `makeMeta` service 處理，各頁面元件在 constructor 呼叫 `meta.makeMeta(classification, article)`。
- 沒有 `src/environments/` 環境設定檔，也沒有任何 `apiUrl` 之類的設定——因為前端本來就不打 API。
- `config.json` 用 `require()` 在 build time 被 webpack 打進 JS bundle；`.md` 文章檔則是透過 `<markdown src="...">`（ngx-markdown）在 runtime 用 HTTP 抓取，SSR 時也是靠 `MarkdownModule.forRoot({ loader: HttpClient })` 在 server 端發請求抓檔案。修改 `config.json` 需要重新 build 才會生效；新增/修改 `.md` 檔案內容則不用。
