# 重構計畫：移除 Django 後端，改為純靜態網站

## 目標

- 移除 `mlic_backend-main/` 整個資料夾與其部署
- 前端維持 Angular，但不再需要一個「隨時在跑、要人維護」的 Django 服務
- 之後內容更新交給 AI agent 處理（改 `config.json` + `.md` 檔 + 圖片 → build → 部署）

## 現況基礎（已確認，不用重新調查）

- 前端目前**沒有任何 runtime API 呼叫**指向後端，內容已經 100% 是靜態的（`config.json` + `src/assets/article/*.md` + 圖片），詳見 [content-model.md](content-model.md)
- 後端唯一還在扮演的角色，是**過去用來上傳/管理文章的 CMS**（Django Admin），資料已經（大部分）人工搬到前端，詳見 [backend-legacy.md](backend-legacy.md)
- 兩邊內容有落差：**後端多 4 篇未發佈的 Django 教學文章**（+對應封面圖），前端沒有

## 待與 Ivan 確認的問題（開始大改之前先問，不要自己猜）

1. **那 4 篇「Django 教學系列」文章要不要一併發佈到前端？** 如果要，需要走一次[content-model.md](content-model.md)裡的「新增文章」流程，並補上 `previous`/`next` 鏈結（要接進哪個系列由 Ivan 決定，程式碼看不出來原本打算放哪）。
2. **日後怎麼「寫文章」？** 現在等於是靠人工編輯 `config.json` + 丟 `.md` 檔 + 丟圖片。是否要做一個小工具（CLI script 或簡單表單）幫忙：自動配下一個 id、自動維護 `previous`/`next` 雙向鏈結、自動更新 `class[].chapter[]`？還是就維持全手動（畢竟更新頻率不高，AI agent 之後可以直接照流程手改）？
3. **SSR（Node/Express server）要不要留？** 目前正式站是 Angular Universal SSR（`server.ts` 起一個 Express process）。純靜態化有兩個方向可選：
   - **(a) 全站 prerender**：用 `@nguniversal/builders:prerender`，把 `post-routes.txt`（[../post-routes.txt](../post-routes.txt)，目前未被使用、但剛好列出了所有文章路徑）接進 `angular.json` 的 `prerender.options.routes`，build 出純 HTML/JS/CSS，丟到任何靜態 hosting（GitHub Pages / Cloudflare Pages / Zeabur static 等），完全不用跑 Node process。SEO 效果跟現在 SSR 接近，但少了一個要顧的 server。
   - **(b) 純 CSR**：拿掉 SSR，直接 `ng build` 丟靜態檔（`index.html` 由瀏覽器端 Angular 接管路由）。最簡單，但初次載入的 SEO/OG 分享預覽會變差（`makeMeta.ts` 設的 meta tag 是 client-side 才設定的，社群爬蟲抓到的會是空的 `index.html`）。
   - 目前傾向 (a)，但需要 Ivan 確認 SEO／社群分享預覽的重要性，以及是否接受多一道 prerender build 步驟。
4. **`class["5"]`（實用工具分享）沒有被 `blog.component.ts` 的線上課程判斷清單納入**，是否為刻意設計（希望它走一般文章頁而非課程頁）？如果不是，重構時要一併修正這個不一致（見 [content-model.md](content-model.md)）。

## 建議的執行階段（等問題 1–4 確認後再排優先序）

1. **內容補齊**：視問題 1 的答案，把缺的 4 篇文章（若要發佈）搬進前端，跑一次完整的「新增文章」流程驗證沒問題。
2. **內容工作流程**：視問題 2 的答案，寫（或不寫）一個小工具取代 Django Admin 的上傳功能。
3. **部署形態**：視問題 3 的答案，調整 `angular.json` 的 `prerender` 設定／拿掉 `server.ts` 與 SSR 相關 npm scripts、依賴（`@nguniversal/*`、`express`）。
4. **修資料一致性小問題**：`class["5"]` 分類判斷、`article_url` 死欄位、缺 `next`/`previous` 的舊文章防呆（見 [content-model.md](content-model.md)「已知的資料一致性問題」）。
5. **刪除 `mlic_backend-main/`**，並取消其在 Zeabur（或其他平台）上的部署／關閉服務。
6. **收尾**：確認 `.gitignore`、README、部署文件都不再提到 Django 後端；`src/index.html` 裡的 Google Analytics（`gtag.js`，`UA-193650099-1`）等第三方追蹤碼維持不動，跟後端無關。

## 明確不需要做的事（避免過度工程）

- 不需要幫「前端呼叫後端 API」寫遷移層——因為本來就沒有這種呼叫。
- 不需要保留後端的 JWT/`Temp` model 邏輯，那段程式碼跟部落格內容無關（見 [backend-legacy.md](backend-legacy.md)）。
