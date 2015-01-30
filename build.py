import os
import os.path
import subprocess
import shutil

def process_file(name):
   css_name = name[:-4] + "css"
   # https://docs.python.org/3/library/subprocess.html#subprocess.call
   print(name)
   subprocess.call(["build\duncansmart-less\lessc.cmd", name, css_name])

for root, dirs, files in os.walk(r'themes'):
   for dirname in dirs:
      fname = os.path.join(root, dirname, os.path.basename(dirname) + ".less")
      if os.path.exists(fname):
         process_file(fname)
         
shutil.copytree('components/', 'SBIS3.CONTROLS/components/')
shutil.copytree('themes/', 'SBIS3.CONTROLS/themes/')