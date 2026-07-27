# Django 後端參考文件（`mlic_backend-main/`，重構後將整包移除）

這份文件記錄 `mlic_backend-main/` 現有的樣貌，供拆除前參考。**確認過前端在 runtime 完全不呼叫這個後端的任何 API**（見 [CLAUDE.md](../CLAUDE.md) 開頭的說明），所以這裡不是「拔 API 整合」，而是「確認可以安全刪除、並把它曾經扮演的角色（內容上傳/管理）想清楚替代方案」。

## 技術棧

Django 4.2.1 + Django REST Framework 3.14，SQLite（`db.sqlite3`），`django-cors-headers`、`djangorestframework-jwt`、`whitenoise`（serve static）、`gunicorn`（production server）。部署在 Zeabur（`CSRF_TRUSTED_ORIGINS = ['https://mlic.zeabur.app']`），`Dockerfile` 用 `python:alpine`。

## 資料模型（`app/models.py`）

```
Classification          # 文章／課程「分類」，如「行銷與商業分析」
  - title, tags, name, description
  - classify_type: '線上課程' | '文章主題'
  - cover_image (ImageField → static/upload/image/)

Coursechapter           # 線上課程的「章節」，屬於某個 Classification
  - title, number
  - classification_id → FK Classification

Article                 # 一篇文章／一個課程單元
  - title, tags, description
  - cover_image (ImageField)
  - classification_id → FK Classification
  - coursechapter_id → FK Coursechapter（nullable，只有課程單元才有）
  - number（章節內排序，nullable）
  - article_file (FileField → static/upload/markdown/)
  - download_url, video_url

Temp                     # 用途不明的暫存表，見下方「奇怪的地方」
  - context (TextField)
```

跟前端 `config.json` 的 `article` schema幾乎一一對應（`title`/`tag`/`description`/`cover-image`/`classification`/`download`/`video`），可以合理推斷：**這個 Django Admin 曾經是實際的內容輸入介面**，寫完文章後用 admin 上傳 Markdown 檔＋封面圖，之後有人（很可能是人工）把 `static/upload/` 底下的檔案複製到前端 `src/assets/`，並手動把欄位謄寫進 `config.json`。**沒有找到任何自動匯出/同步腳本**（兩邊 repo 都搜過）。

## API（`app/viewsets.py` + `backend/urls.py`）

Router 掛在 `/api/`：

- `GET /api/classification/` — 列表（`AllowAny`）
- `GET /api/classification/{name}/pick_classify/` — 依 name 撈分類
- `POST /api/classification/classify_catalog/` — 撈某分類目錄下第一篇文章
- `GET /api/coursechapter/` — 列表（`AllowAny`）
- `GET /api/articles/{id}/`（`retrieve`，`AllowAny`）
- `POST /api/articles/pick_classify/` — 依分類+文章 id 撈文章本體＋上下篇＋（若為課程）章節目錄，`AllowAny`
- `POST /api/articles/pick_gallery/` — 依分類撈畫廊用文章列表，`classification == "home"` 時撈「非課程」文章，`AllowAny`
- `POST /api/temp/get_temp/` — 解一段 JWT（`key='ggininder'`，寫死在程式碼裡）後存進 `Temp` 表，`AllowAny`

其餘 CRUD action（`create`/`update`/`destroy`）預設要求 `IsAuthenticated`，對應 Django Admin 或需要登入的管理操作。

其他路由：`/coolplace/` = Django Admin 後台入口（刻意取了不明顯的路徑名）；`/api-auth/` = DRF 內建登入頁；`/static` = whitenoise 靜態檔案。

## 需要注意的地方

- **SECRET_KEY、JWT key（`'ggininder'`）都是明碼寫在 `settings.py`/`viewsets.py` 裡**，如果考慮繼續使用這個後端（哪怕只是過渡期），這是安全風險；但既然計畫整包移除，只需確認 repo 不會被公開發布含有這些字串的歷史記錄。
- `Temp` model + `pick_temp`/`get_temp` 這段邏輯（解 JWT 存進資料庫）用途不明，看起來像除錯用或未完成的功能，跟部落格內容無關，重構評估時可以直接視為無用程式碼。
- `JWT_AUTH.JWT_EXPIRATION_DELTA` 設定成 1 分鐘，也像是測試殘留設定。

## 內容檔案盤點：backend vs frontend（2026-07-27 比對結果）

`mlic_backend-main/static/upload/` 底下比 `src/assets/` 多出的檔案：

- **4 篇文章 Markdown 在後端有、前端沒有**（Django 教學系列，看起來是特意沒發佈或漏發佈）：
  - `首部曲Python最火紅框架Django0到1的建立.md`
  - `二部曲Python最火紅框架Django後台Admin與資料庫功能懶人.md`
  - `三部曲Python最火紅框架Django後台Admin的外觀客製化調整.md`
  - `四部曲Python最火紅框架Django好強的API套件Rest_Framework.md`
  - 對應的封面圖也只在後端有
- 另外「想找意見領袖（KOL）…」這篇在兩邊都有，只是檔名的標點符號（全形/半形括號、破折號）不同，前端版本應視為正式版，後端那份可視為舊檔。

這代表：**`mlic_backend-main` 不是「前端內容的純備份」，它比前端多 4 篇未發佈文章**。刪除後端前，務必先跟 Ivan 確認這 4 篇 Django 教學文章是否要一併搬到前端發佈，還是刻意不發佈——細節與行動項目見 [refactor-plan.md](refactor-plan.md)。
