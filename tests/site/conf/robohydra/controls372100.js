exports.config = {
   host: 'http://localhost:1175',// укажите тут адресс Вашего сервиса
   Proxy:[
      {
         serviceUrl: '/.*.(html|xml)$',
         proxyTo   : 'http://localhost:2175' //укажите тут порт на котором поднят препроцессор
      },
      {
         serviceUrl: '/',
         proxyTo   : 'http://localhost:2175/index.html'
      }
   ]
};