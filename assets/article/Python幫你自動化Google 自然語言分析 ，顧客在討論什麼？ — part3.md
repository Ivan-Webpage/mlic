# Python幫你自動化Google 自然語言分析 ，顧客在討論什麼？ — part3

> 關鍵字分析，是AI時代的基本盤

## 前情提要
在前篇文章[「Python幫你自動化Google 自然語言分析 ，NLP套件大解密 — part2」]()中，我們學會了如何使用Google串接Python，達到自動化的語意分析，但當我們知道消費者對我們的品牌的正負評價後，更想知道的是，顧客喜歡我們的甚麼？討厭我們的甚麼?

## Google 關鍵字分析
![完整程式碼](https://i.imgur.com/GFgLcNw.png)

程式中的範例與前篇文章相同，也必須使用同一個憑證檔案，因此必須將憑證檔案改成自己的。
```python
text= '想與姊妹掏來個下午茶談天時光，應該不少人都會想到咖啡廳聚集地 - 捷運中山站，除了幾間著名大家耳熟能詳的咖啡'# （因為過多，詳情請看github程式碼，以下省略...）
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '你的憑證檔案名稱.json'
```

分析前所需設定的參數，大多都與情緒分析相同，但在關鍵字分析當中，多了一項特殊的參數－語言，這裡將語言參數設定為「zh-Hant」，代表的是繁體中文。可想而知，若要分析簡體中文、西班牙文、日語，都是在這裡做修改，若您想知道Google還支援甚麼語言，請參閱[詳細文件](https://cloud.google.com/natural-language/docs/languages)。

```python
# 實例化一個客戶端
client = language.LanguageServiceClient()
type_ = enums.Document.Type.PLAIN_TEXT
language = 'zh-Hant'document = {
                             'content': text,
                             'type': type_,
                             'language': language}
```

client.analyze_entities即是將您的語句，送到google的機房進行分析的方法。因此請避免重複且無意義的執行，會增加許多的成本。
```python
# 設定編碼
encoding_type = enums.EncodingType.UTF8
response = client.analyze_entities(document,encoding_type=encoding_type) #進行計算
```

## 執行結果
結果不只是告訴你有什麼重要的關鍵字，有以下重要內容：

> 📌name：
> 該詞語的名稱。

> 📌Entity.Type：
> 該此語的型態，不只列出名詞、形容詞等，還會更詳細的說明，這是個地點等。

> 📌salience：
> 該字詞在整篇文章的重要程度。可以藉由此數值，找到整篇文章的Top5關鍵字。

![輸出結果](https://i.imgur.com/UeqDBbM.png)
```python
for entity in response.entities:
     print('詞: ' + entity.name)
     print('詞語型態: ' + enums.Entity.Type(entity.type).name)
     print('重要性: ' + str(entity.salience))
```
回傳的參數其實是Dictionary的格式，因此我利用for迴圈，將所有的關鍵字，一字不漏的輸出。當然，您也可以將資料轉成DataFrame的資料格式，更方便進行排序、資料計算。

## 管理意涵
關鍵字分析對於品牌來說，有兩個最大的幫助：

> 📌文章貼標籤
> 若您的產業，有需要為每個文章貼上重點標籤的話，這會是個不錯的選擇，例如：電商等。有了標籤後，相對地可以知道這個消費者的需求是甚麼，未來廣告的推送也能相對精準。

> 📌找到市場缺口
> 儘管利用Python幫我們進行分析，還是有許多人工的部分無法避免。當您得到許多關鍵字後，會發現有些關鍵字不應該出現在您的產業中，這可能就會是一個市場缺口。但這件事情不能那麼莽撞的下定論，因此需要回去看消費者的原文（通常很多篇）。這個過程雖然很辛苦，但若能為您的品牌找到新的藍海，更輝煌10年，何樂而不為呢？

### 番外篇
找到消費者所討論的關鍵字固然重要，但您可能會覺得，Google的收費有點高。

> 其實演算法可以幫您解決問題
> [「演算法與Google NLP，誰與爭鋒？」]()文章將告訴您，如何利用「算」的方式，算出消費者所討論的關鍵字，並比較他與Google雲端運算的差異程度。看到這裡，您還不快手刀點擊下一篇文章！
