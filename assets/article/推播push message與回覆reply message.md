# 推播push_message與回覆reply_message
![成品參考](https://i.imgur.com/4gVtarC.png)
> 若不知如何修改「你自己的token」、「你自己的secret」、「你自己的ID」，請參考文章「[Line Bot機器人串接與測試](/classification/lineBot/43)」中的影片教學。

push message 與 reply message兩者的差異很大，為了讓您更快明白，製作了以上比較表供您參考，主要差別有三個項目：

## 使用者主動
reply message必須要使用者先對機器人傳送訊息，機器人才會「回應」，相對的push message就是機器人可以主動傳訊息給使用者，在「推播文字push_message.py」的檔案中有所介紹。push message的主動回應是透過程式，因此可以直接使用Python下指令進行傳送訊息。

## 每次回覆數量
push_message由程式控制，因此想要讓機器人說幾句話都可以。相對的reply message的目的是「回應」，因此使用者說了一句話，機器人也只能回覆一句話。

## 每月回覆訊息限制
需要注意若LineBot是免費版本（輕用量）的話，每月只有500則push message的推播數量。
![每月回覆訊息限制](https://i.imgur.com/qICLjSM.png)
