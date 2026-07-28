# Windows圖片顯示中文
在利用Matplotlib進行繪圖，時常會碰到中文字無法顯示之問題，教學利用匯入字體檔案，並指定使用該字體檔案，即可根治此問題。

## 尋找繪圖所使用之字體位置：
```python
from matplotlib.font_manager import findfont, FontProperties 
findfont(FontProperties(family=FontProperties().get_family()))
```

## 在font.serif後方加入：
```python
Microsoft JhengHei
```

## 圖片測試
```python
# -*- coding: utf-8 -*-
"""
Created on Sat Apr 24 21:44:24 2021

@author: Ivan
首頁
版權屬於「行銷搬進大程式」所有，若有疑問，可聯絡ivanyang0606@gmail.com

Python免費基礎教學課程
第六章Matplotlib繪圖
圖片測試
"""
import matplotlib.pyplot as plt
plt.plot([1,2], [3,4])
plt.title('圖片大標題', fontsize = 30)
plt.xlabel('X資料名稱')
plt.ylabel('Y資料名稱')
plt.show()
```