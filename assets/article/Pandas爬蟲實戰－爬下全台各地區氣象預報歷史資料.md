# Pandas爬蟲實戰－爬下全台各地區氣象預報歷史資料
![圖片來自：2345天氣王](https://i.imgur.com/i3Xe2cp.png)
您一定會很好奇，為何不直接爬台灣氣象局的網站，原因在於，台灣氣象局的網站無法抓到「歷史」天氣。我們很常會需要調查一個區域的天氣，不管是從事事業，或者土地建物，都跟天氣非常有關係，因此我選擇到[2345天氣王](http://tianqi.2345.com/)當中查看。

![2345天氣王中的歷史天氣](https://i.imgur.com/IoWHY15.png)
利用「[Json爬蟲教學－Google趨勢搜尋」與「Json爬蟲實戰－PChome]()」所教導的Json爬蟲方式，取得該網站地區歷史資料的API，在該網站按下F12後，在重新整理網頁（F5），即可看到API（如下圖所示）。
![按下F12後，在重新整理網頁（F5），即可看到API](https://i.imgur.com/wJ3zay9.png)
觀察該API的網址會發現，主要會有幾個參數： 地區的編號、 台灣的編號（固定是2）、 查詢年分、 查詢月份。由此可知，想要取得不同時間或地點的資料，就是在這裡進行調整。
```
http://tianqi.2345.com/Pc/GetHistory?areaInfo%5BareaId%5D=54511&areaInfo%5BareaType%5D=2&date%5Byear%5D=2021&date%5Bmonth%5D=8
```
對比參數：
```
http://tianqi.2345.com/Pc/GetHistory?areaInfo%5BareaId%5D=【地區的編號】&areaInfo%5BareaType%5D=【台灣的編號】&date%5Byear%5D=【查詢年分】&date%5Bmonth%5D=【查詢月份】
```
接下來就是利用request 套件請求，再利用Json 套件對結果進行解析。
```python
#請求網站
list_req = requests.get(url)
#將整個網站的程式碼爬下來
getJson = json.loads(list_req.content)
getTable = pd.read_html(getJson['data'],header = 0)
getTable[0] # 抓到資料
```

在實際資料抓取時，常會需要至少一年資料，因此程式碼的範例以台北為例，爬取12個月的天氣資料。每個月所完成的資料，利用「[Pandas合併資料－concat、merge]()」課程所教的pd.concat 方法進行合併，方能率先整理資料。
```python
#--- 取得大量資料，該地區12個月
today = datetime.datetime.today()

areaId = '71294' # 台北
areaType = '2'
containar = pd.DataFrame() # 準備一個容器
for i in tqdm.tqdm(range(12)):
    countDay = today - relativedelta(months=i)
    year = countDay.year
    month = countDay.month
    # 要抓取的網址
    url = 'http://tianqi.2345.com/Pc/GetHistory?areaInfo%5BareaId%5D='+ str(areaId) +'&areaInfo%5BareaType%5D='+ str(areaType) +'&date%5Byear%5D='+ str(year) +'&date%5Bmonth%5D='+ str(month)
    
    #請求網站
    print(str(i)+'開始請求')
    list_req = requests.get(url)
    print(str(i)+'請求完成')
    #將整個網站的程式碼爬下來
    getJson = json.loads(list_req.content)
    getTable = pd.read_html(getJson['data'],header = 0)
    # 合併資料
    containar = pd.concat([containar, getTable[0]])
    
    # 休息一下
    time.sleep(random.randint(45,70))
```
