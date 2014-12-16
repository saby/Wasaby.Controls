from .loader import LoadServiceModules
import os

_host = os.environ.get('SBIS_HOST')
try:
    _port = int(os.environ.get('SBIS_PORT') or 0)
except:
    _port = 0
_folder = os.environ.get('SBIS_VIRTUAL_FOLDER')
LoadServiceModules(_host, _port, _folder)

from sbis import *