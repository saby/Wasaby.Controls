import re, os, uuid, shutil, ast
from .wrap import *

def _Identifier( candidate ):
   if re.match( r'^[^\d\W]\w*$', candidate ):
      return candidate
   else:
      if not re.match( r'^[^\d\W]', candidate ):
         candidate = 'ПлохоеНазвание_' + candidate
      return re.sub( r'\W', '_СимволУдалён_', candidate )
     
CHECK_IDENTIFIER_RE = re.compile( '^[^\d\W]\w*\Z' )
TAB_SPACES = ' ' * 3

def __check_identifier( identifier ):
   return CHECK_IDENTIFIER_RE.match( identifier )

def ConvertModules( filename, resources_hash ):
   ''' Генерирует файл modules.py в текущем каталоге на основе списка методов в формате:
      - тип метода (автогенерируемый, декларативный и т.п.);
      - полное имя метода (логическое имя);
      - настоящее имя вызываемого метода;
      - количество аргументов;
      - список аргументов (если доступен).
      В файле modules.py генерируются классы соответствующие имени модуля,
      а также статические методы класса, соответствующие методам бизнес-логики.'''
   methods = ListOfBLMethods()
   objects = { }
   for method in methods:
      methtype, proctype, fullname, realname, argcount, arglist, definition = method
      dotpos = fullname.find('.')
      if dotpos == -1:
         ErrorMsg( 'Не найден символ "." в имени метода ' + fullname )
         continue
      objname = fullname[:dotpos]
      if not objname:
         ErrorMsg( 'Пустое имя объекта в "{0}" [реальное имя "{1}"]'.format( fullname, realname ) )
         continue
      metname = fullname[dotpos+1:]
      if not metname:
         ErrorMsg( 'Пустое имя метода в "{0}" [реальное имя "{1}"]'.format( fullname, realname ) )
         continue
      if not __check_identifier( metname ):
         ErrorMsg( 'Недопустимое имя метода "{0}" ["{1}"; реальное имя "{2}"]'.format( metname, fullname, realname ) )
         continue
      # Проверим синтаксис метода
      try:
         ast.parse(definition)
      except SyntaxError as ex:
         ErrorMsg( 'Ошибка в синтаксисе метода "{0}": {1}'.format( fullname, str(ex) ) )
         continue
      newpack = (methtype, proctype, metname, realname, argcount, arglist, definition)
      objects.setdefault( objname, [] ).append( newpack )
   tmp_filename = '{fullpath}.py'.format( fullpath=os.path.join( os.path.dirname(filename), str(uuid.uuid4()) ) )
   with open( tmp_filename, 'w', encoding='utf_8_sig' ) as exp:
      exp.write( '# %s\n\n' % resources_hash )
      exp.write( 'from sbis import *\n' )
      exp.write( 'import sbis\n\n' )
      static_method = '{t}@staticmethod\n'.format(t=TAB_SPACES)
      replarg = { 'pass': 'password' }
      make_body = lambda text: ('{t}{t}'.format(t=TAB_SPACES) + '%s\n\n' % (text.replace( '\n', '\n{t}{t}'.format(t=TAB_SPACES) ) if text else 'pass'))
      hide_name = lambda name, count: '__%s_%d' % (_Identifier(name), count)
      for objname in objects:
         clsname = _Identifier(objname)
         if clsname[0] > '0' and clsname[0] < '9': clsname = '_' + clsname
         exp.write( 'class {clsname}:\n'.format(clsname=clsname) )
         exp.write( '{t}"Объект бизнес-логики"\n\n{t}__obj = BLObject( "{objname}" )\n{t}__objname = "{objname}"\n\n'.format(objname=objname, t=TAB_SPACES) )
         methdict = { }
         for method in objects[objname]:
            methtype, proctype, methname, realname, argcount, arglist, definition = method
            if methtype == ResourceType.rtSTANDART_SELECT and proctype == ProcedureType.ptPYTHON:
               exp.write( static_method )
               exp.write( '{t}def {name}( ДопПоля, Фильтр, Сортировка, Навигация, context ):\n'.format(name=hide_name( methname, 4 ), t=TAB_SPACES) )
               exp.write( make_body(definition) )
            elif (methtype == ResourceType.rtSELECT or methtype == ResourceType.rtASYNC_CALLBACK) and proctype == ProcedureType.ptPYTHON:
               goodarg = [ _Identifier(a) if not a in replarg else replarg[a] for a in arglist ]
               argstr = ', '.join( goodarg )
               invstr = ', ( ' + argstr + ', )' if argcount > 0 else ', ()'
               callstr = argstr + ', ' if argcount > 0 else ''
               exp.write( static_method )
               exp.write( '{t}def {name}( {callstr}context ):\n'.format(name=hide_name( methname, argcount ), callstr=callstr, t=TAB_SPACES) )
               exp.write( make_body(definition) )
            elif methtype is None: # обработчик на Python
               exp.write( static_method )
               argstr = ', '.join( arglist )
               exp.write( '{t}def {name}( {argstr}, context ):\n'.format(name=hide_name( methname, argcount ), argstr=argstr, t=TAB_SPACES) )
               exp.write( make_body(definition) )
            # добавляем сигнатуры
            methdict.setdefault( methname, [] )

         for methname in methdict:
            exp.write( '\n' + static_method )
            exp.write( '{t}def {methname}( *arg, **param ):\n'.format(methname=methname, t=TAB_SPACES) )
            exp.write( '{t}{t}"Метод бизнес логики: {objname}.{methname}"\n'.format(objname=objname, methname=methname, t=TAB_SPACES) )
            exp.write( '{t}{t}return InvokeBLMethod( __class__.__obj, "{methname}", arg, param )\n'.format(methname=methname, t=TAB_SPACES) )
         exp.write( '\n\n' )
   # пробуем сохранить
   try:
      shutil.move(tmp_filename, filename)
   except Exception as ex:
      ErrorMsg( 'Ошибка при конвертации ресурсов Python. Не удалось сохранить файл "{filename}": {message}'.format( filename=filename, message=str(ex) ) )
      os.remove(tmp_filename)
      raise
