# PTT爬蟲｜爬下全台最大電子布告欄
PTT是台灣少數沒有利益團體介入（理論上）的社群平台，而內容多以文字呈現，因此各品牌業主可以在PTT中找到不少與自己品牌有關的消費者討論，本文章將帶領您爬下您指定的PTT版內容，可以指定要爬的「版」、「頁數」，並且從最新的文章開始爬取。

爬蟲的可交付結果如下列所示，總共個欄位：
* 文章編碼
* 作者
* 版名
* 分類
* 標題
* 內文
* 日期
* IP位置
* 總留言數
* 噓
* 推
* 中立
* 文章分數（正-負）
* 所有留言
    
我已經將PPT爬蟲的功能打包成 Ivan_ptt.py 這個檔案，因此程式碼的教學都會圍繞著如何使用這裏面的方法 crawl_ptt_page 。 crawl_ptt_page 總共有以下兩個參數：
> * Board_Name：想爬的板名稱（英文）。
> * page_num：想要爬幾頁的內容（從最新的開始爬）。
在範例中爬取PTT的八卦版，而八卦版的板名為「Gossiping」，然後從最新的頁數爬一頁。
```python
# 使用範例
gossip = crawl_ptt_page(Board_Name ='Gossiping' ,page_num= 1)
```
當我們實際在蒐集消費者資訊的時候，關於您的品牌留言可能會散布在各個版中，因此想要爬取多個版的話，就必須使用pandas套件中的 concat來進行資料合併的動作，以利之後的資料分析。如果還不知道文字資料如何分析的話，可以參考「[Python幫你自動化Google 自然語言分析 ，顧客在討論什麼？ — part3](/classification/marketing/4)」文章，裡面有詳細的解析與分享！或者是直接看看「[消費者關鍵字分析](/classification/marketing/24)」課程的實戰案例吧！

```python
# 爬蟲實戰情況
broad = ['folklore','womentalk','boy-girl','Urban_Plan','Gossiping','Nantou','TaichungBun']
containar = pd.DataFrame() # 先準備一個空的容器
for i in broad:
    Elephants = crawl_ptt_page(Board_Name =i ,page_num= 50)
    containar =pd.concat([containar,Elephants],axis=0) # 把新的結果存進容器
```
