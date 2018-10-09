"""SDK modules builder"""
import shutil
import os
import logging


def build():
    """Build interface modules"""

    list_dirs = ['lang', 'less-blacklist.json']

    def _copy(source, target):
        """Copy from 'source' to 'target' with replace"""
        logging.info('Copy "%s" to "%s"', source, target)
        if os.path.exists(target):
            if os.path.isdir(target):
               shutil.rmtree(target)
            else:
               os.remove(target)
        if os.path.isdir(source):
            shutil.copytree(source, target)
        else:
            shutil.copyfile(source, target)
    # TODO фикс чтобы собирать темы, до момента, пока модуль не включем в сборки
    themepath = os.path.join('SBIS3.CONTROLS', 'default-theme') 
    if not os.path.exists(themepath):
        os.makedirs(themepath)
    set(map(lambda x: _copy(os.path.join('Controls-theme', 'themes', 'default', x), os.path.join(themepath, x)), os.listdir(os.path.join('Controls-theme', 'themes', 'default'))))

if __name__ == '__main__':
    build()
