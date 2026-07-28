# 小編神器，IG愛心大放送，selenium在IG上的實做

> 年輕人已經不用Line了，IG是未來的社交平台

最近朋友們有事情都用IG私訊我，因為我的Line三個小時才回一次，IG十分鐘內就回復了。因為Line已經被「工作海嘯」淹沒，明明是私人的聊天平台，卻充斥著各個工作、活動群組。

年輕人在IG的時間日以俱增，品牌也嗅到這個味道，紛紛轉往IG經營粉絲團。轉換平台又得重新累積粉絲，有方法的。其實在IG中有個「淺規則」：

> 有人按我愛心，我就按回去

這個淺規則在國外更加明顯。因此若能夠瘋狂地對受眾的照片按愛心，就能夠讓品牌的粉絲團大量曝光，因此我們就利用Python的套件－Selenium，來達到自動對受眾按愛心的可交付成果。

## 別再重蹈覆轍
在開始時做之前，必須要與讀者達成一個默契，就是：

> 別再把FB、Line那一套，搬到IG來

年輕人會退出Line，因為被工作充斥，打開Line只有滿滿的壓力。年輕人會退出FB，因為都是廣告，甚至有許多專門廣告的社團。前兩個平台的教訓，讓我們知道，年輕一代要的是「生活」、「新奇」、「娛樂」，因此不再只是把最新的商品放上去、公告明天店裡公休等。

### 所以要怎麼做
在使用Selenium之前，必須先做好IG的定位，有以下幾個必要條件，這裡以[知名的英文教學平台voice tube的IG官方帳號](https://www.instagram.com/voicetube_tw/?hl=zh-tw)為例：
![voice tube的IG官方帳號](https://i.imgur.com/AdQLgx8.png)
> 1. 一致的風格或者主題：
> 整個粉絲團的畫面要有一致性的風格，不會像是四處拍照片就貼上去。

> 2. 明確的最小可行市場：
> 確定自己的受眾。譬如：想學英文的人、想滑手機但又不想沒有進步的人。

> 3. 幫受眾的生活加分：
> 這是最重要的。受眾有甚麼需求，除了能幫受眾解決問題以外，更能增加受眾與品牌的黏濁性。voice tube就是最好的例子。想要在滑IG放鬆時，還能讓英文進步，還整理許多電影的名言，更貼近生活。

這能讓消費者沒有壓力的持續追蹤品牌粉絲團，也才是讓粉絲團長長久久的不二法門。

當一切就緒，才能開始進行「愛心大放送」，網路行銷雖然傳播的快，但負面評價傳得更快，因此一定要準備好再出發。

## 環境準備
### Python環境
若您是Python的新手，建議可以下載Anaconda來搭建環境。以下兩個Anaconda的介紹：

> [Windwos&Mac Python初學者為什麼選擇Anaconda為開發環境呢? -入門系列](https://medium.com/%E8%AA%A4%E9%97%96%E6%95%B8%E6%93%9A%E5%8F%A2%E6%9E%97%E7%9A%84%E5%95%86%E7%AE%A1%E4%BA%BAzino/windwos-mac%E5%88%9D%E5%AD%B8%E8%80%85%E7%82%BA%E4%BB%80%E9%BA%BC%E9%81%B8%E6%93%87aanconda-%E7%82%BA%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83%E5%91%A2-%E5%85%A5%E9%96%80%E7%B3%BB%E5%88%97-f892697f1a53)

> [Python 入門必看！Windows 懶人搭建Anaconda Python 學習環境-入門系列](https://medium.com/%E8%AA%A4%E9%97%96%E6%95%B8%E6%93%9A%E5%8F%A2%E6%9E%97%E7%9A%84%E5%95%86%E7%AE%A1%E4%BA%BAzino/python-%E5%85%A5%E9%96%80%E5%BF%85%E7%9C%8B-windows-%E6%87%B6%E4%BA%BA%E6%90%AD%E5%BB%BAanaconda-python-%E5%AD%B8%E7%BF%92%E7%92%B0%E5%A2%83-%E5%85%A5%E9%96%80%E7%B3%BB%E5%88%97-3fa7ab23b3e9)

### 套件安裝
整個實作只需要用到Selenium套件，因此若是使用Anaconda，就直接在Anaconda prompt中輸入以下指令，若在系統環境中安裝python，則直接在Terminal貼上指令即可。
```
pip install selenium
```

![](https://i.imgur.com/l2pDqUX.png)
#### 下載phantomjs
[點我下載phantomjs](https://phantomjs.org/download.html)
phantomjs是Selenium的控制器，等於是將python程式碼變成機器人的工具。Selenium之所以能爬到許多爬蟲爬不到的網站，就是因為Selenium是模仿人的行為，真的打開一個瀏覽器，不像傳統的爬蟲，直接請求封包下來解析。當然這各有有缺點Selenium的執行效率相對就差很多，但面對IG這種「動態式」的網站，必須要用Selenium才能達的到。

不同系統，圖示可能會不太一樣，但不影響功能，讀者不必過度擔心。

#### 下載chromedriver
[點我下載chromedriver](https://phantomjs.org/download.html)
chromedriver是專門給程式控制的瀏覽器。因此實作時，程式會幫您開啟一個chrome瀏覽器，並且按照程式自動按按鈕，當然也可以人工介入操作。chromedriver必須與您目前的chrome版本相同，若您不知道您chrome的版本，可以點這裡[查看需下載的版本](https://chromedriver.storage.googleapis.com/LATEST_RELEASE)，確定後，即可點下方選擇下載檔案。

### 集合檔案
![](https://i.imgur.com/WjHd5zF.png)
phantomjs與chromedriver下載完成後，都必須放到主程式的資料夾中（如上圖右），讓Python確保能抓到這兩個檔案。若系統為linux，可能會有使用chromedriver與phantomjs檔案權限問題，因此必須要輸入以下來打開權限（777為全開，若是覺得有安全疑慮者可以自行調整）。
![集合檔案](https://i.imgur.com/Emx2sJQ.png)

## 執行程式碼
![執行程式碼](https://i.imgur.com/Svbn1oU.png)

### 輸入帳密
必須輸入您的帳號密碼，以方便自動登入。tags則是輸入想要到哪個tag按讚，因此這些tag通常要與品牌最有相關。
```python
IGID = '你的IG帳號'
IGpassword = '你的IG密碼'
tags=['guitar','guitarcover','music','piano']
```
### 設定phantomjs
設定請求所需的資訊，因此可以在21行，修改成自己的User-Agent，但若程式可以執行，則就不需要特別修改，因此可以先執行過去，若有出現bug，再回來檢查即可。

User-Agent是封包在傳送時，必要的資訊，因此裡面可以看到該使用者的瀏覽器、作業系統等資訊。在爬蟲的時候，有些網站會檢查User-Agent是否正確，但在IG中不用。
```python
# 設定基本參數

desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()

#此處必須換成自己電腦的User-Agent

desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'

# PhantomJS driver 路徑 似乎只能絕對路徑
driver = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities
```

### 開啟chrome
執行以下程式碼，就會彈出一個空白的chrome。程式碼中有三行註解，若程式已經穩定，不需要跳出chrome了，就將這三行的註解拿掉即可。
```python
# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications" : 2}
chrome_options.add_experimental_option("prefs",prefs)
# 以下三個註解打開，瀏覽器就不會開啟
# chrome_options.add_argument('--headless')
# chrome_options.add_argument('--no-sandbox')
# chrome_options.add_argument('--disable-dev-shm-usage')

# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver',chrome_options=chrome_options)
```
![開啟空白頁面](https://i.imgur.com/4WLarb0.png)

### 登入IG
driver.get即可控制chrome到任何您想要的網址。這個階段，有些帳號會設定兩階段驗證，甚至是用FB登入，這可能會造成登入無法自動化，因此這塊也可以直接用手動的方式輸入。
```python
####### 開始操作 輸入帳號密碼登入 到IG首頁 ####### 
driver.get("https://www.instagram.com/")
time.sleep(1)
assert "Instagram" in driver.title
time.sleep(3)

driver.find_element_by_xpath('//*[@name="username"]').send_keys(IGID) #輸入登入帳號
time.sleep(1)
driver.find_element_by_xpath('//*[@name="password"]').send_keys(IGpassword) # 輸入登入密碼
time.sleep(3)
# 登入
driver.find_element_by_xpath('//*[@type="submit"]').click()
```
![登入IG](https://i.imgur.com/hc0Dxue.png)
### 開始送愛心
這裡將開始依照您所設定的tag，進去每張照片按愛心。按愛心是從「最新」開始按，而不是「最熱門」，因為「最熱門」通常都是品牌、網紅，他們並不會追蹤您的品牌。

56行的迴圈，決定會在這個tag按幾張照片愛心。這裡都以亂數的方式決定，目的在於盡量的模仿真人，以防辛苦經營的品牌，被封鎖。
```python
####### 開始操作 到不同的tag去發文 ####### 
for tag in tags:
    driver.get("https://www.instagram.com/explore/tags/" + tag) #切換到該tag
    time.sleep(random.randint(2,5))
    driver.find_elements_by_class_name('_9AhH0')[9].click() #點選圖片(選擇最新發的)
    for i in range(random.randint(20,25)):
        if i % 10 == 1:
            time.sleep(random.randint(5,20))

        # 檢查有沒有按過讚
        if len(driver.find_elements_by_xpath('//*[@aria-label="Unlike"]')) != 0 or len(driver.find_elements_by_xpath('//*[@aria-label="收回讚"]')) != 0:
            print('按過了')
        else:
            time.sleep(random.randint(1,3))
            try:
                driver.find_element_by_xpath('//*[@aria-label="讚"]').click()
            except:
                try:
                    driver.find_elements_by_xpath('//*[@aria-label="讚"]')[1].click()
                except:
                    print('圖片沒跑出來，直接下一頁')
        driver.find_elements_by_class_name('coreSpriteRightPaginationArrow')[0].click()
        time.sleep(random.randint(1,5))
    print(tag +' 按完了')
    time.sleep(random.randint(7,15)) # 按完一個tag稍微休息一下，盡量模仿真人
```
> <strong>注意！</strong>

> 經過實測，IG一天按愛心的數量，大約是400次，若超過該帳號會被封鎖一天不能按愛心，若有多次這樣的紀錄，甚至會封鎖3天、一星期，以此類推，因此請適度的使用selenium就好，重點還是在於品牌提供給消費者的價值。

## 成果驗收
我以自己的帳號實驗，將個人吉他的影片上傳，並將所有風格經過整理。每三天使用一次機器人按愛心，一個月大約增加200粉絲。但過一兩個禮拜，就有許多人退追蹤了，因此沒有持續的經營，這要漫無目的的曝光，效果也不張。