define(
   [
      'Controls/Decorator/WrapURLs'
   ],
   function(WrapURLs) {

      'use strict';

      describe('Controls.Decorator.WrapURLs', function() {
         var result;

         describe('parseText', function() {
            var parseText = WrapURLs._private.parseText.bind(WrapURLs._private);

            it('Simple URL', function() {
               result = parseText('http://regexpal.com/');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/',
                  www: false,
                  end: ''
               }]);
            });
            it('Simple URL with whitespaces', function() {
               result = parseText('  http://regexpal.com/    ');
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
               result = parseText('http://regexpal.com/home.php?request=q&theme=2');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  www: false,
                  end: ''
               }]);
            });
            it('Ru link', function() {
               result = parseText('http://почта.рф/');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://почта.рф/',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with brackets', function() {
               result = parseText('http://sometext/(test)');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://sometext/(test)',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with port', function() {
               result = parseText('http://ya.ru:80');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://ya.ru:80',
                  www: false,
                  end: ''
               }]);
            });
            it('Link inside text', function() {
               result = parseText('find here: http://ya.ru/, please');
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
               result = parseText('https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5',
                  www: false,
                  end: ''
               }]);
            });
            it('Link with anchor', function() {
               result = parseText('http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4',
                  www: false,
                  end: ''
               }]);
            });
            it('Link ends dot', function() {
               result = parseText('http://regexpal.com/home.php?request=q&theme=2.');
               assert.deepEqual(result, [{
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  www: false,
                  end: '.'
               }]);
            });
            it('Simple mail', function() {
               result = parseText('e@mail.ru');
               assert.deepEqual(result, [{
                  type: 'email',
                  address: 'e@mail.ru',
                  end: ''
               }]);
            });
            it('Mail with seperators', function() {
               result = parseText('my-e.ma@il.ru');
               assert.deepEqual(result, [{
                  type: 'email',
                  address: 'my-e.ma@il.ru',
                  end: ''
               }]);
            });
            it('Ru mail', function() {
               result = parseText('почтальон@почта.рф');
               assert.deepEqual(result, [{
                  type: 'email',
                  address: 'почтальон@почта.рф',
                  end: ''
               }]);
            });
            it('Colon mail', function() {
               result = parseText('git@git.sbis.ru:');
               assert.deepEqual(result, [{
                  type: 'email',
                  address: 'git@git.sbis.ru',
                  end: ':'
               }]);
            });
            it('After colon mail', function() {
               result = parseText('git@git.sbis.ru: abc');
               assert.deepEqual(result, [
                  {
                     type: 'email',
                     address: 'git@git.sbis.ru',
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
               result = parseText('email@topleveldomain');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'email@topleveldomain',
                  end: ''
               }]);
            });
            it('www', function() {
               result = parseText('www.yandex.ru text after');
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
               result = parseText('https:// www.youtube.com/watch?v=_avffmEHKf8');
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
               result = parseText('wwwanytext');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'wwwanytext',
                  end: ''
               }]);
            });
            it('Star url', function() {
               result = parseText('http://www.123assess.com/te/tbm/servlet?aid=gTXJuESfVsj7qTRkHepNsA**&mid=Olnl6KgvpofmSElvN69BeA**');
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
