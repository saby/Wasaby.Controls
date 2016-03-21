import buildThemes
import shutil
import os
import os.path

buildThemes.main()

def copyReplace(folder): 
   myPath = os.path.join("SBIS3.CONTROLS", folder)
   if os.path.exists(myPath):
      shutil.rmtree(myPath)
   shutil.copytree(folder, myPath)

def copyThemesLess(file):
   sourcePath = os.path.join("themes", file)
   buildThemePath = os.path.join("SBIS3.CONTROLS","build", "buildSingleTheme", file)
   shutil.copyfile(sourcePath, buildThemePath)

copyReplace("components")
copyReplace("themes")
copyReplace("build")

copyThemesLess("general.less")
copyThemesLess("mixins.less")