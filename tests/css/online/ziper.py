from os.path import join, exists
from os import getcwd, remove, walk, rename
from zipfile import ZipFile, ZIP_DEFLATED
from shutil import copytree, rmtree

diff = '~diff'
current = '~current'
ref = '~ref'

if __name__ == '__main__':

    report_zip = 'report.zip'
    src = join(getcwd(), 'gemini-report', 'images')
    dst = src.replace('images', 'images-copy')
    zip_src = join(getcwd(), report_zip)
    if exists(zip_src):
        remove(report_zip)
    if exists(dst):
        rmtree(dst)
    copytree(src, dst)
    archive = ZipFile(report_zip, 'w', ZIP_DEFLATED)
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
            archive_name = new_file_name.replace(dst, '')
            archive.write(new_file_name, archive_name)
    archive.close()
