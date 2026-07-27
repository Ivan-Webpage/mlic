# Youtube爬蟲－社群資料｜用Python找到Youtuber經營粉絲的秘密【附程式碼】
在前一堂課程「[Youtube爬蟲－頻道資料｜Youtuber網紅時代不可或缺的Python技能【附程式碼】](/classification/crawler_king/104)」當中，我們將每個Youtube頻道爬下來，我們會延續上堂課的結果進行爬蟲。

## 可交付成果
本次教學教您如何使用Python 的Selenium套件，爬下各個Youtube頻道中的社群資料，其中包含Youtube頻道貼文的頻道名稱、頻道網址、文章連結、文章內容、發文時間、按讚數、留言數量、留言內容。並將結果儲存成CSV檔案，之後也可以直接用Excel直接觀看或編輯喔！

## Selenium 登入Youtube
若您還不知道Selenium 是什麼東西，可以參考「[Selenium介紹｜Python爬動態網頁的利器](/classification/crawler_king/92)」，並且一定要先將Selenium 需要用到的環境事先設定好，若不知道如何設定可以參考「[Selenium環境設定與測試｜手把手教您如何設定 phantomjs與 chromedriver](/classification/crawler_king/92)」。
```python
# 設定基本參數
desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()

#此處必須換成自己電腦的User-Agent
desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'

# PhantomJS driver 路徑 似乎只能絕對路徑
 = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities)

# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications" : 2}
chrome_options.add_experimental_option("prefs",prefs)
# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver',chrome_options=chrome_options)
time.sleep(5)
```

## 滾動頁面方法
![滾動頁面方法](https://cdn-images-1.medium.com/max/1200/1*lQFzvjeGZ4uGfo7usEGKZw.gif)
由於Youtube也是屬於動態生成的網頁，因此需要利用程式把網頁向下滾動，才能取得更多網頁資料。滾動的過程中有不少time.sleep() 方法，其原因在於滾動時的資料載入時間，若因為網路延遲導致資料還沒載入，爬蟲就會壞掉，進而導致程式停止，因此需要稍微延長時間。
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
            time.sleep(2)
            driver.execute_script('window.scrollBy(0,4000)')
            time.sleep(1)
            element = driver.find_elements_by_xpath(xpathText) # 抓取指定的標籤
            if len(element) &gt; remenber: # 檢查滾動後的數量有無增加
                remenber = len(element)
            else:
                doit = False # 還是無增加，停止滾動
        time.sleep(1)
    return element #回傳元素內容
```

## 準備目標頻道
本次的爬蟲會利用到前面的課程「[Youtube爬蟲－頻道資料｜Youtuber網紅時代不可或缺的Python技能【附程式碼】](/classification/crawler_king/104)」所取得的CSV檔案，因此若還沒看過前面的課程，趕快手刀點擊喔！
```python
#抓取Youtuber_頻道資料.csv
getdata = pd.read_csv('Youtuber_頻道資料.csv', encoding = 'utf-8-sig')
#準備容器
youtuberChannel = []
channelLink = []
articleLink = []
articleContent = []
postTime = []
good = []
commentNum = []
comment = []
```
![準備目標頻道](https://cdn-images-1.medium.com/max/1200/1*us83vnKlfJaDKJ0Kw2m_OQ.png)
這次是到每個Youtube頻道的社群當中爬蟲，每個Youtube頻道會有上百則文章，因此需要用for 迴圈大量執行，也是相當的耗時。
```python
# 開始一個一個爬蟲
for yName, yChannel in zip(getdata['Youtuber頻道名稱'], getdata['頻道網址']):
    #到社群頁面
    driver.get(str(yChannel) + '/community')
    time.sleep(10)
    
    # 滾動頁面
    getAll_url = scroll(driver, '//yt-formatted-string[@id="published-time-text"]/a')
```
## 爬取所有文章
會設計兩層的for 迴圈原因在於，第一層是先到Youtube頻道的社群中，把每個文章的網址爬下來，第二層for 回圈則是一個個網址進去，可以爬下文章內的詳細資料，例如：文章內容、發文時間、留言、按讚數、留言數量。
```python
# 文章網址必須先擷取出來
    for article in getAll_url:
        articleLink.append(article.get_attribute('href')) # 取得文章連結
        postTime.append(article.text) # 取得發文時間
        youtuberChannel.append(yName)
        channelLink.append(yChannel)
    print('頻道'+ str(yName) + '共有'+ str(len(articleLink)) + '篇文章，開始抓取文章內容')
    
    for goto_url in tqdm(articleLink):
        
        # 去到該文章
        driver.get(goto_url)
        time.sleep(3)
```

## 解析留言資料
首先，先抓取基本的文章內容、文章讚數、留言數量，這些都是只要找到Html標籤即可取得，不需要特別去滾動頁面動態爬取。
```python
# 取得文章內文
good.append(driver.find_element_by_id('vote-count-middle').text) # 取得文章讚數
time.sleep(3)
        
# 取得留言總數量
getcommentNum = int(driver.find_element_by_xpath('//h2[@id="count"]/yt-formatted-string/span').text)
commentNum.append(getcommentNum)
time.sleep(3)
```
接著就是比較複雜的部份，需要一直滾動畫面，才能產生更久之前的留言，以利於抓到留言內容、發言者、按讚數、留言時間等。
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
comment.append(containar) # 儲存所有留言
```


