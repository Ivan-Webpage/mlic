# IG增粉機器人｜追蹤莫名其妙的增加啦！
> 已經規劃好您的IG品牌了嗎！還沒就趕快看「[IG品牌規劃]()」

## 輸入帳密
必須輸入您的帳號密碼，以方便自動登入。tags則是輸入想要到哪個tag按讚，因此這些tag通常要與品牌最有相關。
```python
IGID = '您的IG帳號'
IGpassword = '您的IG密碼'
```

## 設定phantomjs
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

## 開啟chrome
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

## 登入IG
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

## 開始送愛心
這裡將開始依照您所設定的tag，進去每張照片按愛心。按愛心是從「最新」開始按，而不是「最熱門」，因為「最熱門」通常都是品牌、網紅，他們並不會追蹤您的品牌。

56行的迴圈，決定會在這個tag按幾張照片愛心。這裡都以亂數的方式決定，目的在於盡量的模仿真人，以防辛苦經營的品牌，被封鎖。
```python
####### 開始操作 到不同的tag去發文 ####### 
for tag in tags:
    driver.get("https://www.instagram.com/explore/tags/" + tag) #切換到該tag
    time.sleep(random.randint(2,5))
    driver.find_elements_by_class_name('_9AhH0')[9].click() #點選圖片(選擇最新發的)
    for i in range(random.randint(20,40)):
        if i % 10 == 1:
            time.sleep(random.randint(5,20))
        
        # 檢查有沒有按過讚
        if len(driver.find_elements_by_xpath('//*[@aria-label="收回讚"]')) != 0:
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
> 注意！
> 經過實測，IG一天按愛心的數量，大約是400次，若超過該帳號會被封鎖一天不能按愛心，若有多次這樣的紀錄，甚至會封鎖3天、一星期，以此類推，因此請適度的使用selenium就好，重點還是在於品牌提供給消費者的價值。

## 成果驗收
我以自己的帳號實驗，將個人吉他的影片上傳，並將所有風格經過整理。每三天使用一次機器人按愛心，一個月大約增加200粉絲。但過一兩個禮拜，就有許多人退追蹤了，因此沒有持續的經營，這要漫無目的的曝光，效果也不張。