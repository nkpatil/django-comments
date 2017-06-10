from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib import auth
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from post.models import UserComments
from post.forms import DocumentForm


def index(request):
  if request.user.is_authenticated():
    if request.method == 'POST':
      form = DocumentForm(request.POST, request.FILES)
      if form.is_valid():
        newdoc = UserComments(docfile=request.FILES['docfile'],\
                 user=request.user,
                 comment = request.POST['comment'])
        newdoc.save()
        return HttpResponseRedirect(reverse('post:index'))
    else:
      form = DocumentForm()
    documents = UserComments.objects.filter(user=request.user).all()
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
				  documents = UserComments.objects.filter(user=user).all()
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

    