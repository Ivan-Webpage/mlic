# 資料分析實戰｜利用PTT資料進行消費者關鍵字分析，消費者都在討論什麼？
在學「[PPT爬蟲｜爬下全台最大電子布告欄]()」課程後，我們就以品牌的角度來實作，如何分析消費者眼中的品牌。以下為實際爬下來的範例資料，共有「8,759筆」資料，其資料來自於PPT的folklore、womentalk、boy-girl、Urban_Plan、Gossiping、Nantou、TaichungBun這幾個版。而這次課程中我們的產業定位為「服飾業」，想要勘查「花襯衫」的市場如何。

## 挑出有關鍵字的文章
「8,759筆」資料代表有 8,759篇文章，但並不是每篇文章都一定會提到「花襯衫」這個關鍵字，因此要先用pandas套件中的 str.contains()方法來挑選出標題、內文、所有留言中有提到「花襯衫」這個關鍵字的文章。
```python
# 挑出 標題 or 內文 or 所有留言 中，有出現「花襯衫」這個字詞的文章
get_shirt_data = getdata[
    getdata['標題'].str.contains('花襯衫') |
    getdata['內文'].str.contains('花襯衫') |
    getdata['所有留言'].str.contains('花襯衫')
    ]
```
## 合併所有文字
為何要將所有文字串再一起呢？因為之後做文字切個的時候，如果全部串再一起，就只需要分析一段字串即可（雖然說很大段），但若拆開來的話，要使用for迴圈來執行，這樣執行的效率會變得很差。
```python
#--- 先行填滿空值
get_shirt_data['標題'] = get_shirt_data['標題'].fillna('')
get_shirt_data['內文'] = get_shirt_data['內文'].fillna('')
get_shirt_data['所有留言'] = get_shirt_data['所有留言'].fillna('')
allstr = get_shirt_data['標題'].sum() + get_shirt_data['內文'].sum() + get_shirt_data['所有留言'].sum() # 將標題與內文全部串起來
```
## 取代掉無意義字元
因為PPT的鄉民文化很喜歡使用表情符號，因此若沒有執行這個步驟，最高頻率的關鍵字永遠都是「XD」、「QQ」等，因此這些表情符號都要先使用 replace()這個方法來進行取代。
```python
#--- 取代掉無意義字元
replaceList = ['span','https','com','imgur','class','jpg','f6','href','rel',
               'nofollow','..','target','blank','hl','www','cc','tw','XD','f3',
               'f2','reurl','Re','http','amp','content','type','user','ipdatetime',
               '[',']','{','}','(',')',"'",':',',','/','\n','，','"','→','.','=','>',
               '>','<','？','。','_','！','、','?','：','-','（','~','～','）','「',
               '!','」','…','^',';','─','QQ','&','—',':',',','/','★','｜','+']
for i in replaceList:
    allstr = allstr.replace(i,'')
```
## 尋找關鍵字
在課程「關鍵字替代方案，比較TF-IDF演算法與Google NLP，誰與爭鋒？」有分享使用TF-IDF演算法來進行關鍵字分析，使用 jieba.analyse.extract_tags()方法進行分析。如果老闆或主管不了解TF-IDF演算法如何計算，又不方便跟他們解釋的話，納建議還是使用下一個「土法煉鋼」的方式。
### TF-IDF演算法
```python
# 用TF-IDF演算法，尋找top 100 關鍵字
keywords_top=jieba.analyse.extract_tags(allstr, # 字詞
                                        topK=100, # 前幾名
                                        withWeight=True) # 是否要計算分數
```
### 土法煉鋼法
這個計算的方式非常簡單，直接計算每個字詞出現的「次數」，因此直觀上很好理解，但缺點就是缺乏執行效率，而且通常最高頻率的關鍵字都是「的」、「你」、「我」、「他」等等的無意義關鍵一。
```python
words = jieba.cut(allstr)
df_words = pd.DataFrame(list(words))
df_value_counts = df_words.value_counts()

for i in range(100):
    print(df_value_counts.index[i])
```

## 查看原始資料
在分析的過程中，會出現許多令您困惑的關鍵字，有些是不知道這個詞是甚麼意思，有些則是好奇這個詞怎麼會出現在文章中的頻率那麼高，而想要去看原文。這裡寫了以下的程式，只要設定想查詢的關鍵字在變數 findword中，就會顯示出所有該關鍵字的前後各50個字。
```python
# 觀看原始資料
import re
findword = 'UQ'
for m in re.finditer(findword, allstr): #進行資料比對
    print(
        allstr[m.start()-50 : m.start()] + # 關鍵字的前50個字
        '【'+findword+'】' + # 關鍵字本身
        allstr[m.start()+len(findword): m.start()+50]+'\n' # 關鍵字的後50個字
        ) 
```
