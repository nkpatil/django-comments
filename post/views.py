from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib import auth
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from post.models import UserComments
from post.forms import DocumentForm
import datetime
import time
import json


def index(request):
  if request.user.is_authenticated():
    if request.method == 'POST':
      form = DocumentForm(request.POST, request.FILES)
      if form.is_valid():
        newdoc = UserComments()
        if 'image' in request.FILES:
          newdoc.image = request.FILES['image']
        if 'video' in request.FILES:
          newdoc.video = request.FILES['video']
        if 'date' in request.POST:
          if request.POST['date'] != "":
            newdoc.date = request.POST['date']
          else:
            newdoc.date = str(datetime.date.today())
        else:
          newdoc.date = str(datetime.date.today())
        newdoc.user = request.user
        newdoc.comment = request.POST['comment']
        newdoc.save()
        return HttpResponseRedirect(reverse('post:index'))
    else:
      form = DocumentForm()
    documents = UserComments.objects.filter(user=request.user).all().order_by('date').reverse()
    return render(request, 'index.html', {'documents': documents, 'form': form, 'user':request.user})
  else:
	  username = '-'
	  password = '-'
	  if 'username' in request.POST:
		  username = request.POST['username']
	  if 'password' in request.POST:
		  password = request.POST['password']
		  user = authenticate(username=username, password=password)
		  if user is not None:
			  if user.is_active:
				  auth.login(request, user)
				  documents = UserComments.objects.filter(user=user).all().order_by('date').reverse()
				  form = DocumentForm()
				  return render(request, 'index.html', {'documents': documents, 'form': form, 'user':request.user})
			  else:
				  return render(request, 'login.html', {'error': 'account disabled'})
		  else:
			  return render(request, 'login.html', {'error': 'invalid login'})
	  else:
		  return render(request, 'login.html', {'error': ''})		
		  

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect(reverse("post:index"))


def save_comments(request):
  if request.method == 'POST':
    form = DocumentForm(request.POST, request.FILES)
    if form.is_valid():
      newdoc = UserComments()
      if 'image' in request.FILES:
        newdoc.image = request.FILES['image']
      if 'video' in request.FILES:
        newdoc.video = request.FILES['video']
      if 'date' in request.POST:
        if request.POST['date'] != "":
          newdoc.date = request.POST['date']
        else:
          newdoc.date = str(datetime.date.today())
      else:
        newdoc.date = str(datetime.date.today())
      newdoc.user = request.user
      newdoc.comment = request.POST['comment']
      newdoc.save()
      return HttpResponse()
  else:
    form = DocumentForm()


def get_comments(request):
  data = UserComments.objects.filter(user=request.user).values().order_by('date')
  parent_json = {}
  for i in data:
  	i['date'] = int(time.mktime(i['date'].timetuple()) * 1000)
  	parent_json[i['date']] = [i['comment'], i['image'], i['video'], i['id']]
  #parent_json['values'] = data
  return HttpResponse(json.dumps(parent_json), content_type="application/json")

