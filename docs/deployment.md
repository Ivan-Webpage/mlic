# 部署：GitHub Pages（自訂網域 marketingliveincode.com）

## 一鍵部署

```bash
npm run deploy
```

這個指令（[`scripts/deploy.js`](../scripts/deploy.js)）依序做三件事：

1. `npm run build`——純前端 build，產出 `dist/mlic/browser/`（build 前會自動先跑 `generate-sitemap`，`robots.txt`／`sitemap.xml`／`CNAME` 都會被複製進 dist 根目錄）
2. `git push origin HEAD:main`——把目前分支（本地是 `master`）的內容推到遠端的 `main` 分支
3. `npx gh-pages -d dist/mlic/browser`——用 [`gh-pages`](https://www.npmjs.com/package/gh-pages) 套件把 `dist/mlic/browser` 的內容發布到 `gh-pages` 分支（這個套件會自己管理 `gh-pages` 分支的 commit/force-push，不會動到 `main` 分支的歷史）

> ⚠️ 這個腳本會**先 build，發現有問題就中止**（不會半殘 push 出去），且會提醒你有沒有尚未 commit 的變更。但 `git push`／發佈到 gh-pages 都是會影響遠端／正式網站的動作，執行前請確認你要發佈的內容已經 commit 好、也確定要上線。

## 為什麼 Custom Domain 以前每次 push 都會被重設

GitHub Pages 的自訂網域設定，實際上是靠 `gh-pages` 分支根目錄下的一個 **`CNAME`** 檔案（內容就是網域名稱，這裡是 `marketingliveincode.com`）記住的。只要某次部署的內容沒帶這個檔案，GitHub 就會判定「使用者拿掉了自訂網域」，把 Settings 裡的 Custom domain 欄位清空。

以前的部署流程八成沒有把 `CNAME` 放進部署內容裡，所以每次 push 都被重設。現在的作法：

- 原始檔放在 [`src/CNAME`](../src/CNAME)（內容是 `marketingliveincode.com`）
- `angular.json` 的 `assets` 設定了一個 glob，把 `src/CNAME` 複製到 `dist/mlic/browser/CNAME`（做法跟 `robots.txt`／`sitemap.xml` 一樣，見 [architecture.md](architecture.md)）
- 所以**每次** `npm run build` 都會自動帶上 `CNAME`，`npm run deploy` 發布到 `gh-pages` 分支時也一定會包含它

只要這個檔案持續存在於 `gh-pages` 分支裡，Custom domain 設定就不會再被重設，不需要每次手動回 GitHub 網頁重填。

## ⚠️ 深連結（deep link）目前是用 404.html fallback，不是 prerender（跟舊部署不同，是已知取捨）

2026-07-28 第一次用這支工具部署時發現：**GitHub Pages 上除了首頁根目錄，其他所有路徑（`/about`、`/classification/xxx/yyy`…）都是 404**。原因是這裡是純 CSR（client-side render）的 `ng build` 產物，GitHub Pages 只會照實體檔案路徑找檔案，沒有像 SSR 那樣「不管什麼路徑都渲染正確內容」的伺服器。

比對舊的 `gh-pages` 分支內容後發現，**舊的部署方式其實有做 prerender**（`gh-pages` 分支根目錄下有實體的 `home/`、`about/`、`classification/` 資料夾，每個都各自有 `index.html`），應該是透過 `angular.json` 裡本來就有的 `prerender` architect target（`ng run mlic:prerender`）搭配 `post-routes.txt`（已在 SEO 重構時移除，見 [refactor-plan.md](refactor-plan.md)）產生的。Prerender 出來的頁面，搜尋引擎爬到時拿到的是真正的 200 狀態碼＋完整內容，SEO 效果比較好。

**目前這支 `npm run deploy` 用的是比較簡單的作法**：[`scripts/copy-404.js`](../scripts/copy-404.js) 把 `index.html` 複製成 `404.html`，讓 GitHub Pages 在找不到實體路徑時，改吐出這份 404.html（內容就是完整的 Angular App shell），瀏覽器載入後由前端 Router 自己讀網址、渲染正確頁面——**使用者看到的畫面是正常的**，但 HTTP 狀態碼仍然是 404，這對搜尋引擎爬蟲不夠友善（爬蟲可能不會好好收錄回傳 404 的頁面）。

這是刻意先做的權宜之計，讓網站至少能用；**如果要恢復到舊部署那種「每個路由都是真正 200 的 prerender」**，需要另外：
1. 寫一支腳本從 `config.json` 產生一份純文字的路由清單（邏輮跟 `scripts/generate-sitemap.js` 差不多，只是輸出格式改成一行一個路徑）
2. 用 `ng run mlic:prerender --routes-file=<路由清單檔案>` 取代單純的 `ng build`，這會需要同時 build 出 server bundle（`ng run mlic:server`）當作 prerender 的渲染引擎，跑完後 `dist/mlic/browser` 底下就會多出每個路由對應的實體資料夾
3. `npm run deploy` 改成部署這個 prerender 過的 `dist/mlic/browser`，而不是純 CSR 版本

這件事目前還沒做，因為量體不小（139 篇文章 x 各自的 URL）、需要額外測試 prerender 是否對每篇文章都能正常渲染。如果 SEO 表現不理想，這是下一步該做的優化。

## 第一次部署前要手動確認的事（GitHub 網頁上）

以下這些是 GitHub repo 的設定，不是程式碼，沒辦法用這支腳本自動做，需要手動到 `https://github.com/<owner>/<repo>/settings/pages` 確認一次：

1. **Source** 要設成「Deploy from a branch」，Branch 選 `gh-pages` / `/(root)`（通常第一次 push `gh-pages` 分支後 GitHub 會自動偵測並幫你設好，但建議還是去確認一次）
2. **Custom domain** 欄位跑完第一次 `npm run deploy` 後，應該會自動出現 `marketingliveincode.com`（因為 `CNAME` 檔案已經在 `gh-pages` 分支裡了）。如果沒有自動出現，手動填入存檔一次即可，之後就會持續保留
3. DNS（網域註冊商那邊，例如 A 記錄指到 GitHub Pages 的 IP，或 CNAME 記錄指到 `<owner>.github.io`）——這個網站先前就已經在 `marketingliveincode.com` 上線過，DNS 應該已經設定好了，這裡不需要重新設定

## 跟 SSR 部署的關係

`npm run deploy` 走的是**純靜態**路線（`ng build` 產出的 `dist/mlic/browser`），跟 [`server.ts`](../server.ts) 的 Angular Universal SSR 是兩條不同的部署路徑：

- GitHub Pages 只能放靜態檔案，沒辦法跑 Node.js process，所以不能用 SSR
- 如果之後正式站改用別的平台（例如原本 Zeabur）跑 SSR（`npm run build:ssr` + `npm run serve:ssr`），那是另一條路徑，跟 GitHub Pages 這條無關，兩者可以並存但目前這支 `deploy` 腳本只處理 GitHub Pages 這條
