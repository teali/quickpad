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

if __name__ == '__main__':
    import itertools, glob
    listener = multiprocessing.Process(target=hotkey_listener)
    listener.start()
    icons = itertools.cycle(glob.glob('*.ico'))
    hover_text = "Quickpad"
    def set_expiration(sysTrayIcon): print "Set expiration"
    def about(sysTrayIcon): print "About Quickpad"
    def switch_icon(sysTrayIcon):
        sysTrayIcon.icon = icons.next()
        sysTrayIcon.refresh_icon()
    menu_options = (('File Expiration', icons.next(), set_expiration),
    				('About Quickpad', icons.next(), (('Say Hello to Simon', icons.next(), setexpiration),
                                                  ('Switch Icon', icons.next(), setexpiration),
                                                 ))
    			   )


    '''    
    menu_options = (('Say Hello', icons.next(), hello),
                    ('Switch Icon', None, switch_icon),
                    ('A sub-menu', icons.next(), (('Say Hello to Simon', icons.next(), simon),
                                                  ('Switch Icon', icons.next(), switch_icon),
                                                 ))
                   )
	'''
    def quit(sysTrayIcon): 
    	print 'Bye, then.'
    	global listener
    	listener.terminate()
    
    SysTrayIcon(icons.next(), hover_text, menu_options, on_quit=quit, default_menu_index=1)


