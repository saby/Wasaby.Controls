exports.config = {
   host: 'http://localhost:10011',// укажите тут адресс Вашего сервиса
   Proxy:[
      {
         serviceUrl: '/.*.(html|xml)$',
         proxyTo   : 'http://localhost:20011' //укажите тут порт на котором поднят препроцессор
      },
      {
         serviceUrl: '/',
         proxyTo   : 'http://localhost:20011/index.html'
      },
      {
         serviceUrl: '/webfonts',
         proxyTo   : 'http://localhost:20011/'
      }
   ]
};