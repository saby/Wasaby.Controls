"""SDK modules builder"""
import shutil
import os
import logging


def build():
    """Build interface modules"""

    list_dirs = {'components', 'themes', 'lang'}

    def _copy(source, target):
        """Copy from 'source' to 'target' with replace"""
        logging.info('Copy "%s" to "%s"', source, target)
        if os.path.exists(target):
            shutil.rmtree(target)
        shutil.copytree(source, target)

    set(map(lambda x: _copy(x, os.path.join('SBIS3.CONTROLS', x)), list_dirs))


if __name__ == '__main__':
    build()
