# Spyder指定Python環境
除非是非常專業的Python開發者，否則一開始進行學習的初學者，非常忌諱開發環境混亂。若有兩個以上的Python開發環境，初學者也搞不清楚自己把某套件安裝在哪個環境中，會導致開發效率降低，甚至想要放棄寫Python的念頭。避免後續的路途坎坷，那現在我就幫你把柏油路鋪好！

## 還沒安裝Spyder與Python？
在課程「[Spyder使用教學](/classification/python_foundation/26)」我們已經下載完Spyder，並且再「[Windows直接裝Python](/classification/python_foundation/27)」帶領您如何直接再Windows直接安裝Python，因此若您還沒看以下的文章與教學影片，可以先行觀賞。
> [Spyder使用教學](/classification/python_foundation/26)
> [Windows直接裝Python](/classification/python_foundation/27)

## 我的電腦Python環境在哪裡？
尋找自己的Python環境位置很簡單，以下依照條列步驟帶領您尋找Python環境位置：　
1. 打開終端機，可以輸入CMD或終端機。若為Mac電腦則是打開Terminal。
2. 在終端機中輸入指令`where python`，就會顯示您現在電腦的Python環境，作者的Python環境有兩個。正常來說，您照課程進行下來，只會有一個環境喔！
![作者的Python環境](https://i.imgur.com/b86oXPa.png)

## Spyder指定Python環境
接下來我們就用條列的方式，方便您操作與理解：
1. 首先打開Spyder編輯器。
2. 在上方的工具列中，找到「板手圖案」，或者選擇「Tools > Preferences」，就會進到Spyder的設定畫面中。(圖案可參考下圖)
3. 在左方的選單中，選擇「Python interpreter」這個選項，切換「Python interpreter」選項後就會看到右方的表單轉換。
4. 在右方的表單中，在「Python interpreter」的地方，切換選項到「Use the following Python interpreter」。
5. 切換選項後下方的方格就可以輸入文字，這裡就可以直接輸入您的python環境位置(前一小截取得的位置)，這裡顯示作者的路徑給您參考：
   ```
   C:\Users\你的使用者名稱\AppData\Local\Programs\Python\Python310\python.exe
   ```
6. 輸入完成後，按下最下方的按鈕「Apply」，接著重開一個console或者重新啟動Spyder即可。
![](https://i.imgur.com/B0AkFtz.png)


## 重新安裝套件Spyder-kernels
![An error ocurred while starting the kernel](https://i.imgur.com/O18jHLi.png)

也許您做完以上的作業，直接打開Spyder，終於要開始大顯身手時，竟然發現跳出這個錯誤：

```
An error ocurred while starting the kernel
Your Python environment or installation doesn't have the spyder‑kernels module or the right version of it installed (>= 1.10.0 and < 1.11.0). Without this module is not possible for Spyder to create a console for you.
You can install it by running in a system terminal:
conda install spyder‑kernels
or
pip install spyder‑kernels
```

這是代表說這個Python環境中沒有spyder-kernels這個套件，要有這個套件Spyder才能運行Python，因此需要輸入以下指令：
```
pip install spyder-kernels==您指定的版本
```
「您指定的版本」是看錯誤訊息中，提示您要安裝哪個版本的`spyder-kernels`套件。因為隨著Python與Spyder IDE不斷的更新，spyder-kernels套件需要的版本也會有所不同。以作者的現在的環境範例中，因為錯誤訊息中敘述「`...the right version of it installed (>= 1.10.0 and < 1.11.0...)`」，表示要裝大於`1.10.0`以上的版本，因此我會這樣下指令：　
```
pip install spyder-kernels==1.10.0
```

![](https://media.giphy.com/media/HHOedzzruPb3MMmtYx/giphy.gif)

切記！必須要「指定版本」，否則一樣會無法使用Spyder的介面！

到這邊，Spyder的獨立Python就設定好瞜~~。
