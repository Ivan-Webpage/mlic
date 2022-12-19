# Heroku要收費了我的LineBot怎麼辦？Fly.io正在向你招手，聊天機器人手把手建置【2022年最新Python更新版】
## 前言
如果您之前有看過我的[LineBot聊天機器人](/article?a=13)文章，您對Heroku肯定不陌生，介面非常好用又方便佈署我們的LineBot機器人。很不幸的是Heroku即將在2022/11/28停止免費的服務，換句話說，[LineBot聊天機器人](/article?a=13)文章教您的機器人不能用了！這對於[行銷搬進大程式](https://marketingliveincode.com/)來說絕對是災難性的，關於機器人的課程都不能用了，我當然不能讓這種事情發生，因此開始汲汲營營尋找Heroku的替代方案。

還好！前幾看到大神[黑暗執行序](https://blog.darkthread.net/)所寫的文章：[Heroku 替代方案 - Fly.io 平台之 ASP.NET Core 部署筆記](https://blog.darkthread.net/blog/deploy-aspnetcore-to-fly-io/)，身為客家人的筆者馬上被吸引，尤其是說到「逐水草而居的免費仔」臉就有點紅紅腫腫的感覺，這就是要的實作！
![Line Bot機器人建置圖](https://i.imgur.com/NPgNwCB.png)
## Fly.io收費方式
相信您也是衝著免費來的，因此這裡就只分享免費的服務上限：
* 最多3個 shared-cpu-1x 256MB VM，說人話就是一核心，256記憶體的虛擬機。
* 3GB 持久卷(volume)存儲，說人話就是硬碟空間總共3G，這是三個虛擬機加起來喔！
* 出站數據傳輸量（就是網路流量，把它當成辦電信方案就懂了）依照地區分類：
    * 北美歐洲 100GB
    * 南美亞太非洲地中海 30GB
    * 印度 30GB

以上的條件看起來有些嚴苛，但是您做過[LineBot聊天機器人](/article?a=13)的讀者們肯定知道，這些條件拿來做LineBot已經綽綽有餘了，如果只是掛一些Demo網站也是非常足夠的。
另外筆者也在猜，Fly.io趁著這次Heroku撤除免費服務的機會增加客戶數，這個操作有沒有很熟悉？相信您理解以下兩個道理：
1. [公司法第一條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1)，公司必須以營利為目的。
2. 養套殺SOP。
不排除以後我們還是要繼續逐水草而居，因此請持續關注[行銷搬進大程式](https://marketingliveincode.com/)來獲得最新消息喔！

## 下載LineBot範例
在[LineBot範例檔案](https://github.com/rifleak74/MarketDataScience/tree/master/%E8%A1%8C%E9%8A%B7%E5%AF%A6%E7%94%A8%E5%B7%A5%E5%85%B7/Linebot-Basic)中，裡面有三個檔案，簡單與您介紹，可以先將其下在下來：
![下載LineBot範例](https://i.imgur.com/EpSnvzt.png)


* **app.py：**
機器人的主程式，本文章會修改的程式碼都在這個檔案中。檔案內的方法handle_message(event)是主要編輯區塊，所有與使用者對答的邏輯都在這裡實作（程式碼41～44行）。
![app.py](https://i.imgur.com/IBVrzmp.png)


* **requirements.txt：**
告訴Heroku要安裝哪一些套件。requirement的意思就是先決條件，要搭建這個機器人，需要用到的套件，就是他的先決條件。

* **Procfile：**
Heroku所需要的文件，讓Heroku的主機知道要開啟機器人的主程式是哪一個。因此檔案app.py的名稱若有做修改，這裡面也必須一起修改。

我先在我的桌面中建立一個叫做「testbot」的資料夾，並將三個檔案都放進去。
## 平台創建
### 1. Github（若想要直接從本機端佈署可以跳過此步驟）
如果您走軟體業，不能不知道這個平台。Github是目前全世界最大的git平台，簡單來說，就是能將程式碼傳上去的平台，當然還支援版本控制、共同開發等。很多公司應徵工程師，都會看您在Github上的專案貢獻喔！
由於2018年微軟收購了Github平台，本來Github的私有功能（就是別人看不到您傳上去的程式碼）是要付費的，現在免費了，因此我們選擇用Github平台作為部屬的媒介。部屬過程會很繁瑣，但對於商管人來說，friendly的圖形化界面更重要
#### 創立Github帳號
請到[Github官方網站](https://github.com/)申辦。因為資安意識的抬頭，帳號申請加入了很多機器人驗證的過程。
![創立Github帳號](https://i.imgur.com/jSgH2pu.png)
#### 創立Github專案
專案的名稱只要不要在帳號中有重複即可。**非常重要的一點，必須要句選Privite**，否則等等上傳的程式碼中，會有您機器人的「密碼」，如果別人知道這組密碼，那它就可以利用您的機器人，隨意散播訊息，甚至是不法用途。
![創建新的Github專案](https://i.imgur.com/lB9lYfw.png)
到這裡網站先放著，我們先來準備其他東西！
### 3. Line Developer
近年來Line經過多次的改革，將原本的Line developer跟分隔成原本的Line developer 與 Line manager（之後兩者都會用到）。商管人可能對於 Line manager會比較熟係，最有名就是Line @，但最近修改條約後，收費大幅度上升，相對我們今天的主軸，Line bot的價格便宜了很多。
#### Line@收費
![資料來自Line@官方](https://i.imgur.com/InwSdy4.png)
#### Linebot收費
![資料來自Line Developer](https://i.imgur.com/yrSHdXW.png)
#### 登入Line Developer
接下來到[Line developer](https://developers.line.biz/en/)創建屬於自己的Linebot機器人專案，先登入自己的Line帳號後，就可以進入了。由於一般大家Line都是用手機自動登入，很多人早就忘記密碼是多少，因此還有提供QR code的登入方式，您可以多多利用。
![圖片來自Line Developer官方網站](https://i.imgur.com/vkzXgwa.jpg)
#### 創立providers
providers的意思是提供者，可以把它當作專案的分類資料夾。通常會將私人使用的機器人，與公司的機器人分開。
![創建providers](https://i.imgur.com/3rAkslA.png)
![輸入新名稱](https://i.imgur.com/uw1j7lT.png)
#### 創立機器人專案
選擇「Create a new channel」後，在channel中選「Messaging API」。
![建立Messaging API](https://i.imgur.com/dDlemXr.png)
輸入機器人的基本資料。其中要注意的是channel name的部分，也就是機器人的名稱。這個名稱雖然之後可以做修改，但改完後有7天不能更動，因此命名還是要決定好再輸入。
![輸入機器人的基本資料](https://i.imgur.com/Yd2slvA.png)
填寫完成送出後，就成功地建立了LineBot專案了。
![成功地建立了LineBot專案](https://i.imgur.com/ekMhEJU.png)

到這裡網站先放著，我們先來準備其他東西！


### 3. Fly.io
#### 註冊帳號
前面已經介紹不少關於Fly.io的資訊，因此不再多說了。請到[Fly的官方網站](https://fly.io/)註冊帳號，帳號註冊完成後，您應該會看到以下畫面。
![Fly.io初始畫面](https://i.imgur.com/GeNVzQw.png)
#### 安裝flyctl工具
不同的作業系統安裝方式不一樣，依照Fly的[安裝Flyctl教學文件](https://fly.io/docs/hands-on/install-flyctl/)指示。
* **macOS**請在Terminal中輸入`brew install flyctl`，如果無法執行，請改為輸入`curl -L https://fly.io/install.sh | sh`

* **windows**則需要再Powershell(不是cmd喔)中輸入`iwr https://fly.io/install.ps1 -useb | iex`

* **Linux**直接在Temial中輸入`curl -L https://fly.io/install.sh | sh`

筆者的作業系統是windows，因此我就輸入windows指令。
![](https://i.imgur.com/R1rPVQX.png)

#### 利用flyctl登入
這裡會需要用到一點終端機介面，對黑底白字畫面敏感的您請忍耐一下！請回到「**終端機（CMD）**」當中，如果您是APPLE電腦就一樣使用Terminal，而後輸入以下指令進行登入動作，就會跳出瀏覽器要求您登入，如果您剛剛已經登入過了，那就可以直接點選「Continue as XXXXX」進行登入：
`flyctl auth login`
![flyctl登入](https://i.imgur.com/2tWz7p0.png)
![看到這行代表登入成功](https://i.imgur.com/5z3tcku.png)

#### 創建新的Fly專案
請先CD到剛剛存下LineBot範例檔案的位置，如筆者的範例是放在我桌面的「ivantest」資料夾中，因此就先在終端機中輸入以下兩行切換到此目錄：
```
cd Desktop
cd testbot
```
![創建新的Fly專案](https://i.imgur.com/7oOco08.png)

請接著執行以下程式碼開始新建專案。一開始會先詢問您這個專案的名稱，如果您的機器人會公開給客戶親友使用的話，這個名字不會被他們看到，您可以放心地取名，這裡我就取「ivantest」：
`flyctl launch`
這裡命名需要注意命名規則，只能接受小寫英文字母、數字、還有「_」，否則就會出現以下錯誤訊息：
`Validation failed:Name may only contaion numbers. lovercase letters and dashes`
![Validation failed:Name may only contaion numbers. lovercase letters and dashes](https://i.imgur.com/LED4Mls.png)

![輸入APP名稱](https://i.imgur.com/aNrd21X.png)
接著會問您想要將這個服務建立在哪裡，伺服器當然是離我們越近越好，底點選項看來只有東京跟香港離我們比較近，因此我這裡選擇香港，打上香港的代號「hkg」。
![主機位置](https://i.imgur.com/rZgtB4c.png)
因為我們並沒有進行專案分類，因此直接設定到「Personal」裡面，若您想要進行分類，可以到網站中的左上角選擇「Creat Organization」，這裡先已完成專案為主，就不贅述。
而後問我們是否要建立Postgresql這個~~古老的~~資料庫，我們現在不需要用到，因此打上「N」。
![是否要建立Postgresql](https://i.imgur.com/tkeFWXX.png)
最後問我們是否要現在就佈署，~~檔案還沒準備好怎麼佈署~~，我們先選擇「Ｎ」，等整理好檔案後再進行佈署。
![先不要佈署](https://i.imgur.com/p3WLaeP.png)
最後出現以下畫面，就是建立完成了。
![建立完成](https://i.imgur.com/1U8JKxu.png)
回到檔案資料夾中，可以發現多了一個「fly.toml」的檔案，這是上傳到fly中所需要的設定檔，因此我們不要做更動
![fly.toml](https://i.imgur.com/2TmCghX.png)

## 合併三大平台
### 貼上Channel secret
我們剛剛在Line Developer申請好的機器人專案中，有一個「Channel secret」的選項，貼到您剛剛下載的app.py檔案中，第17行的位置。
![貼上Channel secret](https://i.imgur.com/B8mbWXH.png)
`handler = WebhookHandler('你自己的secret')`
依照我的範例，完成後應該如下：
`handler = WebhookHandler('你自己的secret')`

### 貼上Your user ID
找到「Your user ID」，並複製到app.py檔案中，第19行的位置。
![貼上Your user ID](https://i.imgur.com/uHfYr0k.png)
`line_bot_api.push_message('你自己的ID', TextSendMessage(text='你可以開始了'))`
依照我的範例，完成後應該如下：
`line_bot_api.push_message('U1631af466f4d8ad30fd93a02bb0416ba', TextSendMessage(text='你可以開始了'))`

### 貼上Channel access token
切換上方的選項Messaging API，找到「Channel access token」並按下後方的Issue，即可得到token，並複製到app.py檔案中，第15行的位置。
> 請注意！若有心人士拿到這個token，他就可以操控您的機器人，因此請妥善保管。

![貼上Channel access token](https://i.imgur.com/tSiilEC.png)
`line_bot_api = LineBotApi('你自己的token')`
依照我的範例，完成後應該如下：
`line_bot_api = LineBotApi('E9d+OYcA5GOPfVuT5AmSuhQEAWhilEN56LVkMt5XdnBzyhe2C6Y5HRvKepuYk/ywW7tgiN2pcPC7GHiAsEuuP6QJTl6qzcP78Z6J07yJIMGPdGU1i0ELBaRgGSKuJJyk8pKqVnHlmL3pTVp5acXE4gdB04t89/1O/w1cDnyilFU=')`

> 以上三步完成後記得存檔，另外不要直接copy筆者的token等等，教學文章完成後我就把機器人刪除了，想壞壞也沒轍喔！

### 設定Webhook URL
一樣在選項Messaging API中，找到「Webhook settings」並輸入以下網址：
`https://【你的fly傳案名稱】.fly.dev/callback`
![設定Webhook URL](https://i.imgur.com/Haq3CLX.png)
如果您點選後跳出以下錯誤屬於正常狀態，因為我們的fly專案還沒佈署，因此此網址還沒啟用，所以Line Developer抓不到很正常。
`An incorrect parameter or value may have been specified. Please check that the parameters and values are correct and try again.`
![貼上網址](https://i.imgur.com/6ufzNTb.png)
除了網址的設定外，下方的Use Webhook也要打開喔！
![Webhook也要打開](https://i.imgur.com/GpYTuc8.png)
### 細節設定
這部分不一定要設定。
![](https://i.imgur.com/hJ5xV8q.png)

### 加入好友
您可以加入自己機器人的好友了，但機器人還沒有任何功能，所以密他並不會有任何回復喔（或者是罐頭回復）。
![作者客人是全都關掉](https://i.imgur.com/NUtScAT.png)

## 開始部屬
Fly.io的佈署方式有很多，這裡分享兩個比較親民的方式提供給您。如果您有選擇障礙，這裡做一些分類給您參考，您可以詳讀後依照自己的需求做選擇：

|  | Github自動部屬 | FlyCtl部屬 |
| --- | --- | --- |
| 建置時使用終端機 | 是 | 是 |
| 之後更新使用終端機 | 否 | 是 |
| 串聯github平台 | 是 | 否 |
| 儲存程式碼 | 是，存在Github | 自己電腦 |
| 資安疑慮 | 放在網路平台就是有絕對風險，駭客無所不在 | 依照您自己的資安意識 |

這裡先說筆者心得，雖然Github自動部屬聽起來很方便，但實際的操作也不是很簡單，而且仍然需要使用到終端機介面，相對來說使用FlyCtl佈署，只需要簡單幾個指令即可完成，我個人是比較喜歡FlyCtl佈署的方式。但若從系統維護的角度來看，Github絕對是絕佳的選擇，程式碼的儲存與版本控制都交給Github了，對一整個開發團隊來說是一件好事情（但token跟secret放在Github上面還是有點毛毛的）。
### 部屬方式：Github自動部屬
#### 取得Fly.io的token
首先在flyctl中輸入以下指令，已取得token，待會要利用這個token讓github連接到fly.io進行自動佈署。
`flyctl auth token`
![取得Fly.io的token](https://i.imgur.com/eCkWvWi.png)

#### 設置Fly.io的Secrets
請直接在flyctl中輸入以下指令，以用來指定這個Fly專案會連接到哪個Github專案：
`flyctl secrets set githubPush=【你的github專案網址】`
![設置Fly.io的Secrets](https://i.imgur.com/5L8DLJz.png)
其中「githubPush」是您可以隨意命名的變數，因此不一定要跟筆者的一樣。
完成後可以到fly的專案中點選「Secrets」，就會看到剛剛的設定出來了！
![fly的專案中成功出現Secrets](https://i.imgur.com/djhxhwL.png)

#### 設置Github的Actions
到我們建立好的Github專案中，點選上排「setting」選項後，選擇左方選單的「Secrets > Actions」。
![設置Github的Actions](https://i.imgur.com/9haDlRf.png)
而後點選右方的「New repostory secret」按鈕。
![New repostory secret](https://i.imgur.com/BP9285M.png)
接著會看到輸入的畫面，name的部分請輸入「FLY_API_TOKEN」（這個一定要跟我一樣喔！），Secret則是剛剛我們利用flyctl製造出來的token。
![FLY_API_TOKEN](https://i.imgur.com/IZsCQwz.png)
設定完成後就會看到以下畫面。
![建立成功](https://i.imgur.com/R9OA2Rs.png)

#### 設定Fly的yml檔案
Github提供許多已經成形的Workflows（不知道是什麼也不重要），但這裡面並沒有fly.io的選項。不過沒有關係，我們自己建立就好，因此**隨便找一個Configure點擊**即可，待會裡面的內容會全部修改。
![隨便選一個就好](https://i.imgur.com/3xny1Kr.png)
接著修改掉檔案名稱，改為「main.yml」，並且將下方的文字輸入區域改為以下的code：
```=yml
name: Fly Deploy
on: [push]
env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
jobs:
  deploy:
      name: Deploy app
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: superfly/flyctl-actions/setup-flyctl@master
        - run: flyctl deploy --remote-only
```
完成後按下右方的綠色按鈕「Start Commit」即可。
![貼上後畫面如下](https://i.imgur.com/bxrBqfI.png)
完成後會發現在您的github專案中，多了一個資料夾路徑與檔案：
`.github/workflows/main.yml`
![可檢查您的專案資料夾](https://i.imgur.com/KAcx7Nl.png)

#### 上傳Github完成自動佈署
最後我們便可以將剛剛整理好的檔案全部丟上Github專案中，只要一丟上去，就會啟動自動佈署功能。
![上傳Github](https://i.imgur.com/Tv6QFk4.jpg)
想要檢查一下有沒有正常佈署，一來是可以在github專案中點選上排選單「Actions」，即可看到有沒有成功佈署。這裡為了教學，我特別刻意把code亂改導致佈署失敗，可以很明顯區別佈署成功（綠色）與失敗（紅色）
![查看佈署狀態](https://i.imgur.com/jmDqJy3.png)
也可以到fly.io的「Activity」裡面查看喔！任何關於fly.io的動作都會在這裡被記錄。
![fly.io動作紀錄](https://i.imgur.com/Z4eXLJ6.png)


### 部屬方式：FlyCtl佈署
在flyctl中輸入以下指令，就會開始進行佈署了：
`flyctl deploy`
![flyctl deploy執行畫面](https://i.imgur.com/OXCYkOk.png)
若最後有出現「Successfully」那就是佈署成功了。
![佈署成功](https://i.imgur.com/fLne2Fe.png)

## LineBot成品
睽違了兩年又再重新佈署一次LineBot機器人（筆者早就換Telegram去了），兩次的差別就在於佈署的平台，因此對筆者來說，兩邊的使用心得我都有深刻參與。整體來說我還是比較喜歡Heroku的，因為不管事終端機還是用Github佈署的整個操作都是比較順暢的，有用過Heroku Github佈署的讀者更能體會，Heroku Github佈署對非工程師朋友非常友善。Fly.io也並非一無是處，還記得Heroku免費版的情況下，若機器人閒置超過30分鐘以上，就會睡眠。但就筆者的測試，Fly.io免費版是沒有睡眠的，所以如果你今天想要掛網站服務也可以考慮喔！

![LineBot成品](https://i.imgur.com/TDaBPDd.jpg)

## Debug問題日誌
### 禁用VPN等網路環境
若您的網路環境是在進入VPN的狀態，會無法佈署fly.io，會出現以下錯誤，因此需要將VPN關掉。
`failed to fetch an image or build from source: failed building options: failed probing "你的專案集名稱": context deadline exceeded`
![failed to fetch an image or build from source: failed building options: failed probing "你的專案集名稱": context deadline exceeded](https://i.imgur.com/9LMCceI.png)

### 專案衝突
有時候佈署會遭遇亂流，或是前一次佈署失敗後，導致這個專案佈署都卡住，最保險的作法是到fly.io的地方將這整個專案刪除後重新佈署，即可解決此問題
`failed to fetch an image or build from source: remote builder app unavailable`
![failed to fetch an image or build from source: remote builder app unavailable](https://i.imgur.com/jmWFm9f.png)

### 信用卡安全問題
您有可能在輸入指令`flyctl launch`的時候，或者是在您的帳號設定中，看到以下錯誤訊息：
```
Error Your account got flagged by our internal fraud protection service, please contact support@fly.io
```
![Error Your account got flagged by our internal fraud protection service, please contact support@fly.io](https://i.imgur.com/4V2loH9.png)
![Error Your account got flagged by our internal fraud protection service, please contact support@fly.io](https://i.imgur.com/X9eirU3.png)
這代表您的信用卡是有金融風險疑慮的(講直白就是非法金流)問題，因此整個帳號會被鎖定，目前看來是只能重辦帳號，並且不要再用那張信用卡註冊了。

### 付款方式
您可能在`flyctl launch`的時候會看到以下錯誤訊息：
`Error We need your payment information to continue! Add a credit card or buy credit: https://fly.io/dashboard/ppc4088-gmail-com/billing`
![Error We need your payment information to continue! Add a credit card or buy credit: https://fly.io/dashboard/ppc4088-gmail-com/billing](https://i.imgur.com/VlKE4Je.png)
這代表您的帳號還沒有設定付款方式，請到您帳號左手邊欄位的Billing按鈕當中設定。
![新增信用卡](https://i.imgur.com/eBBwYPu.png)

### flyctl lunch出現error
![Error: name argument or flag must be specified when not running interactively，圖片由Chen Bo-yan提供](https://i.imgur.com/KTFiAsF.jpg)
您執行了`flyctl lunch`，並且問您是否建立Proflie，不管您按下是還是否，都出現以下的錯誤：
```
Error: name argument or flag must be specified when not running interactively
```
在此情況下，我們必須換另一種指令來建立專案：
```
flyctl launch --name 【你的APP名稱】 --region yyz
```
「你的APP名稱」這個部分是隨意命名的，就是為自己即將建立的fly專案命名，因此不要跟自己原有的專案名稱重複就好了，當然若您是第一次使用，則沒有這個問題
