import os
import os.path
import sys
import subprocess
import platform

def process_file(name):
   css_name = name[:-4] + "css"
   # https://docs.python.org/3/library/subprocess.html#subprocess.call
   print(name)
   util = "lessc"
   if platform.system() == "Windows":
      util = os.path.join("..", "duncansmart-less","lessc.cmd")
   subprocess.call([util, name, css_name])

def main():
   if len(sys.argv) < 2:
      print(" !  less-file is not set. Use such command:\npy buildSingleTheme.py D:\\themeFolder\\themeName.less\nor\npy buildSingleTheme.py ..\\..\\..\\onlinetest\\online.less")
      return False
   fname = sys.argv[1]
   # fname = "..\..\..\onlinetest\online.less"
   fname = os.path.realpath(fname)
   if not(os.path.exists(fname)):
      print('less-file not found')
      return False
   if os.path.exists(fname):
      process_file(fname)

if __name__ == "__main__":
   main()