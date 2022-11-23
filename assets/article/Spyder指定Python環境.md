# Spyder指定Python環境
在課程「Spyder使用教學」我們已經下載完Spyder，並且再「Windows直接裝Python」帶領您如何直接再Windows直接安裝Python。在 「Windows直接裝Python」課程中的Python路徑直接貼在Spyder的「Preferences（板手圖案）-> Python interpreter」，選擇「Use the following Python interpreter」並貼上Python路徑，後面必須加上「\python.exe」指定這個執行檔。
![](https://i.imgur.com/B0AkFtz.png)
```
C:\Users\你的使用者名稱\AppData\Local\Programs\Python\Python39\python.exe
```

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
pip install spyder-kernels==1.10.0
```

![](https://media.giphy.com/media/HHOedzzruPb3MMmtYx/giphy.gif)

切記！必須要指定版本「1.10.0」，否則一樣會無法使用Spyder的介面！

到這邊，Spyder的獨立Python就設定好瞜~~。