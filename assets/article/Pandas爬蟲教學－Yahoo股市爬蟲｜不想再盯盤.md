# Pandas爬蟲教學－Yahoo股市爬蟲｜不想再盯盤
> 還不知道Get與Post請看「[資料傳遞Get與Post差異]()」
在課程「Html爬蟲Get教學－Yahoo」中使用get的方式爬蟲，在課程中也有提到此方法的不便之處。當要爬取Table 標籤內的資料，會因為標籤名稱都一樣，難以取得資料內容。在本課程使用Pandas 套件，利用 pd.read_html 方法，能直接取得網頁中所有的Table 標籤。
```python
getdata=pd.read_html(
    url, #想爬的網址
    encoding='big5', # 如何編碼爬下來的資料
    header=0, # 資料取代標題列
    )
```
pd.read_html 方法內主要有三個參數，其餘較少使用的參數可參考Pandas 官方文件：
* encoding：設定資料的編碼，通常會依照該網頁的編碼進行爬蟲。
* header：資料是否保留標題列，參數內容為0或1。
* attrs：table 標籤的屬性特色，方便擷取出想要的標籤

```python
getdata=pd.read_html(
    url, #想爬的網址
    encoding='big5', # 如何編碼爬下來的資料
    header=0, # 資料取代標題列
    attrs={'border':'2'}
    )
```
