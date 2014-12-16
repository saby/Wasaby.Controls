# стандартные исключения СБИС 3

import sbis
from sbis import *

class Error( Exception ):
   "Cтандартное исключение СБИС 3"

   def __init__( self, details, user_msg = "", traceback = "", error_code = -1 ):
      "Конструктор исключения"
      self.details     = details
      self.user_msg    = user_msg
      self.traceback   = traceback
      self.error_code  = error_code
      self.type        = ExceptionType.ERROR

   def __str__( self ):
      if self.user_msg and self.details:
         return '{user_msg} [{error_code}] (ОПИСАНИЕ: {details})'.format(classname=__class__, user_msg=self.user_msg, error_code=self.error_code, details=self.details)
      elif not self.user_msg:
         return self.details
      else:
         return self.user_msg + '(ОПИСАНИЕ: отсутствует)'


class Warning( Error ):
   "Пишет предупреждение в лог"
   
   def __init__( self, details, user_msg = "", traceback = "", error_code = -1 ):
      super().__init__( details, user_msg, traceback, error_code )
      self.type = ExceptionType.WARNING


class BadGatewayException( Error ):
   "Исключение для HTTP 502"
   pass


class BadExecStatement( Error ):
   "Невозможность выполнить sql команду"
   def __str__( self ):
      if self.user_msg and self.details and self.error_code != -1:
         return '{user_msg} [{error_type}] (ОПИСАНИЕ: {details})'.format(
            classname=__class__, user_msg=self.user_msg, 
            error_type = BadExecStatementErrorTypes.values[ self.error_code ], details=self.details)
      else:
         return super(BadExecStatement, self).__str__()

class TransportError( Error ):
   "Исключение для HTTP 503"
   pass


class SerializableException( Error ):
   "Сериализуемое исключение"

   def __init__( self, details, user_msg = "", traceback = "", error_code = -1, class_uuid = None, passed_exception = None ):
      "Конструктор исключения"
      super().__init__( details, user_msg, traceback, error_code )
      self.__class_uuid       = class_uuid
      self.__passed_exception = passed_exception
      self.additional_data    = Record()

   @property
   def class_uuid( self ):
      return self.__class_uuid

   @property
   def passed_exception( self ):
      return self.__passed_exception


def DumpProcess( filename ):
   "Функция для записи состояния потоков интерпретатора на момент падения процесса"
   import os, sys, traceback
   with open( filename, 'w' ) as f:
      f.write('Python process dump\n')
      for thread_id, thread_stack in sys._current_frames().items():
         f.write( 80 * '_' + '\n' )
         f.write( '\nThread: {thread_id:d}\n'.format( thread_id=thread_id ) )
         for file, line_no, name, line in traceback.extract_stack( thread_stack ):
            f.write( '\tFile: {file}, line {line_no:d}, in {name}\n'.format( file=os.path.normpath(file), line_no=line_no, name=name ) )
            if line: f.write( '\t\t{line}\n'.format(line=line) )
      f.write(80 * '_' + '\n')
      f.write('\nGlobals:\n')
      for name, value in globals().items():
         f.write( '\t{name}: {value}\n'.format( name=name, value=value ) )
      f.write(80 * '_' + '\n')
      f.write('\nLocals:\n')
      for name, value in locals().items():
         f.write( '\t{name}: {value}\n'.format( name=name, value=value ) )
