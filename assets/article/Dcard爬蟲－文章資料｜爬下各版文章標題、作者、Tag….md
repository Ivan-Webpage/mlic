# Dcard爬蟲－文章資料｜爬下各版文章標題、作者、Tag…
> 次課程使用Json爬蟲，所以你要先看「[Json爬蟲教學－Google趨勢搜尋]()」教學喔！

Dcard是現在台灣年輕組群較長使用的社群軟體，如同年輕一代的PTT。因此若您的品牌目標受眾（TA）屬於30歲之前的年紀，那在Dcard您一定會收到很多使用者回饋。本課程會教您如何找到Dcard的Json封包，並且解析封包後，轉換成CSV檔案進行儲存。

首先利用我們在課程「[Json爬蟲教學－Google趨勢搜尋]()」與「[Json爬蟲實戰－PChome]()」教導的方式取得Json封包的連結如下：
```
https://www.dcard.tw/service/api/v2/forums/talk/posts?limit=30 
```
因為Dcard的網址參數設計方式，若是第一頁後方不會有「before」參數，因此需要用If判斷式來檢查是否為第一頁，藉此來決定request的網址。
```python
for i in range(5):
    if i != 0: # 判斷是否是第一次執行
        request_url = url +'&before='+ str(last_article)
    else:
        request_url = url # 第一次執行，不須加上後方的before
    list_req = requests.get(request_url) # 請求
```
接著使用json.load()方法將抓下來的Json封包進行解析。
```python
#將整個網站的程式碼爬下來
getdata = json.loads(list_req.content)
alldata.extend(getdata) # 將另一個陣列插在最後面
```
