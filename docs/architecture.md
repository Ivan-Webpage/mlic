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

> ⚠️ `BlogComponent` 用 `window.location.reload()` 處理路由變化（見 constructor 裡 `router.events.subscribe`），而不是用 Angular 的方式重新渲染。這是既有的 hack，重構時要留意是否要保留（SSR/靜態化後，切頁會整頁重載，SPA 的效果會打折）。

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

- `server.ts` 是 Express server，用 `ngExpressEngine` 渲染 `AppServerModule`，`npm run serve:ssr` 啟動；正式站目前跑這個 Node server。
- `angular.json` 的 `architect.prerender` 只設定了 `/` 這一個 route，並沒有把 `post-routes.txt`（[../post-routes.txt](../post-routes.txt)，列出約 120+ 篇文章的完整路徑）接進 prerender 設定——目前程式碼裡也沒有任何地方讀取 `post-routes.txt`，看起來像是手動維護、目前未被使用的 route 清單（可能原本要拿來做 sitemap 或全站 prerender，但沒接上）。重構成靜態站時，這份清單可以是「全站要 prerender 哪些路徑」的現成參考。
- Build asset pipeline：`angular.json` 的 `assets` 只設定 `src/assets`（整包複製到 dist），沒有其他資料來源。

## 內容渲染細節（重要，影響 SSR/靜態化決策）

- `config.json` 用 `require("src/assets/config.json")` 讀取 → **build time 就打包進 JS**，改了要重新 build。
- 文章 `.md` 內文用 `<markdown src="{{article}}">`（ngx-markdown）→ **runtime 用 HTTP GET 抓檔案**（瀏覽器端用 fetch，SSR 端則是 `MarkdownModule.forRoot({ loader: HttpClient })` 在 Node 端發 request）。也就是說即使是 SSR，渲染文章內文仍然要對外（或對自己）發一次 HTTP request 抓 `.md` 檔，不是純記憶體操作。
- 圖片一律用相對路徑字串（如 `assets/images/article_cover/xxx.jpg`），由瀏覽器直接當靜態資源請求，跟後端無關。

延伸閱讀：[content-model.md](content-model.md) 說明 `config.json` 的完整 schema 與資料串接邏輯。
