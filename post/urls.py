from django.conf.urls import patterns, url
from post import views

urlpatterns=patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^logout', views.logout, name='logout'),
	url(r'^save_data', views.save_comments, name='save_data'),
	url(r'^delete_record', views.delete_record, name='delete_record'),
)
