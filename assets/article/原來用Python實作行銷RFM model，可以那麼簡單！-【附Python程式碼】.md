# 原來用Python實作行銷RFM model，可以那麼簡單！-【附Python程式碼】

先前的文章[「常貴客？新客？ 讓RFM模型簡簡單單解釋一切！（附實現程式碼）」]()，得到廣大的回響，甚至受到許多公司的參考及採用，非常謝謝您的肯定。

而在RFM Model的課程中，有學員提到，公司也想導入RFM，並且要以Python進行編寫，因為上述文章是以R語言為基礎，而目前市面上並沒有以Python實作RFM的程式碼，因此本文以Python為主要語言進行RFM實作。在開始程式編即之前，就讓我們來解析資料內容。
![利用python實作出RFM model](https://i.imgur.com/4DHLKqN.png)

## 資料欄位
> RFM存在至今已過半百，為何大家仍想要引進呢？

因為RFM只需要基本的銷售資料，就能做出強大的顧客分群，等同於市場區隔（Segmentation），且邏輯清晰明瞭。一般的CRM資料一定有有購買者ID、銷售ID、購買時間、購買金額，這麼少的欄位若要進行機器學習其實誤差值是非常大的，這時候RFM就派上用場了，因此本按例就預設以最少的資料欄位進行分析。

以下資料為單一顧客的購買數據，是一般銷售數據經過整理後所得的，欄位recency、frequency、recency_cate、frequency_cate是利用orderdate計算出來的，引此嚴格來說這筆資料只有三個欄位，竟然就能做出RFM！
1. clientId：顧客編號。
2. orderdate：顧客最後一次來購買的日期
3. recency（近因）：上一次購買與今天相差天數。
4. gender：性別。人口變數資料，有的話更能細部分析顧客類群。
5. frequency（頻率）：從顧客第一次來開始，到目前共來過幾次。
6. recency_cate：近因天數。
7. frequency_cate：頻率天數。
8. 購買量：該顧客的總購買量。
![資料欄位內容](https://i.imgur.com/xhkDMWM.png)

## 用Python實作RFM
基於以上的基礎，並以FacetGrid的特性，開發出6 X 6的RFM Model。最主要的兩個欄位是recency_cate與frequency_cate，分別控制資料在RFM圖形中的位置，因此只要資料調整到定位，可以簡單利用FacetGrid產出圖片。

比較需要注意的地方在於row_order的參數是給予frequency_label[::-1]，這意思是將陣列frequency_label相反輸出，其原因在於FacetGrid的圖形排列是由左上角開始排列的，對應到frequency的「>5 freq」，因此必須將整個鎮列倒著放。
```python
recency_label =  ['0-7 day', '8-15 day', '16-22 day', '23-30 day', '31-55 day', '>55 day']
frequency_label =  ['1 freq', '2 freq', '3 freq', '4 freq', '5 freq', '>5 freq']
g = sns.FacetGrid(purchase_list, # 來源資料表
                  col="recency_cate", # X資料來源欄位
                  row="frequency_cate" ,  # Y資料來源欄位
                  col_order=  recency_label,  # X資料順序
                  row_order= frequency_label[::-1], # Y資料順序
                  margin_titles=True
                  )#小圖表部分
```
小圖示中是以gender（性別）來作為分類，此能依照您不同的資料欄位調整，但建議該欄位的項目不要太多，否則會造成視覺的凌亂，反而失去了RFM Model一目瞭然的意義。

在此範例中只有gender是人口變數，若您的資料有更多相關變數（例如：地址、學歷、家庭等），RFM的分析將會更有意思。
```python
g = g.map_dataframe(sns.barplot, # 資料顯示的模式
                    x= 'gender', # 小圖表X資料來源
                    y ='購買量', # 小圖表Y資料來源
                    palette = sns.color_palette("muted")) #畫布色調 
g = g.set_axis_labels('光顧天數','購買頻率').add_legend()
```
![產出的結果](https://i.imgur.com/D4vxLFj.png)

## 這個RFM還是美中不足：
相信您實作完也感覺到，這個圖形用來自己分析還可以，若要報告給主管或老闆聽，絕對是不合格的，如以下幾點：
* 無法看出顧客分類：無法一目瞭然的找出常貴客、量販客、先前客、一次客。
* XY軸的標籤：重複「光顧天數」、「購買頻率」，最完美的展現方式是只有一個，並且置中表示。
* 小圖示XY軸標籤：顯示「0-7天」或者「1 freq」的標籤，人們視覺上是習慣放在左方與下方，這正好與我們的習慣相反了。
* 小圖示調整：小圖示內的棒狀圖無法做調整，譬如想要調整刻度。

那您可以看看[RFM顧客分類模型實戰教學【附Python程式碼】]()能幫您解決一些問題喔！






