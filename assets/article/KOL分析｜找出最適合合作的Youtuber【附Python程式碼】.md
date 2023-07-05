# KOL分析｜找出最適合合作的Youtuber【附Python程式碼】

> 在看此篇之前，要先看前面課程喔：[Youtube爬蟲－頻道資料｜Youtuber網紅時代不可或缺的Python技能【附程式碼】](/classification/crawler_king/81)

## 可交付成果
![KOL分析－四象限分析](https://cdn-images-1.medium.com/max/1200/1*VxlJwnk7osm2iF-vwMpJ8Q.png)
利用每個Youtuber的總訂閱數，與總觀看數（中間虛線為平均值），可以區分出以下四塊：
* 總訂閱高總觀看高：代表絕對的流量，但跟這類的Youtuber合作金額肯定很高。
* 總訂閱高總觀看低：多人訂閱但相對觀看者卻相對沒有那麼多，粉絲具有一定的忠實性。
* 總訂閱低總觀看高：訂閱數不多卻有大量觀看者，可能在某幾支影片有接觸到熱門議題。
* 總訂閱低總觀看低：Youtuber相較於其他同類來說都是偏低的，所創造的流量可能也比較少，但價格便宜。

由以上四個區域，假設您是正在尋找Youtuber合作的品牌，您會選擇哪個區域的Youtuber呢？很多人可能會直觀性的選擇<strong>總訂閱高總觀看高</strong>，但這樣合作費用肯定不斐，可以試試看朝向<strong>總訂閱低總觀看高</strong>的Youtuber進行洽談，一方面通常報價會與訂閱數成正比，因此訂閱較低相對報價較便宜。另一方面觀看總數代表該Youtuber在不同層面的觸擊效果較強，較能夠打到非同溫層的觀眾。

![KOL分析－正比分析](https://cdn-images-1.medium.com/max/1200/1*840uH7pjk3BGNqm4HVZnpA.png)
同樣的XY軸，換成45度線的方式，可以有以下幾種解析：
* 5度線上方：觀看總數超過訂閱數太多，需要增強觀眾訂閱慾望。
* 剛好位於45度線：非常完美的平衡，可依照自己品牌取向，選擇要先增加訂閱或者觀看數。
* 45度線下方：訂閱數超過觀看數，需要探討訂閱者不觀看的問題。

若您本身是經營Youtuber，利用45度線成長分析能夠快速且數據化的決定品牌的目標方向，一個健康的位置應該要位於45度線上，代表訂閱數量與觀看數量都是呈正比的，若失衡的話則代表觀眾不願訂閱或者訂閱者不觀看，對於Youtube頻道品牌端來說都不是好事情。

## 資料匯入與整理
在繪圖前最主要的工作就是資料處理。在這次的教學中，處理算是相對單純的，只需要將時間進行換算，並且將總觀看數與總訂閱數的單位調整好即可。
```python
# 取得資料
getdata = pd.read_csv('Youtuber_頻道資料.csv', encoding = 'utf-8-sig')
getdata.columns
# 處理經營時間欄位
getdata['開始經營時間'] = pd.to_datetime(getdata['開始經營時間'])
getdata['經營天數'] = (today - getdata['開始經營時間']).astype(str)
getdata['經營天數'] = getdata['經營天數'].str.replace('days.*', #想取代的東西
                                                    '', #取代成的東西
                                                    regex = True)
getdata['經營天數'] = getdata['經營天數'].astype(int)
# 處理總觀看數欄位
getdata['總觀看數'] = getdata['總觀看數']/10000
# 處理總訂閱數欄位
getdata['總訂閱數'] = getdata['總訂閱數'].str.replace('萬', #想取代的東西
                                                    '', #取代成的東西
                                                    )
getdata['總訂閱數'] = getdata['總訂閱數'].astype(float)
```

## 畫圖－四象限分析圖
由於我們想要呈現的四象限分析要用顏色做為區隔，以方便閱讀，因此每個Youtuber再分類後都要設定不同的顏色，因此繪圖時需要使用for 迴圈，每個Youtuber進去設定顏色。
```python
#進行資料分析－四象限分析
plt.figure(figsize=(20,10))
colorlist = []
for tx,ty,ab in zip(getdata['總訂閱數'],getdata['總觀看數'], getdata['Youtuber頻道名稱']):
    Aavg = getdata['總訂閱數'].mean()
    Bavg = getdata['總觀看數'].mean()
    
    if (tx &lt; Aavg) &amp; (ty &lt; Bavg):#第三象限
        colorlist.append('#abc4d8')
    elif (tx &gt; Aavg) &amp; (ty &lt; Bavg):
        colorlist.append('#abd8bf')
    elif (tx &lt; Aavg) &amp; (ty &gt; Bavg):
        colorlist.append('#d8bfab')
    else:
        colorlist.append('#d8abc4')
    plt.text(tx,ty,ab, fontsize=15)# 加上文字註解
# 繪製圓點
plt.scatter(getdata['總訂閱數'],getdata['總觀看數'],
            color= colorlist,
            s=getdata['經營天數'],
            alpha=0.5)
plt.axvline(getdata['總訂閱數'].mean(), color='c', linestyle='dashed', linewidth=1) # 繪製平均線    
plt.axhline(getdata['總觀看數'].mean(), color='c', linestyle='dashed', linewidth=1) # 繪製平均線
plt.title("KOL分析",fontsize=30)#標題
plt.ylabel('總觀看數',fontsize=20)#y的標題
plt.xlabel('總訂閱數',fontsize=20) #x的標題
plt.tight_layout()
```

## 畫圖－正比分析圖

與四象限分析圖唯一不同的是，正比分析圖將XY的平均線，換成45度線，因此其餘的程式碼都是一樣的。
```python
#進行資料分析－正比分析
plt.figure(figsize=(20,10))
colorlist = []
for tx,ty,ab in zip(getdata['總訂閱數'],getdata['總觀看數'], getdata['Youtuber頻道名稱']):
    Aavg = getdata['總訂閱數'].mean()
    Bavg = getdata['總觀看數'].mean()
    
    if (tx &lt; Aavg) &amp; (ty &lt; Bavg):#第三象限
        colorlist.append('#abc4d8')
    elif (tx &gt; Aavg) &amp; (ty &lt; Bavg):
        colorlist.append('#abd8bf')
    elif (tx &lt; Aavg) &amp; (ty &gt; Bavg):
        colorlist.append('#d8bfab')
    else:
        colorlist.append('#d8abc4')
    plt.text(tx,ty,ab, fontsize=15)# 加上文字註解
# 繪製圓點
plt.scatter(getdata['總訂閱數'],getdata['總觀看數'],
            color= colorlist,
            s=getdata['經營天數'],
            alpha=0.5)
plt.plot([0, 400], [0, 80000] ,
         color='c', 
         linestyle='dashed', 
         linewidth=1
    )
plt.title("KOL分析",fontsize=30)#標題
plt.ylabel('總觀看數',fontsize=20)#y的標題
plt.xlabel('總訂閱數',fontsize=20) #x的標題
plt.tight_layout()
```
