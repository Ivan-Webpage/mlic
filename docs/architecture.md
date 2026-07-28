# 前端架構（Angular 15 + Universal SSR）

## 路由

定義於 [`src/app/app-routing.module.ts`](../src/app/app-routing.module.ts)：

```
/                                   → redirect → /home
/home                                → HomeComponent            首頁
/about                               → AboutComponent           關於我
/classification/:cls                 → GalleryComponent         某分類的文章列表（畫廊式排版）
/classification/:cls/:id             → BlogComponent            單篇文章／課程頁
```

全部包在 `LayoutComponent` 底下（`<app-navbar>` + `<router-outlet>` + `<app-footer>` + `<app-right-botton>`）。

`:cls`（classification）目前有兩種語意，靠 `BlogComponent` 判斷：

- 一般文章分類：`marketing`（行銷與商業分析）、`financial`（投資與程式金融）、`technology`（工程技術紀錄）、`manage`（管理與經理人思維）→ 顯示 `ArticleComponent`
- 線上課程分類（寫死在 [`blog.component.ts`](../src/app/blog/blog.component.ts) 的陣列）：`python_foundation`、`lineBot`、`telegramBot`、`crawler_king` → 顯示 `OnlineClassComponent`（多一個章節目錄 + YouTube 影片嵌入）

`:id` 是文章在 `config.json` `article` 物件裡的 key（字串數字，如 `"1"`、`"122"`）。

> ⚠️ `BlogComponent`（以及 `GalleryComponent`）用 `window.location.reload()` 處理路由變化，`ArticleComponent`／`OnlineClassComponent` 則是重新呼叫 `reset()`。這幾個元件都透過共用的 [`onNavigationEnd()`](../src/app/onNavigationEnd.ts) helper 訂閱 `NavigationEnd`。這是刻意保留的既有行為，不是待清理的技術債：切頁時強制整頁重載／重置，能確保 `makeMeta.ts` 設定的 SEO/OG meta tag 在每次導覽都是新的，避免 SPA client-side 導航殘留舊頁面的 meta 資訊。

## 模組結構

- `AppModule`（[app.module.ts](../src/app/app.module.ts)）— root module，宣告 `AppComponent`、`LayoutComponent`、`BlogComponent`，載入 `MarkdownModule.forRoot()`
- `SharedModule`（[shared.module.ts](../src/app/shared.module.ts)）— 集中宣告大多數共用元件（`FooterComponent`、`ArticleComponent`、`OnlineClassComponent`、`GalleryComponent`、`NavbarComponent`、`RightBottonComponent`）與第三方 UI module（Angular Material、ng-bootstrap、mdb、FontAwesome、ngx-markdown、ngx-scrolltop…），並在 `providers` 註冊 `makeMeta`
- `HomeModule`、`AboutModule` — 各自獨立小 module，只放自己的元件
- `AppServerModule`（[app.server.module.ts](../src/app/app.server.module.ts)）— SSR 用的 server module

## 元件清單

| 路徑 | 用途 |
|---|---|
| `layout/layout.component` | 全站外框：navbar + router-outlet + footer + 回頂/社群浮動按鈕 |
| `layout/navbar` | 導覽列（含下拉選單，MDB collapse/dropdown） |
| `layout/footer` | 頁尾（社群連結，純靜態） |
| `layout/right-botton` | 右下角浮動按鈕（回頂 + 社群連結，純靜態） |
| `layout/sticky/sticky.directive` | 自製 sticky 定位 directive（配合 `DestroyService` 做 `takeUntil` 清理） |
| `home/home.component` | 首頁 |
| `about/about.component` | 關於我頁，含 masonry 相片牆（講師經歷照片） |
| `gallery/gallery.component` | 某分類下的文章清單／畫廊 |
| `blog/blog.component` | 路由分派：依 `:cls` 決定顯示 `ArticleComponent` 或 `OnlineClassComponent` |
| `blog/article/article.component` | 一般文章內文頁：渲染 Markdown、自動產生目錄（H2–H6）、上/下篇導覽 |
| `blog/online-class/online-class.component` | 線上課程單元頁：YouTube 內嵌影片 + 課程章節側欄 |
| `makeMeta.ts` | 依頁面類型設定 `<title>` 與 SEO/OpenGraph/Twitter meta tag |

## SSR / build 流程

- `server.ts` 是 Express server，用 `ngExpressEngine` 渲染 `AppServerModule`，`npm run serve:ssr` 啟動；正式站目前跑這個 Node server。這是重構後刻意維持的決定（見 [refactor-plan.md](refactor-plan.md)），不是待處理項目。
- `angular.json` 的 `architect.prerender` 只設定了 `/` 這一個 route，實際上沒有被使用到——正式站走的是 SSR（每個 request 都即時 render），不是 prerender 靜態輸出。
- Build asset pipeline：`angular.json` 的 `assets` 除了整包複製 `src/assets` 之外，另外用兩個 glob entry 把 `src/robots.txt`／`src/sitemap.xml`（注意：這兩個放在 `src/` 底下，不是 `src/assets/`）輸出到 dist **根目錄**（`/robots.txt`、`/sitemap.xml`），這樣搜尋引擎才抓得到，放在 `/assets/` 底下的話 URL 會變成 `/assets/robots.txt`，不符合慣例。
- `sitemap.xml` 是 [`scripts/generate-sitemap.js`](../scripts/generate-sitemap.js) 依 `config.json` 產生的，`npm run build`／`npm run build:ssr` 都會在 `ng build` 之前先跑這支腳本；它本身不進版控（是 build 產物，見 `.gitignore`），本機沒 build 過的話 `src/sitemap.xml` 不會存在。

## 內容渲染細節（重要，影響 SSR/靜態化決策）

- `config.json` 用標準 ES `import config from '....config.json'` 讀取（`tsconfig.json` 開了 `resolveJsonModule`）→ **build time 就打包進 JS**，改了要重新 build。
- 文章 `.md` 內文用 `<markdown src="{{article}}">`（ngx-markdown）→ **runtime 用 HTTP GET 抓檔案**（瀏覽器端用 fetch，SSR 端則是 `MarkdownModule.forRoot({ loader: HttpClient })` 在 Node 端發 request）。也就是說即使是 SSR，渲染文章內文仍然要對外（或對自己）發一次 HTTP request 抓 `.md` 檔，不是純記憶體操作。
- 圖片一律用相對路徑字串（如 `assets/images/article_cover/xxx.jpg`），由瀏覽器直接當靜態資源請求，跟後端無關。
- SEO meta（`<title>`、OG/Twitter tag、`<link rel="canonical">`、文章頁 JSON-LD）都由 [`makeMeta.ts`](../src/app/makeMeta.ts) 透過 `DOCUMENT`/`Title`/`Meta` 這幾個 Angular 抽象操作，在瀏覽器和 SSR（Node）端都能正確運作、且都會反映在初始 HTML 裡（已用 `curl` 對 SSR build 的輸出實測驗證過）。

延伸閱讀：[content-model.md](content-model.md) 說明 `config.json` 的完整 schema 與資料串接邏輯。
