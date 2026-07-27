# 快速回復QuickReply
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/classification/lineBot/43)」中的影片教學。

QuickReply() 方法能夠呈現快問快答的效果，因此在與使用者的互動上能達到許多有趣的效果，特別是在季節活動上。

QuickReply() 方法內的按鈕需要使用QuickReplyButton() 方法才可以執行，而QuickReplyButton() 內有label、text兩個參數內容如下：

* label：顯示的文字。
* text：傳送的文字。
