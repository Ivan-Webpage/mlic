# 安裝套件教學ModuleNotFoundError: No module named
在執行Python的過程中，很常會出現`ModuleNotFoundError: No module named XXX`這個錯誤。許多初學者看到這個錯誤就卡住了，手足無措並懷疑自己是不是不適合學Python。其實看到這個錯誤的解決方式非常的簡單喔！

## 確認套件名稱
### Python套件別亂安裝，會中毒！
如果您直接認定錯誤訊息中`ModuleNotFoundError: No module named XXX`的「XXX」就是套件名稱，那是非常危險的一件事情。
1. 並不是每個套件的安裝名稱，與import進來的名稱都會相同，因此直接輸入指令可能會無法安裝。這個原因在「[匯入import](/classification/python_foundation/40)」課程會有所介紹。
2. 很多駭客看準了這點，故意寫一些惡意程式，命名成常被誤會的套件名稱，放在開源空間給開發者下載。沒錯，**亂下載pip套件包是會中毒的！**，[這裡有新聞](https://www.informationsecurity.com.tw/article/article_detail.aspx?aid=10031)不是嚇你而已。

### 尋找套件正確安裝指令
![Pypi官方網站](https://i.imgur.com/jgoAFsb.png)
「[Pypi](https://pypi.org/)」的官方網站中，整理了所有Python開源貢獻者的套件包，並且詳細記錄該套件的安裝指令、版本更新歷程記錄、使用說明、最近維護時間等，您可以將想要安裝的套件名稱在此網站中搜尋，即可找到該套件的正確安裝指令。

要先說明非常重要的一點，並不是[Pypi](https://pypi.org/)上面的套件就沒有病毒疑慮，只是[Pypi](https://pypi.org/)官方會去審核各個套件，因此**有病毒的機率較低**而已。且可以查看版本更新歷程記錄，來檢視這個套件存在多久了，如果已經建立了好幾年，還被數以萬計的開發者下載，那相對會是較為安全的套件。

## 下指令「pip install 套件名稱」
這時初學者們會想問：「這個指令要下在哪裡？」，這要看您的Python環境安裝在哪裡了，這樣講對於初學者來說太複雜了，我們換個方式！您是怎麼安裝編輯器的來做分類：
### 使用Anaconda安裝的編輯器
這代表您是依照課程「[Anaconda安裝，手把手教學，最詳細的安裝步驟說明](/classification/python_foundation/25)」安裝完成編輯器。這樣的話您只需要在您的作業系統中搜尋「Anaconda prompt」，打開Anaconda專屬的終端機，再輸入以下的指令即可：
```
ModuleNotFoundError: No module named 【套件名稱】
```

### 直接安裝Spyder或VS code
這代表您是依照課程「[Windows直接安裝Spyder，告別肥嘟嘟的Anaconda！](/classification/python_foundation/27)」或「[VS Code安裝與使用 ，2023年開發者最愛的IDE！](/classification/python_foundation/28)」安裝完成編輯器。如果您有依照「[Spyder指定Python環境](/classification/python_foundation/31)」的方式，將編輯器的Python與作業系統本身的Python環境設定一樣，那就直接在終端機中輸入以下指令即可：
```
ModuleNotFoundError: No module named 【套件名稱】
```
