# 【二部曲】Python最火紅框架Django：後台Admin與資料庫功能懶人包
本文接續前篇文章「[【首部曲】Python最火紅框架Django：0到1的建立](/classification/technology/123)」的程式碼與專案內容，因此若還沒看過建議您先觀看前一篇文章。
在前篇文章設定`myweb/urls.py`時相信您已經發現有一個預設的路由`admin/`：

![](https://imgur.com/BzsGN92.png)

當時在前篇文章中並沒有詳細解釋，但聰明的您可能會試著切換到[http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)，但卻可能會出現以下畫面：

![](https://imgur.com/reLZmbI.png)

這是正常的，因為我們還沒對後台進行設定，因此接下來在本篇文章中將要詳細解釋如何使用此後台，且與資料庫(本文使用預設的Sqlite資料庫)之間的關係。

## Django資料庫存取與設定
### 建立資料表

首先在外層`myweb`專案目錄執行以下程式碼，建立後台所需之資料表：
```
python manage.py migrate
```
執行會出現以下輸出：
```
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying sessions.0001_initial... OK
```
### 建立新的使用者
輸入以下程式碼，就會引導您建立使用者：
```
python manage.py createsuperuser
```
若正常的話則會跳出以下的內容引導您建立使用者：
```
使用者名稱 (leave blank to use '您電腦的使用者名稱'): root
電子信箱: ivanyang@gmail.com
Password: 
Password (again): 
這個密碼與使用者名稱太相近。
這個密碼過短。請至少使用 8 個字元。
這個密碼太普通。
Bypass password validation and create user anyway? [y/N]: y
Superuser created successfully.
```
如果剛剛在建立資料表的步驟，沒有執行成功的話，您輸入該程式碼則會出現以下錯誤，代表資料庫並沒有建立完成：
```
django.db.utils.OperationalError: no such table: auth_user
```

### 設定資料模型：myapp/models.py
這個步驟非常重要。由於本文是使用SQL種類的資料庫，因此若往後需求變更，需要新增或修改欄位，又或者欄位的參數要有些變化，都是非常麻煩的過程。因此建議，若您目前是正在建立正式的資料庫，給您未來的後端系統使用，那這邊需先將資料表的需求與欄位定義清楚。

範例預計將建造兩個資料表，分別是article 與 classification，代表的意義分別是文章的基本資料，與文章的分類主題：
* article

| 欄位名稱 | 資料型態 | 資料長度 | 預設值 | 是否可為空值 |
| -------- | -------- | -------- | -------- | -------- |
| title     | 字串     | 100     |      | False     |
| classification_id | 關聯資料     |      |      | False     |
| language | 字串     |  2   | CH   | False     |
| number     | int     |      |      | True     |
| video_url     | url     |      |      | False     |
| created_time     | datetime     |      | 自動填入現在時間     | Text     |

* classification

| 欄位名稱 | 資料型態 | 資料長度 | 預設值 | 是否可為空值 |
| -------- | -------- | -------- | -------- | -------- |
| title     | 字串     | 100     |      | False     |
| created_time     | datetime     |      | 自動填入現在時間     | Text     |

以上之資料庫設計對應再`myapp/models.py`檔案的編寫如下程式碼所示：
```python
from django.db import models

# Create your models here.
class Article(models.Model):
    LANGUAGE_CHOICES = [
        ('CH', '中文'),
        ('EG', '英文'),
    ]
    title = models.CharField('標題', max_length=100, null=False)
    language = models.CharField('語言',max_length=2, choices=LANGUAGE_CHOICES, default='', null=False)
    classification_id = models.ForeignKey('Classification', verbose_name='文章分類', on_delete=models.CASCADE)
    number = models.IntegerField('章節課程編號', null=True, blank=True)
    video_url = models.URLField('影片網址', blank=True)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.title
    
class Classification(models.Model):
    title = models.CharField('標題', max_length=100, null=False)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.title
```

![](https://imgur.com/3BrLTlL.png)

在這裡也簡單的解釋一下各models的方法：


| 方法       | 說明                             |
| --------  | -------------------------------- |
| CharField | 字串資料 |
| IntegerField | 數字資料 |
| DateTimeField | 時間資料 |
| URLField | 網址資料 |
| ForeignKey | 連動其他資料表，依照本文的例子，當Classification資料表有新增時，Article資料表的選項也會同步新增 |

### 產生 migrations 遷移檔
執行以下命令，Django會去檢查剛剛設定的`myapp/models.py`檔案有無修改，有修改的話就會製作成一個新的遷移檔(migration)。
```
python manage.py makemigrations myapp
```
若執行完成，終端機則會出現以下文字，也代表產出了一個檔案，且檔案中有兩個物件：
```
Migrations for 'myapp':
  myapp\migrations\0001_initial.py
    - Create model Classification
    - Create model Article
```
也可以在資料夾中找到檔案`myapp/migrations/0001_initial.py`，就是剛剛所產出的檔案。
![](https://imgur.com/I7wgTwA.png)

### 將遷移檔套用於資料庫
此舉便是前段的檔案，實際在資料庫執行，因此若經過此步驟後想要新增刪除欄位，或者是修改欄位長度都是沒有辦法的，與一般的SQL資料庫一樣有嚴謹的守則，因此在執行此步驟前一定要確認您的資料庫已經照需求設計完成。
```
python manage.py migrate myapp
```
執行成功則會出現以下文字：
```
Operations to perform:
  Apply all migrations: myapp
Running migrations:
  Applying myapp.0001_initial... OK
```

### 檢視修改成果
再次的執行伺服器，並且到後台[http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)，會發現到達登入畫面。
```
python manage.py runserver
```
![](https://imgur.com/uv9Vt5f.png)

輸入在前面步驟所設定的使用者帳號密碼後即可登入，就可以看到以下的管理介面了。乍看之下此處只能夠編輯帳號，新增刪除使用者等等，但我們剛剛所設定的兩個資料表能否在後台進行編輯呢？將在下一章節揭曉。

![](https://imgur.com/XRjeVf0.png)

## Django admin 後台管理
本章節將延續前章節到後台[http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)繼續，使資料庫的資料表能在後台進行編輯。

### admin 後台加入資料表：myapp/admin.py
到檔案`myapp/admin.py`當中，加入以下程式碼，：
```python
from django.contrib import admin

# Register your models here.
# 加入以下程式碼
from myapp.models import Article, Classification

admin.site.register(Article)
admin.site.register(Classification)
```

![](https://imgur.com/uVipcK2.png)

修改好後(記得存檔)不須重新啟動server，直接在剛剛的畫面[http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)按下F5案件重新整理，就可以看到這兩張資料表出現在上面瞜！
![](https://imgur.com/5U4f150.png)

接下來都是圖形化介面(GUI)，操作就變得非常簡單，不是工程師也能輕易上手。例如點選「新增」就可以輸入新的資料了。
![](https://imgur.com/TJCLeSa.png)

特別注意文章分類的這個欄位，若Classification沒有資料，這裡也不會顯示，因為兩者是連動的。也因為文章分類的欄位當時是設定禁止為空值，因此若您要嘗試手動新增資料，則需要先在Classification新增一筆資料後，才可在Article新增資料。新增完成後的畫面如下：
![](https://imgur.com/kvMXCdg.png)

### admin 欄位顯示：myapp\admin.py
![](https://imgur.com/kvMXCdg.png)
有沒有覺得以上的欄位顯示，這麼大的一塊螢幕，只有文章的標題，我們可能會想要看到其他的欄位資訊，也方便我們在之後的資料管理。這個部分一樣在`myapp\admin.py`檔案進行修改。

請嘗試著將檔案`myapp\admin.py`修改成以下的程式碼：
```python
from django.contrib import admin

# Register your models here.
# 加入以下程式碼
from myapp.models import Article, Classification

class ArticleAdmin(admin.ModelAdmin):
    list_display=['id','title','language','classification_id','created_time'] # 設定要在在列表頁面顯示的欄位
    list_filter=['classification_id',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['title'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-created_time']
    list_per_page=10
admin.site.register(Article, ArticleAdmin)

class ClassificationAdmin(admin.ModelAdmin):
    list_display=['id','title','created_time'] # 設定要在在列表頁面顯示的欄位
    list_filter=['title',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['title'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-created_time']
    list_per_page=10
admin.site.register(Classification, ClassificationAdmin)
```
修改完後重新整理頁面，即可看到變化。
![](https://imgur.com/SarsFK1.png)

這裡也解釋`ModelAdmin`常用的幾個參數：


| 參數名稱 | 型態 | 說明 |
| -------- | -------- | -------- |
| list_display | List | 將顯示在畫面的欄位 |
| list_filter | List | 設定欄位啟用列表頁面右側的篩選器 |
| search_fields | List | 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API |
| ordering | List | 依照哪個欄位做排序，正常是A-Z，若前面加上「-」則為Z-A |
| list_per_page | Int | 每一頁最多幾筆資料 |

## 總結
可以發現Django admin已經為後台提供了非常完整的客製化功能，基本上能滿足一般的後台需求。但有著設計控的朋友可能就不樂意了！
可以發現整個後台我們完全沒有編輯到html、css，這也就代表說，後台的畫面呈現都是預設的，如果我們想要克制出一個屬於自己的後台風格要如何著手呢？這個問題將再「[【三部曲】Python最火紅框架Django：後台Admin的外觀客製化調整，自行修改Html、CSS、插入logo！](/classification/technology/125)」