import shutil
import os
import os.path


def copyReplace(folder): 
   myPath = os.path.join("SBIS3.CONTROLS", folder)
   if os.path.exists(myPath):
      shutil.rmtree(myPath)
   shutil.copytree(folder, myPath)

copyReplace("components")
copyReplace("themes")
copyReplace("resources")
