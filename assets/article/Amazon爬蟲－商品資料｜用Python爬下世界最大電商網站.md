# Amazon爬蟲－商品資料｜用Python爬下世界最大電商網站
## 可交付成果
![可交付成果](https://cdn-images-1.medium.com/max/1200/1*s53C4LKGA5SjEuKL6wy0_w.png)本次爬蟲以「花襯衫」為例，利用Python 的Selenium 套件進行爬蟲，可以爬下每個商品的品牌名稱、商品名稱、網址、商品定價、星星評分、全球評分、客戶回饋尺寸、大小選項、顏色選項、商品描述、產品資訊、全球排名、留言網址，並且將最終結果儲存成CSV檔案。

## Selenium 登入Amazon
若您還不知道Selenium 是什麼東西，可以參考「[Selenium介紹｜Python爬動態網頁的利器](/classification/crawler_king/69)」，並且一定要先將Selenium 需要用到的環境事先設定好，若不知道如何設定可以參考「[Selenium環境設定與測試｜手把手教您如何設定 phantomjs與 chromedriver](/classification/crawler_king/70)」。

```python
# 設定基本參數
desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()

#此處必須換成自己電腦的User-Agent
desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'

# PhantomJS driver 路徑
driver = webdriver.PhantomJS(executable_path = 'phantomjs', desired_capabilities=desired_capabilities)

# 關閉通知提醒
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.default_content_setting_values.notifications" : 2}
chrome_options.add_experimental_option("prefs",prefs)

# 開啟瀏覽器
driver = webdriver.Chrome('chromedriver',chrome_options=chrome_options)
```

## 爬取Amazon所有商品
要爬取商品的資料之前，要先取得所有商品的連結，因此這裡先在商品瀏覽的地方做搜尋，並且爬取5頁的商品網址，待會就可以利用這些網址去到每個商品頁面進行爬蟲。
```python
theurl = []
for i in range(5):
    # 去到你想要的網頁
    driver.get("https://www.amazon.com/s?k="+ thing +"&amp;page="+ str(i) +"ref=sr_pg_2")
    
    geturl = driver.find_elements_by_xpath('//h2/a')
    for j in geturl:
        theurl.append(j.get_attribute('href'))
        
    time.sleep(5)

```
## 爬取商品細節
準備好每個商品的網址後，就可以利用for 迴圈開始爬取每個商品細節，在爬取之前也需要準備各個變數，以便於之後的資料存取。
```python
brand = []
title = []
url = []
price = []
star = []
starNum = []
toosmall = []
small = []
goodsize = []
big = []
toobig = []
size_options = []
color_options = []
description = []
productDscrp = []
global_range = []
view_url = []
for page in range(0,len(theurl)):
    print('第 '+ str(page) + ' 個商品')
    #儲存網址
    url.append(theurl[page])
    
    # 去到你想要的網頁
    driver.get(theurl[page])
    time.sleep(randint( 7, 15))
```
### 爬取品牌名稱
品牌名稱相對的是很好爬的，因為Html標籤中有ID，因此可以直接使用find_elements_by_id() 方法來進行爬取。會使用if 檢查長度的原因在於，不一定每個商品都有顯示品牌，因此要確定有這個標籤，才會進行爬取。
```python
# 品牌名稱
if len(driver.find_elements_by_id('bylineInfo')) == 0 :
    brand.append('沒有牌子')
else:
    brand.append(driver.find_element_by_id('bylineInfo').text)
```
### 爬取商品名稱
商品名稱也有標準的ID，因此一樣也使用find_elements_by_id() 方法來進行爬取。
```python
# 商品名稱
title.append(driver.find_element_by_id('title').text)
```

### 爬取商品價格
爬取商品價格時使用if 並不是要確認網頁中有沒有價格，畢竟每個購物網站一定會把價格寫清楚，而是現在行銷的需求，導致標價會有許多不同的形式，而標籤也會有所變動。
```python
if len(driver.find_elements_by_id('corePriceDisplay_desktop_feature_div'))==0:
    getprice = driver.find_element_by_id('corePrice_desktop').text
else:
    getprice = driver.find_element_by_id('corePriceDisplay_desktop_feature_div').text
```
譬如像以下的身品就不是直接寫價格，而是顯示原價與折扣後價格，來提高消費者的慾望（雖然我們也知道這只是行銷小手法）。在這樣的設計下，就會以不同的標籤來呈現。

![Amazon呈現價格的方式](https://cdn-images-1.medium.com/max/1200/1*TtyCX9vQEIhxue23whOhXQ.png)

在取得價格的資訊後，必須要過濾掉一些不必要的字串，因此需要大量使用replace() 方法。另外因為字串的內容與長度為隨機的，因此還需使用find() 方法來取得各個字串位置。
```python
getprice = getprice.replace('US$','') # 先把「US$」拿掉
if '有了交易' in getprice:
    getprice = getprice[getprice.find('有了交易')+6:]
    getprice = getprice.split('\n')[0]
else:
        
    getprice = getprice.replace('定價：','') # 把「US$」拿掉
    if ' -' in getprice: # 利用「 - 」來切割兩個數字
        getprice = getprice.replace('\n','') # 把「US$」拿掉
        cutlist = getprice.split(' -')
        getprice = (float(cutlist[0]) + float(cutlist[1]))/2 # 計算平均
    else:
        getprice = getprice.replace('\n','.')
price.append(getprice)
```

### 爬取星星數量
![爬取星星數量](https://cdn-images-1.medium.com/max/1200/1*TbfjtRIYbNOnaxxK2bMYYQ.png)
由於有些商品可能剛上架，或者是還沒有人購買，導致於商品沒有星等，因此也需要事先進行排除。
```python
# 星星評分
if len(driver.find_elements_by_id('acrPopover'))==0:
    star.append('沒有星等')
else:
    star.append(driver.find_element_by_id('acrPopover').get_attribute("title").replace(' 顆星，最高 5 顆星',''))
    
```
### 爬取全球評分
![爬取全球評分](https://cdn-images-1.medium.com/max/1200/1*T6BRhGnzH3EN03jCx6wf2A.png)
全球評分也是不一定每個商品都會有。經過觀察，只有一些較為熱賣的商品會有排名，因此也需要進行檢查。
```python
# 全球評分數量
if len(driver.find_elements_by_id('acrCustomerReviewText'))==0:
    starNum.append(0)
else:
    getglobalNum = driver.find_element_by_id('acrCustomerReviewText').text
    getglobalNum = getglobalNum.replace('等級','')
    getglobalNum = getglobalNum.replace(',','')
    starNum.append(getglobalNum)

```
### 爬取顧客回饋尺寸
![爬取顧客回饋尺寸](https://cdn-images-1.medium.com/max/1200/1*L6JIc_U3TosAkMobc1XekA.png)
若沒有消費者回饋，則不會有資料，因此會給予0。另外想要爬取該資料必須要先利用click() 方法點開介面，且爬取完畢後，可能會遮擋到別的標籤，導致於爬蟲出錯，因此還需要點選「Ｘ」關閉畫面。
```python
# 客戶回饋大小
if len(driver.find_elements_by_id('fitRecommendationsLinkRatingText')) == 0:
  toosmall.append(0)
  small.append(0)
  goodsize.append(0)
   big.append(0)
   toobig.append(0)
else:time.sleep(5)
        driver.find_element_by_id('fitRecommendationsLinkRatingText').click()
        time.sleep(5)
        getrequest = driver.find_elements_by_xpath('//td[@class = "a-span1 a-nowrap"]')
        toosmall.append(getrequest[0].text)# 太小
        small.append(getrequest[1].text)# 有點小
        goodsize.append(getrequest[2].text)# 尺寸正確
        big.append(getrequest[3].text)# 有點大
        toobig.append(getrequest[4].text)# 太大
        # 關閉選項
        if len(driver.find_elements_by_xpath('//button[@data-action = "a-popover-close"]')) != 0:
            driver.find_element_by_xpath('//button[@data-action = "a-popover-close"]').click()
        time.sleep(5)
```

### 爬取尺寸大小選項
![爬取尺寸大小選項](https://cdn-images-1.medium.com/max/1200/1*01OD3fIon7cpy2CY4AqTrw.png)
爬取所有商品的所有尺寸，爬取尺寸後有能做什麼呢？這個資料有利於產品開發、剛進入市場的廠商、採購、買手作分析使用，詳情可參考課程「[蝦皮市場大小預估分析－K-means分群的實例應用](/classification/crawler_king/89)」。
```python
# 大小選項
driver.find_element_by_xpath('//span[@data-csa-interaction-events = "click"]').click()
time.sleep(5)
containar = []
for i in driver.find_elements_by_xpath('//li[contains(@id, "size_name_")]'):
    if i.text != '選擇' and i.text != '':
        containar.append(i.text)
size_options.append(containar)
```

### 爬取顏色選項
花襯衫的消費者最在意的就是顏色了，因此我們也要將所有商品的顏色爬下來！
```python
# 顏色選項
containar = []
for i in driver.find_elements_by_xpath('//li[contains(@id, "color_name_")]'):
    getdata = i.get_attribute("title")
    containar.append(getdata.replace('請按下選擇 ','')) # 取代掉「請按下選擇」
color_options.append(containar)
```

### 爬取商品描述
這裡是爬取商品的文案介紹，而Amazon 市場與蝦皮很大的不同是，跟蝦皮相比，Amazon 不會寫太多資訊在商品描述中，而是會在商品詳細資訊中以條列式的方式呈現。
```python
# 商品描述
if len(driver.find_elements_by_id('productDescription')) != 0:
    productDscrp.append(driver.find_element_by_id('productDescription').text)
else:
    productDscrp.append('')
```
### 爬取產品詳細資訊與排名
![爬取產品詳細資訊與排名](https://cdn-images-1.medium.com/max/1200/1*laesSaTOQuzj7tT3kgA96g.png)
排名的部分因為需要做字串整理，因此程式比較複雜一點。因為每個商品的排名數量都不一樣，舉例來說，花襯衫較常被拿出來排名的是「[服裝，鞋子和珠寶](https://www.amazon.com/-/zh_TW/gp/bestsellers/fashion/ref=pd_zg_ts_fashion)」與「[男士休閒扣領襯衫](https://www.amazon.com/-/zh_TW/gp/bestsellers/fashion/1045630/ref=pd_zg_hrsr_fashion)」，但有些商品可能只有「[男士休閒扣領襯衫](https://www.amazon.com/-/zh_TW/gp/bestsellers/fashion/1045630/ref=pd_zg_hrsr_fashion)」，因此需要利用字串切割，區別成不同的排名類別。
```python
# 產品詳細資訊
description.append(driver.find_element_by_id('detailBullets_feature_div').text)
# 全球排名
getdata = driver.find_element_by_xpath('//div[@id = "detailBulletsWrapper_feature_div"]/ul').text
getdata = getdata.replace('暢銷商品排名: ','')
# getdata = getdata.replace('\n','')
getdata = getdata.split('#')
containar = {}
for i in range(1,len(getdata)):
    rang = getdata[i].split(' 在 ')[0]
    item = getdata[i].split(' 在 ')[1]
    if ' (' in item:
        item = item.split(' (')[0]
    containar[item] = int(rang.replace(',',''))
global_range.append(containar)

```


### 爬取留言網址
在這裡取得該商品的消費者留言，而Amazon 設計消費者留言是呈現另一個頁面，因此我們在下門課程就會以爬取每個商品的留言為目標。
```python
# 留言網址
if len(driver.find_elements_by_xpath('//a[@data-hook = "see-all-reviews-link-foot"]'))== 0 :
    view_url.append('沒有留言')
else:
    view_url.append(driver.find_element_by_xpath('//a[@data-hook = "see-all-reviews-link-foot"]').get_attribute('href'))
    
```
### 存檔成CSV
由於擔心爬蟲的過程有任何無法抗拒因素，導致爬蟲停下來的狀況，而之前爬的東西都不見了，因此本程式設計每10筆資料就儲存一次，這樣若程式有任何因素停止了，也不必再從頭爬取喔！
```python
dic = {
        '品牌名稱' : brand,
        '商品名稱' : title,
        '網址' : url,
        '商品定價' : price,
        '星星評分' : star,
        '全球評分數量' : starNum,
        '太小' : toosmall,
        '有點小' : small,
        '尺寸正確' : goodsize,
        '有點大' : big,
        '太大' : toobig,
        '大小選項' : size_options,
        '顏色選項' : color_options,
        '商品描述' : description,
        '產品資訊' : productDscrp,
        '全球排名' : global_range,
        '留言網址' : view_url
        }
if page%10==9:
    pd.DataFrame(dic).to_csv(
            '到第'+str(page)+'頁_Amazon商品資料.csv', # 檔案名稱
            encoding = 'utf-8-sig', # 編碼
            index=False # 是否保留index
            )
```
