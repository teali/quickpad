# -*- mode: python -*-
a = Analysis(['quickpad.py'],
             pathex=['C:\\Code\\quickpad\\local_app'],
             hiddenimports=[],
             hookspath=None,
             runtime_hooks=None)
pyz = PYZ(a.pure)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='quickpad.exe',
          debug=False,
          strip=None,
          upx=True,
          console=False , icon='quickpad_full.ico')
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=None,
               upx=True,
               name='quickpad')
