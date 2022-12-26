# IG自動登入｜利用Selenium自動登入Instagram
> 本次課程使用Selenium爬蟲，所以你要先看「[Selenium實戰練習－UberEat爬蟲](/class?c=3&a=94)」教學喔！
在接下來的IG課程中，會教您如何讓機器人幫您自動按愛心。而在這堂課程中，會先教您如何自動登入IG帳號，以便之後的課程進行。

## 環境準備
### Python環境
若您是Python的新手，建議可以下載Anaconda來搭建環境。以下兩個Anaconda的介紹：
> * [PYTHON環境設定－Anaconda安裝](/class?c=1&a=25)
> * [PYTHON環境設定－Spyder使用教學](/class?c=1&a=26)

### 套件安裝
整個實作只需要用到Selenium套件，因此若是使用Anaconda，就直接在Anaconda prompt中輸入以下指令，若在系統環境中安裝python，則直接在Terminal貼上指令即可。
```
pip install selenium
```
![打開Anaconda Promp](https://i.imgur.com/cRalHzo.png)
### 下載phantomjs
[點我下載phantomjs](https://phantomjs.org/download.html)
phantomjs是Selenium的控制器，等於是將python程式碼變成機器人的工具。Selenium之所以能爬到許多爬蟲爬不到的網站，就是因為Selenium是模仿人的行為，真的打開一個瀏覽器，不像傳統的爬蟲，直接請求封包下來解析。當然這各有有缺點Selenium的執行效率相對就差很多，但面對IG這種「動態式」的網站，必須要用Selenium才能達的到。

> 不同系統，圖示可能會不太一樣，但不影響功能，讀者不必過度擔心。

### 下載chromedriver
[點我下載chromedriver](https://phantomjs.org/download.html)
chromedriver是專門給程式控制的瀏覽器。因此實作時，程式會幫您開啟一個chrome瀏覽器，並且按照程式自動按按鈕，當然也可以人工介入操作。chromedriver必須與您目前的chrome版本相同，若您不知道您chrome的版本，可以[點這裡查看需下載的版本](https://chromedriver.storage.googleapis.com/LATEST_RELEASE)，確定後，即可點下方選擇下載檔案。

### 集合檔案
![集合檔案](https://i.imgur.com/P0C8uh6.png)
phantomjs與chromedriver下載完成後，都必須放到主程式的資料夾中（如上圖右），讓Python確保能抓到這兩個檔案。若系統為linux，可能會有使用chromedriver與phantomjs檔案權限問題，因此必須要輸入以下來打開權限（777為全開，若是覺得有安全疑慮者可以自行調整）。

![linux系列的系統，必須要開起權限，windows的讀者可以忽略](https://i.imgur.com/ZgQc6mT.png)

## 開始程式實作
### 輸入帳密
必須輸入您的帳號密碼，以方便自動登入。tags則是輸入想要到哪個tag按讚，因此這些tag通常要與品牌最有相關。
```python
IGID = '您的IG帳號'
IGpassword = '您的IG密碼'

tags=['guitar','guitarcover','music','他','followme','likeforlike','like4like','follow4follow','followforfollow','instagood','f4f']
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
driver = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities)
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
![開啟chrome](https://i.imgur.com/C3oLI7X.png)

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

driver.find_element_by_xpath('//*[@type="submit"]').click()
time.sleep(3)
# 若瀏覽器會問是否儲存，那開啟以下兩行註解
# driver.find_elements_by_xpath('//*[@type="button"]')[1].click() #是否儲存瀏覽器資料，「稍後再說」
# time.sleep(3)
```

![機器人自動登入IG](https://i.imgur.com/ckqBo9c.png)

> 在開始前，你的IG品牌規畫好了嗎？快看「[IG品牌規劃｜想要在Instagram開品牌粉專？先看看如何品牌定位吧](/class?c=3&a=102)」
