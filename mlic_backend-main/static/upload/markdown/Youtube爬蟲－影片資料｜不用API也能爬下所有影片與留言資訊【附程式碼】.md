# Youtube爬蟲－影片資料｜不用API也能爬下所有影片與留言資訊【附程式碼】
在前一堂課程「[Youtube爬蟲－頻道資料｜Youtuber網紅時代不可或缺的Python技能【附程式碼】](/classification/crawler_king/81)」當中，我們將每個Youtube頻道爬下來，並且在「[Youtube爬蟲－社群資料｜用Python找到Youtuber經營粉絲的秘密【附程式碼】](/classification/crawler_king/82)」課程中取得了Youtuber們辛苦經營的社群資料與留言資料。相信敏銳的您一定會想問：那影片的留言資料呢？現在就讓我們來解密。

## 可交付成果
![](https://cdn-images-1.medium.com/max/1200/1*QoLW47-zaBlDPs8EFZxvCw.png)

可爬下Youtube每個影片的影片連結、發布時間、讚數、觀看次數、影片文案、留言數量、留言內容，並且留言內容可記錄發言者、發言者的留言、發言者的頻道、讚數，以及回復發言者的留言都會記錄，並最終將結果儲存為CSV檔案，以方便後續分析使用。

## Selenium 登入Youtube
若您還不知道Selenium 是什麼東西，可以參考「[Selenium介紹｜Python爬動態網頁的利器](/classification/crawler_king/69)」，並且一定要先將Selenium 需要用到的環境事先設定好，若不知道如何設定可以參考「[Selenium環境設定與測試｜手把手教您如何設定 phantomjs與 chromedriver](/classification/crawler_king/70)」。
```python
# 設定基本參數
desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
#此處必須換成自己電腦的User-Agent
desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
# PhantomJS driver 路徑 似乎只能絕對路徑
driver = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities)
# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications" : 2}
chrome_options.add_experimental_option("prefs",prefs)
# 開啟瀏覽器
driver=webdriver.Chrome('chromedriver',chrome_options=chrome_options)
time.sleep(5)
```

## 爬蟲前準備
首先，我們需要用到「[Youtube爬蟲－頻道資料｜Youtuber網紅時代不可或缺的Python技能【附程式碼】](/classification/crawler_king/81)」課程的成果CSV，因此在這裡需要匯入CSV檔案。
```python
#抓取csv資料
getdata = pd.read_csv('Youtuber_頻道資料.csv', encoding = 'utf-8-sig')
#準備容器
youtuberChannel = []
channelLink = []
videoName = []
videoLink = []
good = []
looking = []
videoDate = []
videoContent = []
commentNum = []
comment = []
```

待會再爬取留言的時候，需要向下滾動頁面，留言才會顯示出來，因此這裡撰寫scroll() 方法，會向下滾動4,000px，並且檢查有沒有新增留言，若沒有新增留言會等五秒後在滾動一次，避免只是網路延遲導致沒有爬到其他留言。

```python
# 滾動頁面
def scroll(driver, xpathText):
    remenber = 0
    doit = True
    while doit:
        driver.execute_script('window.scrollBy(0,4000)')
        time.sleep(1)
        element = driver.find_elements_by_xpath(xpathText) # 抓取指定的標籤
        if len(element) &gt; remenber: # 檢查滾動後的數量有無增加
            remenber = len(element)
        else: # 沒增加則等待一下，然後在滾動一次
            time.sleep(random.randint(5,20))
            driver.execute_script('window.scrollBy(0,4000)')
            time.sleep(3)
            element = driver.find_elements_by_xpath(xpathText) # 抓取指定的標籤
            if len(element) &gt; remenber: # 檢查滾動後的數量有無增加
                remenber = len(element)
            else:
                doit = False # 還是無增加，停止滾動
        time.sleep(2)
    return element #回傳元素內容
```

> 準備好以上後，便可以進到每個頻道中爬取影片資料了！
```python
for yName, yChannel, allLink in zip(getdata['Youtuber頻道名稱'], getdata['頻道網址'], getdata['所有影片連結']):
    print('開始爬取 '+ yName +' 的影片')
```

## 爬取資料
在開始爬蟲之前，會先利用while迴圈檢查標題是否已經載入，其原因在於，因為為了提高搜尋引擎優化（SEO）的緣故，多數網站都會有載入順序的先後配置。在Youtube當中，影片通常最先載入，而其餘的影片介紹、留言、其他影片等等，都會晚個幾秒鐘才載入，這個方便觀眾的功能可能會導致爬蟲出錯。
```python
# 去到該影片
driver.get(link)
        
while len(driver.find_elements_by_xpath('//h1[@class="title style-scope ytd-video-primary-info-renderer"]')) == 0:
    time.sleep(5)
        
youtuberChannel.append(yName) # 取得Youtuber頻道名稱
channelLink.append(yChannel) # 取得頻道網址
videoLink.append(allLink) # 取得影片連結
```
### 取得影片名稱
在前面已經確認標題已經載入，便可以進行爬取了。
```python
# 取得影片名稱
getvideoName = driver.find_element_by_xpath('//h1[@class="title style-scope ytd-video-primary-info-renderer"]').text
print('開始爬取： '+ getvideoName)
videoName.append(getvideoName)
```

### 取得讚數
讚數的爬取結果會分成兩種，分別是「XX 人喜歡」與「尚未有人表示喜歡」，因此若顯示為「尚未有人表示喜歡」，我們就已0來記錄，若是「XX 人喜歡」，就取代掉後方的「 人喜歡」，留下前方數字即可。
```python
# 取得讚數
getgood = driver.find_element_by_xpath('//div[@id="menu-container"]/div/ytd-menu-renderer/div[1]/ytd-toggle-button-renderer[1]/a/yt-formatted-string').get_attribute('aria-label')
if '尚未有人表示喜歡' in getgood:
    good.append(0) 
else:
    getgood = getgood.replace(' 人喜歡','')
    getgood = getgood.replace(',','')
    good.append(getgood)
```

### 觀看數、影片時間
觀看的數量與影片發布的時間是在同一個區塊，因此爬蟲時便是將整個字串爬下來後，再利用split() 方法進行切割處理。
```python
# 觀看數、影片時間
getlook = driver.find_element_by_id('info-text').text
# getlook = getlook.split('日 ')[0]
getlook = getlook.replace('觀看次數：','')
getlook = getlook.replace(' ','')
getlook = getlook.replace('.','')
getlook = getlook.replace(',','')
getlook = getlook.split('次')
videoDate.append(datetime.strptime(getlook[1], "%Y年%m月%d日")) # 取得影片時間
looking.append(int(getlook[0])) # 取得觀看數
time.sleep(random.randint(2,5))
```

### 取得影片介紹
影片介紹在網頁中是利用折疊的方式呈現，因此想要爬取影片介紹，需要先點擊「顯示完整資訊」按鈕，等內容全部呈現出來，再進行一次性的爬取作業。
```python
# 點擊更多內容
driver.find_element_by_xpath('//yt-formatted-string[@class="more-button style-scope ytd-video-secondary-info-renderer"]').click()
time.sleep(random.randint(2,5))
getContent = driver.find_element_by_xpath('//div[@id="content"]/div[@id="description"]').text
videoContent.append(getContent) # 取得影片介紹
```

### 取得留言數
由於留言的區塊通常會延後載入，因此在爬取之前，也需要向下滾動頁面。這裡滾動的方式，是使用亂數隨機滾動，此目的是為了樣模仿真人的操作，以免太制式化很容易被偵測出機器人爬蟲。
```python
# 先滾動一小段在取得留言數
while len(driver.find_elements_by_xpath('//h2[@id="count"]/yt-formatted-string/span'))==0:
driver.execute_script('window.scrollBy(0,'+str(random.randint(30,50))+')')
time.sleep(random.randint(2,5))
getcommentNum = driver.find_element_by_xpath('//h2[@id="count"]/yt-formatted-string/span').text
getcommentNum = getcommentNum.replace(',','')
commentNum.append(int(getcommentNum)) # 取得留言數
```

### 取得留言
利用前方的scroll() 方法進行爬蟲後，會一次性地取得所有的留言，再使用for 迴圈一一的整理每個留言內的資訊。
```python
#--- 開始進行「取得留言」工程
 # 滾動頁面
 getcomment = scroll(driver, '//div[@id="main"]')
 getfans = driver.find_elements_by_id('author-text') # 發言者
 
 # 儲存留言內容
 commentMan = []
 manChannel = []
 post_time = []
 comment_content = []
 comment_good = []
 
 count = 0 # 用來編號留言
 containar = {}
 for fans, com in zip(getfans, getcomment):
     if count != 0: # 第一次不需要執行，因為是youter自己的資料
         getcom = com.text
         getcom = getcom.replace('\n回覆','')
         getcom = getcom.replace('\nREPLY','')
         cutcom = getcom.split('\n')
         
         if len(cutcom) == 3: # 若沒有人按讚，則補0
             cutcom.append(0)
         try:
             containar['留言'+str(count)] = {
                 '發言者':cutcom[0],
                 '發言者頻道': fans.get_attribute('href'),
                 '發言時間':cutcom[1],
                 '發言內容':cutcom[2],
                 '讚數':cutcom[3]
                 }
         except:# 碰到異常資料之極端處理
             containar['留言'+str(count)] = {'資料異常'}
     count = count + 1
 
 comment.append(containar) # 取得留言
```

### 儲存資料結果
最後，再將所有的資料一併打包成dict 格式，並轉換成Dataframe 格式後儲存成CSV檔案，以利之後分析使用。
```python
# 暫存器
dic = {
       'Youtuber頻道名稱' : youtuberChannel,
        '頻道網址' : channelLink,
        '影片名稱' : videoName,
        '影片連結' : videoLink,
        '影片發布時間' : videoDate,
        '讚數' : good,
        '觀看次數' : looking,
        '影片文案內容' : videoContent,
        '留言數量' : commentNum,
        '留言' : comment
       }
pd.DataFrame(dic).to_csv(str(yChannel)+'_Youtuber_影片資料.csv', 
                         encoding = 'utf-8-sig', 
                         index=False)
print('頻道 '+str(yChannel)+' 爬取完成')
```
