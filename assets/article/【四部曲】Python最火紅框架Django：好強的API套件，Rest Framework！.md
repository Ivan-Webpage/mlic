# 【四部曲】Python最火紅框架Django：好強的API套件，Rest Framework！

Django再怎麼說也是個網頁後端，在現在前後端分離的趨勢之下，後端主要的功能變成是對資料庫進行請求，並將結果以API的方式提供給前端進行畫面呈現。雖然API也可以手刻，但不力於後續的維護，且安全部分需要考量。
本篇文章將要為您詳述Django的強大套件[rest_framework](https://github.com/encode/django-rest-framework)功能與使用方式，讓這個Django後端的功能完整！

## 安裝 rest_framework
安裝的方式非常簡單，在終端機使用pip進行安裝即可，就跟安裝一般的Python套件沒什麼兩樣。筆者所安裝的版本是 3.14.0的版本，目前是還沒有碰到不同版本所造成的相關問題。
```
pip install djangorestframework
```
## 編輯專案環境設定檔：myweb/settings.py
最重要的是在`INSTALLED_APPS`參數當中，加入`rest_framework`，如下所示：
```python
INSTALLED_APPS = [
    'django.contrib.admin',        # 管理者後台
    'django.contrib.auth',         # 認證授權管理
    'django.contrib.contenttypes', # 內容類型管理
    'django.contrib.sessions',     # session 管理
    'django.contrib.messages',     # 訊息管理
    'django.contrib.staticfiles',  # 靜態檔案管理
    'myapp', 
    'rest_framework' # 加上他
]
```
![](https://imgur.com/OH1HKRP.png)

> 以下可設定，可不設定

其實道以上這一步Rest Framework就可以使用了，但如果想要對API進行一些細部的設定，套件也是有提供的喔！本文就依照常用的API設計來建構範例，建造`REST_FRAMEWORK`這個參數。`REST_FRAMEWORK`這個參數原本在`settings.py`檔案中並沒有，因此要再`settings.py`找個空白處自己新增`REST_FRAMEWORK`變數喔！
```python
REST_FRAMEWORK = {
    "PAGE_SIZE": 100,
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    'DEFAULT_PARSER_CLASSES': ['rest_framework.parsers.JSONParser'], 
    "DEFAULT_AUTHENTICATION_CLASSES": [ 
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"], 
}
```
![](https://imgur.com/iz6NY3w.png)

這裡也為參數的內部設定作介紹：


| 參數名稱 | 說明 |
| -------- | ---------------- |
| PAGE_SIZE | List API 支援分頁時，每頁只傳回 100 筆 |
| DEFAULT_PAGINATION_CLASS | 與PAGE_SIZE參數搭配使用。分頁的參數是使用 limit 跟 offset |
| DEFAULT_PARSER_CLASSES | 只允許 Content-Type 是 application/json |
| DEFAULT_AUTHENTICATION_CLASSES | 驗證方式是使用 Session 跟 Token |
| DEFAULT_PERMISSION_CLASSES | 權限是要求必須要驗證過才能呼叫 API |

## 設定 Rest Framework API 輸出內容
### 定義API輸出欄位：myapp/serializers.py
需要在資料夾`myapp`中建立一個新檔案`serializers.py`，檔案內容如下：
```python
from rest_framework import serializers
from .models import Article, Classification

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Article
        fields = [
            'id',
            'title',
            'language',
            'classification_id',
            'number',
            'video_url']
        
class ClassificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Classification
        fields = ['id','title', 'created_time']
```
一般來說API並不會將所有資料表中的欄位顯示，只需要接露目的端所需要的欄位就好。因此這個部分主要是設定，當API請求時，要丟出哪幾個欄位。
也因此筆者在`ArticleSerializer`物件中，刻意不輸出`created_time`這個欄位，就是要向您說明，若該欄位沒必要輸出，可以在這裡就排除掉。

![](https://imgur.com/HUUNJri.png)

### 設定API請求：myapp/viewsets.py
接著在資料夾`myapp`中建立一個新檔案`viewsets.py`，檔案內容如下：
```python
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action


from .models import Article, Classification
from .serializers import ArticleSerializer, ClassificationSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

class ClassificationViewSet(viewsets.ModelViewSet):
    queryset = Classification.objects.all()
    serializer_class = ClassificationSerializer
    permission_classes = [AllowAny]
```
此處引用了前一步的`serializers.py`檔案，主要是設定請求的相關參數：
* queryset：API輸出的資料內容。
* serializer_class：設定輸出欄位。
* permission_classes：請求身分限制。AllowAny(任何人都可請求)、IsAuthenticated(需身分認證才可請求)
![](https://imgur.com/Gliv0sg.png)

#### viewsets.py 進階設定
若您**只是嘗試使用Rest Framework，又或者先求能執行的話，這個步驟可以跳過**。本步驟會在進行一些權限設定、資料內容篩選的功能多做說明。
##### 權限控管
我們修改剛剛設定好的`ArticleViewSet`物件。首先刪除`permission_classes = [AllowAny]`這一行，既然要權限控管，絕對不可能所有請求全部放行。接著加入`get_permissions`方法，完整物件內容如下：
```python
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
    def get_permissions(self):
        if self.action in ('create',):
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]
        return [permission() for permission in self.permission_classes]
```
在此方法中檢測請求若為`create`，代表是新增資料的動作，那就需要檢查權限，否則不明人士都可以在您的資料庫中注入資料了。而其他請求則是可放行，讓一般的查看權限是通的！

##### 資料篩選
接續剛剛的權限控管。若我們想要在API中利用指定的參數，在資料庫中篩選後才用API輸出出來可以怎麼做呢？
```python
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    # 挑選某文章類別
    @action(detail=True, methods=['get'])
    def pick_classify(self, request, pk=None):
        serializer = ArticleSerializer(
            Article.objects.filter(classification_id = pk), 
            many=True,context={'request': request})
        return Response(serializer.data,  status=status.HTTP_200_OK)
```
API當中會接收`pk`這個參數，並輸入到`filter()`這個方法進行資料庫的篩選，類似於SQL與法中的`where`概念。如此一來便可以利用API指定特定資料了。
```
http://127.0.0.1:8000/api/articles/{參數}/pick_classify/
```
![](https://imgur.com/CNOrhaW.png)

### 設定路由：myweb/urls.py
在`myweb/urls.py`檔案中加入內容：
```python
from django.contrib import admin
from django.urls import path
from myapp import views 
from myapp.viewsets import ArticleViewSet, ClassificationViewSet # 加入這行
from rest_framework.routers import DefaultRouter # 加入這行
from django.urls import path, include # 加入這行
router = DefaultRouter() # 加入這行
router.register(r'articles', ArticleViewSet, basename='article') # 加入這行
router.register(r'classification', ClassificationViewSet, basename='classification') # 加入這行

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.test), 
    path("api/", include(router.urls)),# 加入這行
]
```
![](https://imgur.com/KlIAtPU.png)

### 測試輸出結果
用`python manager.py runserver`開啟server 後，可以到[http://127.0.0.1:8000/api/articles/](http://127.0.0.1:8000/api/articles/)或[http://127.0.0.1:8000/api/classification/](http://127.0.0.1:8000/api/classification/)查看剛剛所設定的API。
![](https://imgur.com/CNOrhaW.png)

## 自訂API輸出內容
至此其實已經可以使用API了。但在實際的前後端網站使用上會發現一個問題：請求次數過多。聰明的您會發現，剛剛的API設計其實都是圍繞著資料表進行輸出，但很多時候前端要的資料，是需要多張表的綜合資料，並且還會有階層關係。

就已範例舉例，我們有兩個資料表Article(文章)與Classification(分類)，如果我在前端呈現以下資料：
```
{
    '分類1':['A文章'],
    '分類2':['B文章','C文章']....
}
```
以上的資料必須要分別請求資料表Article(文章)與Classification(分類)，而前端收到資料後還需要再進行整理。

若為專業的後端人員，是會再另外建立一個資料表定時為兩個資料表做整理，如此可提高請求效率。又或者我們想要在後端Django的部分就處理完成呢？

### 設定API請求
在檔案`myapp/views.py`當中，新增`chapter()`方法，方法內多為資料整理的部分，只是個範例並不多做解釋：
```python
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Article, Classification
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
def test(request):
    return render(request, 'test.html', {
        'title': '測試',
        'data' : '這裡是標題'
    })

#---------- 自訂API ----------
class chapter(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        Classification_data = Classification.objects.all()
        data = {}
        for cls in Classification_data:
            Article_data = Article.objects.filter(classification_id = cls.id)
            temp_array = []
            for atc in Article_data:
                temp_array.append(atc.title)
            data[cls.id] =temp_array
        return Response(data, status=status.HTTP_200_OK)
```
![](https://imgur.com/Gliv0sg.png)

### 設定chapter路由：myweb/urls.py
```python
from django.contrib import admin
from django.urls import path
from myapp import views 
from myapp.viewsets import ArticleViewSet, ClassificationViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include 
router = DefaultRouter() 
router.register(r'articles', ArticleViewSet, basename='article') 
router.register(r'classification', ClassificationViewSet, basename='classification')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.test), 
    path("api/", include(router.urls)),
    path('chapter/', views.chapter.as_view()),# 加入這行
]
```

如此一來在進入[http://127.0.0.1:8000/chapter/](http://127.0.0.1:8000/chapter/)後，便可以看到客製化API的成果了：
![](https://imgur.com/BYkyXQf.png)

## 總結
Rest Framework的模式，是目前後端API設計最常採用的，有了Django的套件支持讓我們在建立API的事務上事半功倍。而實際上在使用API的時候會發現，有時使用[Postman](https://www.postman.com/)試著打打看API，卻拉不到資料，並且瀏覽器的console中會顯示以下錯誤：
```
cors error: the request has been blocked because of the cors policy
```
又或者將Django的後端成品完成後，丟上去雲端空間後，登入卻出現了「CSRF 驗證失敗」，這些問題將在下篇文章「[【五部曲】Python最火紅框架Django：CORS與CSRF錯誤怎麼排除?]()」為您解惑。