define(
   [
      'Controls/Decorators/WrapURLs'
   ],
   function(WrapURLs) {

      'use strict';

      describe('Controls.Decorators.WrapURLs', function() {
         var result;

         describe('getParseText', function() {
            var getParseText = WrapURLs._private.getParseText.bind(WrapURLs._private);

            it('Simple URL', function() {
               result = getParseText('http://regexpal.com/');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/',
                  www: false,
                  end: ''
               }]);
            });
            it('Simple URL with whitespaces', function() {
               result = getParseText('  http://regexpal.com/    ');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: ' ',
                     end: ' '
                  },
                  {
                     type: 'link',
                     href: 'http://regexpal.com/',
                     www: false,
                     end: ' '
                  },
                  {
                     type: 'text',
                     value: '  ',
                     end: ' '
                  }
               ]);
            });
            it('Simple URL with params', function() {
               result = getParseText('http://regexpal.com/home.php?request=q&theme=2');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  www: false,
                  end: ''
               }]);
            });
            it('Ru link', function() {
               result = getParseText('http://почта.рф/');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://почта.рф/',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with brackets', function() {
               result = getParseText('http://sometext/(test)');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://sometext/(test)',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with port', function() {
               result = getParseText('http://ya.ru:80');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://ya.ru:80',
                  www: false,
                  end: ''
               }]);
            });
            it('Link inside text', function() {
               result = getParseText('find here: http://ya.ru/, please');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'find here',
                     end: ': '
                  },
                  {
                     type: 'link',
                     href: 'http://ya.ru/',
                     www: false,
                     end: ', '
                  },
                  {
                     type: 'text',
                     value: 'please',
                     end: ''
                  }
               ]);
            });
            it('Symbol \' inside link', function() {
               result = getParseText('https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with anchor', function() {
               result = getParseText('http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4',
                  www: false,
                  end: ''
               }]);
            });
            it('Link ends dot', function() {
               result = getParseText('http://regexpal.com/home.php?request=q&theme=2.');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  www: false,
                  end: '.'
               }]);
            });
            it('Simple mail', function() {
               result = getParseText('e@mail.ru');
               assert.deepEqual(result, [{
                  type: 'email',
                  addres: 'e@mail.ru',
                  end: ''
               }]);
            });
            it('Mail with seperators', function() {
               result = getParseText('my-e.ma@il.ru');
               assert.deepEqual(result, [{
                  type: 'email',
                  addres: 'my-e.ma@il.ru',
                  end: ''
               }]);
            });
            it('Ru mail', function() {
               result = getParseText('почтальон@почта.рф');
               assert.deepEqual(result, [{
                  type: 'email',
                  addres: 'почтальон@почта.рф',
                  end: ''
               }]);
            });
            it('Colon mail', function() {
               result = getParseText('git@git.sbis.ru:');
               assert.deepEqual(result, [{
                  type: 'email',
                  addres: 'git@git.sbis.ru',
                  end: ':'
               }]);
            });
            it('After colon mail', function() {
               result = getParseText('git@git.sbis.ru: abc');
               assert.deepEqual(result, [
                  {
                     type: 'email',
                     addres: 'git@git.sbis.ru',
                     end: ': '
                  },
                  {
                     type: 'text',
                     value: 'abc',
                     end: ''
                  }
               ]);
            });
            it('Top level domailn mail', function() {
               result = getParseText('email@topleveldomain');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'email@topleveldomain',
                  end: ''
               }]);
            });
            it('www', function() {
               result = getParseText('www.yandex.ru text after');
               assert.deepEqual(result, [
                  {
                     type: 'link',
                     href: 'www.yandex.ru',
                     www: true,
                     end: ' '
                  },
                  {
                     type: 'text',
                     value: 'text after',
                     end: ''
                  }
               ]);
            });
            it('Space after protocol before www', function() {
               result = getParseText('https:// www.youtube.com/watch?v=_avffmEHKf8');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'https://',
                     end: ' '
                  },
                  {
                     type: 'link',
                     href: 'www.youtube.com/watch?v=_avffmEHKf8',
                     www: true,
                     end: ''
                  }
               ]);
            });
            it('www without dot', function() {
               result = getParseText('wwwanytext');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'wwwanytext',
                  end: ''
               }]);
            });
            it('Star url', function() {
               result = getParseText('http://www.123assess.com/te/tbm/servlet?aid=gTXJuESfVsj7qTRkHepNsA**&mid=Olnl6KgvpofmSElvN69BeA**');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://www.123assess.com/te/tbm/servlet?aid=gTXJuESfVsj7qTRkHepNsA**&mid=Olnl6KgvpofmSElvN69BeA**',
                  www: false,
                  end: ''
               }]);
            });
         });
      });
   }
);