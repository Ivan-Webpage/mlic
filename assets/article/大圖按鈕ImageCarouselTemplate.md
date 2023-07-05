# 大圖按鈕ImageCarouselTemplate
![成品參考](https://i.imgur.com/THgkSrj.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/classification/lineBot/43)」中的影片教學。

在ImageCarouselColumn方法中主要有以下兩個參數：
* image_url：大圖圖片位置。
* action：圖片功能。

而參數action中通常放置PostbackAction方法，且在方法裏頭有三個參數：
* label：按鈕標題。
* display_text：按下按鈕後所顯示的文字。
* data：按鈕實際傳送的文字。
