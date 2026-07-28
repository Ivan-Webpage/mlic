# Pandas基本資料處理－匯入、排序、刪除、型態轉換

在本課程中，將會介紹幾個Pandas套件最常使用的方法，內容包含read_csv匯入檔案、sort_values資料排序、drop刪除資料、astype資料型態轉換、replace取代資料內容以及更換columns名稱。記得在執行以下程式碼之前，必須要先匯入pandas套件喔：
```python
import pandas as pd
```

## read_csv()
這裡就用一個模擬的銷售資料來匯入，一般在進行資料分析時，都是使用csv檔案格式來做存取，盡量避免使用xls或xlsx的格式。原因在於xls或xlsx的格式有紀錄excel中的一些欄位樣式設定，包含顏色、大小、框線等，因此檔案會大上許多，但這些多餘的設定在使用pandas的時候都是用不到的。
```python
#--- 匯入資料
salelist = pd.read_csv('salelist.csv') #也可使用read_excel
```
![匯入資料salelist.csv](https://i.imgur.com/ASgSxtp.png)

## sort_values()
sort_values()方法可以對某欄位進行資料的排序，而資料排序有分遞減與遞升，使用「ascending」參數來進行調整。
```python
# 排序(遞減)
salelist['quantity'].sort_values(ascending=False) # False=遞減， True=遞增
```
以上程式碼執行結果：
```python
5    10
1     6
0     5
6     5
9     5
2     4
8     4
3     3
4     2
7     2
Name: quantity, dtype: int64
```

## 資料加減乘除
我們在前面的課程[Pandas了解資料－資料剖析、取資料](/classification/python_foundation/41)當中已經學會如何取整欄的資料。而若要進行欄與欄的計算，只需要將欄位取出來直接進行數學運算即可。
```python
# 資料+-*/
salelist['quantity'] * salelist['price']
```
以上程式碼執行結果：
```python
0     50
1    204
2     20
3    180
4     40
5    340
6     25
7     40
8     20
9     50
dtype: int64
```

## drop()
有時候我們有刪除欄位的需要時，就必須使用到drop()。drop()方法支援刪除多個欄位，但建議在進行刪除之前，可以先用copy()方法複製一份相同的變數，以免發現刪錯資料後悔莫及。
```python
# 移除 uid 與 age
salelist.drop(columns=['tid','uid']) 
```
以上程式碼執行結果：
```python
   key      date product  quantity  price
0    1  109-1-15   apple         5     10
1    2  109-1-18  banana         6     34
2    3  109-2-28  orange         4      5
3    4  109-2-28  cherry         3     60
4    5  109-2-28   guava         2     20
5    6   109-9-1  banana        10     34
6    7   109-9-1  orange         5      5
7    8   109-9-1   guava         2     20
8    9  110-1-15  orange         4      5
9   10  110-1-15   apple         5     10
```

## astype()
astype()方法負責處理欄位的型態轉換，主要是在處理int、float、str這三個資料型態。
```python
salelist['price'].astype('float64') #int, str
```
以上程式碼執行結果：
```python
0    10.0
1    34.0
2     5.0
3    60.0
4    20.0
5    34.0
6     5.0
7    20.0
8     5.0
9    10.0
Name: price, dtype: float64
```

## tolist()
將dataFrame資料型態轉成List就必須要使用到tolist()這個方法。
```python
alelist.values # 轉換回array
salelist.values.tolist() # 轉換回list
```
以上程式碼執行結果：
```python
[[1, 'T0001', '109-1-15', 1, 'apple', 5, 10.0],
 [2, 'T0002', '109-1-18', 5, 'banana', 6, 34.0],
 [3, 'T0003', '109-2-28', 4, 'orange', 4, 5.0],
 [4, 'T0003', '109-2-28', 3, 'cherry', 3, 60.0],
 [5, 'T0003', '109-2-28', 3, 'guava', 2, 20.0],
 [6, 'T0004', '109-9-1', 2, 'banana', 10, 34.0],
 [7, 'T0004', '109-9-1', 2, 'orange', 5, 5.0],
 [8, 'T0004', '109-9-1', 2, 'guava', 2, 20.0],
 [9, 'T0005', '110-1-15', 5, 'orange', 4, 5.0],
 [10, 'T0005', '110-1-15', 5, 'apple', 5, 10.0]]
```

## replace()
replace這方法非常的好用，但會依照需求的不同，有一些變化。先討論replace()這個方法裡面的參數，前者放「想取代的字串」，後者放「想被取代成的字串」。而若replace()前面有加上str，則是取代欄位內字串。
```python
salelist['product'].str.replace('an','@') 
```
以上程式碼執行結果：
```python
0     apple
1      b@@a
2     or@ge
3    cherry
4     guava
5      b@@a
6     or@ge
7     guava
8     or@ge
9     apple
Name: product, dtype: object
```

若只有欄位加上replace()，則是檢查整個欄位的字串有沒有符合，才會進行取代，因此下方的範例執行完後，才會沒有任何的變化。
```python
salelist['product'].replace('an','@') 
```
以上程式碼執行結果：
```python
0     apple
1    banana
2    orange
3    cherry
4     guava
5    banana
6    orange
7     guava
8    orange
9     apple
Name: product, dtype: object
```

## 修改columns名稱()
若想要將所有的欄位名稱進行修改，只需要指定一個陣列給columns即可。這裡需要注意的是，陣列的**長度必須跟columns的長度一樣**。
```python
salelist.columns = ['資料編號','交易序號','交易日期','顧客編號','產品','數量','價格']
```
