

# Получить информацию о пользователе и его клиенте 
# Пример:
# sid = '00008976-09890000-0ba-87477830307844'
# info = info_by_sid(sid)
# print( info.user )  
# '09890000'
# print( info.client )
# '00008976'
# print( info.user_id )  
# 159973376
# print( info.client_id )
# 35190
def  info_by_sid( sid ):
  arr = sid.split('-')
  class ClientInfo:  
      client    = arr[0]
      user      = arr[1]
      client_id = int(client,16)
      user_id   = int(user,16)
  return ClientInfo()
  
 # Сформировать строку логина для анонимного пользователя клиента
 # Формат логина анонимного пользователя это "__сбис__гость__<ид клиента в 16 - ричном представлении>" 
 # Почему в 16 ричном, да потому что, чтобы одинаковую длину логина обеспечить
def create_login_for_guest( id_client ):
    return  "__сбис__гость__{:08x}".format( id_client )
  