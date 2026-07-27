# 【首部曲】Python最火紅框架Django：0到1的建立
以Python語言為基礎的網頁框架（Web Framework）中，以[Django](https://www.djangoproject.com/)為最熱門的網頁框架。其中Django熱門的原因不外乎以下幾個：
* 內建後台：這可以說是Django最強大的賣點，後臺管理介面為內建，且富有強大的客製化功能。
* 套件支援：許多開發者為Django建立大量的工具，例如：rest API、JWT等等，使開發人員不用完全手刻功能，如此也便於維護。
* MVT（Model–View–Template）框架：概念與網頁開發的MVC模式一樣，使網頁開發人員方便管理。

## Django 與 Flask我該選哪個？
筆者最開始使用Python的後端框架為Flask Framework，因此對於這兩個框架的優劣能做一些粗淺的分析。若您目前正屬於選擇Python的後端框架期間，不妨參考以下比較表：


|          | Flask                            | Django                           |
| -------- | -------------------------------- | -------------------------------- |
| 框架模式  | MVT                               | MVT                              |
| 後台      | 無，須自己手刻                     | 內建後台                           |
| 登入機制   | 無內建，但有flask-login套件可支援   | 內建登入機制                        |
| API      | 無，須自己手刻                     | 無內建，但有rest-framework套件可支援  |
| 支援資料庫 | 可使用任何Python串接之資料庫         | [內建僅支援PostgreSQL、MariaDB、MySQL、Oracle、SQLite](https://docs.djangoproject.com/en/4.2/ref/databases/)  |

由上表敘述後，兩個後端框架各有優劣，而已比者的角度而言，在選擇上會以以下兩者作為考量的主因，這樣的考量模式也能泛用在其他語言的後端框架中：

> **框架完整度：**
* > Flask(敗)：幾乎全都是手刻，雖然彈性較高，但通常一個系統開發者與維護者大概率不會相同，因此這樣開發出來的成品後面通常難維護，留有大量技術債。
* > Django(勝)：除了本身內建後台外，有眾多的支援框架，雖然開發有些限制與門檻，但非常方便後續的維護作業。

> **資料庫：**
* > Flask(萬物皆可)：由於沒有了框架限制，選定的資料庫只需要引入對應的Python套件皆可使用，引此廣泛適用於SQL、NoSQL類別的資料庫。
* > Django(僅支援5種)：[內建僅支援PostgreSQL、MariaDB、MySQL、Oracle、SQLite](https://docs.djangoproject.com/en/4.2/ref/databases/)。雖然也有開發人員開發其他Python套件使Django可使用於其他資料庫(例如：MongoEngine 套件用以支援MongoDB)，但此舉既失去了Django的內建管理功能，NoSQL資料庫的快速優點也將不付存在，因此不建議使用Django支援以外的資料庫。

綜觀以上，若您的資料庫(Database)是使用PostgreSQL、MariaDB、MySQL、Oracle、SQLite這五種，同時又有時間熟悉Django內建和外部套件的開發者，那Django對您來說是個不錯的選擇。

## Django安裝
Django的安裝基於Python，因此需要再電腦中先行安裝好Python環境，若還沒安裝好可參考[Windows直接裝Python，我只想要一個Python環境！](/classification/python_foundation/6)。確定具備Python環境後，即可在終端機使用pip執行以下指令進行Django的安裝：
```
pip install django==4.0.10
```
安裝完成後可以使用以下指令，來檢查您安裝的Django版本：
```
python -m django --version
```
> **非常重要！**
> 筆者所使用的Django版本為`4.0.10`，版本的的不同會有不同的程式指令，因此若跟筆者版本不同可能會吃不到一些設定而出錯。

## 建立Django專案
### 建立專案
首先，使用終端機切換目錄到您想要建立專案的地方，譬如筆者想要在`D:\`的這個跟目錄下建立一個`myweb`的專案，那就先CD到該目錄位置：
```
cd D:\
```
![cd路徑](https://imgur.com/SBB953r.jpg)
而後執行以下程式碼，即可創建一個新的Django專案，其中`myweb`為自己客製化的專案名稱，建議整個名稱中不要使用英文大寫：
```
django-admin startproject myweb
```
執行完成後，在剛剛的目錄上，就可以看到多出了一個`myweb`的資料夾了，他就是您剛剛建立的新專案。
![](https://imgur.com/lc3xRfI.png)

### 專案內容介紹
若您進入該資料夾後，可以看到以下的檔案配置：
```
- myweb            # 管理專案的套件目錄(就是您自行設定的專案名稱)
- manage.py        # 管理專案的命令列工具
    - __init__.py  # 一個空文件，代表這個目錄是一個套件
    - settings.py  # 環境設定檔
    - urls.py      # 路由設定檔
    - asgi.py      # Django 專案的 *ASGI 配置屬性
    - wsgi.py      # Django 專案的 *WSGI 配置屬性
```

### 執行Django測試
輸入以下程式碼執行Django之前，請先確認您的終端機工作目錄是否在專案`myweb`之下，若沒有的話，請先`cd myweb`到專案內的目錄。
![](https://imgur.com/mWdiFx9.png)
而後執行以下程式碼，已啟動web server：
```
python manage.py runserver
```
執行完成後應該會在終端機看到以下的文字，若有紅字部分也先不要緊張，可以先到[http://127.0.0.1:8000/](http://127.0.0.1:8000/) 當中看看是否可以看到網頁畫面：
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
July 03, 2023 - 14:12:28
Django version 4.0.10, using settings 'myweb.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```
若您點下[http://127.0.0.1:8000/](http://127.0.0.1:8000/) 後看到以下畫面，則代表有啟動成功：
![](https://imgur.com/tPnLYXi.png)

想要關閉server，則可以在終端機中按下Ctrl+C(就是複製的快捷鍵)就會結束server。

### 建立應用程式 application (app)
在同一個Django當中，可以建立多個應用程式（application，簡稱APP）來搭配運作。舉例來說，一個網站後端可以切割成登入區塊、最新消息區塊、公司產品區塊，這樣便可以建立3個APP，各自負責不同功能，在維護上也會比較方便。以上為舉例，在本文章的專案中主要是讓您了解Django，因此只建立一個APP即可，建立的指令如下，此指令仍需再`myweb`目錄下執行：
```
python manage.py startapp myapp
```
![](https://imgur.com/nwgK3Pc.png)
執行完成後，會發現多出了一個`myapp`資料夾，而內部的檔案介紹如下：
```
- myapp                # 剛剛建立的app
    - __init__.py      # 空文件，代表這個目錄是一個套件。
    - admin.py         # 控管後台的欄位顯示方式
    - apps.py          # 存放Django設定檔的地方
    - models.py        # 定義應用程式在資料庫的欄位
    - tests.py         # 撰寫測試資料庫用的自動腳本
    - views.py         # 接收網頁的請求，處理並回應給網頁
    -migrations        # 記錄資料庫與models.py中的欄位同步歷程，更新資料庫這裡就會多一筆
        - __init__.py  # 空文件，代表這個目錄是一個套件。
- db.sqlite3           # 預設的Sqlite資料庫
- myweb                # --- 以下在文章前面介紹過了 ---
- manage.py        
    - __init__.py
    - settings.py
    - urls.py
    - asgi.py
    - wsgi.py
```
### 建立專案所需之靜態檔案目錄
此處可以使用終端機指令來執行，亦可直接在資料夾中新增，作者使用較為平易近人的方式新增以下兩個資料夾。請在專案`myweb`最外層建立(避免誤會請參考以下圖片)，這兩個資料夾的名稱可以自行定義，但初學階段建議與本文相同，才不會導致後面出現bug：
* templates：放置 html 檔案。
* static：放置各種網頁需要用到的靜態檔案。
![](https://imgur.com/7N7v6JH.png)

一般來說在靜態檔案中也會依照不同的檔案類型進行分類，以便於後面的檔案維護，因此在剛建立的`static`資料夾中，再新增以下三個資料夾：
* css：專門放CSS檔案。
* js：專門放javascript檔案。
* image：專門放圖片檔。
![](https://hackmd.io/_uploads/H1YXCkxF3.png)

## 編輯專案環境設定檔：myweb/settings.py
專案環境檔案位於`myweb/settings.py`，以下的環境設定都是修改此檔案的內容。**這一步必須特別注意，在安裝Django時有請您查看您安裝的版本與筆者是否相同**，因為不同的版本在`settings.py` 設定的參數名稱會不一樣。
而且輸入了一個錯誤的參數名稱Django並不會跳出錯誤（筆者之前因為這問題找了一個星期的bug...），就會出現「明明設定好，怎麼沒反應」的窘境，而且不會跳出bug讓您無從下手，非常痛苦。
![](https://imgur.com/ntJLrJF.png)

### 設定應用程式
請找到`settings.py`檔案中的`INSTALLED_APPS`參數，並在最後面加上剛剛建立的APP`mpapp`進去。
```python
INSTALLED_APPS = [
    'django.contrib.admin',        # 管理者後台
    'django.contrib.auth',         # 認證授權管理
    'django.contrib.contenttypes', # 內容類型管理
    'django.contrib.sessions',     # session 管理
    'django.contrib.messages',     # 訊息管理
    'django.contrib.staticfiles',  # 靜態檔案管理
    'myapp', # 加上他
]
```

### 設定templates路徑
這個路徑決定您之後抓取的html檔案位置，設定內容如下：
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"], # 加上他
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

### 設定static路徑
這個路徑決定您之後抓取的靜態檔案位置，設定內容如下：
```python
STATIC_URL = '/static/'

# 加上這個
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
```

### 設定語系和時間
修改LANGUAGE_CODE 與TIME_ZONE參數。為了方便您比較，筆者將原本的參數註解調，換上新的參數。此舉能讓網頁的語言使用中文繁體，且時區為台北的時區。
```python
# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'zh-Hant' # 加上他

# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Taipei' # 加上他
```

### 測試修改成果
再次執行以下程式碼後(記得存檔)，進入[http://127.0.0.1:8000/](http://127.0.0.1:8000/) ，若網頁能成功顯示，並且為中文，那代表剛剛的設定檔有成功吃進去。
```
python manage.py runserver  
```
![](https://imgur.com/7zlP46y.png)

## 網頁與路由設定
### 建立網頁檔案
首先在資料夾`static/css`當中新增檔案`style.css`，檔案內容如下：
```css=
h1 {
    color: #5d82bb;
}
```
![](https://imgur.com/zmpxET6.png)

另外再資料夾`templates`當中，新增檔案`test.html`，檔案內容如下：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    {% load static %}
    <link href="{% static 'css/style.css'%}" rel="stylesheet">
</head>
<body>
    <h1>{{data}}</h1>
</body>
</html>
```
![](https://imgur.com/plih21I.png)

大括號「{{參數}}」中主要是進行參數傳遞，而若看到是「{% 指令 %}會是指令的執行。

### 設定網址路由：myweb/urls.py
此處為路由器的設定，也就是在您的網址中輸入指定的路徑，則會切換到不同的網頁，對於有網頁路由概念的您來說應該不陌生。這裡特別將test這個路由設定為空，則代表若陸游沒有輸入任何路徑，則會切換到test當中，也就是所謂的萬用路由，這裡通常會拿來設定首頁。
在檔案`myweb/urls.py`當中新增兩行程式碼，程式碼如下：
```python
from django.contrib import admin
from django.urls import path
from myapp import views # 加入這行

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.test), # 加入這行
]
```
![](https://imgur.com/ntJLrJF.png)

### 設定對應函數內容：myapp/views.py
在檔案`myapp/views.py`當中新增程式碼，程式碼如下：
```python
from django.shortcuts import render

# Create your views here.
def test(request):
    return render(request, 'test.html', {
        'title': '測試',
        'data' : '這裡是標題'
    })
```
![](https://imgur.com/e3WzMj9.png)

### 測試修改成果
再次執行以下程式碼後(記得存檔，若您前面沒有停止server則可不用執行該程式碼，直接重整網頁即可)，進入[http://127.0.0.1:8000/](http://127.0.0.1:8000/) ，若您的網頁顯示如下圖代表成功。
```
python manage.py runserver  
```
![](https://imgur.com/dxuvvxp.png)

如此也不難發現網頁的參數傳遞該如何進行。

## 總結
以上的步驟能製作出簡單的靜態網頁了，能滿足最基本的網頁需求，但Django最吸引人的後台功能因為過於豐富，且必須搭配資料庫才能凸顯其特性，因此再另外整理成另一篇文章，因此將在文章「[【二部曲】Python最火紅框架Django：後台Admin與資料庫功能懶人包](/classification/technology/124)」當中為您呈現。