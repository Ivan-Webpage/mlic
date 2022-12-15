# Python寄信基礎－寄送檔案教學
在前面的課「[Python寄Gmail基礎－文字樣式教學｜文字粗體、顏色通通可以改【附Python程式碼】]()」後，您可能會想問：那附件檔案的部分呢？的確，在企業中mail 除了拿來做訊息溝通外，也時常被拿來傳送一些較為正式的文件，因此本堂課程就來教您如何傳送word檔、PDF檔、圖片檔、CSV檔。

## 信件內容準備

這裡我們必須使用`email.mime`套件，並且需要利用`smtplib`套件進行SMTP協定的寄送，因此需要先將所有套件載入。
```python
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.application import MIMEApplication 
import smtplib
from pathlib import Path
```
首先，我們在寄信的時候，也是要打寄件者信箱、收件者信箱、標題等等，這些我們可以請Python程式幫我們自動帶入，但我們還是必須要給Python這些資料他們才能幫我們填入，因此這裡先行設定寄信相關參數。
```python
sendFrom = "寄件者信箱"
senderPassword = "寄件者密碼"
content = MIMEMultipart()  #建立MIMEMultipart物件
content["subject"] = "輸入您想要的郵件標題"  #郵件標題
content["from"] = sendFrom  #寄件者
content["to"] = "收件者信箱" #收件者
content.attach(MIMEText("Ivan的測試寄信，寄信處女作品～～"))  #郵件內容
```
## Gmail寄送圖片
寄送圖片必須要使用MIMEImage() 方法指定圖片，而圖片需要放在工作目錄下，若不知道Spyder 編輯器如何設定工作目錄的話，可以參考課程「
[Spyder使用教學]()」。
```python
content.attach(MIMEImage(Path("夕陽.jpg").read_bytes()))  # 郵件圖片內容</code></pre>
```

## Gmail寄送PDF檔案
首先使用MIMEApplication() 方法指定PDF檔案，並且需要利用add_header() 方法指定該檔案為attachment(附件)，最後利用attach() 方法將整包檔案附加在信件中。
```python
#寄送PDF檔案
fileName = 'test.pdf'
pdfload = MIMEApplication(open(fileName,'rb').read()) 
pdfload.add_header('Content-Disposition', 
                   'attachment', 
                   filename=fileName) 
content.attach(pdfload)
```
## Gmail寄送Word檔案
使用MIMEApplication() 方法指定word檔案，並且需要利用add_header() 方法指定該檔案為attachment(附件)，最後利用attach() 方法將整包檔案附加在信件中。
```python
#寄送Word檔案
fileName = 'test.docx'
pdfload = MIMEApplication(open(fileName,'rb').read()) 
pdfload.add_header('Content-Disposition', 
                   'attachment', 
                   filename=fileName) 
content.attach(pdfload)
```
## Gmail寄送CSV檔案
使用MIMEApplication() 方法指定CSV檔案，並且需要利用add_header() 方法指定該檔案為attachment(附件)，最後利用attach() 方法將整包檔案附加在信件中。
```python
#寄送csv檔案
fileName = '顧客訂單.csv'
pdfload = MIMEApplication(open(fileName,'rb').read()) 
pdfload.add_header('Content-Disposition', # 內容配置
                   'attachment', # 附件
                   filename=fileName) 
content.attach(pdfload)
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