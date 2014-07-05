import os
from sys_tray import *
import pyhk
import multiprocessing
import requests
import json
from win32clipboard import *
from tendo import singleton
from Tkinter import Tk, Frame, Label, BOTH
from PIL import Image, ImageTk
import webbrowser

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
	data = { 'file': contents, 'fileName' : "paste", 'fileExt':".txt",'eDays':'0','eHours':'0', 'eMinutes': exp_time }
	headers = {'Content-type': 'application/json',  "X-CSRFToken":csrftoken}
	r = requests.post(URL+"au", data=json.dumps(data), headers=headers,cookies=cookies)
	webbrowser.open("http://localhost:8000/"+r.json()["link"])
	#deployment
	#webbrowser.open("http://www.quickpad.io/"+r.json()["link"])

def hotkey_listener():
	file_listener = pyhk.pyhk()
	file_listener.addHotkey(['Ctrl', 'Alt','K'],clipboard_to_quickpad)
	file_listener.start()

def set_expiration(exp):
	def exp_closure(sysTrayIcon):
		f_data = open("exp.dat","w")
		f_data.write(str(exp))
		f_data.close()
	return exp_closure

class AboutFrame(Frame):  
    def __init__(self, parent):
        Frame.__init__(self, parent, background="white")   
         
        self.parent = parent      
        self.parent.title("Quickpad")
        self.pack(fill=BOTH, expand=1)
        self.centerWindow()

    def centerWindow(self):
      
        w = 500
        h = 300

        sw = self.parent.winfo_screenwidth()
        sh = self.parent.winfo_screenheight()
        
        x = (sw - w)/2
        y = (sh - h)/2
        self.parent.geometry('%dx%d+%d+%d' % (w, h, x, y))

def about(sysTrayIcon): 
	root = Tk()
	root.wm_iconbitmap('quickpad_full.ico')
	app = AboutFrame(root)

	bg = ImageTk.PhotoImage(Image.open("About-Banner.jpg"))
	panel = Label(root, image=bg)
	panel.pack(side='top', fill='both', expand='yes')

	root.mainloop() 

if __name__ == '__main__':
		import itertools, glob
		listener = multiprocessing.Process(target=hotkey_listener)
		listener.start()
		icon = "quickpad16.ico"
		hover_text = "Quickpad"

		menu_options = (('Upload Clipboard', 
						 icon, 
						 clipboard_to_quickpad),
						 ('File Expiration', 
						 icon, 
						 (('10 Minutes', icon, set_expiration(10)),
											('1 Hour', icon, set_expiration(60)),
											('1 Day', icon, set_expiration(1440)),
											('1 Week', icon, set_expiration(10080)),
											('2 Weeks', icon, set_expiration(20160)),
											('4 Weeks', icon, set_expiration(40320)),
										 )),
						('About Quickpad', 
						 icon, 
						 about)
						 )

		def quit(sysTrayIcon): 
			global listener
			listener.terminate()
		
		SysTrayIcon(icon, hover_text, menu_options, on_quit=quit, default_menu_index=1)


