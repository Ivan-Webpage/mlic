# 傳送貼圖StickerSendMessage
![成品參考](https://i.imgur.com/4PTp9HM.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/classification/lineBot/43)」中的影片教學。

在[Line Developers的貼圖中心中](https://developers.line.biz/en/docs/messaging-api/sticker-list/#specify-sticker-in-message-object)，Line官方提供了不少貼圖，可以讓我們在使用LineBot的時候傳送，增加與客戶連結的好感度，更能增加趣味性，而在貼圖中心的尋找方式也非常的人性化，藉由選單的方式，查看您想要的貼圖。
![Line Developers的貼圖中心](https://i.imgur.com/WE1plF0.png)

傳送貼圖的方式，只需要利用StickerSendMessage() 方法，並輸入package_id 與 sticker_id 即可，例如若我想要傳送第四個熊大與鴨鴨一起睡覺的貼圖，那程式碼的寫法如下：
```python
StickerSendMessage(
             package_id='6359',
             sticker_id='11069851'         
)
```
