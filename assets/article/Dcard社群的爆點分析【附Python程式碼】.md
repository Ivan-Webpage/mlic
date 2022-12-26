# Dcard社群的爆點分析【附Python程式碼】
> 天下武功，為快不破，行銷亦如此

在台灣3、40歲的朋友們，可能還是比較習慣使用PTT，只有少數的8年級生有使用PTT的習慣與經驗。在西元2000年後的世代，大多都使用Dcard來取大PTT，其原因不外乎設計親民、注重隱私、校園訊息更新地等。

## 可交付成果
![Dcard社群的爆點分析－可交付成果](https://i.imgur.com/IGjcuo9.png)
我們在前篇文章「[Dcard爬蟲－留言蒐集](/classification/crawler_king/99)」與「[Dcard爬蟲－文章資料](/classification/crawler_king/98)」當中，已經取得Dcard版中的各個文章與留言。本篇文章將解析如何使用我們在Dcard版中爬下來的文章與留言，利用Python 視覺化的方式，呈現出每個文章主題與時間的關係，一眼便能看出短時間內瘋狂竄升的文章主題或關鍵字。
## 匯入資料
首先，需要匯入先前爬下來的文章資料與留言資料，並且準備多個色碼，為之後視覺畫作準備。
```python
import datetime
import matplotlib.pyplot as plt
import pandas as pd
# 色碼表
colors = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
          '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
          '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
          '#607D8B', '#212121']
# 資料來自talk版
dcard_article = pd.read_csv('Dcard文章資料.csv')
dcard_comment = pd.read_csv('Dcard留言資料.csv')
dcard_article.columns
dcard_comment.columns
```

## 先行填滿空值 fillna()
在進行資料分析前，都需要先將資料作完整的清理，其中空值是率先要做處理的。本文章使用Pandas 套件中的fillna()方法來將所有的空值給填滿。
```python
#--- 先行填滿空值
dcard_article['標題'] = dcard_article['標題'].fillna('')
dcard_article['內文簡介'] = dcard_article['內文簡介'].fillna('')
dcard_article['主題標籤'] = dcard_article['主題標籤'].fillna('')
dcard_comment['留言內容'] = dcard_comment['留言內容'].fillna('')
```
## 時間轉換 to_datetime()
時間為本研究的重要參數之一，因此時間需要詳細處理，因為我們要找的一個主題或關鍵字的爆點，可能是在幾個小時內發生的，因此若定義一個關鍵字的時間點稍晚了，可能就會無法發現這個關鍵字。因此我們在文章與留言的關鍵字中，選擇最早的那個時間，作為這個關鍵字的「起頭」。
```python
# 時間轉換
dcard_article['發文時間'] = pd.to_datetime(dcard_article['發文時間'])
dcard_comment['發文時間'] = pd.to_datetime(dcard_comment['發文時間'])

if dcard_article['發文時間'].min() < dcard_comment['發文時間'].min():
    firsttime = dcard_article['發文時間'].min()
else:
    firsttime = dcard_comment['發文時間'].min()
```
## 資料內容轉換 eval()
Dcard 文章中有許多Tag，但在經過爬蟲下來後，這些List型態的Tag都會變成字串的型態，因此本文章利用eval()與apply()方法，將所有的字串型態資料，轉換成該資料「原有的」型態。
```python
def evaluation(thestr):
    return eval(thestr)  # 轉換str中的內容真正型態


dcard_article['主題標籤'] = dcard_article['主題標籤'].apply(
    evaluation)  # 將dataframe的資料內容套入方法
alltag = dcard_article['主題標籤'].sum()  # 將所有tag串再一起
alltag = pd.DataFrame(alltag)
alltag.dropna(inplace=True)  # 刪除空值
alltag.drop_duplicates(0, inplace=True)
```
## 計算主題
利用while 迴圈，計算每個關鍵字的發文量，與其對應的時間。在計算中，為了方便統計，每篇文章都可以將所有的標題、內文、留言全部串在一起，以便於利用Pandas 套件的count() 方法來進行計算。
```python
thetime = []
remember = []
doit = True
while doit:
    firsttime = firsttime + datetime.timedelta(hours=1)
    print(firsttime)

    getdata_article = dcard_article[dcard_article['發文時間'] < firsttime]
    getdata_comment = dcard_comment[dcard_comment['發文時間'] < firsttime]
    if len(getdata_article) == len(dcard_article) and len(getdata_comment) == len(getdata_comment):
        doit = False

    else:
        thetime.append(firsttime)
        allstr = getdata_article['標題'].sum() + getdata_article['內文簡介'].sum(
        ) + getdata_article['主題標籤'].astype(str).sum() + getdata_comment['留言內容'].sum()
        temp = []
        for i in alltag[0]:
            temp.append(allstr.count(i))
        remember.append(temp)

timeflow = pd.DataFrame(remember)
timeflow.columns = alltag[0]
```

## 視覺化呈現
最後將所有的熱門主題顯示出來，因為主題過多會造成難以判讀，因此我們只顯示前20名。
```python
count = 0
for i in timeflow.columns:
    plt.plot(thetime, timeflow[i],
             color=colors[count % 20],
             linewidth=5,
             alpha=0.3)
    if timeflow[i].iloc[-1] > 20:
        plt.text(thetime[-1], timeflow[i].iloc[-1], i, fontsize=10)  # 加上文字註解
    count = count + 1
plt.title("爆點分析", fontsize=30)  # 標題
plt.ylabel('主題出現次數', fontsize=20)  # y的標題
plt.xlabel('時間軸', fontsize=20)  # x的標題
plt.tight_layout()
plt.show()
```
