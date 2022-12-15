# 產品開發大補帖｜採購的好幫手，如何決定新商品SKU？
## 課程介紹
> ![還沒看過「Shopee爬蟲」？趕快手刀點選！]()
<strong>SKU（Stock Keeping Unit，單品項管理）</strong>是什麼呢？以服裝業舉一個例子，若您今天想要批一款外套來賣，因為資金有限，所以外套的顏色只有「黑、白、灰」三種大眾顏色。除此之外，外套的size 您只進「S、M、L」。若您的一個倉庫只放一種一模一樣的外套，總共要有幾個倉庫才能存放所有外套呢？<strong>答案是9個倉庫，因為3種顏色 X 3種size = 9。而這個外套的SKU就是9。</strong>

由上述可知，光一種外套就要準備9個倉庫來放存貨，而且顏色跟大小還如此單調，更何況增加顏色或size ，因此SKU最直接影響的就是「倉儲成本」，若是產品還是自己製造的，那也會影響「開模成本」，因此若您現在（或是之後）的公司賣的是實體產品，那 SKU 會是個非常重要的考量。

> 如果我要批外套來賣，成本有限的情況下，要選擇什麼顏色與Size？

在以往我們只能去問長輩、作問券、憑自己產業經驗的方式，來選擇外套的顏色與Size，其實這件事情可以用數據來解決！利用Shopee爬蟲可以爬下相同或類似之產品所有的SKU銷售量，整理出以下的表，有了這個表，我們是不是可以很輕易地知道進哪種顏色、size 銷量會最好！

## 可交付成果
![可交付成果－在市場上各個衣服尺寸與顏色的銷量](https://cdn-images-1.medium.com/max/1200/1*-9_QCHMdgqzgN8_SYjs0RA.png)
在前篇文章「[「蝦皮爬蟲」最詳細手把手教學，商品資料＋留言評論]()」當中以「 花襯衫」這個商品為例子，將接續爬下來的資料進行分析。本文章統整所有蝦皮市場上「 花襯衫」在不同<strong>尺寸</strong>、<strong>顏色</strong>中的銷量，若您是一個正想切入這個市場的廠商，正在苦惱商品的SKU，這個表格能夠很明顯給您市場最高銷量的尺寸與顏色，初入市場進這個型號準沒錯！

## 程式碼分析講解
### 匯入檔案
利用 pandas的 read_csv()方法來匯入文章「[「蝦皮爬蟲」最詳細手把手教學，商品資料＋留言評論]()」中所爬下來的檔案。
```python
import pandas as pd

#--- 匯入資料
comment_data = pd.read_csv('花襯衫_留言資料.csv')
# 查看資料欄位
comment_data.columns
```

![花襯衫_留言資料.csv](https://cdn-images-1.medium.com/max/1200/1*Ujgj5otukfL3-XG3hCBiFw.png)

### 定義字詞
在分析每個商品銷量時，會發現一個問題－每個商家的尺寸顏色定義不同！舉例來說「2XL」與「XXL」其實指的是同一個衣服 Size，但程式並不是那麼聰明，會把它當成兩種不同的 Size，因此需要先使用 replace()方法將所有的尺寸、顏色進行統一。
```python
#先取代同意詞語
#先取代全形字母
comment_data['商品規格'] = comment_data['商品規格'].str.replace('Ｓ','S')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('Ｍ','M')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('Ｌ','L')

#從最大的開始取代（大尺碼）
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXXXXXXL','8@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('8XL','8@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXXXXXL','7@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('7XL','7@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXXXXL','6@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('6XL','6@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXXXL','5@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('5XL','5@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXXL','4@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('4XL','4@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXXL','3@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('3XL','3@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXL','2@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('2XL','2@')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XL','1@')
#從最小的開始取代（小尺碼）
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XXS','3~')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('3XS','3~')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('XS','2~')

#取代特殊顏色
comment_data['商品規格'] = comment_data['商品規格'].str.replace('深灰','1#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('熒光綠','2#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('軍綠色','3#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('酒紅','4#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('深藍','5#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('墨綠','6#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('粉橘','7#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('紫粉','8#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('棗紅','9#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('寶藍','10#')
comment_data['商品規格'] = comment_data['商品規格'].str.replace('卡其','11#')

comment_data['商品規格'] = comment_data['商品規格'].str.replace('桃紅','桃')
```

您可能會很好奇，為何要將「XXXL」取代成「3@」，反而不取代成「3XL」反而更好閱讀？其原因在於若取代成「3XL」以後，等等若有取代到「XL」這個 Size的時候，「3XL」也會受到影響，因此盡量用一個「不太會出現」的字元來取代。


### 計算各尺寸顏色的銷量
利用雙重的 for迴圈，檢查比消費資料中的商品尺寸與顏色，利用 contains()方法來檢查個欄位是否同時有該尺寸與顏色的關鍵字出現。這個檢查方法可能會遺漏掉許多「顏色」，因為在範例程式碼中只有28種顏色，當然世界上的衣服顏色一定遠超這個數量，但我們只能盡人工最大的能力列出所有較高頻率出現的顏色，以提供採購作參考。
```python
color = ['黑','白','灰','綠','粉色','膚','橘','藍','紫色','咖啡色','焦糖','桃','紅'
         ,'黃','藏青','杏','1#','2#','3#','4#','5#','6#','7#','8#','9#','10#','11#']
size = ['8@','7@','6@','5@','4@','3@','2@','1@','L','M','S','2~','3~']
#--- 創造市場SKU統計表
counter=[]
for c in color:
    container=[]
    for s in size:
        container.append(
            len(allpro[ allpro[0].str.contains(c) &amp;
                        allpro[0].str.contains(s)
                       ])
            )
    counter.append(container)
    
# 產品開發大補帖完成
buyer = pd.DataFrame(counter)
buyer.columns = ['8XL','7XL','6XL','5XL','4XL','3XL','2XL','1XL','L','M','S','2XS','3XS']
buyer.index = ['黑','白','灰','綠','粉色','膚','橘','藍','紫色','咖啡色',
               '焦糖','桃','紅' ,'黃','藏青','杏','深灰','熒光綠','軍綠色',
               '酒紅', '深藍','墨綠','粉橘','紫粉','棗紅','寶藍', '卡其']
```
### 結果觀察
![分析結果](https://cdn-images-1.medium.com/max/1200/1*-9_QCHMdgqzgN8_SYjs0RA.png)
現在我們就以服飾品牌老闆的角度，來思考該如何進貨。尺寸的部分，很明顯地集中在 S~5XL，若是資金流有限可以進貨 S~3XL即可。另外顏色的部分，主要的幾個銷量包含黑、白、灰、綠、藍、紅、黃、藏、青，比較令作者意外的是藍色，在印象中藍色花襯衫作者自己是不常看到，但從這個分析銷量中可以發現，卻是花襯衫主要銷量之一。