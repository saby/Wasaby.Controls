import os
import os.path
import subprocess
import platform

def process_file(name):
   css_name = name[:-4] + "css"
   # https://docs.python.org/3/library/subprocess.html#subprocess.call
   print(name)
   util = "lessc"
   if platform.system() == "Windows":
      util = os.path.join("build","duncansmart-less","lessc.cmd")
   else:
      util = "lessc"
   subprocess.call([util, name, css_name])

def main():
   process_file(os.path.join(r'themes', 'online', os.path.basename('online') + ".less"))
if __name__ == "__main__":
   main()