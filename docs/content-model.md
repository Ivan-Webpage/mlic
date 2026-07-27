# 內容模型：config.json + Markdown 資產

網站所有「文章」與「線上課程」的資料，全部來自一個檔案：[`src/assets/config.json`](../src/assets/config.json)，搭配 [`src/assets/article/*.md`](../src/assets/article/)（內文）與 `src/assets/images/`（圖片）。**沒有資料庫、沒有 API**——這就是靜態網站的資料層。

## 現況統計（2026-07-27 盤點，已含後端搬遷的 4 篇文章）

- `article` 物件：126 筆（id 從 `"1"` 到 `"126"`，皆為字串 key；`123`～`126` 是從 Django 後端搬遷過來的 Django 教學系列，見 [backend-legacy.md](backend-legacy.md)）
- 對應 `src/assets/article/*.md`：126 個檔案，與 `article` 筆數一致
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

`class` 目前有 5 筆：`5`（實用工具分享，chapter 是空物件 `{}`）、`python_foundation`、`lineBot`、`crawler_king`、`telegramBot`。這些 key 同時也是 `blog.component.ts` 裡硬寫的「線上課程分類清單」，但清單裡沒有 `"5"`。**已查證目前沒有任何 `article` 使用 `classification: "5"`**，所以這是一個空分類，不影響任何實際頁面，不算 bug；若之後要用 `"5"` 發文章，記得同時把 `"5"` 加進 `blog.component.ts` 的判斷清單，不然文章會被誤判成一般文章頁而非課程頁。

## 資料如何被前端使用

- `HomeComponent` — 不直接用 `config.json`，走 `GalleryComponent`（`classification: 'home'` 特例邏輯目前只存在後端 `pick_gallery`，前端 `GalleryComponent` 其實是用 `postData_classification == undefined` 來代表首頁，抓所有 4 大分類最新文章）
- `GalleryComponent` — 讀 `config['article']`，用 `classification` 欄位過濁出屬於該分類的 id 陣列，畫廊呈現，預設一次顯示 15 筆，「顯示更多」每次 +15
- `ArticleComponent` — 用 `postData_article`（路由 `:id`）去 `config['article'][id]` 撈 `title`/`cover-image`/`download`/`previous`/`next`，並把文章內文路徑組成 `'./assets/article/' + title + '.md'` 交給 `<markdown src>`
- `OnlineClassComponent` — 用 `postData_classification` 撈 `config['class'][cls]`，取得章節結構與封面；用 `postData_article` 撈該單元的 `video` 網址
- `makeMeta.ts` — 用 `postData_article` 撈 `title`/`tag`/`description`/`cover-image`/`time` 組 SEO/OG meta tag

## 已知的資料一致性問題（重構前建議先處理或至少記錄）

1. **`ArticleComponent` 不是用 `article_url` 欄位讀檔**，而是自己用 `config['article'][id]['title'] + '.md'` 現組檔名。這代表 `article_url` 欄位目前其實是死欄位（僅少數幾篇例如「NLP 系列」被拿來當外部連結範例，但 component 程式碼並沒有讀它）。重構時可以考慮讓 `article_url` 真正被使用，或乾脆拿掉這個欄位、統一用 title 組檔名的邏輯。
2. **`class["5"]` 沒有被 `blog.component.ts` 的線上課程判斷清單納入**——已查證是空分類（見上），目前不影響任何頁面。
3. ~~少數早期文章缺 `next` 欄位（只有 `previous`），`ArticleComponent` 若遇到 `undefined` 的 `next`/`previous` id 讀取 `config['article'][undefined]` 會壞掉~~ ✅ 已修復：`article.component.html` 的上/下篇按鈕加了 `*ngIf="config['article'][prev_art]"` / `*ngIf="config['article'][next_art]"` 防呆，遇到鏈結兩端（目前是鏈結最新端的文章）就直接不顯示該按鈕，不會噴 `TypeError`。

## 新增一篇文章

完整操作步驟（含如何找鏈結起點、常見錯誤）已經整理成獨立的 SOP 文件：[how-to-add-article.md](how-to-add-article.md)，取代原本 Django Admin 上傳文章的角色。
