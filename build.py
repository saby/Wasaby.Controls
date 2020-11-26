"""SDK modules builder"""
import shutil
import os, sys
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

if __name__ == '__main__':
    build()
