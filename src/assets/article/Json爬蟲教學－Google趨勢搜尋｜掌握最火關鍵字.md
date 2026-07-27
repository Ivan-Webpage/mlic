# Json爬蟲教學－Google趨勢搜尋｜掌握最火關鍵字
![Google 趨勢最新消息](https://i.imgur.com/rcIscpV.png)
> [Json是什麼東西？先了解資料傳遞Get與Post差異吧！](/classification/crawler_king/81)

相信不少人使用過[Google趨勢搜尋](https://trends.google.com.tw/trends/trendingsearches/daily?geo=TW)，而每次都要上網搜尋相當費時。Python爬蟲可以幫您解決這個問題！在[Google趨勢搜尋](https://trends.google.com.tw/trends/trendingsearches/daily?geo=TW)的頁面，按下「F12」按鈕，並重新整理網頁，即可攔下資料封包，利用此發法即可擷取即時資料的Json檔案，如下圖所示。

查閱封包的方式可以選擇Network > Fetch/XHR，這樣殘留下來的封包也不多了，在手動搜尋即可找到[Google趨勢搜尋](https://trends.google.com.tw/trends/trendingsearches/daily?geo=TW)的資料Json檔案。
![按下「F12」按鈕，並重新整理網頁，即可攔下資料封包](https://i.imgur.com/avACe1G.png)

切回到headers可以看到「Request URL」，想要請求這個資料，輸入這串網址就好了！
![Request URL 可以讓我們利用程式持續的請求](https://i.imgur.com/0alihz4.png)

程式碼中的抓取網址也是這樣來的。
```python
# 要抓取的網址
url = 'https://trends.google.com.tw/trends/api/dailytrends?hl=zh-TW&tz=-480&geo=TW&ns=15'
```

接著便可以使用requests 套件請求封包下來。
```python
#請求網站
list_req = requests.get(url)
gettext = list_req.content
```

請求完成的資料雖然看起來是Json格式，但實際的格式是字串，因此必須藉由json.loads 方法，將資料轉換成Json格式。而該資料的前6個字元並無意義，甚至會造成 json.loads 方法轉換失敗，因此才會使用取自串的方式
```python
#將整個網站的程式碼爬下來
getdata = json.loads(gettext[6:])
```

