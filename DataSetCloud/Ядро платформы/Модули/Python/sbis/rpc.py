# Python-only схема работы с бизнес-логикой СБиС 3 по JSON-RPC протоколу

from http.client import HTTPConnection, HTTPSConnection, OK
from http.cookies import SimpleCookie
from datetime import datetime
import json


# RPC-клиент для работы с бизнес-логикой СБиС 3
class Client:
   "Удалённый вызов методов БЛ"

   def __init__(self, hostname, is_https=False):
      "Инициализация"
      self.hostname = hostname
      self.header = { 'Content-type': 'application/json; charset=UTF-8' }
      self.timepass = {}
      self.connection = HTTPSConnection if is_https else HTTPConnection

   def auth(self, login, password):
      "Авторизация"
      result = self.call('САП.Аутентифицировать', '/auth', login=login, password=password)
      cookie = SimpleCookie()
      cookie['sid'] = result
      self.header['Cookie'] = str(cookie)
      self.header['X-SBISSessionID'] = result

   def call(self, method, _site='', req_timeout = None, **params):
      "Удалённый вызов метода БЛ"
      body = json.dumps({ 'jsonrpc': '2.0', 'protocol': 3, 'method': method, 'params': params, "id": 1 })
      # запрашиваем
      connection = self.connection(self.hostname, timeout = req_timeout)
      started = datetime.now() # замер времени
      if _site is not None:
         _site += '/service/'
      else:
         _site = ''
      connection.request('POST', _site, body, self.header)
      response = connection.getresponse()
      passed = (datetime.now() - started).total_seconds()
      data = response.read()
      answer = data.decode()
      # проверяем
      if response.status is not OK:
         raise HttpError(response.status, response.reason, answer)
      # читаем
      connection.close()
      # разбираем
      answer = json.loads(answer)
      if 'error' in answer:
         raise JsonRpcError(answer)
      if 'result' not in answer:
         raise BadJsonError('Ответ от сервера не содержит поле "result".')
      # сохраняем замер времени
      if method not in self.timepass:
         self.timepass[ method ] = [ passed ]
      else:
         self.timepass[ method ].append(passed)
      # возвращаем результат
      return answer['result']


# Обший класс исключений обработки запросов по сети
class WebError(Exception):
   "Базовый класс исключений при работе через rpc.Client"

   def __init__(self, message):
      super().__init__(message)


# Ошибки работы по протоколу HTTP/HTTPS
class HttpError(WebError):
   "Класс исключения при ошибке HTTP/HTTPS протоколов"

   def __init__(self, status, reason, answer):
      "Инициализация исключения по статусу, описанию и ответу при обращении по HTTP/HTTPS"
      super().__init__('{status} {reason}: {answer}'.format(status=status, reason=reason, answer=answer))
      self.__status = status
      self.__reason = reason
      self.__answer = answer

   @property
   def status(self):
      return self.__status

   @property
   def reason(self):
      return self.__reason

   @property
   def answer(self):
      return self.__answer


# Ошибки работы по протоколу JSON-RPC
class JsonRpcError(WebError):
   "Класс исключения при работе через JSON-RPC протокол"

   def __init__(self, message):
      super().__init__(message)


# Неверный JSON для работы в протоколе JSON-RPC
class BadJsonError(WebError):
   "Класс исключения при некорректном JSON для JSON-RPC протокола"

   def __init__(self, message):
      super().__init__(message)
