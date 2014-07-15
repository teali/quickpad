from django.shortcuts import render_to_response
from django.http import StreamingHttpResponse, HttpResponse
from django.template import RequestContext, loader
from django.core.files.base import ContentFile
from django.core.context_processors import csrf
from django.core import serializers
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.forms.models import model_to_dict
from django.utils.timezone import utc
from django.db import models
from django.contrib.auth.models import User

from datetime import datetime, timedelta
from quickpad.models import FileLink, Workspace
from mimetypes import types_map
from random import randint
import json

alphaNum = ''.join([chr(i) for i in range(48,58)+range(65,91)+range(97,123)])
recent_limit = 10

def main(request):
	request.session.set_test_cookie()
	request.META["CSRF_COOKIE_USED"] = True
	template = loader.get_template('quickpad/index.html')
	context = RequestContext(request, {})
	return HttpResponse(template.render(context))

def upload(request):	
	genId = ''	
	try:
		data=json.loads(request.body)
		file=data['file']
		name=data['fileName']
		ext=data['fileExt']
		newFile = FileLink(fileName=name,fileExt=ext,expTime = (datetime.utcnow() + timedelta(days=int(data['eDays']),hours=int(data['eHours']),minutes=int(data['eMinutes']))).replace(tzinfo=utc))
		newFile.file.save(name,ContentFile(file))
		while (True):
			genId = ''.join([alphaNum[randint(0,61)] for i in xrange(8)])
			if len(FileLink.objects.filter(fileId=genId)) == 0: break
		newFile.fileId = genId
		newFile.save()	
	except:
		return HttpResponse(status=400)	

	response = {}
	response['link'] = genId	
	return HttpResponse(json.dumps(response), content_type = "application/json")


def direct_dl(request):
	print request.path
	fId= request.path
	fId = fId[fId.rfind('/')+1:]	
	
	if len(FileLink.objects.filter(fileId=fId)) == 0:
		return HttpResponse(status=404)
	curFile = FileLink.objects.get(fileId=fId)	
	if curFile.expTime < datetime.utcnow().replace(tzinfo=utc):		
		curFile.delete()
		return HttpResponse(status=404)	
	response = StreamingHttpResponse(curFile.file, content_type=types_map[str(curFile.fileExt)])
	response['Content-Disposition'] = 'attachment; filename=%s' % (curFile.fileName + curFile.fileExt)
	
	return response

def my_cookie(request):
	response = {}
	if request.session.test_cookie_worked():
		request.session.delete_test_cookie()
		response['cs'] = '1'

		if 'enabled' not in request.session:
			request.session['enabled'] = 'true'

			genId = ''	
			while (True):
				genId = ''.join([alphaNum[randint(0,61)] for i in xrange(8)])
				if len(Workspace.objects.filter(workspaceId=genId)) == 0: break

			request.session['wId'] = genId
			request.session['tabs'] = 'None'
			request.session['active'] = 'None'
			request.session['font'] = 'consolas'
			request.session['fontSize'] = '12'
			request.session['style'] = ''

			request.session['recent'] = []
			request.session['cur_recent'] = 0
		
		for i in ['wId','tabs','active','font','fontSize','style']:	response[i] = request.session[i]	
	else: response['cs'] = '0'		
	return HttpResponse(json.dumps(response), content_type = "application/json")

def change_tabs(request):
	try:
		data=json.loads(request.body)
		request.session['tabs'] = data['tabs']
		request.session['active'] = data['active']
	except:
		return HttpResponse(status=400)
	return HttpResponse('')


def change_settings(request):
	try:
		data=json.loads(request.body)
		request.session['font'] = data['font']
		request.session['fontSize'] = data['fontSize']
		request.session['style'] = data['style']
	except:
		return HttpResponse(status=400)	
	return HttpResponse('')

def get_recent(request):
	response = []
	try:
		response = request.session['recent']
	except:
		return HttpResponse(status=400)
	return HttpResponse(json.dumps(response), content_type = "application/json")
	
def append_recent(request):
	try:
		data=json.loads(request.body)
		if len(request.session['recent']) == recent_limit:			
			request.session['recent'][request.session['cur_recent']] = data['link']
		else:
			request.session['recent'].append(data['link'])
		request.session['cur_recent'] = (request.session['cur_recent'] + 1)%recent_limit
	except:
		return HttpResponse(status=400)
	return HttpResponse('')
	
	
	
	
	
	
	
	
	
	
	