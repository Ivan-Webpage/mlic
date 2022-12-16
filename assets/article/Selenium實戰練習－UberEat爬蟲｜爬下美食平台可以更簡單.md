# Selenium實戰練習－UberEat爬蟲｜爬下美食平台可以更簡單
![圖片取自：Uber Eats官網畫面](https://i.imgur.com/7MYam1P.png)
在課程「[Selenium介紹」與「Selenium環境設定與測試](/class?c=3&a=93)」中，已經將我們Selenium爬蟲所需要的環境準備好了，接下來我們就以爬下UberEat為範例來進行爬蟲了！

首先到UberEat首頁中，輸入想爬取的地區資料，利用 find_element_by_xpath()方法來進行爬取。

> [find_element_by_xpath 方法解說](/class?c=3&a=92)

```python
#--- 輸入外送地址
getblock = driver.find_element_by_xpath('//*[@placeholder="輸入外送地址"]')
getblock.send_keys('中山北路二段1號') # 輸入地址
time.sleep(1)
getblock.send_keys('\ue007') # 按下Enter
```

首先先使用 find_elements_by_class_name()方法來抓下每個店家的名稱，但此方法會有一些限制。一方面，若想爬取的資料沒有 class 這個標籤，會無法爬取。另一方面，若這個class 被大量使用，可能會爬到許多無意義的資料。

> [find_elements_by_class_name 方法解說](/class?c=3&a=92)

```python
#方法1：利用class抓取
len(driver.find_elements_by_class_name('lv'))
len(driver.find_elements_by_class_name('g3'))
len(driver.find_elements_by_class_name('ag'))

for i in driver.find_elements_by_class_name('lv'):
    print(i.text + '\n')
```
第二種方法使用「剝洋蔥」的方式進行Selenium爬蟲，這個方式較為複雜，若沒有寫過網頁前端的人，可能會比較難理解這個方式。

```python
#方法2：利用剝洋蔥方式
location = '//main/div/div[3]/div[2]/div/div[4]/div['
# driver.find_element_by_xpath('//main/div/div[3]/div[2]/div/div[4]/div[1]/div/a/h3')
for i in range(1, 21):
    print(driver.find_element_by_xpath(location + str(i) + ']/div/a/h3').text + ' ')

doit = True
i = 1
while doit:
    try:
        print(driver.find_element_by_xpath(location + str(i) + ']/div/a/h3').text + ' ')
    except:
        doit = False
        print(i)
    i = i + 1
```
