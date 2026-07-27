# 迴圈while


在學完[迴圈for](/classification/python_foundation/14)以後，學習while相對地就快很多了，而while相較於for簡單了許多，while的呈現方式如下：
```python
while 條件:
    執行指令
```

## while與for差別？
兩者主要的差別為，for是有「順序性」的執行指令，而while則是有「條件性」的執行指令，while有點類似於for與if的結合，在執行迴圈前，先通過布林的檢查決定是否執行此次迴圈，如以下的for與while都同樣是打印出0~4：
```python
# 使用for迴圈
for i in range(5):
    print(i)
```

```python
# 使用while迴圈
i = 0
while i < 4:
    print(i)
    i = i + 1
```
以上兩個指令都會產出以下的結果：
```python
0
1
2
3
4
```

## while無窮迴圈
可以發現while後面的布林boolen變數決定了while的執行次數，因此若將while後面的布林boolen變數直接寫死成「True」的話，那這個迴圈就不會有結束的一天：
```python
# 無窮迴圈
while True:
    print('行銷搬進大程式')
```
以上的指令會產出以下的結果：
```python
行銷搬進大程式
行銷搬進大程式
行銷搬進大程式
行銷搬進大程式
行銷搬進大程式
行銷搬進大程式
行銷搬進大程式
...
```


## 跳過continue
有時候迴圈的內容並不是我們能夠控制的（如上網爬下來），因此有時碰到一些資料我們需要「略過」。以數字來舉例，若我們要列出0~10之中所有的奇數：
```python
i = 0
while i < 10:
    if i % 2 == 1:
        print(i)
    else:
        continue
    i = i + 1
```
以上的指令會產出以下的結果：
```python
1
3
5
7
9
```

## 跳出break
break是個非常好用的指令。當您突然非常想吃「炙燒鮭魚壽司」而來到迴轉壽司店，坐下來等了許久終於等到「炙燒鮭魚壽司」，一口塞下肚以後目標已達成，沒有坐在那裏的必要了，那你會怎麼做呢？當然是直接離開，起身去結帳，break就是那個驅動你身體離開的指令。一樣以數字來舉例，雖然列出0~10的數字，但只要看到5就跳出去：
```python
i = 0
while i < 10:
    print(i)
    if i == 5:
        break
    i = i + 1
```
以上的指令會產出以下的結果：
```python
0
1
2
3
5
```
