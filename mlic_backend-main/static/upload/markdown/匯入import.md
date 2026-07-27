# 匯入import

再參考網路各種大神的程式碼時，都會看到程式碼最前頭有一大群import，這究竟代表什麼呢？對我寫程式有影響嗎？本課程除了告訴您Python中的import實際用途與運作原理，也會帶領您時做出一個屬於自己的import檔案喔！以下整理了在python 中常見的import 類型格式：
```python
import 套件(檔案)名稱
import 套件(檔案)名稱 as 自訂縮寫
from 套件(檔案)名稱 import 方法名稱1, 方法名稱2, 方法名稱3
import 套件(檔案)名稱.方法名稱
```
以下將為您詳細解說這幾種類型的import分別代表什麼含意、使用時機、如何使用。

## import是什麼？
![Pandas的原始檔案](https://i.imgur.com/QZI7FLM.png)
不知道您有沒有想過：「為何我想要的功能，打個單字跟括號就好」？其實我們import 的東西，都是前人已經寫好的Python 程式碼！我們就以`pandas`這個套件來舉例，當我們輸入`import pandas`的時候，其實就會將程式碼(如上圖)匯入我們的python執行環境中。

**那這些檔案放在哪裡呢？**，可以在終端機中輸入指令：
```
pip show pandas
```
之後就會得到以下圖片的結果，其中可以看到Location顯示的路徑，就是這個套件檔案目前存放的位置。
```
Location: c:\users\ivan\appdata\local\programs\python\python310\lib\site-packages
```
![](https://i.imgur.com/OkEGsiv.png)

也可以直接切換到該目錄，可以看到以下的眾多資料夾，這每一個資料夾就是一個套件檔案，也就是我們在輸入指令`pip install 套件名稱`後，下載下來的檔案(課程[安裝套件教學ModuleNotFoundError: No module named](/classification/python_foundation/8))，裡面的程式碼就是前人已經打包好的Python程式，這也是為何我們想要什麼功能，直接輸入一個方法就可以達到的原因！

![python套件存放位置，site-packages](https://i.imgur.com/3AizdwV.png)


## import的呈現形式
### import 套件名稱
這是最單純的套件引用方式，就是直接到您的電腦中(上述的目錄)取得python檔案，因此import 後面的名稱，除了是套件名稱外，他其實也是您c槽某個檔案的名稱！
```python
import pandas
```
舉例使用此套件的「read_csv」方法則要這樣寫：
```python
pandas.read_csv('你要讀的檔案.csv')
```
### import 套件(檔案)名稱 as 自訂縮寫
我們最常看到引入pandas這個套件時，都會使用以下的寫法。前面的`import pandas`一樣是引入套件的意思，而後方的「as」我們可以翻譯成「當作」，等於是命小名的意思。這個概念就如同為何我們會幫親友命小名(別名、綽號)，通常有各種原因與發生情境，但總結的根源就是「好叫好記憶」。回到python程式碼中，每次呼叫pandas這個套件的程式碼時，都要打`pandas`不覺得很麻煩嗎？如果變成只要打兩個字母`pd`是不是相對地容易得多了呢？
```python
import pandas as pd
```
舉例使用此套件的「read_csv」方法則要這樣寫，可與上面一段比較差異：
```python
pd.read_csv('你要讀的檔案.csv')
```
### from 套件(檔案)名稱 import 方法名稱
一樣以pandas來舉例。這個寫法是指定要匯入特定套件的特定方法，換句話說，就不是將整個套件都匯入進來。為什麼還要特別指定呢？全部匯進來不是很方便嗎？這其實有兩個原因：
1. 節省記憶體：您可能很難想像，在某些情況下，記憶體是非常珍貴的，譬如一些微型電腦晶片(雖然大多不是用python寫，只是舉例)本身存取空間就非常有限。又或者一些大型系統，尖峰時期可能會有上百萬的運算需求，這時候還在慢慢載入一些不會用到的程式碼，不覺得有點浪費嗎？
2. 方法名稱衝突：你敢保證沒有其他套件的方法名稱叫做「read_csv」、「pandas」...等嗎？若您寫的架構會需要用到很多的套件，同時又引入太多用不到的方法，很有可能造成方法名稱一樣而混亂，這點在後續會有實作。

> 此方法可以匯入一個以上的方法喔！
```python
import pandas # pandas套件內全部的方法都匯入
from pandas import read_csv # 只會入其中read_csv這個方法
from pandas import read_csv, read_excel # 會入read_csv、read_excel兩個方法
```
![pandas當中所有可呼叫的方法](https://i.imgur.com/e3TUHCl.png)

舉例使用此套件的「read_csv」方法則要這樣寫，可與上面一段比較差異：
```python
read_csv('你要讀的檔案.csv')
```

## 實作自己的import檔案
### 打造一個python套件
在前面的課程[方法function](/classification/python_foundation/16)我們已經學習了如何建立屬於自己的方法，這裡就以前課程的方法來製作成一個python檔案。此檔案裏面有兩個方法可以拿來import，別是factorial()、accumulate()，分別用來進行階層計算與累加計算
```python
# 階層計算機
def factorial(n):
    """
    參數n：欲計算階層的尾數
    範例：計算10!，n輸入10
    """
    count = 1
    for i in range(1, n+1):
        count = count * i
    return count

# 累加計算機
def accumulate(n):
    """
    參數n：欲計算累加的尾數
    範例：計算1+2+3...+10，n輸入10
    """
    return (1+n)*n/2
```

> 嚴格上來說，這樣不能算是寫好一個完整的「python套件」，這裡就以教學需要，讓您能理解，若您想更深入了解，再額外鑽研真正的「python套件」應該具備什麼。

最後將這個檔案存檔，命名成「mymath.py」這個檔案。

### 使用自己的套件
#### 引入自己的套件
首先要確認好自己的工作目錄在哪裏，並且將剛剛建立好的python套件放到工作目錄當中，，若您使用[spyder](/classification/python_foundation/2)這個編輯器的話，工作目錄在您的右上角，有一個長條型的輸入方格，可以在那裏貼上您想要的工作目錄。
![spyder的工作目錄位置](https://i.imgur.com/3v7pjRI.png)
若您是使用[VS code](/classification/python_foundation/28)這個編輯器的話，可以在左方選單的第一個按鈕，點選「Open Folder」選擇您想要的工作目錄。
![VS code的工作目錄位置](https://i.imgur.com/jxhviaP.png)


如果您在後續的執行出現以下錯誤，那就代表您的工作目錄沒有設定好，因此造成抓不到「mymath.py」這個檔案。
```
ModuleNotFoundError: No module named 'mymath'
```
![ModuleNotFoundError: No module named 'mymath'](https://i.imgur.com/PUcMecN.png)


#### 匯入方式：import 套件名稱
先使用最簡單的方式進行import，直接輸入`import mymath`後，就可以同時使用 factorial()與 accumulate()兩個方法。
```python
# 匯入套件，也就是整個檔案程式碼
import mymath
x = 10
y = 2
c = mymath.factorial(x) / ( mymath.factorial(x-y) *  mymath.factorial(y))
```

#### 匯入方式：import 套件(檔案)名稱 as 自訂縮寫
這裡將引入的套件取個別名「mm」，可以方便又快速的編寫程式碼！
```python
# as：取小名，不想打太長的套件名稱所使用
import mymath as mm
x = 10
y = 2
c = mm.factorial(x) / ( mm.factorial(x-y) *  mm.factorial(y))
```

#### 匯入方式：from 套件(檔案)名稱 import 方法名稱
如果使用這個方法進行匯入的話，在使用方法時，連前面的套件名稱都不用打了，在編寫程式時又加速了許多。
```python
# 從套件中獲取「特定」方法
from mymath import factorial
x = 10
y = 2
c = factorial(x) / (factorial(x-y) * factorial(y))
```

另外也可以同時引入多個方法，因此這裡也示範將factorial()與 accumulate()兩個方法同時引入。
```python
# 從套件中獲取「多個」方法
from mymath import factorial, accumulate
x = 10
y = 2
c = factorial(x) / (factorial(x-y) * factorial(y))
```
