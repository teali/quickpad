from django.db import models
from django.contrib.auth.models import User

#when filelink is opened CREATE A NEW ONE
class FileLink(models.Model):
	fileId= models.CharField(max_length=8)
	file = models.FileField(upload_to="files")
	uploadTime = models.DateTimeField(auto_now_add=True)
	expTime = models.DateTimeField()
	fileName = models.CharField(max_length=100)
	fileExt = models.CharField(max_length=100)
	
class Workspace(models.Model):
	workspaceId = models.CharField(max_length=8)
	tabs = models.TextField()
	active = models.CharField(max_length=10)
	font = models.CharField(max_length=100)
	fontSize = models.CharField(max_length=3)
	style = models.CharField(max_length=50)
	