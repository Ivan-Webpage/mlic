# 傳送位置LocationSendMessage
![成品參考](https://i.imgur.com/RzwLDau.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試]()」中的影片教學。

想要傳送座標位置的第一步，首先要知道你想傳送的地點他的座標，我們可以利用Gooogle地圖來找到座標。只需要在想要的地標上點右鍵，即可取得該地區的座標位置。
![Gooogle地圖](https://i.imgur.com/tkuiOGP.png)
傳送座標位置需要用到LocationSendMessage() 方法，LocationSendMessage的使用參數如下，並且對應分別要填入的資料：

* title：顯示的大標題
* address顯示的小標題
* latitude：緯度
* longitude：經度
