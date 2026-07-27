# 小編神器，從此不用發文發到死，selenium在FB上的實做

我曾經做過一陣子的小編，負責將粉絲團的文章廣發到各個社團，這個過程枯燥且乏味，就是一直不斷地按分享社團。我一天大約要分享70多個社團，因此每天得花一小時左右來做這項「機械式」的工作。

## 環境準備
這個過程大部分是與[「小編神器，IG愛心大放送，selenium在IG上的實做」](/classification/marketing/11)類似，因此若您已經讀過該篇文章，大多部分是可以沿用的。

### 套件安裝
整個實作只需要用到Selenium套件，因此若是使用Anaconda，就直接在Anaconda prompt中輸入以下指令，若在系統環境中安裝python，則直接在Terminal貼上指令即可。

```
pip install selenium
```

![打開Anaconda Prompt](https://i.imgur.com/FtOWzrw.png)

### 下載phantomjs
> [點我下載phantomjs](https://phantomjs.org/download.html)
phantomjs是Selenium的控制器，等於是將python程式碼變成機器人的工具。Selenium之所以能爬到許多爬蟲爬不到的網站，就是因為Selenium是模仿人的行為，真的打開一個瀏覽器，不像傳統的爬蟲，直接請求封包下來解析。當然這各有有缺點Selenium的執行效率相對就差很多，但面對IG這種「動態式」的網站，必須要用Selenium才能達的到。

> 不同系統，圖示可能會不太一樣，但不影響功能，讀者不必過度擔心。

### 下載chromedriver
> [點我下載chromedriver](https://chromedriver.chromium.org/downloads)
chromedriver是專門給程式控制的瀏覽器。因此實作時，程式會幫您開啟一個chrome瀏覽器，並且按照程式自動按按鈕，當然也可以人工介入操作。chromedriver必須與您目前的chrome版本相同，若您不知道您chrome的版本，可以點這裡查看需下載的版本，確定後，即可點下方選擇下載檔案。

### 集合檔案
![集合檔案](https://i.imgur.com/JRVr65S.png)
phantomjs與chromedriver下載完成後，都必須放到主程式的資料夾中（如上圖右），讓Python確保能抓到這兩個檔案。若系統為linux，可能會有使用chromedriver與phantomjs檔案權限問題，因此必須要輸入以下來打開權限（777為全開，若是覺得有安全疑慮者可以自行調整）。
![linux系列的系統，必須要開起權限，windows的讀者可以忽略](https://i.imgur.com/mye4vIP.png)
### 發文專用的FB帳號
您可能會好奇，為何還要特別準備一個FB帳號？其實使用selenium發文是有一定風險的，若動作太過於機械式，會被FB禁止發文，少則三天，多則以星期計算，甚至到最後會不會停權都說不定。由此原因，還是建議個人使用的FB帳號不要拿來廣發，當然您現在讀本篇文章，並且進行短暫的實作練習，是不至於被FB禁止發文，但長時間使用，就會有帳號封鎖疑慮。

另一個原因是，公私盡量分明。因為在您的個人帳號中，都是你身邊的真實朋友，您所參加的社團，可能是您國小、國中、高中的班級社團，相信您知道在這些社團發送廣告文章，會造成甚麼反彈吧？

## 執行程式碼
![完整程式碼](https://i.imgur.com/gtJRYmV.png)
### 輸入帳密
請輸入您慾發文的帳號密碼。catch參數是輸入您待會想要分享的社團，而當然並不是打社團全名，而是用模糊搜尋的方式，因此如下範例中輸入「廣告|行銷」，因此待會若您加入的社團名稱中有「廣告」或是「行銷」，就會進行分享。
```python
useEmail='您的FB帳號'
usePass='您的FB密碼'
catch ='廣告|行銷'
postURL = 'https://www.facebook.com/permalink.php?story_fbid=134084921578475&id=101285581525076'
```

postURL參數非常好理解，就是您想要發文的該篇FB文章，而取得該篇FB文章的網址方式非常簡單，只需要點擊該文章的「時間」，即可取得該文章的網址。
![取得FB文章網址](https://i.imgur.com/Tx0YSlF.png)

### 設定phantomjs
這個部分只需要注意，phantomjs與chromedriver這兩個檔案的擺放位置，確實是與程式碼在同一層目錄即可，並且工作目錄設定無誤。若以上皆無問題，那便可以直接順利執行過去，打開程式控制的瀏覽器。
```python
# 設定基本參數
desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
#此處必須換成自己電腦的User-Agent
desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'# PhantomJS driver 路徑 似乎只能絕對路徑
driver = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities)# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.default_content_setting_values.notifications' : 2}
chrome_options.add_experimental_option('prefs',prefs)
# 以下三個註解打開，瀏覽器就不會開啟
# chrome_options.add_argument(' — headless')
# chrome_options.add_argument(' — no-sandbox')
# chrome_options.add_argument(' — disable-dev-shm-usage')# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver',chrome_options=chrome_options)
```
![只有空白頁面](https://i.imgur.com/51hxzda.png)

### Debug時間
若您出現錯誤訊息：
```
WebDriverException: 'phantomjs' executable needs to be in PATH.
```
![WebDriverException: ‘phantomjs’ executable needs to be in PATH.](https://i.imgur.com/t4nh8qF.png)
代表電腦找不到您的phantomjs檔案，您必須重新確認檔案放置的位置是否正確。

若錯誤訊息是：
```
WebDriverException: 'chromedriver' executable needs to be in PATH. Please see https://sites.google.com/a/chromium.org/chromedriver/home
```
![WebDriverException: 'chromedriver' executable needs to be in PATH. Please see https://sites.google.com/a/chromium.org/chromedriver/home](https://i.imgur.com/abb1bi3.png)

則是找不到chromedriver檔案，一樣必須重新確認檔案放置的位置是否正確。

最後若錯誤訊息為：
```
SessionNotCreatedException: session not created: This version of ChromeDriver only supports Chrome version 76
```
![SessionNotCreatedException: session not created: This version of ChromeDriver only supports Chrome version 76](https://i.imgur.com/Z6tFzEf.png)
則是代表您所下載的chromedriver與您的瀏覽器版本並不符合，請重新查看您的電腦版本，並且找到對應的下載檔案。

### 登入FB（程式43~59行）
由於正逢FB的改版時期，因此有些人的FB是舊版，有些則是新版，因此我將兩種版本介面的登入方式都寫上去。
```python
####### 開始操作 輸入帳號密碼登入 到fb首頁 #######
driver.get('http://www.facebook.com')
time.sleep(1)
assert 'Facebook' in driver.title
try:
elem = driver.find_element_by_id('email')
elem.send_keys(useEmail)
elem = driver.find_element_by_id('pass')
elem.send_keys(usePass)
elem.send_keys(Keys.RETURN)
except:
driver.find_element_by_xpath('//*[@name="email"]')
elem.send_keys(useEmail)
elem = driver.find_element_by_xpath('//*[@name="pass"]')
elem.send_keys(usePass)
elem.send_keys(Keys.RETURN)
time.sleep(5)
```
若登入這裡有些不可抗拒因素，倒置無法自動化登入，也可以用手動打字的方式登入。本文張想要節省的時間，是後面重複發文的時間，因此前面的登入並無太大影響，除非要將這個機器人服務化。
![其實也是可以直接用輸入的](https://i.imgur.com/WmlYmEO.png)
### 取得您的個人ID
這個動作是為了等一會要轉跳您的所有社團頁面，進行抓取動作。這個ID其實就是您FB首頁網址中，最後面的那串數字，因此若您想要省略這兩行的步驟，也可以直接寫死這項參數yourID。
```python
#取得帳號絕對ID
try:#舊版
getID = driver.find_element_by_xpath('//*[@title="個人檔案"]').get_attribute('href')
version='old'
except:#新版
getID = driver.find_element_by_xpath('//div[@data-pagelet="LeftRail"]/div/ul/li/div/a').get_attribute('href')
version='new'
yourID = getID[getID.find('id=')+3:]
```
![取得個人FB的ID](https://i.imgur.com/Ec9lKaL.png)
> 這裡若您的帳號有修改過ID，將這些數字ID改成英文，那就不適用本文章的程式碼。

### 準備想發送的社團
當取得您的ID後，就會切換頁面到您所有的社團頁面，目的是為了抓取所有社團的名稱。
```python!
# 切換到自己的社團
driver.get('https://www.facebook.com/profile.php?id=' + yourID + '&sk=groups')
```
由於FB是動態式網頁，因此必須將頁面滾到底部後，才會產生新的資料、文章，因此這裡利用JavaScript的語法window.scrollTo，來自動滾動頁面，直到滾到底部為止。
```python!
# 滾動頁面for i in range(30):    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")    time.sleep(1)
```
首先先抓取所有社團。這裡一樣是因為新舊版的區別，而有不同的爬取方式。
```python!
# 取得所有社團if len(driver.find_elements_by_xpath('//*[@data-hovercard]')) == 0:    #新版    getallgroup = driver.find_elements_by_xpath('//a/span[@dir="auto"]')else:    #舊版    getallgroup = driver.find_elements_by_xpath('//*[@data-hovercard]')
```
還記得我們先前有設定catch參數，若該社團名稱中，有出現catch所設定的關鍵字，就列入待會要發送的名單。這項功能一方面能避免您發送到一些私人、不想打廣告的社團，另一方面，則是可以依照不同的文章，進行不同種類的社團進行發送，譬如：金融類的文章，就設定股票、期貨相關的關鍵字社團發送。
```python!
get_groups = []
#檢查，若無要求就社團全部發
if len(catch) == 0:
    for groups in getallgroup:
        get_groups.append(groups.text)
else:
    for groups in getallgroup:
        if len("".join(re.findall(catch, groups.text))) >0:
            get_groups.append(groups.text)
```
![](https://i.imgur.com/iGdla1P.png)
> 這裡有一個小心得。不要小看發送到一些莫名其妙的廣告社團，這其實對一個粉絲團的成長，意外的有很大的作用。
### 發送到社團
這裡就是模仿人的步驟，點選分享、發送社團等。為了讓整個動作看起來「像人」，在每個動作都加上了time.sleep的延遲，並且是使用亂數的方式。
```python!
####### 開始分享 ####### 
# 切換到文章
driver.get(postURL)
if version == 'new':
    #新版
    for send in get_groups:
    # 按下分享
        driver.find_element_by_xpath('//*[@aria-label="寄送這個給朋友或張貼在你的動態時報中。"]').click()
        time.sleep(random.randint(3,5))
        # 按下分享到社團
        driver.find_element_by_xpath("//*[contains(text(), '分享到社團')]").click()
        time.sleep(random.randint(2,7))
        for send in get_groups:
            # 輸入社團名稱
            driver.find_element_by_xpath('//*[@aria-label="搜尋社團"]').send_keys(send)
            time.sleep(random.randint(2,7))
            driver.find_elements_by_xpath('//div[@aria-labelledby]')[-1].click()
 
            length = len(driver.find_element_by_xpath('//*[@aria-label="搜尋社團"]').get_attribute('value')) #抓到欲刪除的欄位數量
            driver.find_element_by_xpath('//*[@aria-label="搜尋社團"]').send_keys(length * Keys.BACKSPACE) #案幾次刪除
            time.sleep(random.randint(60,120))
else:
     #舊版
     for send in get_groups:
     # 按下分享
         driver.find_element_by_xpath('//*[@title="寄送這個給朋友或張貼在你的動態時報中。"]').click()
         time.sleep(random.randint(3,5))
         # 按下分享到社團
         driver.find_element_by_xpath('//*[contains(text(), "分享到社團")]').click()
         time.sleep(random.randint(2,7))
         # 輸入社團名稱
         driver.find_element_by_xpath('//input[@placeholder="社團名稱"]').send_keys(send)
         time.sleep(random.randint(2,7))
         # 按下向下建選擇第一個最相似的社團
         driver.find_element_by_xpath('//input[@placeholder="社團名稱"]').send_keys('\ue015')
         # 按下enter迴車建
         driver.find_element_by_xpath('//input[@placeholder="社團名稱"]').send_keys('\ue007')
         # 包含原始貼文打勾
         driver.find_element_by_class_name('_55sg').click()
         time.sleep(random.randint(7,15))
         # 發布
         driver.find_elements_by_xpath("//button[contains(text(), '發佈')]")[-1].click()
         time.sleep(random.randint(60,120))
driver.quit()
```
> 注意！
> 本文純屬學習性質，因此請您正當使用。
