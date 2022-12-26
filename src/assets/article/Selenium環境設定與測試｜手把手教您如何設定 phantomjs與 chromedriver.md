# Selenium環境設定與測試｜手把手教您如何設定 phantomjs與 chromedriver
![集合檔案](https://i.imgur.com/R8oPW16.png)
> 若您使用Selenium 4 的方式，則可跳過本篇文章
在看完「[Selenium環境設定與測試](/class?c=3&a=93)」課程後，接著就來學習如何在自己的電腦上準備好Selenium爬蟲所需要的文件。在「[Selenium環境設定與測試](/class?c=3&a=93)」課程中已經下載了 phantomjs 與 chromedriver 檔案後，都必須放到主程式的資料夾中（如上圖），讓Python確保能抓到這兩個檔案。若系統為linux，可能會有使用chromedriver與phantomjs檔案權限問題，因此必須要輸入以下來打開權限（777為全開，若是覺得有安全疑慮者可以自行調整）。

![linux系列的系統，必須要開起權限，windows的讀者可以忽](https://i.imgur.com/u144Ya1.png)
下三個註解打開，瀏覽器就不會開啟。模擬瀏覽器是讓我們在開發時能夠更加方便的可視化，但若已經成熟，就可以直接在後端執行就好，不需要多一個瀏覽器。
```python
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
```
