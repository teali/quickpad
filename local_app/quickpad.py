import os
from sys_tray import *
import pyhk
import multiprocessing
import requests
import json
from win32clipboard import *

MAX_FILESIZE = 1000000L

def clipboard_to_quickpad(sysTrayIcon=None):
	fin = open("exp.dat")
	exp_time = fin.read().strip("\n")
	fin.close()
	contents = ""
	#gets file from clipboard(file or copied text)
	OpenClipboard()
	if IsClipboardFormatAvailable(CF_HDROP) != 0 and len(GetClipboardData(CF_HDROP)) == 1 and os.path.getsize(GetClipboardData(CF_HDROP)[0]) < MAX_FILESIZE:			
		try:
			fin = open(GetClipboardData(CF_HDROP)[0])
			contents = fin.read()
			fin.close()
		except: return
	#fix string size(not len())
	elif IsClipboardFormatAvailable(CF_TEXT) != 0 and len(GetClipboardData(CF_TEXT)) < MAX_FILESIZE:
		contents =  GetClipboardData(CF_TEXT)
	else:
		CloseClipboard()
		return
	CloseClipboard()

	#ajax the file
	URL = 'http://127.0.0.1:8000/'

	client = requests.session()

	client.get(URL,cookies=dict(CSRF_COOKIE=''))
	cookies = dict(client.cookies)
	csrftoken = client.cookies['csrftoken']
	data = { 'file': contents, 'fileName' : "JSONtest", 'fileExt':".py",'eDays':'0','eHours':'0', 'eMinutes': exp_time }
	headers = {'Content-type': 'application/json',  "X-CSRFToken":csrftoken}
	r = requests.post(URL+"au", data=json.dumps(data), headers=headers,cookies=cookies)
	print r.json()

def hotkey_listener():
	file_listener = pyhk.pyhk()
	file_listener.addHotkey(['Ctrl', 'Alt','7'],clipboard_to_quickpad)
	file_listener.start()

def set_expiration(exp):
	def exp_closure(sysTrayIcon):
		f_data = open("exp.dat","w")
		f_data.write(str(exp))
		f_data.close()
	return exp_closure

def about(sysTrayIcon): 
	print "About Quickpad"

if __name__ == '__main__':
		import itertools, glob
		listener = multiprocessing.Process(target=hotkey_listener)
		listener.start()
		icons = itertools.cycle(glob.glob('*.ico'))
		hover_text = "Quickpad"

		def switch_icon(sysTrayIcon):
				sysTrayIcon.icon = icons.next()
				sysTrayIcon.refresh_icon()
		menu_options = (('Upload Clipboard', 
						 icons.next(), 
						 clipboard_to_quickpad),
						 ('File Expiration', 
						 icons.next(), 
						 (('10 Minutes', icons.next(), set_expiration(10)),
											('1 Hour', icons.next(), set_expiration(60)),
											('1 Day', icons.next(), set_expiration(1440)),
											('1 Week', icons.next(), set_expiration(10080)),
											('2 Weeks', icons.next(), set_expiration(20160)),
											('4 Weeks', icons.next(), set_expiration(40320)),
										 )),
						('About Quickpad', 
						 icons.next(), 
						 about)
						 )

		def quit(sysTrayIcon): 
			global listener
			listener.terminate()
		
		SysTrayIcon(icons.next(), hover_text, menu_options, on_quit=quit, default_menu_index=1)


