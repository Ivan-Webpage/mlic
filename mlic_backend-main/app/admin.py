from django.contrib import admin
from .models import Article, Classification, Coursechapter, Temp

admin.site.site_header = '行銷搬進大程式' # 網站大標題
admin.site.index_title = '後台管理' # 副標題
admin.site.site_title = '行銷搬進大程式' # 瀏覽器上方title

class ArticleAdmin(admin.ModelAdmin):
    list_display=['id','title','classification_id','last_update'] # 設定要在在列表頁面顯示的欄位
    list_filter=['classification_id',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['title'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-last_update']
    list_per_page=20
admin.site.register(Article, ArticleAdmin)


class CoursechapterAdmin(admin.ModelAdmin):
    list_display=['id','title', 'number','classification_id','last_update'] # 設定要在在列表頁面顯示的欄位
    list_filter=['classification_id',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['title'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-last_update']
    list_per_page=20
admin.site.register(Coursechapter, CoursechapterAdmin)


class ClassificationAdmin(admin.ModelAdmin):
    list_display=['id','title','classify_type','last_update'] # 設定要在在列表頁面顯示的欄位
    list_filter=['classify_type',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['title'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-last_update']
    list_per_page=20
admin.site.register(Classification, ClassificationAdmin)

class TempAdmin(admin.ModelAdmin):
    list_display=['id','last_update'] # 設定要在在列表頁面顯示的欄位
    list_filter=['last_update',] # 設定欄位啟用列表頁面右側的篩選器
    search_fields=['last_update'] # 設定列表頁面的搜尋框，可以使用欄位名稱或是關聯欄位名稱 API
    ordering=['-last_update']
    list_per_page=20
admin.site.register(Temp, TempAdmin)