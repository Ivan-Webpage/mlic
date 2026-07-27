# 怎麼知道股票買貴了？用EPS挑選全台合理股票–適用長期穩定投資、定存族【附Python程式碼】
隨著美國聯準會生息，景氣慢慢冷卻，而股票市場也是慘不忍睹，但從我的角度來看，這些股票只是回到「正常」的價格而已。~~我知道虧錢心理很不好受，但還是先放下您手中的西瓜刀，聽我娓娓道來。~~
> 如果一支二手還能用的iphone手機，我賣你10萬你買嗎？肯定不會買。

> 那如果一支二手能用的iphone手機，賣你10元你買嗎？買！肯定買。

連是iphone第幾代都還不知道就可以做決定，這之間的差別是什麼？是在於我們心理對於iphone本來就有一個定義的價格區間在了，那股票呢？其實也是有辦法衡量的。
## 可交付成果
![列出目前符合條件之股票](https://i.imgur.com/6L1IBeV.png)
除了告訴您計算合理股價的公式外，還會現學現賣！用教您的公式，將台灣所有的股票，利用Python挑選出來「目前價格合理的股票」，理論與實戰的學習一次滿足！

> 警告：本文章內容僅作為程式分享與範例，並非投資建議，基於文章之任何交易或投資決定，使用者須自負風險及盈虧，本文章與程式亦不負任何責任


## 合理股價公式
衡量股票價格的方式有很多種，每個經融機構都會有這樣的估價團隊，但畢竟我們不是靠這個吃飯的，也沒有那麼多時間進行搜集資料與運算，因此大多數的人都選用最簡單快速的方式來衡量：每股盈餘EPS。
> 合理股價 = 平均每股盈餘(EPS) x 10

我們在做投資前一定要對我們的策略非常的了解，因此接下來我會對這個公式裡面兩個重要的參數做詳細的解釋，您也可以理解後再調整成自己的投資策略:
1. 每股盈餘(EPS）:
簡單來說就是每一張股票可以分到多少的股利，假設是1代表說每買1張股票，可以分到1000塊的股利。注意！在公式中是以平均每股盈餘來計算，通常我至少會以五年的平均來作為參考。

2. 10:
這個數字其實是一個倍數，因此每個人對於這個倍數的設定會不一樣，一般來說8~15倍都是有的。

### 為什麼每股盈餘要乘以10倍？
假設某一檔股票它的近五年每股盈餘都是2，代表說你如果買他一張股票，那你每一年都會賺2000塊的股利。如果當初妳買這隻股票的時候是20塊錢(2萬台幣)，那代表說這隻股票你只要穩定的放十年，你就會回本。

聽到這邊你可能就會理解，為什麼我前面會說每個人對於這個數字的設定會不一樣。例如有一些是國家的產業(ex:台積電)或者是國營企業(ex:中華電)，那這個倍數可能會在更大一點，因為這種企業通常不太可能會倒，所以投資人願意放更長的時間。

### 為何每股盈餘一定要平均？
由前面的倍數可以知道，我們這個投資可能是會長期的方式來進行評估，所以就算這間公司只有某一年發的股息特別的多，後面幾年都沒有發股息，這樣也會導致於我們無法賺回來本錢。

由此可知另一方面，若該公司每年的盈餘分配很穩定，最近卻不好，則需要排查最近甚麼原因造成該公司盈餘分配下降，若評估並不是長期性的，那可忽略不計。

## 合理股價選股實作
本次的實作將會依循上面的理論來挑選股票，在這個實作中最主要需要兩個外部參數：
1. 歷年平均EPS
2. 當前股價

當前股價的部分是最容易解決的，我們在「[高速取得全台股價資訊，馬上用黃金交叉練習看看【附Python程式碼】](/classification/financial/115)」這篇文章中，有教各位如何使用pandas_datareader這個套件輕鬆拉下多支股票的股價。那EPS要怎麼辦呢？

![撿股讚網站所提供的EPS](https://i.imgur.com/QuwKIIa.png)
還好作者找到一個歷年EPS列表網站「[撿股讚](https://stock.wespai.com)」，裡面已經幫我們算好全台灣所有上市櫃公司的歷年EPS。更棒的是！這些資訊全部集中在同一個業面，因此我們可以利用之前學過的爬蟲來抓取。

> **還沒學過爬蟲？先看這裡**
> [Html爬蟲Get教學－抓下Yahoo股票資訊，程式交易的第一步](/classification/crawler_king/59)
> [Pandas爬蟲教學－Yahoo股市爬蟲｜不想再盯盤](/classification/crawler_king/66)


### 取得歷年平均每股盈餘EPS
![成功取得歷年平均每股盈餘EPS的畫面](https://i.imgur.com/QU4zKNP.png)

第一步，我們就先將[撿股讚](https://stock.wespai.com)中的EPS資料給爬下來，先完成選股條件中最重要的參數。爬蟲的部分，由於pandas的套件無法直接讀取到網站的table標籤，因此先用requests套件將整個網頁原始碼請求下來，再利用pandas的read_html()方法進行解析，直接將網頁的表格轉換成python的DataFrame格式。
```python
import datetime
import requests
import pandas as pd
import numpy as np
from pandas_datareader import data
# 需要用此套建載入yahoo的API，否則無法取得資訊
import yfinance as yf
yf.pdr_override()

#--- 取得歷年平均每股盈餘EPS
head = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
}

list_req = requests.get('https://stock.wespai.com/p/7733', headers=head)
tables = pd.read_html(
    list_req.content, 
    attrs = {"class":"display"},
    encoding = 'utf-8'
    )[0]
tables['代號'] = tables['代號'].astype('str')
```

### 取得最近的股價
剛剛取得EPS的表格中，有個「代號」的欄位，記錄著全台灣所有上市櫃公司的股票代號，因此我們也不需要在自己手打，可以直接利用pandas_datareader套件抓取這些代號的股票。這時又遇到另一個問題：
> pandas_datareader套件需要著名「上市(TW)」或「上櫃(TWO)」，這些股票代號要怎麼分類註記呢？

![抓到是空值代表他是上櫃的股票](https://i.imgur.com/ki6Pil8.png)
作者這裡選用一個粗暴的方式，直接全部加上「上市(TW)」丟進去pandas_datareader套件抓抓看，如果沒有抓到資料，再改成使用「上櫃(TWO)」來抓。因此一開始先全部當作是「上市(TW)」的股票，開始請求股價，Python程式碼如下：
```python
# 設定股號代碼，先試試看上市
all_stock = tables['代號'] + '.TW'
all_stock = all_stock.tolist()
# 先設定要爬的時間
start = datetime.datetime.now() - datetime.timedelta(days=3) 
end = datetime.datetime.now()
# 取得全台灣所有的股票，每天的交易資訊
df_stock = data.get_data_yahoo(all_stock, start, end)
```

在請求結束後，利用pandas的fillna()方法，將所有的空值都改成-1，這樣也方便直接挑選資料，而被改為-1的股票就是抓不到股價的「上櫃(TWO)」股票。這時就可以利用numpy的where()方法，將-1與非-1的股票分開來，並建立「種類」這個欄位，紀錄該股票的類型是上市還是上櫃。
```python
# 只抓今天的價格
todayPrice = pd.DataFrame(df_stock['Close'].iloc[-1])
todayPrice.columns = ['最近價格']
# 挑初沒抓到股價的，用上櫃在抓一次
todayPrice['最近價格'] = todayPrice['最近價格'].fillna(-1)

todayPrice['種類'] = np.where(todayPrice['最近價格'] >= 0, 'TW', 'TWO')
```

接著將資料的index儲存成一個欄位，刪除尾巴舊有的股票種類，重新接上我們剛分類完成的欄位「種類」，這整個股票的名單就完成了！
```python
todayPrice['代號'] = todayPrice.index
todayPrice['代號'] = todayPrice['代號'].str.replace('.TW','')
todayPrice['代號'] = todayPrice['代號'] + '.' + todayPrice['種類']
```

最後只需要將我們整理好的股票名單丟進去pandas_datareader套件，即可請求名單中所有股票的股價。值得一提的是，我們雖然說只需要抓取一天的股價就好，因為我們要的是該股票的「現在價格」，但可能會碰到假日休市的情況，導致於您在執行程式碼的時候都拉不到資料，因此這裡才會設定爬取前三天的資料。
```python
# 在抓一次
all_stock = todayPrice['代號'].tolist()
# 取得全台灣所有的股票，每天的交易資訊
df_stock = data.get_data_yahoo(all_stock, start, end)
# 只抓今天的價格
todayPrice = pd.DataFrame(df_stock['Close'].iloc[-1])
todayPrice.columns = ['最近價格']
todayPrice['代號'] = todayPrice.index
todayPrice['代號'] = todayPrice['代號'].str.replace('.TWO','')
todayPrice['代號'] = todayPrice['代號'].str.replace('.TW','')


# 合併資料
tables = pd.merge( tables , todayPrice,
                  how = 'left',
                   on = '代號'
                  )
```
![抓到大部分的股價，但還是有少部分的股票抓不到資料](https://i.imgur.com/EeYacjd.png)

### 挑選價格合理的股票
![列出目前符合條件之股票](https://i.imgur.com/6L1IBeV.png)

最後只需要利用numpy的where()方法，即可挑選出目前股票價格低於10倍的EPS股票標的，我們想挑的股票就完成了。這個部分作者是使用EPS 5年平均來做計算，您也可以依照自己的投資線長短，來前後調整想要計算的平均年限喔！
```python
# 還是沒抓到股價的就沒辦法了，排除掉
tables['最近價格'] = tables['最近價格'].fillna(-1)
tables = tables[tables['最近價格'] >= 0]

tables['選股'] = np.where(tables['最近價格']  < tables['5年平均EPS(元)'] * 10, 1, 0)
tables[tables['選股']==1]
```

## 總結（很重要要看）
> 警告：本文章內容僅作為程式分享與範例，並非投資建議，基於文章之任何交易或投資決定，使用者須自負風險及盈虧，本文章與程式亦不負任何責任

其實嚴格來說，這並不能算是一個「投資策略」，這只能算是長期投資者的「基本先決條件」。若您是喜歡以投機的方式獲利，賺取買賣價差者，其實股價的合理並不是影響您獲利的主要因素；相反的您的投資是較為長期，甚至是以領股息為獲利來源，那買到合理的價格就是相當重要的，否則買在一個高價位雪崩下來，就算領了10年的股息可能也才剛好打平而已。

最後，這篇文章提供給長期投資的您一個快速的篩選工具，能夠有效聚焦在更符合您期待的股票上面，才不會全台1700檔股票慢慢找。**但切記留意市場風險，並不是低於合理價格就代表不會往下跌**，美國2008金融海嘯時，由於整個世界金融體制的「信任」都快崩解，所以全世界的股票跌破合理價格還是繼續墜落，由此說明沒有一個概念與理論是萬用的，還是要會隨機應變才能在這個金融遊戲上生存。