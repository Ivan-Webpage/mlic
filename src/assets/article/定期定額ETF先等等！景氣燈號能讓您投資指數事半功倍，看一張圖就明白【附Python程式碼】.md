# 定期定額ETF先等等！景氣燈號能讓您投資指數事半功倍，看一張圖就明白【附Python程式碼】
近年股市的狂熱，導致於許多沒有再投資的朋友們都想來股市分一杯羹，而身為無頭蒼蠅的他們，都會選擇最快的懶人包：多聽幾個Youtuber、Podcaster的建議（不瞞您說，這好像真是個不錯的方法）。最後這群無頭蒼蠅的結論都是「定存ETF指數股」。
這樣的結論至少確定，聽Youtuber、Podcaster的建議比那些投顧名師好得多，至少相較之下，與作手合作引導韭菜們接盤的機率少很多（這個內幕有機會在分享）。而接下來這群朋友就開始問我「還有什麼股票ETF類似0050？」、「你證券用哪一家？」、「這有甚麼風險？」

> 先等等，你現在ETF買下去，平均7~15年才會賺你知道嗎？
## 可交付成果
![大盤與景氣燈號關係曲線](https://i.imgur.com/wNyG6O3.png)
在本文中除了分享景氣燈號與股市大盤的關係，方便您選擇投資ETF的時機外，更利用Python繪製出視覺化的「大盤與景氣燈號關係曲線」，讓我們能夠更輕鬆的判斷現在的趨勢是否會向上成長，成為開始累積ETF的好時機。

> 警告：本文章內容僅作為程式分享與範例，並非投資建議，基於文章之任何交易或投資決定，使用者須自負風險及盈虧，本文章與程式亦不負任何責任


## 為何投資指數ETF平均至少等7年？
這個原因其實很好理解，如果沒有計畫性投資，那我們在投資ETF通常都是定期定額投資，那您的投資成本就是每次投資金額的平均。若不幸的，您投資的時間剛好是大盤的高點那之後後大盤一回檔，在等他漲回來的時間，差不多就是一個經濟循環（7~15年），因此投資指數型ETF風險的確壓得很低了，但買點會是這項投資中很重要的因素。

## 如何預先知道大盤要漲要跌？
用比較學術的問法是：市場上有預測大盤股市的「領先指標」嗎？是有的，而且你早就聽過了。相信您知道「景氣燈號」這個政府提供的指標，用來標明並區分現在國家的經濟熱度，這個經濟課本上的理論知識，跟大盤有甚麼關係？答案是息息相關。

![轉折部分都有圈起來](https://i.imgur.com/gzZAhWd.png)
這裡我們先看結果。可以發現**每次景氣燈號的數值開始下降後沒多久，大盤也跟著開始下滑**，雖然中間的間隔看起來很短，但其實最少也相差1~3個月之久。也就是說，當景氣燈號開始反轉之後，在半年內大盤必定也會跟著下滑，這是我們從結果中觀察得知的。

從經濟學的角度也不難理解，景氣燈號與大盤同時都是反映一個國家的經濟狀況，而大盤的短期變動多半來自於整體投資人猜測的方向，除非有集體恐慌產生(如金融海嘯)；否則猜測標準也來自於「對目前經濟市場的體驗」，譬如最近物價如、房貸車貸利率、公司叫料情況，而這些參數，其實都被包含在景氣燈號內作為產出因子，因此景氣燈號能成為大盤的領先指標也是合情合理的。

## 程式碼實作
在本次的實作中，仍然會用到pandas_datareader來取得大盤的走勢，因此也需要將此套件包引入。
```python
import datetime
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from pandas_datareader import data
# 需要用此套建載入yahoo的API，否則無法取得資訊
import yfinance as yf
yf.pdr_override()
```

### 取得大盤走勢
在pandas_datareader套件中的台灣指數代號為「^TWII」。這次我們從長期的角度來實證這個論述，因此從2001年開始抓取景氣燈號，其中就經歷了2008年金融海嘯，看完一整個完整的經濟循環才能體現一個理論的實踐。
```python
#--- 抓取大盤的股價變動
# 先設定要爬的時間
start = datetime.datetime.strptime('20010101',"%Y%m%d")
end = datetime.datetime.strptime('20221231',"%Y%m%d")
# 取得全台灣所有的股票，每天的交易資訊
df_stock = data.get_data_yahoo('^TWII', start, end)
```

由於景氣燈號的單位是「月」，因此台指的線圖也必須以月線呈現，這樣才能在同一個基準上做比較。因此這裡需要再依照年月提出資料並合併平均。
```python
# 整理出日期欄位，計算指數的月平均線
df_stock['日期'] = df_stock.index
df_stock['年月'] = df_stock['日期'].dt.strftime('%Y-%m')
M_index = df_stock[['年月','Close']].groupby('年月').mean()
M_index['日期'] =  pd.to_datetime(M_index.index)
```

### 取得景氣燈號資料
![取得景氣燈號資料](https://i.imgur.com/ULvZHDr.png)
想要取得景氣燈號的資料其實非常簡單，國發會就有提供[下載的管道](https://index.ndc.gov.tw/n/zh_tw/data/eco)，歷史景氣燈號都可以下載，因此只需要到[這裡](https://index.ndc.gov.tw/n/zh_tw/data/eco)選擇想要的時間區間進行下載就可以了。
```python
#--- 引入國家景氣燈號資料
monitoring_indicator = pd.read_excel('精氣燈號.xls')
monitoring_indicator.columns = ['日期','景氣對策信號(燈號)','景氣對策信號(分)']
monitoring_indicator['日期'] = pd.to_datetime(monitoring_indicator['日期'])
```

### 繪製「大盤與景氣燈號關係曲線」
![大盤與景氣燈號關係曲線](https://i.imgur.com/wNyG6O3.png)
由於這張圖需要同時加入大盤月線、景氣燈號、時間三個參數，因此必須要使用雙Y軸的繪製方式。在matplotlib繪圖前，必續邀先將畫布切割成兩個來進行繪圖。
```python
#--- 開始繪製「大盤與景氣燈號關係曲線」
fig, ax1 = plt.subplots()
plt.title('大盤與景氣燈號關係曲線')
plt.xlabel('日期')
ax2 = ax1.twinx()

ax1.set_ylabel('台灣指數', color='#5d82bb')
ax1.plot( 
    M_index['日期'], 
    M_index['Close'], 
    color='#5d82bb', 
    alpha=0.5)
ax1.tick_params(axis='y', labelcolor='tab:blue')

ax2.set_ylabel('景氣燈號', color='#bb965d')
ax2.plot( 
    monitoring_indicator['日期'], 
    monitoring_indicator['景氣對策信號(分)'], 
    color='#bb965d', 
    alpha=0.5)
ax2.tick_params(axis='y', labelcolor='black')


fig.tight_layout()
plt.show()
```

## 總結
> 警告：本文章內容僅作為程式分享與範例，並非投資建議，基於文章之任何交易或投資決定，使用者須自負風險及盈虧，本文章與程式亦不負任何責任


對於長期投資、定期定額的投資人來說，景氣燈號絕對是必須加入參考的要件，選對時間入場，能讓資金發會最大的效用。作者本身也是偏好長期投資的人，而我其實也是使用這套方法來評估入場時間，因此也分享給有緣讀到此篇文章的您。