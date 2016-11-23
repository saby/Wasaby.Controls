from os.path import join, exists
from os import getcwd, remove, walk, rename
from zipfile import ZipFile, ZIP_DEFLATED
from shutil import copytree, rmtree

diff = '~diff'
current = '~current'
ref = '~ref'

if __name__ == '__main__':

    archive = ZipFile('report.zip', 'w', ZIP_DEFLATED)
    src = join(getcwd(), 'gemini-report', 'images')
    dst = src.replace('images', 'images-copy')
    if exists(dst):
        rmtree(dst)
    copytree(src, dst)
    for root, dirs, files in walk(dst):
        has_diff = True if len(list(filter(lambda image: diff in image, files))) else False
        if not has_diff:
            continue
        for file in files:
            file_name = join(root, file)
            if ref in file:
                remove(file_name)
                continue
            if diff in file:
                remove(file_name)
                continue
            new_file_name = file_name.replace(current, '')
            rename(file_name, new_file_name)
            archive.write(new_file_name)
    archive.close()
