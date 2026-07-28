# CLAUDE.md — 行銷搬進大程式（Marketing Live in Code）

給 AI agent 的專案總覽。本檔案是進入點，細節分散在 [`docs/`](docs/) 資料夾，開始工作前請先讀完本檔，再依任務讀對應的 docs。

## 這是什麼專案

Ivan（楊超霆）的個人部落格＋線上課程網站，網域 `marketingliveincode.com`。內容以 Python／爬蟲／行銷數據分析／管理思維為主，並有付費／免費線上課程章節。網站語言為繁體中文（`zh-Hant`）。

## ⚠️ 這是一個純靜態網站（後端已移除）

- 網站**沒有任何後端／資料庫**。所有文章 metadata 寫死在 [`src/assets/config.json`](src/assets/config.json)，文章內文是純 Markdown 檔放在 [`src/assets/article/`](src/assets/article/)，圖片放在 `src/assets/images/`。
- 原本有一個 Django REST 後端（`mlic_backend-main/`），但它從來不是前端 runtime 會呼叫的 API——只是過去用來上傳文章的 CMS 後台，其上傳結果會人工搬到前端 `src/assets/`。這個後端已經在重構時整個移除，歷史細節與移除前的內容比對記錄在 [`docs/backend-legacy.md`](docs/backend-legacy.md)（僅供歷史參考，`mlic_backend-main/` 資料夾本身已經不存在，但可從 `git log` 找回）。
- **新增／編輯文章不需要任何後端或工具**，直接照 [`docs/how-to-add-article.md`](docs/how-to-add-article.md) 的步驟改 `config.json` + 放檔案即可。

## 技術棧

- **前端（本目錄，唯一存在的部分）**：Angular 15 + Angular Universal SSR（`@nguniversal/express-engine`），Angular Material、ng-bootstrap、mdb-angular-ui-kit、ngx-markdown（渲染文章 `.md`）、ngx-masonry（About 頁相片牆）、Font Awesome。
- 部署型態維持 SSR（非純 CSR、非 prerender），有 SEO 考量，見 [`docs/architecture.md`](docs/architecture.md)。

## Repo 結構

```
mlic/                          ← 本目錄，Angular 前端，也是整個網站的全部
├── src/app/                   ← 元件（見 docs/architecture.md）
├── src/assets/config.json     ← 所有文章／課程 metadata（見 docs/content-model.md）
├── src/assets/article/*.md    ← 文章內文
├── src/assets/images/         ← 封面圖／內文圖
├── server.ts                  ← Angular Universal 的 Express SSR server
└── docs/                      ← 給 AI agent／人類看的詳細文件
```

## 常用指令

```bash
npm start               # ng serve，本機開發 (http://localhost:4200)
npm run generate-sitemap # 依 config.json 重新產生 src/sitemap.xml（build 前會自動跑一次）
npm run build            # 先跑 generate-sitemap，再 ng build（純前端 build）
npm run dev:ssr           # 本機跑 SSR
npm run build:ssr         # generate-sitemap + build 前端 + server bundle
npm run serve:ssr         # 跑編譯好的 SSR server
npm test                  # Karma/Jasmine 單元測試
npm run deploy            # prerender 全站 + push main + 發布 dist 到 gh-pages（GitHub Pages），見 docs/deployment.md
```

## 文件索引

1. [`docs/architecture.md`](docs/architecture.md) — 前端模組、路由、SSR 架構
2. [`docs/content-model.md`](docs/content-model.md) — `config.json` schema、文章／課程資料怎麼串起來
3. [`docs/how-to-add-article.md`](docs/how-to-add-article.md) — **新增一篇文章的完整操作 SOP**（取代原本 Django Admin 的角色）
4. [`docs/backend-legacy.md`](docs/backend-legacy.md) — 已移除的 Django 後端，歷史參考用
5. [`docs/refactor-plan.md`](docs/refactor-plan.md) — 這次靜態化／SEO 重構的執行記錄
6. [`docs/deployment.md`](docs/deployment.md) — `npm run deploy` 怎麼把網站發布到 GitHub Pages（自訂網域 `marketingliveincode.com`）

## 專案慣例

- 元件採 Angular 傳統 NgModule 架構（非 standalone），每個 feature 一個 module（`about.module.ts`、`home.module.ts` 等），共用元件集中在 [`src/app/shared.module.ts`](src/app/shared.module.ts)。
- SEO/social meta tag（含 `<title>`、OG/Twitter meta、canonical link、文章頁的 JSON-LD 結構化資料）統一由 [`src/app/makeMeta.ts`](src/app/makeMeta.ts) 的 `makeMeta` service 處理，各頁面元件在 constructor 呼叫 `meta.makeMeta(classification, article)`。**`GalleryComponent` 會被 `HomeComponent` 內嵌當「最新文章」小工具用，這種情況下不能呼叫 `meta.makeMeta()`，否則會蓋掉 host 頁面自己的 SEO tag**——判斷方式是檢查 `route.snapshot.params['cls']` 是否真的存在。
- 路由切換時「重置頁面狀態」的邏輯統一用 [`src/app/onNavigationEnd.ts`](src/app/onNavigationEnd.ts) 這個共用 helper（`onNavigationEnd(router, callback)`），不要在各元件裡各自寫 `router.events.subscribe(...)`。
- 沒有 `src/environments/` 環境設定檔，也沒有任何 `apiUrl` 之類的設定——因為前端本來就不打 API。
- `config.json` 用標準 ES `import config from '....config.json'` 讀取（`tsconfig.json` 開了 `resolveJsonModule`），在 build time 被打進 JS bundle；`.md` 文章檔則是透過 `<markdown src="...">`（ngx-markdown）在 runtime 用 HTTP 抓取，SSR 時也是靠 `MarkdownModule.forRoot({ loader: HttpClient })` 在 server 端發請求抓檔案。修改 `config.json` 需要重新 build 才會生效；新增/修改 `.md` 檔案內容則不用。
- `robots.txt`／`sitemap.xml` 原始檔放在 `src/`（不是 `src/assets/`），透過 `angular.json` 的 asset glob 輸出到 dist 根目錄；`sitemap.xml` 是 [`scripts/generate-sitemap.js`](scripts/generate-sitemap.js) 從 `config.json` 產生的 build 產物，本身不進版控（見 `.gitignore`）。
