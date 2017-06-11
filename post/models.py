from django.db import models

class Comments(models.Model):
    user = models.CharField(max_length=50)
    comment = models.CharField(max_length=1000)
    date = models.DateField(auto_now_add=True)
    image = models.FileField(upload_to='documents/%Y/%m/%d', blank=True, null=True)
    video = models.FileField(upload_to='documents/%Y/%m/%d', blank=True, null=True)
