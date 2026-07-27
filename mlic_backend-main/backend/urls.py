from django.contrib import admin
from django.urls import path, include
from app.viewsets import ArticleViewSet, ClassificationViewSet, CoursechapterViewSet, TempViewSet
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve 
router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'classification', ClassificationViewSet, basename='classification')
router.register(r'coursechapter', CoursechapterViewSet, basename='coursechapter')
router.register(r'temp', TempViewSet, basename='temp')

urlpatterns = [
    # 網頁部分
    path('coolplace/', admin.site.urls),
    # path('', views.home),
    # path('login/', views.login),

    # API部分
    path("api/", include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('static', serve,{'document_root': settings.STATIC_ROOT}), 

]  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
