# 部署：GitHub Pages（自訂網域 marketingliveincode.com）

## 一鍵部署

```bash
npm run deploy
```

這個指令（[`scripts/deploy.js`](../scripts/deploy.js)）依序做三件事：

1. **產生路由清單 + prerender 所有頁面**：跑 `generate-sitemap`（更新 `sitemap.xml`）→ [`scripts/generate-prerender-routes.js`](../scripts/generate-prerender-routes.js)（依 `config.json` 產生一份純文字路由清單 `prerender-routes.txt`，一行一個路徑）→ `ng run mlic:prerender --routes-file=prerender-routes.txt`（會自動 build browser + server bundle，並把清單裡每個路由都渲染成 `dist/mlic/browser/<路由>/index.html` 這種實體靜態頁面）→ [`scripts/copy-404.js`](../scripts/copy-404.js)（額外把 `index.html` 複製一份成 `404.html`，當作沒被列進路由清單的網址的保險）
2. `git push origin HEAD:main`——把目前分支（本地是 `master`）的內容推到遠端的 `main` 分支
3. `npx gh-pages -d dist/mlic/browser`——用 [`gh-pages`](https://www.npmjs.com/package/gh-pages) 套件把 `dist/mlic/browser` 的內容發布到 `gh-pages` 分支（這個套件會自己管理 `gh-pages` 分支的 commit/force-push，不會動到 `main` 分支的歷史）

> ⚠️ 這個腳本會**先 build，發現有問題就中止**（不會半殘 push 出去），且會提醒你有沒有尚未 commit 的變更。但 `git push`／發佈到 gh-pages 都是會影響遠端／正式網站的動作，執行前請確認你要發佈的內容已經 commit 好、也確定要上線。Prerender 147 個路由目前實測約需 3~4 分鐘，屬正常現象。

## 為什麼每個路由都要 prerender，而不是單純 `ng build`

第一次用這支工具部署時（2026-07-28）發現：純 `ng build` 是 CSR-only 產物，GitHub Pages 上除了首頁根目錄，其他所有路徑（`/about`、`/classification/xxx/yyy`…）都直接 404，因為 GitHub Pages 只會照實體檔案路徑找檔案，沒有伺服器幫忙轉導。

比對舊的 `gh-pages` 分支內容才發現，**舊部署其實一直都有做 prerender**（`gh-pages` 分支根目錄下有實體的 `home/`、`about/`、`classification/` 資料夾，各自有自己的 `index.html`），應該是透過 `angular.json` 裡本來就有的 `prerender` architect target 搭配當時的 `post-routes.txt`（已在 SEO 重構時移除）產生的。現在用 `generate-prerender-routes.js` 從 `config.json` 自動產生等效、且更完整的路由清單（含全部 139 篇文章），取代原本手動維護的 `post-routes.txt`。

Prerender 出來的頁面，搜尋引擎爬到的是真正的 **200** 狀態碼＋完整內容（用 `curl` 或檢視原始碼就看得到，不需要跑 JS），比單純 CSR 的 SEO 效果好很多。`copy-404.js` 產生的 `404.html` 只是保底用（例如網址打錯字、或路由清單一時沒更新到的極端情況），不是主要機制。

## 為什麼 Custom Domain 以前每次 push 都會被重設

GitHub Pages 的自訂網域設定，實際上是靠 `gh-pages` 分支根目錄下的一個 **`CNAME`** 檔案（內容就是網域名稱，這裡是 `marketingliveincode.com`）記住的。只要某次部署的內容沒帶這個檔案，GitHub 就會判定「使用者拿掉了自訂網域」，把 Settings 裡的 Custom domain 欄位清空。

以前的部署流程八成沒有把 `CNAME` 放進部署內容裡，所以每次 push 都被重設。現在的作法：

- 原始檔放在 [`src/CNAME`](../src/CNAME)（內容是 `marketingliveincode.com`）
- `angular.json` 的 `assets` 設定了一個 glob，把 `src/CNAME` 複製到 `dist/mlic/browser/CNAME`（做法跟 `robots.txt`／`sitemap.xml` 一樣，見 [architecture.md](architecture.md)）
- 所以**每次** build 都會自動帶上 `CNAME`，`npm run deploy` 發布到 `gh-pages` 分支時也一定會包含它；`gh-pages` CLI 也額外多帶了 `--cname`／`--nojekyll` 參數當雙重保險

只要這個檔案持續存在於 `gh-pages` 分支裡，Custom domain 設定就不會再被重設，不需要每次手動回 GitHub 網頁重填。

## 第一次部署前要手動確認的事（GitHub 網頁上）

以下這些是 GitHub repo 的設定，不是程式碼，沒辦法用這支腳本自動做，需要手動到 `https://github.com/<owner>/<repo>/settings/pages` 確認一次：

1. **Source** 要設成「Deploy from a branch」，Branch 選 `gh-pages` / `/(root)`（通常第一次 push `gh-pages` 分支後 GitHub 會自動偵測並幫你設好，但建議還是去確認一次）
2. **Custom domain** 欄位跑完第一次 `npm run deploy` 後，應該會自動出現 `marketingliveincode.com`（因為 `CNAME` 檔案已經在 `gh-pages` 分支裡了）。如果沒有自動出現，手動填入存檔一次即可，之後就會持續保留
3. DNS（網域註冊商那邊，例如 A 記錄指到 GitHub Pages 的 IP，或 CNAME 記錄指到 `<owner>.github.io`）——這個網站先前就已經在 `marketingliveincode.com` 上線過，DNS 應該已經設定好了，這裡不需要重新設定

## 跟 SSR 部署的關係

`npm run deploy` 走的是**靜態＋prerender**路線，跟 [`server.ts`](../server.ts) 的 Angular Universal SSR（每個 request 都即時 render）是兩條不同的部署路徑：

- GitHub Pages 只能放靜態檔案，沒辦法跑 Node.js process，所以不能用「每個 request 即時 SSR」這種模式，用 prerender（build time 就把每個已知路由都先渲染好）是最接近的替代方案
- 如果之後正式站改用別的平台（例如原本 Zeabur）跑即時 SSR（`npm run build:ssr` + `npm run serve:ssr`），那是另一條路徑，跟 GitHub Pages 這條無關，兩者可以並存但目前這支 `deploy` 腳本只處理 GitHub Pages 這條
- Prerender 出來的頁面是「build 當下」的內容快照；之後新增文章要記得重新跑一次 `npm run deploy`，新文章才會有自己的 prerender 頁面（在那之前靠 `404.html` fallback 頂著，內容依然正確，只是 HTTP 狀態碼是 404）
