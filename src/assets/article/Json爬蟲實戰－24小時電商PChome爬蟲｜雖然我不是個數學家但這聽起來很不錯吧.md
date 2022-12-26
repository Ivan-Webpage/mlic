# Json爬蟲實戰－24小時電商PChome爬蟲｜雖然我不是個數學家但這聽起來很不錯吧
> [還沒學過Json爬蟲？先用Google趨勢練習一下吧！](/class?c=3&a=85)

在上完「[Json爬蟲教學－Google趨勢搜尋](/class?c=3&a=85)」課程以後，接著就來實際爬下PChome商品資料！這次的可交付成果是爬下各個商品的商品名稱、商品ID、價格、品牌、商品文案等，全部爬下來。

要找到Json的封包，首先依然在網頁中按下「F12」並且向下滑動商品頁，以取得商品的封包。
![按下「F12」並且向下滑動商品頁，以取得商品的封包](https://i.imgur.com/pYHtVU5.png)
發現這是我們要的封包後，就可以將其放到Python程式碼中。由於在網址中發現q 變數是放置商品關鍵字，因此可利用此特性，製作出動態的商品爬蟲，之後想換任何一種商品，或者是用程式爬下系列型商品，都可以使用此特性。
```python
keyword = '鞋櫃'
# 要抓取的網址
url = 'https://ecshweb.pchome.com.tw/search/v3.3/all/results?q='+keyword+'&page=1&sort=sale/dc'
```

經由 requests 套件請求後，再利用 json.loads 方法，將字串（str）形式轉換成Json型態。
```python
#請求網站
list_req = requests.get(url)
#將整個網站的程式碼爬下來
getdata = json.loads(list_req.content)
```

由以上範例，了解如何爬下單一頁面，接謝來便可以使用for迴圈，自動執行每一頁商品頁面的爬蟲。切記爬蟲的速度不能太快，因此在每一頁爬蟲結束後，會有一個五秒的休息 time.sleep(5) ，秒數的部分可以依照情況做調整。
```python
# 蒐集多頁的資料，打包成csv檔案
alldata = pd.DataFrame() # 準備一個容器
for i in range(1,10):
    # 要抓取的網址
    url = 'https://ecshweb.pchome.com.tw/search/v3.3/all/results?q='+keyword+'&page='+str(i)+'&sort=sale/dc'
    #請求網站
    list_req = requests.get(url)
    #將整個網站的程式碼爬下來
    getdata = json.loads(list_req.content)
    todataFrame = pd.DataFrame(getdata['prods']) # 轉成Dataframe格式
    alldata = pd.concat([alldata, todataFrame]) # 將結果裝進容器
    
    time.sleep(5) #拖延時間
```

> [忘了Pandas存檔嗎？看這裡](/class?c=1&a=47)

最後將爬下來的資料進行儲存。
```python
# 儲存檔案
alldata.to_csv('PChome.csv', # 名稱
               encoding='utf-8-sig', # 編碼 
               index=False) # 是否保留Index
```
