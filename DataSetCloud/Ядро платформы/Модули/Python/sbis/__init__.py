import os, sys
sys.path.append( os.path.dirname( __file__ ) )

from .wrap import *
from .gen import *
from .error import *
from .fields import *
from .docstrings import *
from .depricated import *
from datetime import datetime, date, time, timedelta
from decimal import Decimal, Decimal as Money
from uuid import UUID, uuid1, uuid3, uuid4
import locale

# добавляем зависимые модули от Python в sys.path
SysPathAppendDependentModules()

# генерируем классы по ресурсам модулей бизнес-логики
generate_classes()

# дописываем строки документации туда, где это требуется. (На основе sbis-python.cpp и {core}\test\sbis\Модули\Python\sbis\docstrings.xml)
DocstringsWriter()
