# Youtube爬蟲－頻道資料
近年網路使用者喜好的改變，從文字到圖片，現在使用者更喜歡用影片來獲得各種資訊，這也使的長久經營影音平台的Youtube順勢而生，從2005年成立至今，終於收穫到甜美的果實。身為行銷人的你，該如何應應這個時代的變化，這也是作者一直在探討的主題。

## 可交付成果
本教學使用Python 的Selenium 套件進行爬蟲，經由本次的教學，可以爬下您指定的Youtuber頻道中，頻道名稱、頻道網址、開始經營時間、觀看總數、總訂閱數、國家位置、以及該Youtuber頻道中其他子頻道的資料。
![可交付成果](https://i.imgur.com/v7f9piv.png)
## Selenium 登入Youtube
若您還不知道Selenium 是什麼東西，可以參考「[Selenium介紹｜Python爬動態網頁的利器]()」，並且一定要先將Selenium 需要用到的環境事先設定好，若不知道如何設定可以參考「[Selenium環境設定與測試｜手把手教您如何設定 phantomjs與 chromedriver]()」。
```python
# selenium
from selenium.webdriver import DesiredCapabilities
from selenium import webdriver
import pandas as pd
import time
from datetime import datetime

# 設定基本參數
desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()

# 此處必須換成自己電腦的User-Agent
desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
# PhantomJS driver 路徑 似乎只能絕對路徑
driver = webdriver.PhantomJS(
    executable_path='phantomjs', desired_capabilities=desired_capabilities)

# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications": 2}
chrome_options.add_experimental_option("prefs", prefs)

# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver', chrome_options=chrome_options)
time.sleep(5)
```

## 準備目標頻道
在設定Youtuber頻道時，需要取得Youtuber頻道的ID，而取得ID的方式如下圖，其實就是該頻道首頁的網址。
![準備目標頻道](https://cdn-images-1.medium.com/max/1200/1*8qNtnbgk4L3sIh_GD8Iwaw.png)
在本次的範例中，以休閒娛樂類型的Youtuber為主題（作者絕對沒有喜歡看），以模擬我們真實在分析Youtuber頻道時的真實情況。因此設定待會要爬下這群人、燥咖、又仁、各種同學、反骨男孩、How Fun、喬瑟夫，共7個Youtuber頻道。

```python
# 想爬取的youtube
youtuber = ['c/thisgroupofpeople', # 這群人
            'channel/UCfMiXMUBXxWiVrcXw2GV92g', # 燥咖
            'user/TheN10414', # 又仁
            'channel/UCW_0KHu_E9tH9_WVmrFactg', # 各種同學
            'user/KEVIN0204660', # 反骨男孩
            'user/jasonjason1124', # How Fun
            'user/dionisiojian' # 喬瑟夫
            ]

#準備容器
name = []
pageurl = []
intotime = []
looking = []
subscription = []
description = []
location = []
otherlink = []
channels = []
videolink = []
```
在設定完成後，就利用for 迴圈開始對Youtuber頻道逐一進去爬蟲。若Youtuber頻道設定的越多，會爬得越久，因此這邊需要您自行斟酌。

```python
# 開始一個一個爬蟲
for yChannel in youtuber:
```

## 爬下簡介
首先，去到該Youtuber頻道的首頁。
```python
# --- 簡介 部分
driver.get('https://www.youtube.com/' + str(yChannel) + '/about')
time.sleep(10)
```

### 訂閱數量
![訂閱數量](https://cdn-images-1.medium.com/max/1200/1*oOLnkubFqW3QzrNQSVcdag.png)
接著便先能取下「訂閱數量」，這個資訊對於許多行銷人或者在尋找合作的業主來說，是非常有用的資訊。剛好訂閱數量標籤中有ID「subscriber-count」， 引此直接使用Selenium 的方法find_element_by_id() 取得即可。
```python
# 訂閱數量
getSubscription = driver.find_element_by_id('subscriber-count').text
getSubscription = getSubscription.replace(' 位訂閱者', '')
subscription.append(getSubscription)
```

### 開始經營時間
![](https://cdn-images-1.medium.com/max/1200/1*IYevLrFcpT0N64WTyYyGtg.png)
由於抓取下來的時間格式為str，因此需要使用datetime 套件的strptime() 方法，將其轉乘時間格式，以方便之後的資料分析。
```python
# 開始經營時間
gettime = driver.find_element_by_xpath('//div[@id="right-column"]/yt-formatted-string[2]/span[2]').text
intotime.append(datetime.strptime(gettime, "%Y年%m月%d日"))
```

### 總觀看次數
![總觀看次數](https://cdn-images-1.medium.com/max/1200/1*iBBNWUCLUOL_mRosSpXOFw.png)
Youtuber頻道的總觀看次數中有不少多餘的字串，會造成無法將str 格式轉乘int 格式，因此需要大量使用replace() 方法將不必要的字串去除掉。
```python
# 總觀看次數
getlooking = driver.find_element_by_xpath('//div[@id="right-column"]/yt-formatted-string[3]').text
getlooking = getlooking.replace('getlooking = ', '')
getlooking = getlooking.replace('觀看次數：', '')
getlooking = getlooking.replace('次', '')
getlooking = getlooking.replace(',', '')
looking.append(int(getlooking))
```

### 文案、國家位置
![文案、國家位置](https://cdn-images-1.medium.com/max/1200/1*br4reNBa4frsy1G9UxdhKw.png)
取得Youtuber頻道的文案，但該文案對於資料分析的效益不大，若您是需要大量參考文案的小編，或許可以大量爬取後觀看，或許能產生一些新的想法。
```python
description.append(driver.find_element_by_id('description').text)  # 存文案
location.append(driver.find_element_by_xpath('//div[@id="details-container"]/table/tbody/tr[2]/td[2]').text)  # 存國家位置
```

### 其他連結
![其他連結](https://cdn-images-1.medium.com/max/1200/1*COEUo6N28q4BlHu0IZntwQ.png)
從連結也可以看出每個Youtube頻道經營的狀況，以及經營的整合規模，如同一間公司除了營收之外，他的持股結構、控股行為，企業利用此舉能額外獲得業外收入外，更能在景氣低迷時度過寒冬，而Youtube頻道也是如此。
```python
# 其他連結
getOtherlink = driver.find_elements_by_xpath('//div[@id="link-list-container"]/a')
containar = {}  # 結果整理成dict
for link in getOtherlink:
    containar[link.text] = link.get_attribute('href')
otherlink.append(containar)
```

## 爬下頻道
![爬下頻道](https://cdn-images-1.medium.com/max/1200/1*zRrdfx9WwhP_SIfSnhEWbw.png)
頻道的有效資訊除了頻道名稱外，頻道的連結、訂閱數都是非常有價值的資料，因此我們移併爬下來。另外有些有趣的情況，有些頻道可能是剛建立的子頻道，因此甚至還沒有任何訂閱者，因此在爬蟲中必須將其排除。
```python
# --- 頻道 部分
driver.get('https://www.youtube.com/' + str(yChannel) + '/channels')
time.sleep(10)
getlink = driver.find_elements_by_id('channel-info')
containar = {}  # 結果整理成dict
for link in getlink:
    data = link.text
    data = data.split('\n')
    # 檢查有沒有訂閱者
    if len(data) == 1:
        containar[data[0]] = {
            '訂閱數量': 0,
            '連結': link.get_attribute('href')
        }
    else:
        containar[data[0]] = {
            '訂閱數量': data[1].replace(' 位訂閱者', ''),
            '連結': link.get_attribute('href')
        }
channels.append(containar)
```

## 爬下影片
![爬下影片](https://cdn-images-1.medium.com/max/1200/1*Lc5kxiwTEWjcmEzN74QQIA.png)
這或許是您做Youtube爬蟲最想要達成的效果，就是抓下每部影片的資料。這裡利用Selenium 中execute_script() 方法，來傳送JavaScript語法給瀏覽器，讓瀏覽器產生像滾輪一樣向下滾，便能夠生成每個頻道更久之前的影片。
```python
# --- 影片 部分
driver.get('https://www.youtube.com/' + str(yChannel) + '/videos')
time.sleep(10)

# 滾動頁面
for scroll in range(20):
    driver.execute_script('window.scrollBy(0,1000)')
    time.sleep(2)

containar = []  # 結果整理成list
for link in driver.find_elements_by_id('video-title'):
    containar.append(link.get_attribute('href'))
videolink.append(containar)
```

## 存檔收尾
將以上資料蒐集完成後，便可以利用Pandas 套件進行打包存檔。本次教學屬於範例，因此編寫的流程較為簡單，實際要將這個專案執行，建議每個頻道爬完就先存檔一次，以免緊急情況的發生而功規一匱。
```python
dic = {
    'Youtuber頻道名稱': name,
    '頻道網址': pageurl,
    '開始經營時間': intotime,
    '總觀看數': looking,
    '總訂閱數': subscription,
    '文案': description,
    '國家位置': location,
    '其他連結': otherlink,
    '頻道': channels,
    '所有影片連結': videolink
}
pd.DataFrame(dic).to_csv('Youtuber_頻道資料.csv',
                         encoding='utf-8-sig',
                         index=False)
```