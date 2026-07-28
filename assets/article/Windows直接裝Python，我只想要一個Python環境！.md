# Windows直接裝Python，我只想要一個Python環境！
不管是課程「[Windows直接安裝Spyder](/classification/python_foundation/27)」中自行建立Spyder，或者在「[VS Code安裝與使用](/classification/python_foundation/28)」課程中使用VS Code編輯器，我們想要這兩個編輯器都指向同一個Python環境，最好就是我們的C槽只有一個Python環境，所以編輯器、終端機都使用這個環境，這樣最不會造成困擾，也能夠大大節省電腦空間。
![https://www.python.org/downloads/windows/](https://i.imgur.com/vdAvfDs.png)

# 下載Python
[Python下載點](https://www.python.org/downloads/windows/)
首先直接點選以下連結的「Latest Python 3 Release — Python XXX」，在[行銷搬進大程式](https://marketingliveincode.com)的所有教學與文章都是使用Python 3的版本，因此您在此處安裝時，版本請選擇Python 3開頭的檔案下載連結。
![](https://i.imgur.com/FR5Eto9.png)
另一方面Python 2 現在也已經很少人再用了，且Python 2 的程式碼與Python 3 寫法有顯著的差異，因此若您安裝Python 2 的版本，那目前現在網路上大多數的Python資源您都會無法使用。

下去以後會到以上圖片的畫面，請拉到最下面選擇「Windows installer (64-bit)」，目前的新電腦都是64位元的。
![選擇想要下載的Python檔案](https://i.imgur.com/DD5ouDJ.png)

下載完後的執行檔，直接選擇Install Now，之後一直下一步下一步完成就好。

## Windows設定Python路徑
![尋找Python執行檔位置](https://media.giphy.com/media/lPWOtdU3qynDwDov8Z/giphy.gif)

先確認我們的Python安裝在哪個地方，可以在搜尋中直接搜尋「Python」，然後「開啟檔案位置」，以下是我的Python執行檔位置，若您沒有修該安裝路徑的話，應該也會跟我一樣。

```
C:\Users\你的使用者名稱\AppData\Local\Programs\Python\Python39
```
![link text](https://cdn-images-1.medium.com/max/1080/1*iBfi3ldoIqHuFw8P7_Hgrw.gif)
「進階系統設定」，點選「進階 -> 環境變數 -> XX使用者變數選Path」，在Path內點選新增以下兩行（如果你上面的路徑跟我一樣的話）。

```
C:\Users\你的使用者名稱\AppData\Local\Programs\Python\Python39\Scripts
C:\Users\你的使用者名稱\AppData\Local\Programs\Python\Python39
```
並且記得要將以下兩行上移到最上面，這樣當在終端機輸入Python時才會優先執行Python39的執行檔。如果您完成動作後，在終端機輸入「Python」後，終端機出現「>>>」讓您輸入Python指令，那就代表您設定成功了喔！
 
