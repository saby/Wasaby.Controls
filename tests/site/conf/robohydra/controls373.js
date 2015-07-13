exports.config = {
   host: 'http://localhost:1173',// укажите тут адресс Вашего сервиса
   Proxy:[
      {
         serviceUrl: '/.*.(html|xml)$',
         proxyTo   : 'http://localhost:2173' //укажите тут порт на котором поднят препроцессор
      },
      {
         serviceUrl: '/',
         proxyTo   : 'http://localhost:2173/index.html'
      }
   ]
};