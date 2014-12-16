# Вспомогательный модуль для работы с объектом ПользовательскиеПараметры

class UserParam:
   """Работа со значениями объекта ПользовательскиеПараметры как с массивом значений"""

   __delimiter = '\v\t\b'  # уникальный разделитель

   @staticmethod
   def split(strparam):
      """Получить массив значений из строкового параметра объекта ПользовательскиеПараметры"""
      if type(strparam) is not str and strparam is not None:
         raise TypeError('Непредусмотренный тип %s аргумента для разбиения значения объекта ПользовательскиеПараметры на массив значений, ожидается строка (str) либо None!.' % type(strparam))
      if not strparam:
         return []
      return strparam.split(UserParam.__delimiter)

   @staticmethod
   def join(paramarray):
      """Получить строковое представление массива значений объекта ПользовательскиеПараметры"""
      if type(paramarray) is not list:
         raise TypeError('Непредусмотренный тип %s аргумента для слияния массива значений объекта ПользовательскиеПараметры в строковое значение, ожидается массив (list)!.' % type(paramarray))
      return UserParam.__delimiter.join(paramarray)

   @staticmethod
   def append(value, strparam, numlimit):
      """Добавить значение value в список значений strparam объекта ПользовательскиеПараметры"""
      """с учётом ограничения на количество элементом списка значений numlimit"""
      if type(value) is not str:
         raise TypeError('Непредусмотренный тип %s аргумента для значения объекта ПользовательскиеПараметры для добавления значения, ожидается строка (str).' % type(value))
      if type(strparam) is not str and strparam is not None:
         raise TypeError('Непредусмотренный тип %s аргумента для строкового значения объекта ПользовательскиеПараметры для добавления значения, ожидается строка (str) либо None.' % type(strparam))
      if type(numlimit) is not int:
         raise TypeError('Непредусмотренный тип %d аргумента для ограничения элементов массива значений объекта ПользовательскиеПараметры для добавления значения, ожидается целое число (int).' % type(numlimit))
      if numlimit < 1:
         raise ValueError('Ограничение на количество элементов массива значений объекта ПользовательскиеПараметры не может быть меньше 1.')
      if not strparam:                       # если это первое значение
         return value                        # то просто инициализируем первым элементом
      paramarray = UserParam.split(strparam) # разбиваем строковый параметр на массив значений
      while value in paramarray:             # убиваем все предыдущие вхождения значения
         paramarray.remove(value)            # нужны только уникальные значения параметров
      if len(paramarray) >= numlimit:        # если нужно, освобождаем место для нового значения
         paramarray = paramarray[:-1]        # удаляем один элемент с конца массива
      paramarray.insert(0, value)            # добавляем новое значение в начало
      strparam = UserParam.join(paramarray)  # снова собираем строковый параметр из массива
      return strparam                        # возвращаем строку с новым списком значений
