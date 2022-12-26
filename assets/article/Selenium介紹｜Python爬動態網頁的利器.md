# Selenium介紹｜Python爬動態網頁的利器
近年來網站前端的生態大幅改變，自從FaceBook興起，動態網站也隨之興起，常見的動態網站有FaceBook、Dcard、IG、Youtube等等。可以說現在知名的社群平台都是用動態的方式做設計，這樣的好處是可以讓使用者不斷地在網頁內瀏覽，但這對於網路爬蟲來說，就相當的麻煩，早期的爬蟲都是一次性地載入網頁內的所有程式碼，但當變成動態時，一定要滾輪滾到底才會觸發新的資料近來，導致爬蟲沒有辦法爬到。

初學 Selenium爬蟲可以解決動態網站的爬蟲問題，簡單來說就是模擬使用者在瀏覽網頁的行為，因此也能夠藉由一些調整來偽裝成真人。以下是在「[IG增粉大師－增粉機器人](/classification/crawler_king/103)」課程中使用Selenium爬蟲的實作，可以看到網頁不須人來控制，自動的點擊按鈕。

## 環境準備
### Selenium版本置換
自從Selenium升級到4以後，環境的部分也可以自動下載，因此以下兩個所需的環境檔案也不一定要下載，但若是4之前的版本，仍需要使用以下兩個檔案。本文章也依照新的Selenium 4進行介紹，因此以下程式碼皆為Selenium 4所使用。
### Phantomjs
phantomjs是Selenium的控制器，等於是將python程式碼變成機器人的工具。Selenium之所以能爬到許多爬蟲爬不到的網站，就是因為Selenium是模仿人的行為，真的打開一個瀏覽器，不像傳統的爬蟲，直接請求封包下來解析。當然這各有有缺點Selenium的執行效率相對就差很多，但面對IG這種「動態式」的網站，必須要用Selenium才能達的到。

phantomjs 可以到「[Download PhantomJS](https://phantomjs.org/download.html)」中下載，依照自己的作業系統進行選擇即可。不同系統，圖示可能會不太一樣，但不影響功能，讀者不必過度擔心。

### Chromedriver
初學 Selenium 通常會配合chromedriver工具，chromedriver是專門給程式控制的瀏覽器。因此實作時，程式會幫您開啟一個chrome瀏覽器，並且按照程式自動按按鈕，當然也可以人工介入操作。由於chromedriver需要配合您自己的Google Chrome版本，若不知道怎麼查詢自己的Google Chrome版本，可以點「 Google Chrome版本查詢」，裡面會告訴你應該要下載哪個版本，確定後即可點下方選擇下載檔案。

## Selenium常用方法整理
### By.ID
根據標籤的ID來進行爬蟲。

html範例：
```python
<div id='test'>這個是範例</div>
```

python範例：
```python
driver.find_element(by=By.ID, value='test') 
```

### By.NAME
根據標籤的name來進行爬蟲。

html範例：
```python
<div name='test'>這個是範例</div>
```
python範例：
```python
driver.find_element(by=By.NAME, value='name名稱') 
```
### By.LINK_TEXT
根據該標籤所顯示的文字來進行爬蟲。

html範例：
```python
<div>這個是範例</div>
```
python範例：
```python
driver.find_element(by=By.LINK_TEXT , value='這個是範例')
```
### By.TAG_NAME
通過標籤進行爬蟲。

html範例：
```python
<h1>這個是範例</h1>
```
python範例：
```python
driver.find_element(by=By.TAG_NAME , value='h1') 
```
### By.CSS_SELECTOR
根據style進行爬蟲。

html範例：
```python
<div class='test'>這個是範例</div>
```
python範例：
```python
driver.find_element(by=By.CSS_SELECTOR , value='div.test')
```
### By.XPATH
依照網頁前端程式碼進行爬蟲，若有寫過網頁前端，較容易了解此方法。

html範例：
```python
<div class='test'>
    <div>
        <p>這是第一段文字</p>
    </div>
</div>
```
python範例：
```python
driver.find_element(by=By.XPATH , value='//div[@class="test"]/div/p') 
```
### By.CLASS_NAME
根據class來進行爬蟲，因為class在網頁設計中並非唯獨，因此常常會爬到垃圾資料。

html範例：
```python
<div class='test'>這個是範例</div>
```
python範例：
```python
driver.find_element(by=By.CLASS_NAME, value='test') 
```


---

了解了Selenium以後，我們就接下來「[Selenium環境設定與測試](/classification/crawler_king/93)」課程，開始進行Selenium實作吧！
