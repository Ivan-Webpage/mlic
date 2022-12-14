# 首部曲－最淺白的RCE攻擊，用python sendbox 模擬實戰攻擊
(參考資料：[splitline](https://github.com/splitline/py-sandbox-escape)課程講義)
資訊安全議題近年逐漸受到企業重視，尤其在金融科技進展的同時，金融界也注入可觀的資金在金融資訊安全，畢竟金融客戶的隱私比什麼都重要，當然也因為金融業有龐大的資金，才能投資大量資金到資訊安全中，一般中小企業就會有所取捨。

資訊安全的領域非常廣，大家比較常見的是網域安全，例如：資料庫安全、官方網站掛黑頁等；有趣的是許多台灣的者說：「我們公司的網站只有Demo而已，也沒有資料庫，被掛黑頁就算了，換回去就好」，事實不是這樣的，有時掛黑頁可能是連結到賭博、色情等網站，等於是不肖業者藉您的網頁流量打廣告，這不僅影響顧客對您的企業形象，更可能影響公司的SEO，最終導致企業未來性大打折扣。

這樣消極的資訊防護在台灣不是個案，因此提升資訊安全意識是首要工作。本文章藉由簡單的模擬實戰，演示駭客攻擊中，一種常見的攻擊手法－RCE。

## 遠端執行程式碼攻擊（RCE）
遠端執行程式碼攻擊又稱為Remote Code Execution（簡稱RCE），概念有點類似SQL injection。也就是利用服務中可以讓使用者輸入（input）的區塊，進行指令的運行；如此一來，等於能夠控制server的整臺電腦。本專案將用簡單的範例掩飾駭客的攻擊思維，以及如何較有效的進行防禦。

### Sendbox創建
```python
while True:
    try:
        print(‘請輸入：’)
        inp = input()
        ret = None
        exec(“ret=” + inp)
        if ret != None:
            print(ret)
    except Exception as e:
        print (e)
```
利用while無限迴圈，重複檢查使用者是否有輸入文字，且將輸入的內容與ret變數相接，最後將ret給打印出來。由此處可知，只能輸入數字，若輸入字串的話會被誤認為是變數，就會發生錯誤。照理來說，只能輸入數字，應該是非常安全？

漏洞何在？
執行結果如下圖2所示。若不輸入任何東西，直接送出會出錯。而正常輸入數字也會正常返回輸入的內容，當然這是一個正常的使用方式。但若輸入以下：
```python
exec('import os')
```
![執行結果](https://i.imgur.com/erfpXX6.png)

發現並沒有任何錯誤跳出來，代表被成功執行了。表面上看起來沒什麼大礙，事實上這會是個非常嚴重的漏洞，因為os這個套件可以引入許多系統的方法，接下來想要怎麼控制這臺server都可以，若您對os沒有感覺的話，以下的程式碼您可以更好理解這個嚴重性：

```python
exec("open( '檔案的位置', 'r' )")
```
下圖可以發現，程式成功幫我們執行了open這個方法（雖然沒設定路徑所以出錯），這代表可以在server端任意開啟檔案，當然病毒也可以直接開啟執行了。

![使用open指令](https://i.imgur.com/uW1LxMe.png)

## 那該如何防禦？
由此可知，完全沒有任何防護機制，根本是門戶洞開，毫無安全可言，因此該如何防禦呢？如果將任何有攻擊疑慮的字眼通通排除，也就是限制使用者，有某些字詞禁止輸入，譬如範例中的open語法，就可提升安全性了嗎？請見「[二部曲－最淺白的RCE攻擊，黑名單防禦大法](/article?a=9)」。

(參考資料：[splitline](https://github.com/splitline/py-sandbox-escape)課程講義)
