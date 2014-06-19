import os
from sys_tray import *
import pyhk
import multiprocessing
from win32clipboard import *

MAX_FILESIZE = 1000000L

def hotkey_listener():
	def get_clipboard():
		OpenClipboard()
		if IsClipboardFormatAvailable(CF_HDROP) != 0 and len(GetClipboardData(CF_HDROP)) == 1 and os.path.getsize(GetClipboardData(CF_HDROP)[0]) < MAX_FILESIZE:			
			print  open(GetClipboardData(CF_HDROP)[0]).read()
		
		#fix string size(not len())
		elif IsClipboardFormatAvailable(CF_TEXT) != 0 and len(GetClipboardData(CF_TEXT)) < MAX_FILESIZE:
			print  GetClipboardData(CF_TEXT)
		CloseClipboard()

	file_listener = pyhk.pyhk()
	file_listener.addHotkey(['Ctrl', 'Alt','7'],get_clipboard)
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
    menu_options = (('File Expiration', 
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


