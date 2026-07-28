# 如何新增一篇文章（取代原本 Django Admin 上傳功能）

這份文件是給 Ivan 或未來的 AI agent 看的操作手冊。網站是純靜態的，新增文章不需要任何後端、資料庫或工具，只需要照下面步驟改檔案即可。背景知識見 [content-model.md](content-model.md)。

## 準備檔案

1. **封面圖**：一張圖片檔（jpg/webp/png 皆可），建議寬高比接近 16:9（現有文章多為 1280×853 或類似比例），放進：
   - 一般文章／線上課程單元：`src/assets/images/article_cover/`
   - 線上課程分類的封面（不是單元，而是整個課程的封面）：`src/assets/images/class_cover/`
2. **文章內文**：一份 Markdown 檔（`.md`），內容第一行請用 `# 標題` 當 H1（會被拿來當文章大標題，不會顯示在正文中），之後用 `##`/`###`... 分節，會自動產生右側目錄。
   - **檔名必須跟你等一下要填進 `config.json` 的 `title` 欄位完全一致**（含全形符號、書名號都要一樣），例如 `title` 是 `【五部曲】Python最火紅框架Django：CORS與CSRF錯誤怎麼排除？`，檔案就要存成 `src/assets/article/【五部曲】Python最火紅框架Django：CORS與CSRF錯誤怎麼排除？.md`。這是因為 [`ArticleComponent`](../src/app/blog/article/article.component.ts) 是直接用 `title + '.md'` 組出內文檔案路徑，沒有另外用檔名欄位。

## 修改 `config.json`

打開 [`src/assets/config.json`](../src/assets/config.json)，在 `article` 物件裡新增一筆，key 是**下一個流水號 id**（字串，例如目前最大是 `"126"`，新文章就是 `"127"`）。

```jsonc
"127": {
  "title": "文章標題（要跟 md 檔名一致）",
  "tag": ["關鍵字1", "關鍵字2", "關鍵字3"],       // SEO keywords，3~5 個即可
  "description": "150~200 字的文章摘要，會被拿去當 meta description 跟 OG 分享預覽文字",
  "cover-image": "assets/images/article_cover/xxx.jpg",
  "classification": "marketing",                  // 見下方「分類要填什麼」
  "previous": "上一篇的 id",
  "next": "下一篇的 id（新文章通常不用填，見下方說明）",
  "time": "2026-07-27",                            // 發佈日期，YYYY-MM-DD
  "download": "",                                   // 有附加下載連結才填，沒有就留空字串
  "article_url": "",                                // 目前沒有被程式讀取，留空字串即可
  "video": ""                                       // 只有線上課程單元才需要填 YouTube 連結
}
```

### 分類（classification）要填什麼

- 一般文章：`marketing`（行銷與商業分析）、`financial`（投資與程式金融）、`technology`（工程技術紀錄）、`manage`（管理與經理人思維）、`angular`（Angular 前端開發）
  - 如果要開一個全新的分類（目前的分類都是寫死的，沒有共用設定來源），除了 `config.json` 之外還要記得同步改：`src/app/gallery/gallery.component.ts`（`showImages()` 的 title 對照、首頁最新文章的分類清單）、`src/app/makeMeta.ts`（`gallery` case 的 title 對照）、`src/app/layout/navbar/navbar.component.html`（文章分類下拉選單），並跑 `npm run generate-sitemap` 更新 `/classification/{新分類}` 這個靜態頁到 sitemap（`scripts/generate-sitemap.js` 裡的 `staticUrls` 也要手動加一行）
- 線上課程單元：填課程的 key，目前有 `python_foundation`、`lineBot`、`crawler_king`、`telegramBot`（`class["5"]` 目前是空分類，見 [content-model.md](content-model.md)，除非確定要用，否則不要填這個）
  - 如果是線上課程單元，除了 `article` 物件要新增這筆，還要多一步：把新 id 加進 `config.json` 的 `class[該課程].chapter[章節名稱]` 陣列裡（陣列順序＝顯示順序），沒有對應章節就新增一個章節 key

### 怎麼正確串接 previous / next（重要）

`previous`/`next` 是手動維護的雙向鏈結串列，**不是自動算的**，串錯的話上一篇/下一篇按鈕會連到錯誤文章。步驟：

1. **找出目前鏈結的「最新端」**：在 `config.json` 的 `article` 物件裡，找出唯一一筆**沒有 `next` 欄位**的文章——那就是目前最新加入的文章（我們叫它「舊頭」）。
2. 把新文章接在舊頭後面：
   - 把「舊頭」那筆加上 `"next": "新文章的id"`
   - 新文章的 `"previous"` 填「舊頭」的 id
   - 新文章**不要填 `next`**（新文章變成新的「頭」，等下一篇文章加入時才會被接上）
3. 如果一次要加好幾篇連載文章（像 Django 教學系列那樣），中間幾篇就正常首尾相接，只有最後一篇比照上面規則、不填 `next`。

### 常見錯誤

- 檔名跟 `title` 沒有完全對齊（漏字、全形/半形符號不同）→ 文章內文會讀不到，畫面空白
- id 打重複（跟現有文章 key 撞到）→ 舊文章會被覆蓋
- 忘記把「舊頭」補上 `next` → 舊頭文章的「下一篇」按鈕會維持隱藏（不會壞掉，但看不到新文章）
- 忘記幫線上課程單元更新 `class[cls].chapter[...]` → 文章存在，但不會出現在課程側邊目錄裡

## 新增後要做的事

1. 跑 `npm run generate-sitemap`（或直接 `npm run build`，build 前會自動重新產生）更新 `sitemap.xml`，讓搜尋引擎能找到新文章。這一步不是必要才能上線，但漏掉的話新文章要等比較久才會被 Google 發現。
2. 本機驗證：`npm start` 後開瀏覽器檢查：
   - 文章內文渲染正常（`/classification/{classification}/{新id}`）
   - 「上一篇」「下一篇」連結都對
   - 若是線上課程單元，側邊章節目錄有出現新單元
   - 瀏覽器分頁標題（`<title>`）、`view-source` 檢查 `<link rel="canonical">` 是否指到正確網址（背景邏輯見 [architecture.md](architecture.md) 跟 [`makeMeta.ts`](../src/app/makeMeta.ts)）
3. 圖片盡量寫**有描述性的 alt text**：目前 markdown 內文圖片若沒手動加圖說文字，套件會統一套用「行銷搬進大程式」這個固定字串當 alt，對 SEO 跟無障礙都不理想。在 markdown 裡用 `![描述文字](圖片網址)` 的語法，就能讓每張圖片有自己的 alt text。
4. 確認 build 沒問題：`npm run build`（或 `npm run build:ssr` 如果要驗證 SSR）。
