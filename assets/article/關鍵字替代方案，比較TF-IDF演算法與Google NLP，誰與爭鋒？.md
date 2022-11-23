# 關鍵字替代方案，比較TF-IDF演算法與Google NLP，誰與爭鋒？

> 最Free的關鍵字分析

前篇文章「Python幫你自動化Google 自然語言分析 ，顧客在討論什麼？ — part3」獲得廣大迴響，許多朋友讀完文章後，產生一個疑問：「我們利用Google NLP分析文章的關鍵字，雖然結果令人滿意，但還是要支付一筆可觀的費用，有沒有便宜又大碗的關鍵字分析呢？」

## TF-IDF演算法
一般找出關鍵字最值觀的方式，就是直接計算這個詞「出現幾次」，出現越多次的，照理來說那個字詞就會越重要，但實際執行後，Top 10的字詞永遠都是「的」、「你」、「我」、「他」、「哈哈哈」，這些高頻率出現，但卻沒有任何分析幫助。TF-IDF演算法專門解決這種問題。
![文章適意圖](https://i.imgur.com/FVWl7Jc.png)

簡單來說，某一個「我」雖然高頻率出現在A文章中，重要分數會提高，但若發現在其他篇文章B、C等，也都高頻率出現「我」，那「我」的重要分數反而會被降低；相對的景點、露營區這幾個關鍵字重要度就增加了，這就是TF-IDF演算法的運作原理。

## Python實作
在執行程式碼之前，必須要先安裝Jieba切詞套件，可以在終端機執行以下指令：
```
pip install jieba
```
![利用Anaconda Prompt執行指令畫面](https://i.imgur.com/gb5wjuD.png)
```python
i=0
while i<10:
    print('詞語型態: ' + enums.Entity.Type(entity.type).name)
    i=i+1
import jieba.analyse
keywords1=jieba.analyse.extract_tags(text)
```
為何要有替代方案呢？如果有用過Google NLP的讀者都知道，這個服務並不便宜，詳情請查看NLP定價。這個服務固然好用，但索價過高，其實有些演算法可以解決這樣的問題，利用TFIDF這個演算法，可以找到文章中的關鍵字，並一樣依照重要程度給分。
![每個關鍵字的分析與給分](https://i.imgur.com/c2amCih.png)
從結果中可以比較，同樣都有出現關鍵字咖啡、中山站，而在Google NLP中分析的關鍵字「獨有風格」，也與TFIDF中的「風格」相似，整體看來Google NLP的切詞結結果比較人性化，也比較符合貼標籤的要求，但把價格因素也考慮進去的話，TFIDF也是個不錯的選擇。

















