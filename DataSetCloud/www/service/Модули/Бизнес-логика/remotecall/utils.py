from sbis import *
from urllib.parse import urlparse

# Терентьев
# Получаем из URL имя хоста , т.е. для url = https://online.sbis.ru/amd  нам должно вернуться online.sbis.ru
# помним что описания url выглядит как <схема>://<логин>:<пароль>@<хост>:<порт>/<URL?путь>?<параметры>#<якорь>
def get_host_name_from_url( url ):  
   host = urlparse(url).hostname
   if( host is None ):
      return urlparse('//' + url).hostname   # оказывается так требует стандарт "Following the syntax specifications in RFC 1808, urlparse recognizes a netloc only if it is properly introduced by '//'
   return host
 
 
# Терентьев
# Выполнить аутентификацию по логину и паролю по адресу url_auth
def do_auth_by_login_pwd( url_auth, login, password ):
   param = Record()
   param.AddString('login', login ) 
   param.AddString('password', password )
   res = Record()
   res.AddString('result') 
   rc = RemoteCommandRecParam('САП.Аутентифицировать', param, res[0] )
   # здесь неплохо бы проверять может /service уже задали
   if url_auth.endswith('/service/') == True:
      rc.execute( url_auth, '')
   elif url_auth.endswith('/service') == True:
      rc.execute( url_auth + '/', '')
   elif url_auth.endswith('/') == True:
      rc.execute( url_auth + 'service/', '')
   else:
      rc.execute( url_auth + '/service/', '')
   return res.result

