# Python幫你自動化Google 自然語言分析 ，NLP套件大解密— part2

> 好奇顧客在網上怎麼說你嗎？Google NLP告訴你！

## 前情提要
在[「Python幫你自動化Google 自然語言分析，NLP申請詳細圖文解說 — part1」]()文章中，手把手帶領您申請屬於自己的GCP平台，並取得NLP的憑證檔案。接下來我們將利用先前申請好的json憑證檔案，開始分析消費者在網路上的輿論。
![前篇文章所產生憑證](https://i.imgur.com/j5x5cKT.png)

## Google 情緒分析
在執行程式碼之前，必須要先安裝Google NLP的python套件，可以在終端機執行以下指令：
```python
pip install google-cloud-language
```
![以Anaconda Prompt執行為例](https://i.imgur.com/upHyhou.png)
若您是使用Anaconda來編寫Python，那就開啟Anaconda prompt，並輸入以上指令，mac系統或者linux系同的讀者，直接選擇terminal並輸入即可。切記！以上的指令都是「半形」符號，切勿使用到全形，或者多一個空白等等，都會造成執行失誤。
![安裝google套件畫面](https://i.imgur.com/nqPjOo0.png)

## Python自動化語意分析
![完整程式碼](https://i.imgur.com/V46eWGe.png)

本次範例以一篇網路文章為基礎分析文字的範例，展現分析結果。其中要注意，`os.environ[‘GOOGLE_APPLICATION_CREDENTIALS’]`必須要指定為自己剛剛下載下來的json檔案，並再次提醒，這個檔案千萬不能外流，若真的不慎外流，請立馬停用專案。
```python
text= '想與姊妹掏來個下午茶談天時光，應該不少人都會想到咖啡廳聚集地 — 捷運中山站，除了幾間著名大家耳熟能詳的咖啡'
#（因為過多，詳情請下載程式碼觀看，以下省略...）
```
在範例中，我將整個分析的程式碼，都包在emotion這個方法理面。motion中的參數是thetext，也就是想要進行情緒分析的句子、文章。
```python
def emotion(thetext):
     os.environ['GOOGLE_APPLICATION_CREDENTIALS'] ='你的憑證檔案名稱.json'
     # 實例化一個客戶端
     client = language.LanguageServiceClient()
     # 要分析的文本
     text = thetext
     document = types.Document(
                                 content=text,
                                 type=enums.Document.Type.PLAIN_TEXT)
     # 檢測文本的情緒
     sentiment = client.analyze_sentiment(document=document).document_sentiment
     return([sentiment.score, sentiment.magnitude])
 get =emotion(text)
```

請記得必須要將以下的憑證檔案，修改成您的憑證檔案名稱，否則程式會無法執行。
```python
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] ='你的憑證檔案名稱.json'
types.Document方法設定了NLP分析的必要參數content與type，分別是放置「分析目標文章」與「文章型態」，在這裡型態一般都設定為enums.Document.Type.PLAIN_TEXT，也就是普通的文字型態。

document = types.Document(
                 content=text,
                 type=enums.Document.Type.PLAIN_TEXT)
```

client.analyze_sentiment就是情緒分析的執行方法，所以切記，非必要這行程式碼不要一直重複執行，否則Google會照價計費，很快您的300美元額度就會燒光光了。
```python
sentiment = client.analyze_sentiment(document=document).document_sentiment
```

## 執行結果
產出的結果分為以下兩個：

> 📌sentiment.score：
> 情緒分數，這個分數會界在-1～1之間，越高代表越正向。

> 📌sentiment.magnitude：
> 情緒強度，假設sentiment.score分析的結果為-1，代表該消費者的留言為負面，若sentiment.magnitude還越大，那就代表消費者的留言越「激進」。

```python
return([sentiment.score, sentiment.magnitude])
```
![執行結果](https://i.imgur.com/975q6GY.png)
結果顯示了，這整個文章的評分為0.4，可以依照Google的評分表，是在一個為正評價的級距，這個結果也與這篇美食文章相符，文章中也沒有什麼暴雷的部分，都屬於正面評價。整體來看，Google NLP的準確度已經相當的高，這是我們一般人用類神經訓練不出來的模型（如果你夠有錢當然你也可以），因此NLP的收費其實也算是合理。
![Google情緒分析標準](https://i.imgur.com/9kCLbbd.png)

## 管理意涵
> 「前面一個顧客抱怨，後面20個客人流失」

想想您被品牌問卷、電訪、街訪，您有幾次認真的回答品牌，多半都是以打發心態完成問券，如同「知名餐飲集團的餐後問卷」一般，其實大部分顧客的不滿，是不會傳達到品牌端。

網路輿情可不一般，消費者會在網路上留言，多半是「忍無可忍」、「真的很誇張」，如果抱怨只是無病呻吟，也不會有多少網友附和，文章熱度自然不高，但如果下面有不少人回復「真的」、「有同感」、「+1」，這就是必須重視的問題。

> 嫌貨人，才是買貨人

> 不要討厭顧客抱怨，他在幫你優化品牌

作者的網路輿情分析經驗中，會發現網路上的負面評價會比較高；也就是說，假如您同時進行傳統市調與網路市調，網路市調的品牌滿意度都會偏低，而且「低很多」，尤其在特定論壇，如：PTT、Dcard等，滿意度通常不到5成，而且全市場的品牌都一樣。若這是普遍的現象，那您選擇想信哪邊呢？

## 還沒有完
難道您只想知道消費者對你正面評價，到底是甚麼讓他對你那麼滿意？將在下篇文章[「Python幫你自動化Google 自然語言分析 ，顧客在討論什麼？ — part3」]()中告訴您，如何利用NLP套件，找出消費者所討論的關鍵字。