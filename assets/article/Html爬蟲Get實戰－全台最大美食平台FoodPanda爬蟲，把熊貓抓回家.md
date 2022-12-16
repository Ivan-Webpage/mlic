# Html爬蟲Get實戰－全台最大美食平台FoodPanda爬蟲，把熊貓抓回家
[FoodPanda](https://www.foodpanda.com.tw/)是台灣現在最具知名的美食外送平台，他改變了整個消費者的飲食習慣，創造出一個獨特的線上通路，也讓商家的消費族群不再侷限於方圓一公里內。能爬下[Foodpanda](https://www.foodpanda.com.tw/)等於能夠了解當地的飲食習慣，對於要切入該市場的你，這是很具有參考價值的！

在學習完「[Html爬蟲Get教學－Yahoo](/class?c=3&a=82)」課程以後，本篇文章將帶領您朝向下一個實戰。課程的可交付成果，是爬下地區的「店家名稱、評分、標籤、外送費用」，並將結果整理成CSV檔案，以便日後分析。

課程中首先利用figcaption這個特殊的標籤，抓下class名稱為vendor-info的資料，此舉能爬下所有店家的相關資料，後續只需要將此資料進行擷取，找出每家店的 「店家名稱、評分、標籤、外送費用」 即可。
![figcaption 標籤在網站中的位置](https://i.imgur.com/R3WSHKI.png)
利用span標籤的class名稱name抓下店家名稱
```python
print(i.find('span',{'class':'name'}).text) #取得店家名稱
```

取得評分的部分，因為剛好評分的標籤為strong，正是資料中第一個出現的strong標籤，因此直接抓取strong標籤即可，甚至不需要任何的額外條件設定。
```python
print(i.find('strong').text) #取得評分
```

每家店的標籤則是爬取li標籤中vendor-characteristic的這個class，這個class非常獨一無二，因此不須另外深入擷取，即可拿到我們想要的資料。
```python
print(i.find('li',{'class':'vendor-characteristic'}).text) #取得標籤
```

費用則是爬取li標籤中的delivery-fee這個class（2021/7/25修改，因此與影片中程式碼不同），由於取得的資料位於li的strong標籤裏頭，因此採取兩步驟，第一個變數part1先取得li標籤內容，part2變數則是從li標籤中，取得strong標籤。
```python
# 取得外送費用
print(i.find('li',{'class':'delivery-fee'}).text) # 2021/7/25修改
part1 = i.find('li',{'class':'delivery-fee'}) # 2021/7/25修改
part2 = part1.find({'strong'})
part2.text
```

