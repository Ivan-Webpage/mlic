# 傳送音訊AudioSendMessage
![成品參考](https://i.imgur.com/J4QAZWf.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/class?c=2&a=66)」中的影片教學。

想要傳送的音訊必須要是以URL的形式傳送，換句話說，要先將音訊檔案事先放在網路上，再將該音訊的網址傳送給LineBot聊天機器人，AudioSendMessage() 方法內的兩個參數解釋如下：

* original_content_url：是音訊檔案在網路上的連結
* duration：是顯示音訊檔案的時間，所以手機螢幕上所顯示的音訊時間，並不一定是實際音訊的時間。

