from .common import *
import os
import pymysql


pymysql.install_as_MySQLdb()

ALLOWED_HOSTS = ['*']
DEBUG = True

DATABASES = {    
    'default': {'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.mysql'),
    'HOST': os.environ['DB_HOST'],       
    'USER': os.environ['DB_USER'],        
    'PASSWORD': os.environ['DB_PASSWORD'],        
    'NAME': os.environ['DB_NAME'],      
    'PORT': os.environ['DB_PORT'],
    }, 
}

INSTALLED_APPS += ['storages']
# django-storages 앱 의존성 추가
# 기본 static/media 저장소를 django-storages로 변경
STATICFILES_STORAGE = 'hack_server.storages.StaticS3Boto3Storage'
DEFAULT_FILE_STORAGE = 'hack_server.storages.MediaS3Boto3Storage'
# S3 파일 관리에 필요한 최소 설정
# 소스코드에 설정정보를 남기지마세요. 환경변수를 통한 설정 추천
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', default='ap-northeast-2')
