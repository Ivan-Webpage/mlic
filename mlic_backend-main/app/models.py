# from django.forms import ModelChoiceField
from django.db import models
# from django.utils import timezone, dateformat

class Classification(models.Model):
    title = models.CharField('標題', max_length=100, null=False)
    tags = models.CharField('關鍵字(空白分隔)', max_length=50, null=False)
    name = models.CharField('英文標籤名稱', max_length=50, null=False)
    description = models.TextField('說明', max_length=200, null=False)
    classify_type = models.CharField('類型',max_length=4, choices=[('線上課程','線上課程'),('文章主題','文章主題')], default='', null=False)
    # cover_image = models.CharField('封面圖片檔案名稱', max_length=250, null=False)
    cover_image = models.ImageField('封面圖片檔案名稱',upload_to='static/upload/image/', blank=False, null=False)
    last_update = models.DateTimeField('最后修改日期', auto_now = True)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.title
    
class Coursechapter(models.Model):
    title = models.CharField('標題', max_length=100, null=False)
    number = models.IntegerField('章節編號', null=False)
    classification_id = models.ForeignKey('Classification', verbose_name='章節分類', on_delete=models.CASCADE)
    last_update = models.DateTimeField('最后修改日期', auto_now = True)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.title
    
class Article(models.Model):
    title = models.CharField('標題', max_length=100, null=False)
    tags = models.CharField('關鍵字(空白分隔)', max_length=50, null=False)
    description = models.TextField('說明', max_length=200, null=False)
    # cover_image = models.CharField('封面圖片檔案名稱', max_length=50, null=False)
    cover_image = models.ImageField('封面圖片檔案名稱',upload_to='static/upload/image/', blank=False, null=False)
    classification_id = models.ForeignKey('Classification', verbose_name='文章分類', on_delete=models.CASCADE)
    coursechapter_id = models.ForeignKey('Coursechapter', verbose_name='文章章節', on_delete=models.CASCADE, null=True, blank=True)
    number = models.IntegerField('章節課程編號', null=True, blank=True)
    # article_file = models.CharField('文章檔案名稱', max_length=150, null=False)
    article_file = models.FileField('文章檔案名稱',upload_to='static/upload/markdown/', blank=False, null=False)
    download_url = models.URLField('下載網址', blank=True)
    video_url = models.URLField('影片網址', blank=True)
    last_update = models.DateTimeField('最后修改日期', auto_now = True)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.title

class Temp(models.Model):
    context = models.TextField('內容', max_length=99999, null=False)
    last_update = models.DateTimeField('最后修改日期', auto_now = True)
    created_time = models.DateTimeField('保存日期', auto_now = True)
    def __str__(self):
        return self.created_time
    
