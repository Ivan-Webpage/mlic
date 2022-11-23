# 選擇按鈕ConfirmTemplate
![成品參考](https://i.imgur.com/4jNESB4.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試]()」中的影片教學。
範例中使用PostbackAction() 方法與MessageAction() 方法，分別使用post概念傳送資料，與直接傳送文字資料的方式。每個參數的解釋如下：

* text：問題標題
* PostbackAction：按鈕。傳送post資料，也就是顯示的資料與回傳的資料不同。
* MessageAction：按鈕。會直接顯示資料內容。

```python
ConfirmTemplate(
    text='你喜這堂課嗎？',
    actions=[
        PostbackAction(
            label='喜歡',
            display_text='超喜歡',
            data='action=其實不喜歡'
        ),
        MessageAction(
            label='愛',
            text='愛愛'
        )
    ]
)
```
