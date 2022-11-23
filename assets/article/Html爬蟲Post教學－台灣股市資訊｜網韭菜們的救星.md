# Html爬蟲Post教學－台灣股市資訊｜網韭菜們的救星
介Goodinfo!台灣股市資訊網相信您不陌生，上頭不只是股票價格資訊，就廉直利率、盈餘分配、董監持股等，資訊極為豐富，但著手寫爬蟲時，卻發現這並不如想像那般容易，您可能也出現了以下的畫面。
```htmlembedded
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>請勿透過網站內容下載軟體查詢本網站
```
![台灣股市資訊網的錯誤訊息](https://i.imgur.com/8QUoVwQ.png)

> 你必須要先學會：[資料傳遞Get與Post差異！！]()

因為Goodinfo!台灣股市資訊網會檢查封包中的「User-Agent」，若沒有則判定為機器人， 「User-Agent」 的位置可以在網頁F12 > Network > 點選任一封包 > Headers，在request 的資料內容裡面就可以發現 User-Agent」 ，如下圖所示。
![「User-Agent」 的位置](https://i.imgur.com/8f0fjNm.png)

程式碼的 headers 變數內容就是從以上的方式取得。

接下來的爬蟲方式與「Html爬蟲Get教學－Yahoo」課程和「Html爬蟲Get實戰－FoodPanda」課程教導的非常相似，都是利用 requests 與BS4 進行爬蟲即可。
```python
#請求網站
list_req = requests.post(url, headers=headers)
#將整個網站的程式碼爬下來
soup = BeautifulSoup(list_req.content, "html.parser")
```
