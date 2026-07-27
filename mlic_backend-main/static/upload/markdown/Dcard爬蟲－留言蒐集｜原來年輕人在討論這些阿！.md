# Dcard爬蟲－留言蒐集｜原來年輕人在討論這些阿！
> 先看看前一堂課「[Dcard爬蟲－文章資料](/classification/crawler_king/75)」

若您已經成功爬下Dcard文章資料，我們接著就來爬Dcard留言資料。 首先利用我們在課程「[Json爬蟲教學－Google趨勢搜尋](/classification/crawler_king/62)」與「[Json爬蟲實戰－24小時電商PChome爬蟲｜雖然我不是個數學家但這聽起來很不錯吧](/classification/crawler_king/63)」教導的方式取得Json封包的連結如下：
```
https://www.dcard.tw/service/api/v2/posts/235996273/comments?after=60 
```
由連結可以看到after參數是決定向資料庫請求多少留言資料出來。而請求的參數與課程「Dcard文章資料」的一樣，都會看到before這個參數。 因為Dcard的網址參數設計方式，若是第一頁後方不會有「before」參數，因此需要用If判斷式來檢查是否為第一頁，藉此來決定request的網址。
```python
alldata = []
for articleID in dcard_article['文章ID']:
    last_comment = ''
    url = 'https://www.dcard.tw/service/api/v2/posts/'+ str(articleID) +'/comments'
    doit = True
    i=0
    while doit:
        if i != 0: # 判斷是否是第一次執行
            request_url = url +'?after='+ str(last_comment)
        else:
            request_url = url # 第一次執行，不須加上後方的before
        list_req = requests.get(request_url) # 請求
        #將整個網站的程式碼爬下來
        getdata = json.loads(list_req.content)
        if len(getdata) > 0:
            alldata.extend(getdata) # 將另一個陣列插在最後面
        else:
            doit = False
        
        last_comment = str(len(alldata)) # 取出最後一篇文章
        print(i)
        time.sleep(5)
        i=i+1
```
