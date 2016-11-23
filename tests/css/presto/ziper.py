from os.path import join, exists
from os import getcwd, remove, walk
from zipfile import ZipFile, ZIP_DEFLATED
from shutil import copytree, rmtree


if __name__ == '__main__':

    archive = ZipFile('etalons.zip', 'w', ZIP_DEFLATED)
    src = join(getcwd(), 'gemini-report', 'images')
    dst = src.replace('images', 'images-copy')
    if exists(dst):
        rmtree(dst)
    copytree(src, dst)
    for root, dirs, files in walk(dst):
        for file in files:
            file_name = join(root, file)
            if '~ref' in file:
                remove(file_name)
                continue
            if '~current' in file:
                remove(file_name)
                continue
            archive.write(file_name)
    archive.close()
