# Amazon爬蟲－留言資料｜雖然我不是個數學家，但全部爬下來很棒吧！【附Python程式碼】
## 可交付成果
![可交付成果](https://cdn-images-1.medium.com/max/1200/1*8jek2_TdrN_4XLF3auGeOA.png)
接續前面課程「[Amazon爬蟲－商品資料｜用Python爬下世界最大電商網站【附程式碼】](/classification/crawler_king/113)」所爬下來的商品結果，進到每個商品中爬下所有的留言內容，其內容包含商品名稱、留言網址、留言者、星等、留言時間、留言地點(區域)、SKU、留言內容、覺得留言有用的人數。

## 爬蟲前準備
在開始本課程的爬蟲之前，必須要先將前一堂課「[Amazon爬蟲－商品資料｜用Python爬下世界最大電商網站【附程式碼】](/classification/crawler_king/113)」的結果放在程式的工作目錄內，若不知道如何在Spyder 中設定工作目錄，也可以參考課程「[Spyder使用教學](/classification/python_foundation/26)」。
```python
productData = pd.read_csv('Amazon商品資料.csv', encoding = 'utf-8')
```
雖然這次的爬蟲只需要用get 請求即可，但因為Amazon 在封包上還是有些檢查的，因此request 的時候還是需要付上header ，而經過作者測試，封包內只需要accept-encoding、accept-language、cookie、user-agent 即可，但在爬蟲前需要換成自己的喔！
```python
# 請求使用Header，可能需要替換cookie
head = {
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
        'cookie': 'session-id=136-0340723-9192226; session-id-time=2082787201l; i18n-prefs=USD; lc-main=zh_TW; ubid-main=134-3980769-3693765; sp-cdn="L5Z9:TW"; csm-hit=tb:TZMAJPK9WYNJ0Y80TMZK+s-TZMAJPK9WYNJ0Y80TMZK|1660289724778&amp;t:1660289724778&amp;adb:adblk_no; session-token=k3RS++Iksjl7C0tJ6mcNq0RKrVUijnLF3sGiIoxeKYwsG3aTueKJ6BGxf1Z6C+j3R4W9UBC/Jlyv24bO/e4JyDPhLhiKZs64nYY0UmUBqtBsgRAkgHnkzJ4KCI2Soocp46TvfNQe7YzoO/vHjHXoCJ0bVCvhkshLYNLWvkQTSxIJaMYOP3a0Q5rSPnicXs3+54f73HotO2JZaPwBsmnxSVPrGpZpqRNI',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        }
```
最後在準備各個List ，以便於等等爬蟲的結果進行儲存。
```python
theproduct = []
theCommenturl = []
who = []
star = []
thetime = []
location = []
sku = []
comment = []
helpful = []
```

## 進到每個商品爬蟲
開始進到每一個Amazon 商品的留言中進行爬蟲了，而在留言中會使用while 迴圈來爬取留言，因為我們無法確定總共有多少留言，因此需要在每次請求後，檢查有無增加新的留言，有的話就代表還沒有爬完。
```python
for data in range(0, len(productData)):
    # 決定要抓取的網址
    geturl = productData.iloc[data]['留言網址']
    
    doit = True # 決定是否繼續進行留言爬蟲
    page = 0 # 爬到第幾頁
    while doit:
        if page == 0: # 判斷是否為第一頁
            url = geturl
        else:
            url = geturl.split('/ref')[0] + '/ref=cm_cr_getr_d_paging_btm_next_'+ str(page) +'?ie=UTF8&amp;reviewerType=all_reviews&amp;pageNumber=' + str(page)
        
        #請求網站
        list_req = requests.get(url, headers= head)
        #將整個網站的程式碼爬下來
        soup = BeautifulSoup(list_req.content, "html.parser")
        getdata = soup.find_all('div', {'data-hook':'review'})
if len(getdata) &gt; 0: # 判斷是否有流言資料，沒有就直接將doit改成False，停止執行
            for i in getdata:
                theproduct.append(productData.iloc[data]['商品名稱']) # 儲存商品名稱
                theCommenturl.append(productData.iloc[data]['留言網址']) # 儲存留言網址
                
                who.append(i.find('span', {'class':'a-profile-name'}).text) # 儲存留言者
```
### 爬取星星
星星的抓取只需要針對標籤的class 為a-icon-alt 的即可。但由於不同語系的原因，有可能有些使用者是使用到英文的頁面，因此中英文網頁的贅字都有使用replace() 方法取代掉。
```python
# 處理星星
getstart = i.find('span', {'class':'a-icon-alt'}).text
getstart = getstart.replace(' 顆星，最高 5 顆星','') # 中文網頁
getstart = getstart.replace(' out of 5 stars','') # 英文網頁
star.append(float(getstart))
```

### 爬取購買時間、地點
這裡主要調整的部分是購買時間，若為英文網頁，呈現的月份是英文的全名，這會導致我們無法轉成datetime 時間格式，因此要先將所有的月份英文轉換成對應的數字後，再進行轉換。
```python
# 處理購買時間、地點
gettime = i.find('span', {'data-hook':'review-date'}).text
if 'Reviewed' in gettime: # 判斷是否為英文網頁
    # 將英文月份換成數字，這樣待會才能給datetime辨別
    gettime = gettime.replace('January','1')
    gettime = gettime.replace('February','2')
    gettime = gettime.replace('March','3')
    gettime = gettime.replace('April','4')
    gettime = gettime.replace('May','5')
    gettime = gettime.replace('June','6')
    gettime = gettime.replace('July','7')
    gettime = gettime.replace('August','8')
    gettime = gettime.replace('September','9')
    gettime = gettime.replace('October','10')
    gettime = gettime.replace('November','11')
    gettime = gettime.replace('December','12')
    
    gettime_list = gettime.split(' on ')
    thetime.append(datetime.strptime(gettime_list[1], "%m %d, %Y")) # 儲存留言時間
    location.append(gettime_list[0].replace('Reviewed in the ','')) # 儲存留言地點
else:
    gettime_list = gettime.split('在')
    cuttime = gettime_list[0].replace(' ','')
    thetime.append(datetime.strptime(cuttime, "%Y年%m月%d日")) # 儲存留言時間
    location.append(gettime_list[1].replace('評論','')) # 儲存留言地點
```

### 爬取覺得留言有用人數
這個功能很像我們在一般購物網站所看到的按讚功能，代表支持這個發言者的立場。這裡也需要將多餘的字串取代掉，也因為擔心可能您會爬到原文的網頁，因此中英文的字串取代都寫進去了。
```python
# 處理覺得留言有用人數
gethelpful = i.findAll('span', {'data-hook':'helpful-vote-statement'}) # 儲存覺得留言有用人數
if len(gethelpful) != 0: # 判斷是否有資料
    
    gethelpful = gethelpful[0].text
    gethelpful = gethelpful.replace(',','') # 把千分位的「,」拿掉
    gethelpful = gethelpful.replace(' 個人覺得有用','') # 中文網頁
    gethelpful = gethelpful.replace(' people found this helpful','') # 英文網頁
    if '一人覺得有用' == gethelpful or 'One person found this helpful' == gethelpful: # 判斷是否只有一人
        helpful.append(1)
    else:
        helpful.append(int(gethelpful))
else:
    helpful.append(0)
    
```
### 爬處購買顏色、尺寸
在留言中另一個價值就是每個購買者所購買的樣式，由此能窺探這個市場的銷量，進而推算出適合進入市場的位置，這也可以參考課程「[產品開發大補帖｜採購的好幫手，如何決定新商品SKU？]()」的邏輯方式。
```python
# 處理購買顏色、尺寸
getsku = i.find_all('a', {'data-hook':'format-strip'})
if len(getsku) == 1: # 判斷是否有資料
    sku.append(getsku[0].text)
else:
    sku.append(None)
    
```
### 存檔
因為有些商品可能沒有留言，但有些知名的商品留言會破萬，因此為了保險起見，每爬兩個商品就存檔一次，以防資料遺失。
```python
dic = {
        '商品名稱' : theproduct,
        '留言網址' : theCommenturl,
        '留言者' : who,
        '星等' : star,
        '留言時間' : thetime,
        '留言地點' : location,
        'SKU' : sku,
        '留言內容' : comment,
        '覺得留言有用人數' : helpful,
    }
    
    if data%2==0:
        pd.DataFrame(dic).to_csv('到第'+str(data)+'個商品_Amazon留言資料.csv', 
                                 encoding = 'utf-8-sig', 
                                 index=False)</code></pre>
```
