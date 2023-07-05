# 蝦皮市場大小預估分析－K-means分群的實例應用
## 課程介紹
> [還沒看「產品開發大補帖－採購的好幫手，如何決定新商品SKU？」，還不快手刀點擊！](/classification/crawler_king/88)
在前篇文章「[「蝦皮爬蟲」最詳細手把手教學，商品資料＋留言評論](/classification/crawler_king/87)」當中已經取得了在蝦皮市場中，所有「花襯衫」產品的商品資料，這個市場有幾種消費類群呢？每個類群的市場總額是多少呢？哪裡會有市場缺口呢？![蝦皮商品頁的Tag](https://cdn-images-1.medium.com/max/1200/1*p8dInKTZx40n1VE3oZ5MNw.png)

你有發現嗎！蝦皮的每個商品為了增加被搜尋到的機率，會盡量地將剛商品的特色寫在「標題」或者「內文 Tag」當中，等於是<strong>賣家幫我們「把商品分類」了</strong>，而因為消費者保護法的關係，賣家也不能亂寫商品特色。因此我們進行市場分群的原理，便是依照賣家對每個商品的 Tag進行分類。

## 可交付成果
![市場分類結果](https://cdn-images-1.medium.com/max/1200/1*47m3f3l3TO93H5S3fHtiTw.png)
我們利用所有競爭廠商的銷售資料，依照競爭廠商給商品的 Tag，利用K-means 演算法將每個商品分類。由結果（上圖）可以看到，每個點代表一種商品，而不同艷色代表不同的類群。

分類完成後可以在產出每個類群的高頻率 Tag，因此若分類成10群，就會有10張 Tag頻率圖。（如下圖），在經過一番審視，不難發現第0群著重在「復古韓風」，身受文青系列喜愛。相反的第2群都是「海灘花襯衫」，兩者的客群可想而知！
![產出每個類群的高頻率 Tag](https://cdn-images-1.medium.com/max/1200/1*e0DrvH6gWbA4mRSzwxpzRw.png)

## 整理商品Tag
![整理商品Tag](https://cdn-images-1.medium.com/max/1200/1*PEUXVU9ZDntjOKVqG7fkKw.png)
在K-means分群前，必須要先將每個商品的 Tag資料整理出來。這裡比較特別的是，若 Tag的字數大於10個字我們不計入，其原因在於，許多時候商家會利用 Tag來打一些自己的名言、笑話、內心OS等等，這些根商品本身並無關係，因此予以排除。
```python
from tqdm import tqdm
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import pandas as pd
colors = ['#d9f776','#76f794','#9476f7','#f776d9','#e70e4b','#76d9f7','#f79476','#fbccbe','#befbcc','#fbbeed']
getdata = pd.read_csv('花襯衫_商品資料.csv', encoding='utf-8')
getdata.columns

#--- 若沒有tag，則從文章中整理出Tag
containar = []
for i in range(len(getdata)):
    getArticle = getdata['商品文案'][i] #抓取每篇文案
    
    getArticle = getArticle.replace('＃','#') # 半形全形一致
    item = []
    for j in getArticle.split('#'): # 利用「#」來做切割
        if len(j) &lt; 10 : # 若tag大於10個字則不計入
            j = j.replace(' ','') # 取代空白
            j = j.replace('^n','') # 取代^n
            if len(j) &gt;0 : # 要確認取代完成後還有剩下東西
                item.append(j)
    containar.append(item)

getdata['Tag'] = containar
```
## 資料整理
首先先將商品ID、價格、歷史銷售量、Tag這四個欄位提取出來，其實除了 Tag以外，剩下的欄位主要是做視覺化時所使用，因此只是要產出報告名單，則可以省略價格、歷史銷售量欄位。
```python
#--- 整理成可以被Kmean分析的資料
KmeansData = getdata[['商品ID','價格','歷史銷售量','Tag']]
```
![allpro變數](https://cdn-images-1.medium.com/max/1200/1*3twBVY-zJjS1-iNXLt1t8Q.png)

> 要如何計算使用率最高的Tag呢？
這個問題也困擾了我很久，其實運作的原理簡單。首先利用pandas 本身內建的sum() 方法，把所有商品的Tag 全部串接成一個List變數，並利用pd.DataFrame() 方法將List轉換成dataFrame 型態資料。
```python
allpro = KmeansData['Tag'].sum()
allpro = pd.DataFrame(allpro)
allpro.dropna(inplace=True)
```

將List轉換成dataFrame 型態資料的目的在這裡就顯現出來了。我們可以利用value_counts() 方法來過濾掉重複的Tag ，並且還會幫我們從出現次數最多的Tag 開始進行排序。接著利用np.where() 與contains() 方法，來計算每個商品是否有出現該Tag ，如此一來便大功告成了。
```python
KmeansData['Tag'] = KmeansData['Tag'].astype(str)
count=0
for i in tqdm(allpro[0].value_counts().index):
    KmeansData['c'+str(count)] = np.where(KmeansData['Tag'].str.contains(i),1,0)
    count = count+1
```
下圖是計算完成的結果。c0～c1228 代表的是有1228個Tag（其實更多），下方的資料0代表沒有在商品文案中出現該Tag，反之資料1代表有出現。您可能會很好奇為<strong>何要使用c0～c1228 進行命名，為何不直接將Tag 的內容當作標題Index？</strong>其原因在於方便之後的迴圈計算，並且等等的Kmeans 演算法中，也不能有中文出現，因此直接用統一的編碼相對的方便許多。
![計算完成的結果](https://cdn-images-1.medium.com/max/1200/1*r6u8efWR9yZRTYohJbe3Mg.png)

## K-means分群市場
將上個步驟的欄位全部餵入Kmeans演算法進行分類。
```python
#--- 開始分類
crub = 10 #總共要分成幾群
clf = KMeans(n_clusters=crub)
clf.fit(KmeansData[['c'+str(x) for x in range(count)]].values.tolist())#開始訓練

#--- 取得預測結果
getdata['類群'] = clf.labels_
```

## Kmean分類圖
![市場分類結果](https://cdn-images-1.medium.com/max/1200/1*47m3f3l3TO93H5S3fHtiTw.png)
結果（上圖）可以看到，每個點代表一種商品，而不同艷色代表不同的類群。由於繪圖的XY軸是價格與歷史銷量，而Kmeans的分類依據是依照Tag，因此會感覺此圖中並沒有甚麼規律，那我們可以接著下來看每個類群中是不是真的有一些特色，Kmeans演算法才將他們歸為一類。
```python
#--- Kmean分類圖
for i in range(crub):
    draw = getdata[getdata['類群']==i]
    print('第' + str(i) + '群數量：　' + str(len(draw)))
    plt.scatter(draw['價格'],draw['歷史銷售量'], 
                color=colors[i], 
                label = i,
                alpha=0.5)
plt.title("Kmean分類圖",fontsize=30)#標題
plt.xlabel("價格",fontsize=15)#y的標題
plt.ylabel("歷史銷售量",fontsize=15) #x的標題
plt.legend(bbox_to_anchor=(1.03, 0.8), loc=2) # 設置圖例
plt.grid(True) # grid 開啟
plt.tight_layout()
```
## 各群關鍵字Top 20
![產出每個類群的高頻率 Tag](https://cdn-images-1.medium.com/max/1200/1*e0DrvH6gWbA4mRSzwxpzRw.png)
特別的列出每個群體後就可以發現，第0群著重在「復古韓風」，身受文青系列喜愛。相反的第2群都是「海灘花襯衫」，因此這兩個群體有很顯著的客群。

> 會不會出現沒有特色的群體呢？絕對會！
原因在於市場大多數產品還是沒有做區隔化的，儘管市場區隔理論已經出來了半個世紀，但絕大多數的業主，都還是希望他們的商品能包山包海的迎合各層級消費者。

這個問題的處理方式，是將那些沒有特色的群體，全部歸類到「無名」群體之中，由於沒有特色，因此也沒有特別分析的必要性了。依照作者之前的經驗，在蝦皮中這樣的「無名」群體比例大約會佔市場的50～70% 之間，其實也是不少的數目。作者推斷應該是蝦皮市場本身各個商品單價都偏低，因此過路客較多，多數商店也不容易培育忠實顧客。
```python
#--- 各群tag top 20
for i in range(10)
    draw = getdata[getdata['類群']==i]
    draw = pd.DataFrame(draw['Tag'].sum())[0].value_counts()
    
    plt.bar(draw.index[0:20],
            draw[0:20].values, 
            color='#d9f776',
            alpha=0.5)
    plt.xticks(rotation=70)
    plt.title("第"+str(i)+"群tag的top20",fontsize=30)#標題
    plt.xlabel("tag名稱",fontsize=15)#y的標題
    plt.ylabel("數量",fontsize=15) #x的標題

    plt.tight_layout()
    plt.savefig("第"+str(i)+"群tag的top20.png", dpi=300) # 存檔且設定解析度
    plt.close()
```
## 計算市場總市值
最後也是最好玩的地方，原來市場總市值算起來那麼簡單！直接利用Pandas 套件挑出各個群體，將該群體所有商品的價格乘上銷售量，即可獲得該市場的總市值了！您有佔據市場的大餅嗎？
```python
#--- 各群的總市值
getdata['總收入'] = getdata['價格'] * getdata['歷史銷售量']
for i in range(10)
    draw = getdata[getdata['類群']==i]
    print('第'+str(i)+'群總收入： '+str(draw['總收入'].sum()))
```
### 總結
乍看之下，目前各個線上購物平台只剩蝦皮提供各商品的銷量，因此這套方法目前也僅適用於蝦皮。電商的市場瞬息萬變，許多新興的平台虎視眈眈想要奪下這塊大餅，而唯獨思考的方式是無法掠奪的，筆者將這套分析的思維給您帶著走！希望能幫助讀到最後的您。
