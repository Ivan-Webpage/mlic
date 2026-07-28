# Pandas了解資料－資料剖析、取資料

當進行資料分析前，我們一定得了解這個資料的一些概況，否則也難以做分析。這時候您可會想問：「就直接用excel打開看一下就好了啊」？這的確是一個很快速方便的方式，但在以下情況的時候，反而使用excel會適得其反：
1. 資料量太大：這也是最危險的，可能一打開電腦就當掉了。
2. 欄位名稱太長：這您可能很有經驗，欄位名稱長的時候其實很難查看。
3. 篩選效率慢：這跟第一點有直接性關係。就算這個檔案是您的電腦可以負荷的大小，在打開以後，想要排序、看平均等欄位計算時，也會算得非常久。

因此接下來將介紹幾個Pandas的方法，是在資料分析的前期，了解資料時非常實用的方法。

## 製造資料
由於是初學pandas的使用，因此也不太適合引入太複雜的資料，因此在本文中先自建一個簡單的資料表。此舉方便在查看指令結果時，直接跟原資料表做比對，能更快理解程式碼的運作方式喔！pandas套件所製造出來的資料有自己的資料格式「DataFrame」。
```python
import pandas as pd
#--- 製造資料
data = {'顧客編號':[1,2,3,4,5,6,7],
        '姓名':['Jacky','Lily','Kevin',
                'Bob','Harry','Bill','Harry'],
        '年齡':[21,21,35,18,15,49,7]}
member = pd.DataFrame(data)
```
## 資料剖析
### head()
列出前五筆資料。很多時候檔案過大，excel開不起來，再用pandas打開後，可以先用這個方法簡單的窺探一下資料內容。
```python
member.head() # 列出前五筆資料
```
以上程式碼的執行結果：　
```python
   顧客編號     姓名  年齡
0     1  Jacky  21
1     2   Lily  21
2     3  Kevin  35
3     4    Bob  18
4     5  Harry  15
```

### info()
這個方法提供了兩個非常重要的資訊：
1. 此欄位有幾個空值
2. 此欄位資料型態

由於我們在後續的資料處理時，若型態不同可能會造成程式出錯，因此可以先在這裡查看。
```python
member.info() # 資料資訊
```
以上程式碼的執行結果：　
```python
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 7 entries, 0 to 6
Data columns (total 3 columns):
 #   Column  Non-Null Count  Dtype 
---  ------  --------------  ----- 
 0   顧客編號    7 non-null      int64 
 1   姓名      7 non-null      object
 2   年齡      7 non-null      int64 
dtypes: int64(2), object(1)
memory usage: 296.0+ bytes
```

### shape
查看這筆資料共有多少欄、列。
```python
member.shape # (列數，欗數)
```
以上程式碼的執行結果：　
```python
(7, 3)
```

### columns
列出所有的欄位。這個方法非常好用，原因在於，我們在後續取欄位資料時需要輸入欄位名稱，而時常有些資料的欄位名稱很長或很複雜，直接用打得很容易打錯。這時就可以執行此方法，然後複製您想要的欄位。
```python
member.columns #列出所有欄位
```
以上程式碼的執行結果：　
```python
Index(['顧客編號', '姓名', '年齡'], dtype='object')
```

### index
列出所有列的索引。索引如果沒有進行修改的話，都會是用range的方式作編號。
```python
member.index #列出所有列
```
以上程式碼的執行結果：　
```python
RangeIndex(start=0, stop=7, step=1)
```


## 取欄位資料
### 單一欄位
取得某欄位的所有資料，方式是使用中括號包覆欄位名稱，以字串的方式輸入。此處切記！欄位名稱必須輸入的一次不差，否則會抓不到資料。
```python
member['年齡'] #取出某欄位
```
以上程式碼的執行結果：　
```python

0    21
1    21
2    35
3    18
4    15
5    49
6     7
Name: 年齡, dtype: int64
```

### 多個欄位
取得多欄的資料。使用中括號包覆陣列，陣列中輸入想要抓取的多個欄位名稱。
```python
# 取出 uid 與age 欄位
member[['顧客編號','姓名']]
```
以上程式碼的執行結果：　
```python
   顧客編號     姓名
0     1  Jacky
1     2   Lily
2     3  Kevin
3     4    Bob
4     5  Harry
5     6   Bill
6     7  Harry
```

### 有條件的取欄位
有時候我們在取得欄位時，會需要對欄位內的資料進行篩選，因此可以在中括號中加入「判斷」，格式如下：　
```python
變數名稱[判斷條件]
```

這裡舉一個例子，挑選出變數member的「姓名」這個欄位中，名字叫做Harry的人。
```python
# 只顯示'姓名' 為 Harry 的交易數據
member[member['姓名'] == 'Harry'] 
```
以上程式碼的執行結果：　
```python
   顧客編號     姓名  年齡
4     5  Harry  15
6     7  Harry   7
```

您可能會很好奇`[member['姓名'] == 'Harry'`這部分的編寫方式，其實這一塊也是可以執行的。可以看到輸出的結果，是以布林boolen的格式呈現，而資料中True的部分，也是符合條件、會被挑選出來的資料：

```python
member['姓名'] == 'Harry'
```
以上程式碼的執行結果：　
```python
0    False
1    False
2    False
3    False
4     True
5    False
6     True
Name: 姓名, dtype: bool
```

### 多重條件
在上一段已經知道了dataframe格式中也會有Boolen的格式，那就代表說可以像課程[判斷式If](/classification/python_foundation/36)所教的，進行多個條件的資料判斷與篩選。但在DataFrame的部分比較特別，他們的邏輯運算子有特定的符號：　
* and：&
* or：|
* not：~
```python
step1 = member['姓名'] == 'Harry'
step2 = member['年齡'] < 10
member[(step1 & step2)] 
```
以上程式碼的執行結果：　
```python
   顧客編號     姓名  年齡
6     7  Harry   7
```


## 了解個別欄位資料
取出該欄位的最大值，此欄位必須是數值欄位。
### max()
```python
member['年齡'].max() #最大值
```
以上程式碼的執行結果：　
```python
49
```

### min()
取出該欄位的最小值，此欄位必須是數值欄位。
```python
member['年齡'].min() #最小值
```
以上程式碼的執行結果：　
```python
7
```

### mean()
取出該欄位的平均值，此欄位必須是數值欄位。
```python
member['年齡'].mean() #平均值
```
以上程式碼的執行結果：　
```python
23.714285714285715
```

### std()
取出該欄位的標準差，此欄位必須是數值欄位。
```python
member['年齡'].std() #標準差
```
以上程式碼的執行結果：　
```python
13.96082955646841
```

### count()
取出該欄位的總數量。
```python
member['年齡'].count() #總數量
```
以上程式碼的執行結果：　
```python
7
```

### describe()
取出該欄位的統計數值，此欄位必須是數值欄位。
```python
member['年齡'].describe() #欄位資訊
```
以上程式碼的執行結果：　
```python
count     7.000000
mean     23.714286
std      13.960830
min       7.000000
25%      16.500000
50%      21.000000
75%      28.000000
max      49.000000
Name: 年齡, dtype: float64
```

### sum()
將此欄位進行加總。這個方法除了可以加總數字外，文字的資料型態也可以加總，會將該欄位所有的字串接再一起。
```python
member['年齡'].sum() # 加總
```
以上程式碼的執行結果：　
```python
166
```

### value_counts()
這裡特別額外介紹value_counts()這個方法，因為他在pandas的資料查看上非常的方便。在下方的案例中我們可以看到，value_counts()方法可以幫我們把欄位內的資料進行總個數計算，並且依照由大到小進行排序，因此可以快速了解該欄位中各個項目的占比。
```python
member['姓名'].value_counts() #計算個數並依大到小排序
```
以上程式碼的執行結果：　
```python
Harry    2
Jacky    1
Lily     1
Kevin    1
Bob      1
Bill     1
Name: 姓名, dtype: int64
```
