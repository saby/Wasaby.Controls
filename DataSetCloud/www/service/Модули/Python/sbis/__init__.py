from .wrap import *
from .gen import *
from .error import *
from .fields import *
from .docstrings import *
from datetime import datetime, date, time, timedelta
from uuid import UUID, uuid1, uuid3, uuid4
import os, sys
import locale

# добавляем зависимые модули от Python в sys.path
SysPathAppendDependentModules()

# генерируем классы по ресурсам модулей бизнес-логики
generate_classes()

# дописываем строки документации туда, где это требуется. (На основе sbis-python.cpp и {core}\test\sbis\Модули\Python\sbis\docstrings.xml)
DocstringsWriter()
