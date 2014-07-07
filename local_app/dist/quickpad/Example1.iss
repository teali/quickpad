; -- Example1.iss --
; Demonstrates copying 3 files and creating an icon.

[Setup]
AppName=Quickpad
AppVersion=1.0.0
DefaultDirName={pf}\Quickpad
DefaultGroupName=Quickpad
UninstallDisplayIcon={app}\MyProg.exe
Compression=lzma2
SolidCompression=yes
OutputDir={app}\output
WizardImageFile=Install_Banner.bmp

[Files]
Source: "_ctypes.pyd"; DestDir: "{app}"
Source: "_hashlib.pyd"; DestDir: "{app}"
Source: "_multiprocessing.pyd"; DestDir: "{app}"
Source: "_socket.pyd"; DestDir: "{app}"
Source: "_ssl.pyd"; DestDir: "{app}"
Source: "_win32sysloader.pyd"; DestDir: "{app}"
Source: "bz2.pyd"; DestDir: "{app}"
Source: "exp.dat"; DestDir: "{app}"
Source: "instance.dat"; DestDir: "{app}"
Source: "Microsoft.VC90.CRT.manifest"; DestDir: "{app}"
Source: "msvcm90.dll"; DestDir: "{app}"
Source: "msvcp90.dll"; DestDir: "{app}"
Source: "msvcr90.dll"; DestDir: "{app}"
Source: "pyexpat.pyd"; DestDir: "{app}"
Source: "pyHook._cpyHook.pyd"; DestDir: "{app}"
Source: "python27.dll"; DestDir: "{app}"
Source: "pythoncom27.dll"; DestDir: "{app}"
Source: "pywintypes27.dll"; DestDir: "{app}"
Source: "quickpad.exe"; DestDir: "{app}"
Source: "quickpad.exe.manifest"; DestDir: "{app}"
Source: "quickpad16.ico"; DestDir: "{app}"
Source: "select.pyd"; DestDir: "{app}"
Source: "unicodedata.pyd"; DestDir: "{app}"
Source: "win32api.pyd"; DestDir: "{app}"
Source: "win32clipboard.pyd"; DestDir: "{app}"
Source: "win32gui.pyd"; DestDir: "{app}"
Source: "win32pipe.pyd"; DestDir: "{app}"
Source: "win32wnet.pyd"; DestDir: "{app}"
Source: "winxpgui.pyd"; DestDir: "{app}"
Source: "include\pyconfig.h"; DestDir: "{app}"

[Icons]
Name: "{group}\Quickpad"; Filename: "{app}\Quickpad.exe"
