from django.conf.urls import patterns, url
from post import views

urlpatterns=patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^logout', views.logout, name='logout'),
	url(r'^get_comments', views.get_comments, name='get_comments'),
)
