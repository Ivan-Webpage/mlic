# 內容模型：config.json + Markdown 資產

網站所有「文章」與「線上課程」的資料，全部來自一個檔案：[`src/assets/config.json`](../src/assets/config.json)，搭配 [`src/assets/article/*.md`](../src/assets/article/)（內文）與 `src/assets/images/`（圖片）。**沒有資料庫、沒有 API**——這就是靜態網站的資料層。

## 現況統計（2026-07-27 盤點）

- `article` 物件：122 筆（id 從 `"1"` 到 `"122"`，皆為字串 key）
- 對應 `src/assets/article/*.md`：122 個檔案，與 `article` 筆數一致
- `class` 物件：5 筆線上課程分類

## Schema：`config.json`

頂層只有兩個 key：`article`、`class`。

### `article[id]`

```jsonc
"1": {
  "title": "Chia Network奇亞幣挖礦！成為農夫詳細安裝教學",
  "tag": ["chia", "奇亞幣", "挖礦", "步驟教學", "區塊鍊"],   // 陣列，SEO keywords 用
  "description": "……",                                        // meta description 用
  "cover-image": "assets/images/article_cover/Chia_Network.jpg", // 相對路徑
  "classification": "technology",                              // 對應路由 :cls
  "previous": "4",                                              // 上一篇文章 id（字串）
  "next": "24",                                                 // 下一篇文章 id（部分早期文章沒有這個欄位）
  "time": "2021-05-03",                                         // 發布日期，article:published_time meta 用
  "download": "",                                                // 附加下載連結，空字串＝不顯示下載按鈕
  "article_url": "assets/article/Chia Network奇亞幣挖礦！成為農夫詳細安裝教學.md", // 內文檔案路徑（注意：ArticleComponent 實際上是自己用 title 重組路徑，沒有直接讀這個欄位，見下方「已知不一致」）
  "video": ""                                                    // 線上課程單元才會用到，YouTube 網址
}
```

`classification` 的合法值：`marketing`、`financial`、`technology`、`manage`（一般文章分類）或線上課程分類 key（見下）。

### `class[classId]`

```jsonc
"python_foundation": {
  "title": "Python 基礎教學",
  "cover-image": "assets/images/class_cover/python.jpg",
  "chapter": {
    "Python 環境設定": [25, 26, 27, 28, 29, 30, 31, 6],   // 章節標題 → 該章節底下文章 id 的陣列（順序＝顯示順序）
    "Python 基本變數": [32, 33, 34, 35],
    "...": ["..."]
  }
}
```

`class` 目前有 5 筆：`5`（實用工具分享，chapter 是空物件 `{}`）、`python_foundation`、`lineBot`、`crawler_king`、`telegramBot`。這些 key 同時也是 `blog.component.ts` 裡硬寫的「線上課程分類清單」，兩邊要保持一致（目前 `class` 多了一個 `"5"`，但 `blog.component.ts` 的判斷清單沒有 `"5"`——如果 `"5"` 底下的文章要用課程頁呈現，這是一個需要修的不一致，見 [refactor-plan.md](refactor-plan.md)）。

## 資料如何被前端使用

- `HomeComponent` — 不直接用 `config.json`，走 `GalleryComponent`（`classification: 'home'` 特例邏輯目前只存在後端 `pick_gallery`，前端 `GalleryComponent` 其實是用 `postData_classification == undefined` 來代表首頁，抓所有 4 大分類最新文章）
- `GalleryComponent` — 讀 `config['article']`，用 `classification` 欄位過濁出屬於該分類的 id 陣列，畫廊呈現，預設一次顯示 15 筆，「顯示更多」每次 +15
- `ArticleComponent` — 用 `postData_article`（路由 `:id`）去 `config['article'][id]` 撈 `title`/`cover-image`/`download`/`previous`/`next`，並把文章內文路徑組成 `'./assets/article/' + title + '.md'` 交給 `<markdown src>`
- `OnlineClassComponent` — 用 `postData_classification` 撈 `config['class'][cls]`，取得章節結構與封面；用 `postData_article` 撈該單元的 `video` 網址
- `makeMeta.ts` — 用 `postData_article` 撈 `title`/`tag`/`description`/`cover-image`/`time` 組 SEO/OG meta tag

## 已知的資料一致性問題（重構前建議先處理或至少記錄）

1. **`ArticleComponent` 不是用 `article_url` 欄位讀檔**，而是自己用 `config['article'][id]['title'] + '.md'` 現組檔名。這代表 `article_url` 欄位目前其實是死欄位（僅少數幾篇例如「NLP 系列」被拿來當外部連結範例，但 component 程式碼並沒有讀它）。重構時可以考慮讓 `article_url` 真正被使用，或乾脆拿掉這個欄位、統一用 title 組檔名的邏輯。
2. **`class["5"]` 沒有被 `blog.component.ts` 的線上課程判斷清單納入**，目前效果應該是被當一般文章走 `ArticleComponent`（除非它底下沒有文章使用它，需要實測確認）。
3. 少數早期文章缺 `next` 欄位（只有 `previous`），`ArticleComponent` 若遇到 `undefined` 的 `next`/`previous` id 讀取 `config['article'][undefined]` 會壞掉，需要在重構時補上或做防呆。

## 目前「新增一篇文章」的手動流程（重構後要有替代方案）

依現有程式碼與檔案結構推斷出的流程（**沒有自動化腳本**，純手動）：

1. 把封面圖放進 `src/assets/images/article_cover/`（或線上課程的 `class_cover/`）
2. 把文章內文（Markdown）存成 `src/assets/article/{title}.md`，檔名必須跟 `config.json` 裡的 `title` 完全一致（因為 `ArticleComponent` 是拿 title 組檔名）
3. 在 `config.json` `article` 物件新增一筆，key 是下一個流水號 id（字串）
4. 手動把「上一篇」文章的 `next`、以及被指定為 `previous` 的那篇文章的 `next`，更新成新文章的 id（目前 `previous`/`next` 是雙向手動維護的鏈結串列，不是自動算的）
5. 若是線上課程單元，額外要把新 id 塞進對應 `class[cls].chapter[章節名稱]` 的陣列裡
6. 重新 `ng build`（因為 `config.json` 是 `require()` 進 JS bundle）

這個流程目前**很容易手動出錯**（漏改 next/previous、id 打錯字），是重構的一個好機會，見 [refactor-plan.md](refactor-plan.md) 的建議。
