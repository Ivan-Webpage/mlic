# 【三部曲】Python最火紅框架Django：後台Admin的外觀客製化調整，自行修改Html、CSS、插入logo！
在前面的文章「[【二部曲】Python最火紅框架Django：後台Admin與資料庫功能懶人包](/classification/technology/124)」當中，我們已經學會了如何使用參數調整Django admin的資料呈現與篩選。而在本文我們繼續前面的專案，將更精進於修改Django admin的Html、CSS等檔案，使後台外觀能以我們想要的樣子呈現！
![](https://imgur.com/W3t1r2f.png)

## 修改標題名稱 標題加上logo
此處會使用到圖片，您可以選擇下載本文所提供的完整程式碼，裡面有範例的圖片。又或者您知道如何修改，可以換成自己的圖片進行實驗。
### 簡單版
若單純只是修改標題名稱，有更簡單的方式，就是在`myapp/admin.py`檔案中，隨意找個地方插入以下程式碼：
```python
admin.site.site_header = '行銷搬進大程式' # 網站大標題
admin.site.index_title = '後台管理' # 副標題
admin.site.site_title = '行銷搬進大程式' # 瀏覽器上方title
```
![](https://imgur.com/WhTSdqT.png)

而後台經過重新整理後，會發現有三處變得不一樣：
![](https://imgur.com/p3re5yf.png)
如果您問說還能用這個方式修改網頁的何處，筆者去找了Django套件內部的程式碼，能用的參數如下所示，但僅靠這些參數，絕對無法進行高程度的客製化：
![](https://imgur.com/d15tdfj.png)

### 複雜版
我們採用修改html的方式，來修改標題列，當然前面所設定的site_header、index_title、site_title也不需要刪除，兩者並不衝突。
> 以下的名命都必須要跟文章中的一樣，否則Django吃不到

首先，在資料夾`templates`當中建立一個新的資料夾`admin`，並在資料夾內建立一個檔案`base_site.html`，而後再`base_site.html`內加入以下內容：
```
templates/admin/base_site.html
```

```html
{% extends "admin/base.html" %}

{% load static %}

{% block extrastyle %}
<link href="{% static 'css/style.css'%}" rel="stylesheet" type="text/css">
<link rel="icon" type="image/x-icon" href="{% static 'img/logo_icon.svg' %}""> 
{% endblock %}

{% block branding %}
<link href="{% static 'css/style.css'%}" rel="stylesheet" type="text/css">
<h1 id="site-name" class="back-major-ten">
    <a href="{% url 'admin:index' %}">
        <img src="{% static 'img/logo_icon.svg' %}" height="40px" />
        行銷搬進大程式
    </a>
</h1>
{% endblock %}

{% block nav-global %}{% endblock %}

{% block footer %}
<div id="footer" class="text-white">
    <p style="text-align: center; font-size: 10px;">©2023 行銷搬進大程式 Marketing Live in Code</p>
</div>
{% endblock %}
```
![](https://imgur.com/F4T1hlm.png)

另外修改`static/css/style.css`的內容為以下：
```CSS
h1 {
    color: #5d82bb;
}

footer {
    height: 50px;
    text-align: center;
    bottom: 0;
}

.back-major-ten {
    background-color: rgb(93, 130, 187, 1);
}

.text-white {
    color: rgb(227, 229, 235) !important;
}


.login_background {
    background-image: linear-gradient(to bottom, rgba(93, 130, 187, 1), rgba(255, 255, 255, 0)), url("../image/login_background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}

:root {
    --secondary: #5d82bb;
    --primary: #bb965d;
    --link-fg: #9db4d6;
    --accent: #ffffff;
    --header-color: #daa21b;
    --body-bg: #111111;
    --darkened-bg: #000000;
    --delete-button-bg: #f44336;
}
```
完成後存檔並重新整理後台，會發現後台的標題上多出了自己所設定的logo，下面還多出了我自己定義的footer。並且顏色的部分也不再是Django預設的顏色了，而是筆者剛剛在`style.css`檔案中所設定的顏色。
![](https://imgur.com/vVfntjV.png)

#### 修改原理
了解此原理後，相信您也能自己修改Django admin中所有的視覺化部份了！`base_site.html`檔案的內容其實是繼承的概念，將原本Django admin的Html檔案做複寫，在[此處](https://github.com/django/django/blob/main/django/contrib/admin/templates/admin/base_site.html)可以看到原本Django admin的內容，程式碼不多筆者就直接把他複製過來了：
```html
{% extends "admin/base.html" %}

{% block title %}{% if subtitle %}{{ subtitle }} | {% endif %}{{ title }} | {{ site_title|default:_('Django site admin') }}{% endblock %}

{% block branding %}
<div id="site-name"><a href="{% url 'admin:index' %}">{{ site_header|default:_('Django administration') }}</a></div>
{% if user.is_anonymous %}
  {% include "admin/color_theme_toggle.html" %}
{% endif %}
{% endblock %}

{% block nav-global %}{% endblock %}
```
若您了解MVT架構，一定看得懂這些程式碼。而**Django的運作原理也是先到本地端抓取html，抓不到才會抓取Django admin的原檔內容**，這也是前面提醒您為何命名都要跟我一樣的緣故。
而MVT架構的原理下，我們想插入html的時候，又要怎麼知道插入變數呢？很簡單，在程式碼的最前面有一段`{% extends "admin/base.html" %}`，即是代表這些插入都基於`base.html`這個檔案，這個檔案我們並沒有複寫他，因此可以斷定Django是使用[原本的檔案](https://github.com/django/django/blob/main/django/contrib/admin/templates/admin/base.html)，在該檔案中就可以看到官方設計了那些部份可以進行插入了！
![](https://imgur.com/532HYbc.png)

若您瞭解了這個修改原理，那就可以差解`base_site.html`的內容了。

#### 加入自訂CSS與icon
`base_site.html`檔案中，加入自訂CSS與Icon的部分，是在`{% block extrastyle %}`插入部分插入以下程式碼：
```html
{% block extrastyle %}
<link href="{% static 'css/style.css'%}" rel="stylesheet" type="text/css">
<link rel="icon" type="image/x-icon" href="{% static 'image/logo_icon.svg' %}""> 
{% endblock %}
```

#### 加入Logo
`base_site.html`檔案中，加入logo部分，是在`{% block branding %}`插入部分插入以下程式碼：
```html
{% block branding %}
<link href="{% static 'css/style.css'%}" rel="stylesheet" type="text/css">
<h1 id="site-name" class="back-major-ten">
    <a href="{% url 'admin:index' %}">
        <img src="{% static 'image/logo_icon.svg' %}" height="40px" />
        行銷搬進大程式
    </a>
</h1>
{% endblock %}
```

#### 加入footer
`base_site.html`檔案中，加入footer部分，是在`{% block footer %}`插入部分插入以下程式碼：
```html
{% block footer %}
<div id="footer" class="text-white">
    <p style="text-align: center; font-size: 10px;">©2023 行銷搬進大程式 Marketing Live in Code</p>
</div>
{% endblock %}
```

## 登入畫面加上背景
若以上的修改成功您的登入畫面應該已經有些不同，至少看起來不再是Django的色調。但回看登入畫面死板板的黑色，如果能插入一些背景圖片，整個格調會上升許多喔！

這次要複寫login了！在資料夾`templates`當中建立一個新的資料夾`admin`，並在資料夾內建立一個檔案`login.html`，而後再`login.html`內加入以下內容：
```
templates/admin/login.html
```

```html
{% extends "admin/base_site.html" %}
{% load i18n static %}

{% block extrastyle %}{{ block.super }}<link rel="stylesheet" href="{% static "admin/css/login.css" %}">
{{ form.media }}
{% endblock %}

{% block bodyclass %}{{ block.super }}login_background login{% endblock %}

{% block usertools %}{% endblock %}

{% block nav-global %}{% endblock %}

{% block nav-sidebar %}{% endblock %}

{% block content_title %}{% endblock %}

{% block nav-breadcrumbs %}{% endblock %}

{% block content %}
{% if form.errors and not form.non_field_errors %}
<p class="errornote">
{% blocktranslate count counter=form.errors.items|length %}Please correct the error below.{% plural %}Please correct the errors below.{% endblocktranslate %}
</p>
{% endif %}

{% if form.non_field_errors %}
{% for error in form.non_field_errors %}
<p class="errornote">
    {{ error }}
</p>
{% endfor %}
{% endif %}

<div id="content-main">

{% if user.is_authenticated %}
<p class="errornote">
{% blocktranslate trimmed %}
    You are authenticated as {{ username }}, but are not authorized to
    access this page. Would you like to login to a different account?
{% endblocktranslate %}
</p>
{% endif %}

<form action="{{ app_path }}" method="post" id="login-form">{% csrf_token %}
  <div class="form-row">
    {{ form.username.errors }}
    {{ form.username.label_tag }} {{ form.username }}
  </div>
  <div class="form-row">
    {{ form.password.errors }}
    {{ form.password.label_tag }} {{ form.password }}
    <input type="hidden" name="next" value="{{ next }}">
  </div>
  {% url 'admin_password_reset' as password_reset_url %}
  {% if password_reset_url %}
  <div class="password-reset-link">
    <a href="{{ password_reset_url }}">{% translate 'Forgotten your password or username?' %}</a>
  </div>
  {% endif %}
  <div class="submit-row">
    <input type="submit" value="{% translate 'Log in' %}">
  </div>
</form>

</div>
{% endblock %}
```
![](https://imgur.com/aZJeW5v.png)

若您已經了解了修改的原理，比對Django admin的[login.html原檔案](https://github.com/django/django/blob/main/django/contrib/admin/templates/admin/login.html)，您會發現其實我修改的只有以下這一行，在body這個標籤中多插入一個`login_background`的class：
```HTML
{% block bodyclass %}{{ block.super }}login_background login{% endblock %}

```
    
而`login_background`這個class，已經寫在`style.css`裡面了。
```CSS
.login_background {
  background-image: linear-gradient(to bottom, rgba(93,130,187, 1), rgba(255, 255, 255, 0)),url("../image/login_background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
```
![](https://imgur.com/W3t1r2f.png)

> 這個登入畫面看起來，是不是舒服許多呢？
## 總結
經果本文章的洗禮後，相信您對於Django有更深一層的認識，至少在視覺化呈現的部分都能夠進行客製化修改了。而Django再怎麼說也是個網頁後端，在現在前後端分離的趨勢之下，後端主要的功能變成是對資料庫進行請求，並將結果以API的方式提供給前端進行畫面呈現。雖然API也可以手刻，但不力於後續的維護，且安全部分需要考量。
下篇文章「[【四部曲】Python最火紅框架Django：最強API套件，Rest Framework！](/classification/technology/126)」將要為您詳述Django的強大套件rest_framework功能與使用方式，讓這個Django後端的功能完整！
