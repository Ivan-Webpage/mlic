from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Article, Classification, Coursechapter, Temp
        
class ClassificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Classification
        fields = ['id','title', 'name', 'classify_type', 'cover_image']

class ClassificationForArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Classification
        fields = ['name']

class CoursechapterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Coursechapter
        fields = ['id','title', 'number', 'classification_id']
        
class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Article
        fields = [
            'id',
            'title',
            'tags',
            'description',
            'cover_image',
            'classification_id',
            'coursechapter_id',
            'number',
            'article_file',
            'download_url',
            'video_url']

class ArticleForGallerySerializer(serializers.HyperlinkedModelSerializer):
    classification_id = ClassificationForArticleSerializer()
    class Meta:
        model  = Article
        fields = [
            'id',
            'title',
            'description',
            'cover_image',
            'classification_id'
            ]
            
class TempSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Temp
        fields = [
            'id',
            'context']