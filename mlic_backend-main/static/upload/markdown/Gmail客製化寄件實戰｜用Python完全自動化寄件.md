# Gmail客製化寄件實戰｜用Python完全自動化寄件

> 前面的基礎要先看喔！
> 1. [Gmail設定自動寄信專案｜從此不用再慢慢發信了【手把手影片教學】](/classification/crawler_king/92)
> 2. [Python寄Gmail基礎－文字樣式教學｜文字粗體、顏色通通可以改【附Python程式碼】](/classification/crawler_king/93)
> 3. [Python寄信基礎－寄送檔案教學｜用程式附檔Word、PDF、CSV、圖片都可以【附程式碼】](/classification/crawler_king/94)

在學習完前面的課程後，基本上在Gmail寄件時會使用到的功能，我們都會用Python幫我們解決了，因此接下來我們便來模擬行銷人常常碰到的問題，如何客製化每封信件，並且達到自動化寄件的目的。

## 信件內容準備
這裡我們必須使用`email.mime`套件，並且需要利用`smtplib`套件進行SMTP協定的寄送，因此需要先將所有套件載入。
```python
import pandas as pd
import smtplib
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
```

![顧客訂單.csv](https://cdn-images-1.medium.com/max/1200/1*Qnrh7jrgiVMP-6kxj5X8dQ.png)
這次我們假設的情境，想要讓Python 依照公司的顧客訂單，自動幫我們發送信件給每位顧客，因此我們需要先載入顧客訂單資料。
```python
custemor = pd.read_csv('顧客訂單.csv')
sendFrom = "寄件者信箱"
senderPassword = "寄件者密碼"
```
## 準備附件檔案的方法
相信您在看完「[Python寄信基礎－寄送檔案教學｜用程式附檔Word、PDF、CSV、圖片都可以【附程式碼】](/classification/crawler_king/94)」課程後一定會有一個想法：好像大部分的附件程式碼都是一樣的，因此這裡直接將其寫成一個def 方法即可，只需要給予信件的物件與想寄送的檔案名稱即可。
```python
#寄送檔案專用
def sendFile(fileName, content):
    pdfload = MIMEApplication(open(fileName,'rb').read()) 
    pdfload.add_header('Content-Disposition', 
                       'attachment', 
                       filename=fileName) 
    content.attach(pdfload) 
    return content
```
## 開始每一筆資料寄送信件
這裡是使用「顧客訂單.csv」檔案內的各個資料，因此需要使用for 迴圈一個個顧客發送信件。
```python
#開始每一筆資料進去客製化的寄送信件
for coste in range(len(custemor)):
    
```
首先需要利用性別的欄位，來確認等等信件的稱謂是先生還是小姐，並且存在gender 變數當中。
```python
message=''
#先確認性別，決定給予什麼稱謂
if custemor.iloc[coste]['性別'] == '男':
    gender='先生'
else:
    gender='小姐'
    
```

將所有的客製化資料都放入message 變數當中。
```python
# 整理將要傳送出去的文字
message += '親愛的 {} {} 您好：\n\n非常感謝您在本店購買「{}」{}個，共 {}元。\n\nIvan股份有限公司\nMediemJ文章：https://medium.com/@ivanyang0606'.format(
                custemor.iloc[coste]['姓名'], 
                gender,
                custemor.iloc[coste]['購買商品'],
                custemor.iloc[coste]['數量'],
                custemor.iloc[coste]['購買總金額'],
                )
```
設定信件的收件者。
```python
content = MIMEMultipart()  #建立MIMEMultipart物件
content["subject"] = "【行銷辦進大程式】感謝您的光顧"  #郵件標題
content["from"] = sendFrom
content["to"] = custemor.iloc[coste]['電子郵件'] #收件者
content.attach(MIMEText(message))  #郵件內容
```

此範例中寄送圖片、Word檔案、PDF檔案，並且呼叫剛剛建立的sendFile() 方法，藉此呈現若要寄送多個檔案的時候，Python 該要如何寫。
```python
#以下為檔案附件，若要客製化寄送不同的附件，可以用if來達成
content.attach(MIMEImage(Path("夕陽.jpg").read_bytes()))  # 郵件圖片內容
for file in ['test.pdf','test.docx','顧客訂單.csv']: #把想寄送的黨名直接放在陣列，讓程式自動去抓取
    content = sendFile(file, content)
```
## 信件寄送
在信件內容確定後，執行以下程式碼，就會記送信件了。
```python
with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
    try:
        smtp.ehlo()  # 驗證SMTP伺服器
        smtp.starttls()  # 建立加密傳輸
        smtp.login( sendFrom, senderPassword)  # 登入寄件者gmail
        smtp.send_message(content)  # 寄送郵件
        print("成功傳送")
    except Exception as e:
        print("Error message: ", e)
```
