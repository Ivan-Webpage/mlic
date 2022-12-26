# FB自動分享小幫手｜用Python灑文到各社團，小編從此不用發文發到死
## 可交付成果
利用 Python的 Selenium套件，使用爬蟲幫我們將想要廣宣的FB文章，自動分享到指定的社團。此舉能用較低的成本（比起直接投放FB廣告來說），得到較高的曝光度，並且增加品牌粉絲團的觸擊數量。作者自己測試效果卓越，曾將一個FB粉專在一年內衝向1萬人訂閱。
## Python參數設定
我們在前篇文章「[FB自動登入－Python Selenium 爬蟲](/classification/crawler_king/108)」當中，已經設定好了FB機器人登入時所使用的帳號密碼，而現在我們再另外設定幾個參數，因此這邊條列式說明：
* useEmail：登入帳號。
* usePass：登入密碼。
* catchk_keyword：社團名稱的關鍵字。例如，輸入「理財」，則「理財股海社團、投資理財專區、陳老師理財教室」等等社團，有「理財」兩個字的社團都會被發送。
* identity：指定發文者身分，因此可以切換不同的管理者進行發送。
* content：分享時輸入的文章內容。
* postURL：想分享的文章。

```python
useEmail = '帳號'
usePass = '密碼'
catchk_keyword = ['廣告'] # 想要發文的社團，而該社團名字中出現的字詞
identity = '楊超霆' # 發文身分
content = '#python\n #好物物推薦' # 發文文章內容
postURL = 'https://www.facebook.com/marketingliveincode/posts/1590865937778957' #所分享的文章
```

## 發文準備
在這裡先設定好一個方法，每次固定切換到想分享的文章，並且設定各個想要的文章參數。

```python
# 發文準備
def goto_post(keyword):
    driver.get(postURL)# 切換到想發的文章
    time.sleep(10)
    
    # 點選分享社團
    driver.find_element_by_xpath('//div[@aria-label="寄送這個給朋友或張貼在你的動態時報中。"]').click()
    time.sleep(3)
    driver.find_element_by_xpath("//*[contains(text(), '分享到社團')]").click()
    time.sleep(3)
    
    # 切換分享身分
    driver.find_element_by_xpath('//label[@aria-label="使用以下身分分享"]').send_keys('\ue015')
    time.sleep(5)
    get_all_identity = driver.find_elements_by_xpath('//div[@aria-checked="false"]')
    for getid in get_all_identity:
        if getid.text == identity:
            getid.click()
            break;
    time.sleep(5)
    
    # 將Keyword放入，搜尋社團
    driver.find_element_by_xpath('//input[@aria-label="搜尋社團"]').send_keys(keyword)
    time.sleep(3)
```
## 開始自動分享FB文章到各個社團
開始依照設定的社團關鍵字進行發文。在過程中會先呼叫剛剛設定的 goto_post()方法，將想設定的文章資料都先調整完畢，而後開始利用 Selenium自動抓取各個按鈕標籤進行發送。這裡必須要注意，因為FB抓機器人抓得很嚴格，因此 time.sleep()這個方法不能省，FB抓到的話帳號會被封鎖三天到一個星期喔！

```python
#一個個關鍵字進去
for keyword in catchk_keyword:
    goto_post(keyword) # 執行發文準備

    # 計算該關鍵字共有幾個社團
    count = len(driver.find_elements_by_xpath('//div[@style="padding-left: 8px; padding-right: 8px;"]/div[@role="button"]'))
    time.sleep(random.randint(5,10))
    
    temp = 0 # 用來記錄已發文的社團
    for long in range(count):
        if long != 0: # 若不是第一次執行，則需要再次執行發文準備，因為發過文後「分享」按鈕會消失
            goto_post(keyword) 
            
        getdriver = driver.find_elements_by_xpath('//div[@style="padding-left: 8px; padding-right: 8px;"]/div[@role="button"]')[temp]
        if len(getdriver.text) == 0: # 檢查
            print('抓到空物件，下一個')
        else:
            # 點進社團
            getdriver.click()
            
            # 發文
            time.sleep(random.randint(3,5))
            try:
                driver.find_element_by_xpath('//div[@aria-label="留個言吧......"]').send_keys(content)
            except:
                driver.find_element_by_xpath('//div[@aria-label="建立公開貼文……"]').send_keys(content)
            time.sleep(random.randint(3,5))
            driver.find_element_by_xpath('//input[@aria-checked="false"]').click()
            time.sleep(random.randint(2,5))
            driver.find_element_by_xpath('//div[@aria-label="發佈"]').click()
            time.sleep(random.randint(6,12))
        
        temp = temp + 1 # 記錄已發文的社團
        
    time.sleep(random.randint(20,50))
```
