import requests
import json
import sys


URL = 'http://localhost:8000/'

client = requests.session()

client.get(URL)

csrftoken = client.cookies['csrftoken']


data = { 'file': "print \"It works!\"", 'fileName' : "JSONtest", 'fileExt':".py",'eDays':'99','eHours':'1', 'eMinutes':'1' }
headers = {'Content-type': 'application/json',  "X-CSRFToken":csrftoken}
r = requests.post(URL+"au", data=json.dumps(data), headers=headers)
