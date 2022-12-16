# Line Bot機器人串接與測試
在執行程式碼前，若為Mac的作業系統，打開Termail。若為Windows作業系統並使用Anaconda，請打開Anaconda Prompt，並輸入以下指令安裝Line Bot所需之套件：

```pip3 install line-bot-sdk```
介紹如何將Github、Heroku、Line Developers三個平台串接再一起。請觀看完成前面課程在觀看本次課程：
1. [Bot流程與架構介紹](/class?c=2&a=62)
2. [申請Github]()
3. [申請Heroku]()
4. [申請Line Bot]()

## 程式碼內容解釋
### Procfile
Heroku所需要的文件，讓Heroku的主機知道要開啟機器人的主程式是哪一個。因此檔案app.py的名稱若有做修改，這裡面也必須一起修改。
```
web: python app.py
```

### requirements.txt
告訴Heroku要安裝哪一些套件。requirement的意思就是先決條件，要搭建這個機器人，需要用到的套件，就是他的先決條件。
```
line-bot-sdk 
bs4 
flask 
pymongo 
datetime 
pandas 
SnowNLP 
emoji 
pyshorteners 
scipy
```
### app.py
![handle_message()](https://i.imgur.com/aDryJEH.png)
機器人的主程式，本文章會修改的程式碼都在這個檔案中。檔案內的方法handle_message(event)是主要編輯區塊，所有與使用者對答的邏輯都在這裡實作。
```python
# -*- coding: utf-8 -*-
"""
Created on Wed Jun  2 21:16:35 2021
@author: Ivan
版權屬於「行銷搬進大程式」所有，若有疑問，可聯絡ivanyang0606@gmail.com

Line Bot聊天機器人
第一章 Line Bot申請與串接
Line Bot機器人串接與測試
"""
#載入LineBot所需要的套件
from flask import Flask, request, abort

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import *

app = Flask(__name__)

# 必須放上自己的Channel Access Token
line_bot_api = LineBotApi('你自己的token')
# 必須放上自己的Channel Secret
handler = WebhookHandler('你自己的secret')

line_bot_api.push_message('你自己的ID', TextSendMessage(text='你可以開始了'))


# 監聽所有來自 /callback 的 Post Request
@app.route("/callback", methods=['POST'])
def callback():
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

 
    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'

 
#訊息傳遞區塊
##### 基本上程式編輯都在這個function #####
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    message = TextSendMessage(text=event.message.text)
    line_bot_api.reply_message(event.reply_token,message)

#主程式
import os
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

## 貼上Channel secret
我們剛剛申請好的機器人專案中，有一個「Channel secret」的選項，貼到您剛剛下載的app.py檔案中，第17行的位置。
![貼上Channel secret](https://i.imgur.com/PimmMhI.png)

## 貼上Your user ID
找到「Your user ID」，並複製到app.py檔案中，第19行的位置。
![貼上Your user ID](https://i.imgur.com/v7HPxte.png)

## 貼上Channel access token
切換上方的選項Messaging API，找到「Channel access token」並按下後方的Issue，即可得到token，並複製到app.py檔案中，第15行的位置。

> 請注意！若有心人士拿到這個token，他就可以操控您的機器人，因此請妥善保管。

![貼上Channel access token](https://i.imgur.com/9O8x9si.png)

## 設定Webhook URL
一樣在選項Messaging API中，找到「Webhook settings」，將我們在Heroku中申請好的專案網址貼上，後方必須要加入「/callback」，否則會無法執行。
![設定Webhook URL](https://i.imgur.com/sQcKU0Z.png)

## 打開Webhook
這個步驟很簡單，送出剛剛的webhook後，將下方的use webhook打開即可（呈現綠色）。為何這麼簡單的動作，我還會獨立出一個步驟呢？因為時常會有朋友忘記把他打開，甚至有時候明明打開了，網頁重新整理，又被關閉了，因此這邊必須多次確認。
![](https://i.imgur.com/4YacOp4.png)

## 細節設定
這部分不一定要設定，依照您自己的意識去設定，不過筆者個人是很討厭Line幫我們設計的罐頭回復，所以這個我一定會關掉的。
![細節設定](https://i.imgur.com/IA6k7G7.png)

## 加入好友
您可以加入自己機器人的好友了，但機器人還沒有任何功能，所以密他並不會有任何回復喔（或者是罐頭回復）。
![加入好友](https://i.imgur.com/vkjcffM.png)

## 上傳程式碼到平台
完成這個步驟，您的機器人就活起來了！待會會將編寫好的程式碼，先上傳到Github中，再將Github與Heroku連接，進行部屬。

### 上傳程式碼到Github
請切換到各位剛辦好的Github專案，點選「Upload files」，並將四個檔案都拉進去。
![上傳程式碼到Github](https://i.imgur.com/t3bAnfc.png)

### Heroku與Github連接
請選擇Deployment method中的Github，以前機器人都是使用第一個heroku Git，他是使用終端機的方式。當初會這樣選擇是因為，當時github設置私有專案是要付費的，但現在變成免費的，那也會建議商管人用圖形化介面的Github就好，不要一直與終端機打交道。
![Heroku與Github連接](https://i.imgur.com/6xMMMe9.png)

### 佈署機器人
拉到最下方，按下Deploy Branch即可佈署了。
![佈署機器人](https://i.imgur.com/w6WBouS.png)

### 測試機器人
如果您的機器人有主動密你說：「你可以開始了」，那就代表「２.三大平台串接」的整個步驟沒有問題。這裡就可以發現，罐頭回復非常影響使用者體驗，因此建議回到「2–7:細節設定」的部分，將它關掉。
![測試機器人](https://i.imgur.com/IM2zV6W.png)

