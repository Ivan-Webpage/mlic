# 資料分析實戰，熊貓FoodPanda熱門美食系列｜看出地區最火料理種類
![可交付成果](https://i.imgur.com/rHP1eu3.png)
看完「[Html爬蟲Get實戰－FoodPanda](/classification/crawler_king/83)」以後，相信您也會爬下FoodPanda的資料了。而爬下來的資料又有什麼商業價值呢？FoodPanda的每個店家都會為自己的美食編輯Tag，這個Tag並不能亂標記，否則會是廣告不實或欺瞞消費者，因此每個Tag都會符合該美食特色。

藉由這項特色，我們就從爬下來的資料Tag中下手，利用Jieba關鍵字分析來找到該地區（台北市中山區）最多的美食特色，其程式碼如下：
```python
getdata = pd.read_csv('foodpanda.csv', encoding = 'utf-8')
getdata.columns
text = getdata['標籤'].sum()

keywords1=jieba.analyse.extract_tags(text)
print("/".join(keywords1))
```
執行結果：
```
Building prefix dict from the default dictionary …
Dumping model to file cache C:\Users\Ivan\AppData\Local\Temp\jieba.cache
Loading model cost 0.844 seconds.
Prefix dict has been built successfully.
店內價/中港/小吃/日韓/便當/火鍋/一送/pro/專屬/優惠/早餐/美式/飲料/首選/甜點/聚餐/熱搜人氣/餐廳/歐式/炸雞
```

可以使用Jieba中的 analyse.extract_tags 方法，找出每個關鍵字的排名與得分：
```python
keywords1=jieba.analyse.extract_tags(text)
print("/".join(keywords1)) 
```

執行結果：
```python
 　0         1
0 店內價 2.735413
1 中港 2.266044
2 小吃 0.671491
3 日韓 0.492085
4 便當 0.376300
5 火鍋 0.347354
6 一送 0.347354
7 pro 0.318408
8 專屬 0.318408
9 優惠 0.318408
```

最後利用「基本繪圖－XY資料、折線、直方、圓餅、點陣圖」課程所教導的Matplotlib套件，繪製出棒狀圖，呈現該地區最火熱的美食Tag，也是該地區競爭最激烈的美食系列，若您是想要進軍此地區的餐飲業老闆，你又會用甚麼行銷策略來找到市場缺口呢？
```python
# 棒狀圖
plt.bar(keywords_top[0], # X資料
    keywords_top[1], # Y資料
    0.5, # bar寬度
    color='#EF798A' # bar顏色
)
plt.title('美食系列排名', fontsize = 30) #加入標題
plt.xlabel('美食系列') #加x軸標籤
plt.ylabel('分數') #加y軸標籤
plt.xticks(rotation=30)
plt.show()
```
