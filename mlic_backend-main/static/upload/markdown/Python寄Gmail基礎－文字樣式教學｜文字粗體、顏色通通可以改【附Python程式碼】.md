# Python寄Gmail基礎－文字樣式教學｜文字粗體、顏色通通可以改【附Python程式碼】

在完成前面的課「[Gmail設定自動寄信專案｜從此不用再慢慢發信了【手把手影片教學】](/classification/crawler_king/92)」後，緊接著我們要開始了解如何使用Python，將我們想要表達的文字，傳送給Gmail進行寄送的動作，因此本課程將詳細介紹python 的email 套件，與其中的參數內容。

## 信件內容準備
這裡我們必須使用`email.mime`套件，並且需要利用`smtplib`套件進行SMTP協定的寄送，因此需要先將所有套件載入。
```python
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
```


首先，我們在寄信的時候，也是要打寄件者信箱、收件者信箱、標題等等，這些我們可以請Python程式幫我們自動帶入，但我們還是必須要給Python這些資料他們才能幫我們填入，因此這裡先行設定寄信相關參數。</p>
```python
sendFrom = "寄件者信箱"
senderPassword = "寄件者密碼"
content = MIMEMultipart()  #建立MIMEMultipart物件
content["subject"] = "輸入您想要的郵件標題"  #郵件標題
content["from"] = sendFrom  #寄件者
content["to"] = "收件者信箱" #收件者
```

內文的部分，如果想要有客製化的文字，例如粗體、顏色、不同大小，都可以使用HTML的方式進行調整。
```python
content.attach(
    MIMEText("""
        親愛的 &lt;u&gt;Ivan&lt;/u&gt;您好：&lt;br&gt;&lt;br&gt;
                        
        想要學Python卻不知從何開始嗎？&lt;b&gt;您有個系統性的選擇！&lt;/b&gt; &lt;br&gt;
        趕快手刀點擊&lt;a href="https://marketingliveincode.com"&gt;行銷搬進大程式&lt;/a&gt;。
                        
        """
        , "html"))  #郵件內容
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
