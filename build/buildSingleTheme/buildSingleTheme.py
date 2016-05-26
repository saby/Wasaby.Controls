import os
import os.path
import sys
import subprocess
import platform

def process_file(name):
   css_name = name[:-4] + "css"
   # https://docs.python.org/3/library/subprocess.html#subprocess.call
   builderDir = os.path.dirname(__file__)
   util = "lessc"
   if platform.system() == "Windows":
      util = os.path.join(builderDir, "..", "duncansmart-less", "lessc.cmd")

   includePath = ''
   if builderDir:
      # default --include-path=PATHS
      includePath = '--include-path=' + builderDir
   subprocess.call([util, name, css_name, includePath])

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