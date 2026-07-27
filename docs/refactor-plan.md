# 重構執行紀錄：移除 Django 後端、程式碼優化、SEO 優化、移除 GA 追蹤碼

這份文件原本是「待確認的重構計畫」，所有問題都已經跟 Ivan 確認過、且已執行完畢，現在改成執行紀錄，供之後查閱「當初為什麼這樣做」。

## 已確認的決策

1. **完全移除後端依賴**：`mlic_backend-main/` 已整個刪除。刪除前已用 git 存檔（見 initial commit），需要的話可以從 git 歷史復原任何檔案。
2. **部署型態維持 SSR**：不改成純 CSR，也不做全站 prerender，理由是 SSR 對 SEO／社群分享預覽比較有利，且改動風險較低。`post-routes.txt` 因為內容過時、且沒有被任何程式碼實際使用，已在 SEO 優化階段被 `sitemap.xml` 產生腳本取代並移除。
3. **4 篇未發佈的 Django 教學文章一併搬到前端發佈**：id `123`～`126`，classification `technology`，串進既有的 previous/next 鏈結（`1 → 123 → 124 → 125 → 126`）。細節見 [backend-legacy.md](backend-legacy.md)「內容檔案盤點」一節。
4. **取代 Django Admin 上傳功能的方式**：Ivan 選擇「先給一份步驟文件（SOP）就好」，不寫自動化工具。見 [how-to-add-article.md](how-to-add-article.md)。
5. **Google 追蹤碼**：確認過 `src/index.html` 裡的 `gtag.js`／`UA-193650099-1` 是舊版 Universal Analytics（Google 已在 2023 年停用資料收集），Ivan 確認直接整段移除，不換 GA4。
6. **`class["5"]`（實用工具分享）**：查證目前沒有任何文章使用這個分類，是空分類，不算 bug，這次不用改程式碼，僅在 [content-model.md](content-model.md) 註記，供之後決定是否沿用。

## 執行內容摘要

- **內容遷移**：4 篇 Django 教學文章的 md／封面圖複製進 `src/assets/`，`config.json` 新增對應 4 筆資料並串接鏈結。過程中發現一個既有 bug：文章的 `previous`/`next` 鏈結若指到不存在的 id（例如鏈結最新端沒有 `next`），`article.component.html` 會直接噴 `TypeError` 而不是優雅地隱藏按鈕——已修成 `*ngIf` 防呆，不改變其他行為。
- **前端程式碼優化**：清掉死碼（未使用的 `@Output`、`console.log`）、把讀 `config.json` 的 `require()` 改成標準 ES `import`（`tsconfig.json` 加 `resolveJsonModule`）、關閉正式站不該開的 `enableTracing`、把四個元件重複的「路由變化時重置頁面」邏輯抽成共用 helper（行為不變，純減少重複）。
- **SEO 優化**：修正 `<html lang="en">` 應為 `zh-Hant` 的錯誤、新增 canonical link、新增 `robots.txt`／`sitemap.xml`（含產生腳本）、在文章頁加入 JSON-LD 結構化資料。
- **移除 GA 追蹤碼**：`src/index.html` 的 `gtag.js`／`UA-193650099-1` 整段移除。

## 明確沒有做的事（刻意排除，避免過度工程）

- 沒有重寫全部 126 篇文章內容的圖片 alt text（量體太大，屬於內容編修工作，寫進 [how-to-add-article.md](how-to-add-article.md) 當作日後新增文章的建議規範）。
- 沒有幫「前端呼叫後端 API」寫遷移層——因為本來就沒有這種呼叫。
- 沒有保留後端的 JWT/`Temp` model 邏輯，那段程式碼跟部落格內容無關（見 [backend-legacy.md](backend-legacy.md)）。
- **五部曲文章缺口未補**：四部曲文章內文提到「下篇文章『【五部曲】…CORS與CSRF錯誤怎麼排除』」，但這篇文章在後端／前端都不存在，看起來是當初沒寫完。這不是這次重構的範圍（沒有內容可搬），但值得 Ivan 知道，如果之後想補完這篇可以再處理。
