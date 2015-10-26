exports.config = {
   host: 'http://localhost:1171',// укажите тут адресс Вашего сервиса
   Proxy:[
      {
         serviceUrl: '/.*.(html|xml)$',
         proxyTo   : 'http://localhost:2171' //укажите тут порт на котором поднят препроцессор
      },
      {
         serviceUrl: '/',
         proxyTo   : 'http://localhost:2171/index.html'
      }
   ]
};