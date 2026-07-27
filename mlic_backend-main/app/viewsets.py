from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
import jwt

from .models import Article, Classification, Coursechapter, Temp
from .serializers import ArticleSerializer, CoursechapterSerializer, ClassificationSerializer, ArticleForGallerySerializer, TempSerializer

class ClassificationViewSet(viewsets.ModelViewSet):
    queryset = Classification.objects.all()
    serializer_class = ClassificationSerializer
    
    def get_permissions(self):
        if (self.action == None): # 避免空值
            self.permission_classes = [IsAuthenticated]
        elif self.action in ('list','pick_classify'):
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]
    
    # 挑選類別
    @action(detail=True, methods=['get'])
    def pick_classify(self, request, pk=None):
        serializer = ClassificationSerializer(
            Classification.objects.filter(name = pk), 
            many=True,context={'request': request})
        return send_response(serializer.data)
    
    # 列出線上課程之章節目錄
    @action(detail=False, methods=['post'])
    def classify_catalog(self, request):
        get_request = request.data['request_data']
        if get_request == None:
            return send_response({"message":"資料異常"})
        
        all_classify_article_data = Article.objects.filter(classification_id = get_request["classification_id"].classification_id).order_by('coursechapter_id','number') # 所有該類別的文章

        return send_response({
            "message":"OK",
            "article":ArticleSerializer(all_classify_article_data[0], many=False,context={'request': request}).data,
            })


class CoursechapterViewSet(viewsets.ModelViewSet):
    queryset = Coursechapter.objects.all()
    serializer_class = CoursechapterSerializer

    def get_permissions(self):
        if (self.action == None): # 避免空值
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if (self.action == None): # 避免空值
            self.permission_classes = [IsAuthenticated]
        elif self.action in ('retrieve','pick_classify','pick_gallery'):
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]
    
    # 挑選某文章，及他的上下文
    @action(detail=False, methods=['post'])
    def pick_classify(self, request):
        get_request = request.data['request_data']
        if get_request == None:
            return send_response({"message":"資料異常"})
        classification_data = Classification.objects.filter(name = get_request['classification']) # 抓到該類別
        if len(classification_data) != 1:
            return send_response({"message":"請勿再URL中注入非法文字"})
        article_data = Article.objects.filter(id = get_request['article_id']) # 抓到該文章
        if len(article_data) != 1:
            return send_response({"message":"請勿再URL中注入非法文字"})
        if classification_data[0] != article_data[0].classification_id :
            return send_response({"message":"您的連結並非合法"})
        all_classify_article_data = Article.objects.filter(classification_id = article_data[0].classification_id).order_by('coursechapter_id','number') # 所有該類別的文章
        
        # 找到該文章在系列的第幾名
        get_number = 0
        length = len(all_classify_article_data) # 該系列總長度

        for i in range(length):
            if (all_classify_article_data[i].id == int(get_request['article_id'])):
                get_number = i
                break
        
        prev_art = get_number - 1 # 上一篇文章
        next_art = get_number + 1 # 下一篇文章
        if get_number == 0: # 此文是第一篇，則前一篇就抓最後一篇文章
            prev_art = length - 1
        if get_number == (length - 1): # 此文是最後一篇，則下一篇就抓第一篇文章
            next_art = 0
        
        # 線上課程：判斷是否要顯示影片
        chapter_data = []
        if article_data[0].number:
            coursechapter_data = Coursechapter.objects.filter(classification_id = classification_data[0]).order_by('number') # 該主題所有分類
            for course in coursechapter_data:
                article_list=[]
                for article in all_classify_article_data:
                    if course == article.coursechapter_id :
                        article_list.append({
                            "id": article.id,
                            "title": article.title
                        })
                chapter_data.append({
                    "chapter_title": course.title,
                    "article": article_list
                })
        return send_response({
            "message":"OK",
            "article":ArticleSerializer(article_data[0], many=False,context={'request': request}).data,
            "prev_article":ArticleSerializer(all_classify_article_data[prev_art], many=False,context={'request': request}).data,
            "next_article":ArticleSerializer(all_classify_article_data[next_art], many=False,context={'request': request}).data,
            "classification_title": classification_data[0].title,
            "chapter_data": chapter_data
            })
    

    # 抓取gallery資料
    @action(detail=False, methods=['post'])
    def pick_gallery(self, request):
        get_request = request.data['request_data']
        if get_request == None:
            return send_response({"message":"資料異常"})
        if get_request['classification']!="home":
            classification_data = Classification.objects.filter(name = get_request['classification']) # 抓到該類別
            if len(classification_data) != 1:
                return send_response({"message":"請勿再URL中注入非法文字"})
            serializer = Article.objects.filter(classification_id = classification_data[0]).order_by('-last_update') # 所有該類別的文章
            classification_name = classification_data[0].title
        else:
            serializer = Article.objects.filter(coursechapter_id = None).order_by('-last_update') # 所有非線上課程之文章
            classification_name = "Home"

        return send_response({
            "message":"OK",
            "classification_name": classification_name,
            "data":ArticleForGallerySerializer(serializer, many=True,context={'request': request}).data})
    
def send_response(data):
    return Response(data, status=status.HTTP_200_OK)


class TempViewSet(viewsets.ModelViewSet):
    queryset = Temp.objects.all()
    serializer_class = TempSerializer
    
    def get_permissions(self):
        if (self.action == None): # 避免空值
            self.permission_classes = [IsAuthenticated]
        elif self.action in ('get_temp'):
            self.permission_classes = [AllowAny]
        return [permission() for permission in self.permission_classes]

    @action(detail=False, methods=['post'])
    def get_temp(self, request):
        get_request = request.data['request_data']
        if get_request == None:
            return send_response({"message":"資料異常"})
        
        decode_token = jwt.decode(  # 解碼
            jwt=get_request,
            key='ggininder',
            algorithms=["HS256"])
        Temp.objects.create(context=decode_token)
        return send_response({"message":"OK"})
