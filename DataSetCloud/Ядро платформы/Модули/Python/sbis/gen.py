from .wrap import *
import sbis

TAB_SPACE = 3 * ' '

class BusinessObjectMetaClass(type):
   'Метакласс для объектов бизнес-логики'
   
   def __init__(self, class_name, class_bases, class_namespace):
      self.__class_name = class_name
      self.__doc__ = 'Объект бизнес-логики "{name}"'.format(name=class_name)

   def __getattr__(self, method_name):
      'Получение метода бизнес-логики с runtime-генерацией'
      if method_name not in self.__dict__:
         if not IsMethodExists(self.__class_name, method_name):
            raise AttributeError('В репозитории не существует метод с именем "{object_name}.{method_name}"'.format(object_name=self.__class_name,
                                                                                                                   method_name=method_name))
         proxy_name = '__{object_name}_{method_name}'.format(method_name=method_name, object_name=self.__class_name)
         try:
            full_method_name = self.__class_name + '.' + method_name
            code_text = 'def {proxy_name}(*arg, **param):\n' + \
                        '{t}"""{full_method_name}"""\n' + \
                        '{t}return InvokeBLMethod(BLObject("{object_name}"), "{method_name}", arg, param)'
            code_text = code_text.format(t=TAB_SPACE, proxy_name=proxy_name, method_name=method_name,
                                         object_name=self.__class_name, full_method_name=full_method_name)
            compiled_code = compile(code_text, full_method_name, 'exec')
            exec(compiled_code, sbis.__dict__, sbis.__dict__)
         except Exception as error:
            ErrorMsg('При регистрации метода бизнес-логики "{object_name}.{method_name}" произошла ошибка, которая не даст вызывать данный метод из Python. Ошибка: {error}'.format(object_name=object_name, method_name=method_name, error=error))
            raise
         setattr(self, method_name, sbis.__dict__[proxy_name])
      return self.__dict__[method_name]


def generate_classes():
   object_list = ObjectList()
   for object_name in object_list:
      try:
         code_text = 'class {name}(metaclass=BusinessObjectMetaClass): pass'.format(name=object_name)
         compiled_code = compile(code_text, object_name, 'exec')
         exec(compiled_code, sbis.__dict__, sbis.__dict__)
      except Exception as error:
         ErrorMsg('При регистрации объекта бизнес-логики "{object_name}" произошла ошибка, которая не даст использовать методы данного объекта из Python. Ошибка: {error}'.format(object_name=object_name, error=error))


def generate_internal_function(function_name, doc_name, arg_list, method_body):
   arg_num = len(arg_list)
   arguments = ', '.join(arg_list + ['context'])
   method_body = method_body if method_body else 'pass'
   try:
      name_components = function_name.split('_')
      full_method_name = name_components[2] + '.' + name_components[3]
      code_text = 'def {function_name}({arguments}):\n' + \
                  '{t}"""{doc_name}({arguments})"""\n' + \
                  '{t}{method_body}'
      code_text = code_text.format(t=TAB_SPACE,
                                   doc_name=doc_name,
                                   arguments=arguments,
                                   method_body=method_body.replace('\n', '\n' + TAB_SPACE),
                                   function_name=function_name)
      compiled_code = compile(code_text, full_method_name, 'exec')
      exec(compiled_code, sbis.__dict__, sbis.__dict__)
   except Exception as error:
      ErrorMsg('При регистрации функции реализующий обработчик либо перегрузку метода бизнес-логики "{function_name}" произошла ошибка, которая не даст использовать данный метод или обработчик на Python. Ошибка: {error}'.format(function_name=function_name, error=error))
      raise
