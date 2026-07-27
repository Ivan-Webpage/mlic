from pathlib import Path
import datetime
# import os
# import mimetypes
# mimetypes.add_type("text/css", ".css", True)
# mimetypes.add_type("text/javascript", ".js", True)
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-2&tnisp)vsaomb1cdx%%+$k!%r3-&si4ng_le5d7t(k_y)k$8='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

CSRF_TRUSTED_ORIGINS = ['https://mlic.zeabur.app']
ALLOWED_HOSTS = ['127.0.0.1','localhost','mlic.zeabur.app']
# CORS_ALLOW_ALL_ORIGINS = True # 新版本用
# CORS_ORIGIN_ALLOW_ALL = True # 舊版本用
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:4200",
    "http://localhost:4200",
    "https://marketingliveincode.com"
]

# Application definition

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic', # 必須加此才能抓到static內容
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_jwt',
    'app'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # 必須加此才能抓到static內容
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'zh-Hant'

TIME_ZONE = 'Asia/Taipei'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/
STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(minutes=1),  # jwt 有效期配置
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'user.utils.jwt_response_payload_handler',  # 返回结果配置
}

REST_FRAMEWORK = {
    "PAGE_SIZE": 100, #List API 支援分頁時，每頁只傳回 100 筆，分頁的參數是使用 limit 跟 offset
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    'DEFAULT_PARSER_CLASSES': ['rest_framework.parsers.JSONParser'], # 只允許 Content-Type 是 application/json 
    "DEFAULT_AUTHENTICATION_CLASSES": [ #驗證方式是使用 Session 跟 Token
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"], #權限是要求必須要驗證過才能呼叫 API
}