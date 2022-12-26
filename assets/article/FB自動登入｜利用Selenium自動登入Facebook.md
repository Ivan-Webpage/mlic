# FB自動登入｜利用Selenium自動登入Facebook

## 可交付成果
若要進行FB的自動化處理，自動登入是逼需經過的門檻。本文章會帶您使用Python 中的Selenium 爬蟲套件來進行FB自動登入，以便於後續課程的進行。因此，在開始課程前請先看過「[Selenium介紹](/classification/crawler_king/92)」、「[Selenium環境設定與測試](/classification/crawler_king/93)」，以確保您對 Selenium有一定的了解，並且以確實安裝 [phantomjs](https://phantomjs.org/download.html)與 [chromedriver](https://chromedriver.chromium.org/downloads)軟體。

## 輸入帳密
首先在載入 Selenium套件後，先行設定好登入所需要的帳號密碼。請將您FB的登入帳號密碼打在程式碼中。也因為您的程式碼會在程式碼中顯示，因此這個檔案必須妥善保管，否則您的FB帳密就會外流。
另外，因為需要使用機器人自動登入，因此須將「Email認證登入」或「簡訊認證登入」關閉，否則會導致機器人登入失敗。
```python
# -*- coding: utf-8 -*-
"""
Created on Fri May  7 17:02:59 2021
@author: Ivan
課程教材：行銷人轉職爬蟲王實戰｜5大社群平台＋2大電商
版權屬於「楊超霆」所有，若有疑問，可聯絡ivanyang0606@gmail.com
第七章 FB自動發社團發文小幫手
FB登入
"""
from selenium.webdriver import DesiredCapabilities
from selenium import webdriver
import time
    
useEmail = '帳號'
usePass = '密碼'</code></pre>
```
## 設定phantomjs

這個部分只需要注意，phantomjs與chromedriver這兩個檔案的擺放位置，確實是與程式碼在同一層目錄即可，並且工作目錄設定無誤。若以上皆無問題，那便可以直接順利執行過去，打開程式控制的瀏覽器。



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
chrome_options.add_experimental_option("prefs",prefs)</code></pre>
```

## FB自動登入
本文章登入的方式，是抓取網頁中指定的ID標籤（若有寫過HTML的朋友會比較了解）。
```python# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver',chrome_options=chrome_options)

driver.get("http://www.facebook.com")
time.sleep(3)
assert "Facebook" in driver.title

driver.find_element_by_id('email').send_keys(useEmail) # 輸入帳號
time.sleep(3)
driver.find_element_by_id('pass').send_keys(usePass) # 輸入密碼
time.sleep(1)
driver.find_element_by_name('login').click() # 按下登入
```
