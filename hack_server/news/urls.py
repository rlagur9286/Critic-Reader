from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'check/$', views.check_news),
    url(r'summary/$', views.summary),
]
