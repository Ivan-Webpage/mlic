# 傳送圖片ImageSendMessage
![成品參考](https://i.imgur.com/CoyQTQ6.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/classification/lineBot/43)」中的影片教學。

傳送圖片需要輸入以下2個參數：

* original_content_url：圖片的網路位置。
* preview_image_url：顯示圖片前，預先顯示的預覽畫面。
兩個參數內都須輸入網址，因此圖片也必須事前傳到網路上。另外preview_image_url參數的目的在於，機器人可能有時會傳送的圖片檔案較大，因此在還沒傳送完成前，先有一個預覽圖片，因此preview_image_url的圖片檔案建議越小越好。
在這邊筆者也分享一個不錯的圖片壓縮工具[Squoosh](https://squoosh.app/)，這個工具能大幅壓縮圖片，且能依照您能接受的解析與檔案大小進行調整，最讚的是~~免費~~：完全線上不必下載任何程式！
![Squoosh畫面](https://i.imgur.com/sohWOVD.png)
