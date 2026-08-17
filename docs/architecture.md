# 前端架構（Angular 21 + Universal SSR）

> 2026-08 從 Angular 15 逐版升級到 21（16→17→18→19→20→21，一次一個大版本，每版都
> 用瀏覽器＋SSR＋147 條路由 prerender 實測過才繼續，過程紀錄見 git log）。
> `mdb-angular-ui-kit` 保留（`styles.scss` 還在用它的 CSS 框架），但 Angular
> 元件依賴（navbar 的收合/下拉選單）已改用 `ng-bootstrap`。這是升級目標
> 停在 21、沒有衝到最新 22 的原因——`mdb-angular-ui-kit` 最新版只支援到
> Angular 21。

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
| `layout/navbar` | 導覽列（含下拉選單，ng-bootstrap `NgbCollapse`/`NgbDropdown`） |
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

- `server.ts` 是 Express server，改用 `@angular/ssr`（Angular 17 之後內建，取代已停止維護的
  `@nguniversal/express-engine`）的 `CommonEngine` 渲染，`npm run serve:ssr` 啟動；正式站
  實際上線走的是 GitHub Pages 靜態 prerender（見下方跟 `deployment.md`），這支 SSR server
  是保留給之後可能改用 Zeabur 等平台做即時 SSR 時用，目前不是正式站實際在跑的東西。
  **`CommonEngine` 建構子帶了 `allowedHosts: ['localhost', 'marketingliveincode.com']`**
  ——Angular 19 開始 `CommonEngine` 會檢查請求的 host 是否在白名單內，不在名單內的 host
  不會報錯，而是靜默退化成純 CSR（回傳的 HTML 沒有真的做 SSR，只是外殼），沒設這個名單
  容易誤以為 SSR 正常運作、實際上完全沒有伺服器端渲染。
- `angular.json` 的 `architect.prerender`／`serve-ssr` 已改用內建的
  `@angular-devkit/build-angular:prerender`／`:ssr-dev-server` builder（取代
  `@nguniversal/builders`），`options.routes` 只設定了 `/` 這一個 route——實際上
  `npm run deploy`／`scripts/deploy.js` 用 `--routes-file` CLI 參數帶入
  `scripts/generate-prerender-routes.js` 產生的完整 147 條路由清單，這個 builder 遷移後
  `--routes-file` 用法沒有改變，已實測驗證過。
- **`tsconfig.json` 的 `moduleResolution` 是 `"bundler"`**（Angular 21 升級時從舊的
  `"node"` 改的）。現代 Angular 套件（例如 `@angular/common/http`）已經不是用實體資料夾
  曝露子路徑，而是純靠 `package.json` 的 `exports` map，`"node"` 這種舊式解析策略看不懂
  `exports` map，會出現一大串看似不相關的「找不到模組」/「未知元素」錯誤，改成
  `"bundler"` 才能正確解析。
- Build asset pipeline：`angular.json` 的 `assets` 除了整包複製 `src/assets` 之外，另外用三個 glob entry 把 `src/robots.txt`／`src/sitemap.xml`／`src/CNAME`（注意：這幾個放在 `src/` 底下，不是 `src/assets/`）輸出到 dist **根目錄**（`/robots.txt`、`/sitemap.xml`、`/CNAME`），這樣搜尋引擎跟 GitHub Pages 才抓得到，放在 `/assets/` 底下的話 URL 會變成 `/assets/robots.txt`，不符合慣例。`CNAME` 是給 GitHub Pages 自訂網域用的，見 [deployment.md](deployment.md)。
- `sitemap.xml` 是 [`scripts/generate-sitemap.js`](../scripts/generate-sitemap.js) 依 `config.json` 產生的，`npm run build`／`npm run build:ssr` 都會在 `ng build` 之前先跑這支腳本；它本身不進版控（是 build 產物，見 `.gitignore`），本機沒 build 過的話 `src/sitemap.xml` 不會存在。

## 內容渲染細節（重要，影響 SSR/靜態化決策）

- `config.json` 用標準 ES `import config from '....config.json'` 讀取（`tsconfig.json` 開了 `resolveJsonModule`）→ **build time 就打包進 JS**，改了要重新 build。
- 文章 `.md` 內文用 `<markdown src="{{article}}">`（ngx-markdown）→ **runtime 用 HTTP GET 抓檔案**（瀏覽器端用 fetch，SSR 端則是 `MarkdownModule.forRoot({ loader: HttpClient })` 在 Node 端發 request）。也就是說即使是 SSR，渲染文章內文仍然要對外（或對自己）發一次 HTTP request 抓 `.md` 檔，不是純記憶體操作。
- 圖片一律用相對路徑字串（如 `assets/images/article_cover/xxx.jpg`），由瀏覽器直接當靜態資源請求，跟後端無關。
- SEO meta（`<title>`、OG/Twitter tag、`<link rel="canonical">`、文章頁 JSON-LD）都由 [`makeMeta.ts`](../src/app/makeMeta.ts) 透過 `DOCUMENT`/`Title`/`Meta` 這幾個 Angular 抽象操作，在瀏覽器和 SSR（Node）端都能正確運作、且都會反映在初始 HTML 裡（已用 `curl` 對 SSR build 的輸出實測驗證過）。
- **文章目錄自動產生跟圖片客製化是靠覆寫 `ngx-markdown` 的 `MarkdownService.renderer`
  做的**（[`article.component.ts`](../src/app/blog/article/article.component.ts) 的
  `reset()`），目前對應的是 `marked` v18 的 renderer API：`renderer.heading`／
  `renderer.image` 接收單一 token 物件（`Tokens.Heading`/`Tokens.Image`，從
  `marked` 套件 import），不是舊版（v5 以前）的一串位置參數。之後如果要再升級
  `ngx-markdown`／`marked`，這兩個函式的簽名很可能又會變，要對照當時 `marked`
  套件的 `Renderer` 型別定義調整，不能直接照抄現在的寫法。

延伸閱讀：[content-model.md](content-model.md) 說明 `config.json` 的完整 schema 與資料串接邏輯。
