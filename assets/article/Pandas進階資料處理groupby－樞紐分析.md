# Pandas進階資料處理groupby－樞紐分析


接續著[前面課程](/classification/python_foundation/42)中所使用到的salelist.csv檔案。在該檔案中有很多的商品銷售紀錄。若今天您是老闆，您會不會想要看各個產品品項的銷售總金額，找出公司的金雞母呢？groupby()這個方法可以幫您做到。
![匯入資料salelist.csv](https://i.imgur.com/ASgSxtp.png)


## 匯入範例檔案
這裡就用一個模擬的銷售資料來匯入，一般在進行資料分析時，都是使用csv檔案格式來做存取，盡量避免使用xls或xlsx的格式。原因在於xls或xlsx的格式有紀錄excel中的一些欄位樣式設定，包含顏色、大小、框線等，因此檔案會大上許多，但這些多餘的設定在使用pandas的時候都是用不到的。
```python
import pandas as pd
#--- 匯入資料
salelist = pd.read_csv('salelist.csv') #也可使用read_excel
```

## 加總產品銷售額
首先，groupby()這個方法裡面給他想要合併的欄位，後面接上合併的方式，就可以完成資料，而合併的方式有max()、min()、count()、sum()...等，可以選擇
```python
salelist.groupby("product").mean()
```
以上程式碼執行之結果：
```python
              key       uid  quantity  price
product                                     
apple    5.500000  3.000000  5.000000   10.0
banana   4.000000  3.500000  8.000000   34.0
cherry   4.000000  3.000000  3.000000   60.0
guava    6.500000  2.500000  2.000000   20.0
orange   6.333333  3.666667  4.333333    5.0
```

```python
salelist[['product','quantity']].groupby("product").mean()
```
以上程式碼執行之結果：
```python
         quantity
product          
apple    5.000000
banana   8.000000
cherry   3.000000
guava    2.000000
orange   4.333333
```

```python
# 每筆訂單的總額
salelist['金額'] = salelist['quantity'] * salelist['price']
salelist[['tid','金額']].groupby("tid").mean()
```
以上程式碼執行之結果：
```python
          金額
tid         
T0001   50.0
T0002  204.0
T0003   80.0
T0004  135.0
T0005   35.0
```
