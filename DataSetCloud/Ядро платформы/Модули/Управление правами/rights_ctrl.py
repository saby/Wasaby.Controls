def isCurrentService(host, request_url, service_adr):
   if host is None or request_url is None :
      return False
   if service_adr.find( host ) == -1 :
      return False
   url = service_adr + '/service/sbis-rpc-service300.dll'
   url2 = host + request_url
   if url.find( url2 ) == -1 :
      return False
   return True