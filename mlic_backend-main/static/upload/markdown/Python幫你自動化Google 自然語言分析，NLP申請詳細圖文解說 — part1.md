# Python幫你自動化Google 自然語言分析，NLP申請詳細圖文解說 — part1

> 電腦做得到的事情，不需要麻煩人腦

自然語言分析（Natural Language Processing，NLP）在AI與大數據的熱潮上，人人都想跟上時代，因此想要把任何耗人工的事情全都交給電腦處理，但您真的了解其中差異嗎？本文章手把手帶領您建置GCP專案，並利用Google NLP 套件的API連接Python，達到自動化自然語言分析的可交付成果。

> 您必須先具備：
> * 有Google GCP帳號，沒有的讀者可以免費辦一個（只要有google帳號）
> * 此專案必須在有網路的環境下執行
> * Python基本知識，至少會執行程式就好（本文章不會用到，之後的文章會用到）

## GCP專案建置
首先，選取所有的專案，並選擇右上角的「新增專案」。
![按下專案的選單](https://i.imgur.com/TMCJwh6.png)
![打上想要的專案名稱](https://i.imgur.com/BrvUG5F.png)
打上預想的專案名稱，並按下建立即可。在範例中使用「My Project nlp」為專案名稱。
![確認有選取到這個專案](https://i.imgur.com/Tu6zutx.png)

請記得確認專案是有選擇正確的。
![尋找NLP的API](https://i.imgur.com/JEYBQ4K.png)
點選前往API總攬，進到資訊主頁的部分（進入的預設就是這裡），點選啟用API和服務，並輸入「Clond Natural Language API」，當然搜尋引擎有模糊搜尋功能，因此打四個字「lang」就出來了。
![啟用API](https://i.imgur.com/wISe5ct.png)
裏頭會有一些介紹，若您了解後，即可點選啟用，並且建立憑證。
![設定憑證](https://i.imgur.com/cIhh3N0.png)
憑證部分，請選擇「Cloud Natural Language API」，並勾選否，沒有啟用任何服務。下一步是權限的管理，輸入自訂的管理者名稱，以及該管理者的身分。金鑰的類型請使用json。
![產生憑證](https://i.imgur.com/k6CBORS.png)
> 完成後就會產出一個json檔案，之後在Python中執行API，所需支付的費用，就依照這個檔案的帳號所屬來扣款，因此：
> 這個檔案請妥善保管，否則就如同信用卡遺失一樣的危險。
## 精彩可期
在下一篇[「Python幫你自動化Google 自然語言分析 ，NLP套件大解密 — part2」](/classification/marketing/120)文章中，將為您詳細解說，如何利用Python套件，結合本文章申請好的Gooogle NLP資源，將兩者進行串接。


