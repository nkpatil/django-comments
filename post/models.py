from django.db import models
    
class UserComments(models.Model):
    user = models.CharField(max_length=50)
    comment = models.CharField(max_length=500)
    docfile = models.FileField(upload_to='documents/%Y/%m/%d')
