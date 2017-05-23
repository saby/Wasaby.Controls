/**
 * Created by ps.borisov on 05.04.2017.
 */
define([
   'js!SBIS3.CONTROLS.Utils.LinkWrap'
], function (
   LinkWrap
) {
   describe('SBIS3.CONTROLS.Utils.LinkWrap', function () {

      describe('.wrapURLs()', function () {
         var
            tests = [
               {
                  name: 'simple URL',
                  question: 'http://regexpal.com/',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/">http://regexpal.com/</a>'
               },
               {
                  name: 'simple URL with whitespaces',
                  question: '  http://regexpal.com/    ',
                  answer: '  <a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/">http://regexpal.com/</a>    '
               },
               {
                  name: 'simple URL with params',
                  question: 'http://regexpal.com/home.php?request=q&theme=2',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/home.php?request=q&theme=2">http://regexpal.com/home.php?request=q&theme=2</a>'
               },
               {
                  name: 'wrapped empty link',
                  question: '<a href="http://regexpal.com/"></a>',
                  answer: '<a href="http://regexpal.com/"></a>'
               },
               {
                  name: 'wrapped link',
                  question: '<a href="http://regexpal.com/">http://regexpal.com</a>',
                  answer: '<a href="http://regexpal.com/">http://regexpal.com</a>'
               },
               {
                  name: 'wrapped link wisth whitespaces',
                  question: '<a href = "http://regexpal.com/">   http://regexpal.com/   </a>',
                  answer: '<a href = "http://regexpal.com/">   http://regexpal.com/   </a>'
               },
               {
                  name: '2 links 1 wrapped link',
                  question: 'http://regexpal.com/   http://regexpal.com/home.php?request=q&theme=2 <a href="http://regexpal.com/"></a>',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/">http://regexpal.com/</a>   <a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/home.php?request=q&theme=2">http://regexpal.com/home.php?request=q&theme=2</a> <a href="http://regexpal.com/"></a>'
               },
               {
                  name: 'ru link',
                  question: 'http://почта.рф/',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://почта.рф/">http://почта.рф/</a>'
               },
               {
                  name: 'link with brackets',
                  question: 'http://sometext/(test)',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://sometext/(test)">http://sometext/(test)</a>'
               },
               {
                  name: 'link with brackets and slash',
                  question: 'http://sometext/(test)/',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://sometext/(test)/">http://sometext/(test)/</a>'
               },
               {
                  name: 'link with one open bracket',
                  question: 'http://sometext.c(om/test/',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://sometext.c">http://sometext.c</a>(om/test/'
               },
               {
                  name: 'link with hash',
                  question: 'http://sometext.com/(#$test)/',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://sometext.com/(#$test)/">http://sometext.com/(#$test)/</a>'
               },
               {
                  name: 'link with port',
                  question: 'http://ya.ru:80',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru:80">http://ya.ru:80</a>'
               },
               {
                  name: 'link with port and brackets',
                  question: 'http://ya.ru:80/(x)',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru:80/(x)">http://ya.ru:80/(x)</a>'
               },
               {
                  name: 'link with port and empty brackets',
                  question: 'http://ya.ru:80/()',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru:80/()">http://ya.ru:80/()</a>'
               },
               {
                  name: 'link inside text',
                  question: 'find here: http://ya.ru/, please',
                  answer: 'find here: <a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>, please'
               },
               {
                  name: 'link inside nbsp text',
                  question: 'find here: http://ya.ru/,&nbsp; &nbsp;please',
                  answer: 'find here: <a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>,&nbsp; &nbsp;please'
               },
               {
                  name: 'link inside nbsp text 2',
                  question: 'find here: http://ya.ru/,&nbsp;please',
                  answer: 'find here: <a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>,&nbsp;please'
               },
               {
                  name: 'link inside escapig symbols',
                  question: '&lt;form action=&quot;http://www.youtube.com/watch?v=q1UiDitcPWc&quot;&gt;&lt;input type=&quot;submit&quot;&gt;&lt;/form&gt;',
                  answer: '&lt;form action=&quot;<a rel="noreferrer" class="asLink" target="_blank" href="http://www.youtube.com/watch?v=q1UiDitcPWc">http://www.youtube.com/watch?v=q1UiDitcPWc</a>&quot;&gt;&lt;input type=&quot;submit&quot;&gt;&lt;/form&gt;'
               },
               {
                  name: '2 links inside escapig symbols',
                  question: '&lt;form action=&quot;http://www.youtube.com/watch?v=q1UiDitcPWc&quot;&gt;&lt;input type=&quot;submit&quot;&gt;&lt;/form&gt; и ещё ссылка http://ya.ru',
                  answer: '&lt;form action=&quot;<a rel="noreferrer" class="asLink" target="_blank" href="http://www.youtube.com/watch?v=q1UiDitcPWc">http://www.youtube.com/watch?v=q1UiDitcPWc</a>&quot;&gt;&lt;input type=&quot;submit&quot;&gt;&lt;/form&gt; и ещё ссылка <a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru">http://ya.ru</a>'
               },
               {
                  name: '2 links separate nbsp',
                  question: 'http://ya.ru/&nbsp;http://ya.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>&nbsp;<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru">http://ya.ru</a>'
               },
               {
                  name: '3 links separate nbsp',
                  question: 'http://ya.ru/&nbsp;http://ya.ru/&nbsp;http://ya.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>&nbsp;<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/">http://ya.ru/</a>&nbsp;<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru">http://ya.ru</a>'
               },
               {
                  name: '3 links separate quot',
                  question: 'http://ya.ru/&quot;http://ya.ru/&quot;http://ya.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://ya.ru/&quot;http://ya.ru/&quot;http://ya.ru">http://ya.ru/&quot;http://ya.ru/&quot;http://ya.ru</a>'
               },
               {
                  name: 'symbol \' inside link',
                  question: 'http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4">http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4</a>'
               },
               {
                  name: 'https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5',
                  question: 'https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5">https://wiki.postgresql.org/wiki/What\'s_new_in_PostgreSQL_9.5</a>'
               },
               {
                  name: 'link ends dot',
                  question: 'http://regexpal.com/home.php?request=q&theme=2........',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="http://regexpal.com/home.php?request=q&theme=2">http://regexpal.com/home.php?request=q&theme=2</a>........'
               },
               {
                  name: 'simple mail',
                  question: 'e@mail.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a>'
               },
               {
                  name: 'mailto mail',
                  question: 'mailto:e@mail.ru',
                  answer: 'mailto:<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a>'
               },
               {
                  name: 'mail with seperators',
                  question: 'my-e.ma@il.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="mailto:my-e.ma@il.ru">my-e.ma@il.ru</a>'
               },
               {
                  name: 'few mails',
                  question: 'e@mail.ru mailto:e@mail.ru mailTo:e@mail.ru Mailto:e@mail.ru MailTo:e@mail.ru my-e.ma@il.ru',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a> mailto:<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a> mailTo:<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a> Mailto:<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a> MailTo:<a rel="noreferrer" class="asLink" target="_blank" href="mailto:e@mail.ru">e@mail.ru</a> <a rel="noreferrer" class="asLink" target="_blank" href="mailto:my-e.ma@il.ru">my-e.ma@il.ru</a>'
               },
               {
                  name: 'ru mail',
                  question: 'почтальон@почта.рф',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="mailto:почтальон@почта.рф">почтальон@почта.рф</a>'
               },
               {
                  name: 'colon mail',
                  question: 'git@git.sbis.ru:',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="mailto:git@git.sbis.ru">git@git.sbis.ru</a>:'
               },
               {
                  name: 'after colon mail',
                  question: 'git@git.sbis.ru:abc',
                  answer: 'git@git.sbis.ru:abc'
               },
               {
                  name: 'top level domailn mail',
                  question: 'email@topleveldomain',
                  answer: 'email@topleveldomain'
               },
               {
                  name: 'www',
                  question: 'www.yandex.ru text after',
                  answer: '<a rel="noreferrer" class="asLink" target="_blank" href="www.yandex.ru">www.yandex.ru</a> text after'
               },
               {
                  name: 'space after protocol before www',
                  question: 'https:// www.youtube.com/watch?v=_avffmEHKf8',
                  answer: 'https:// <a rel="noreferrer" class="asLink" target="_blank" href="www.youtube.com/watch?v=_avffmEHKf8">www.youtube.com/watch?v=_avffmEHKf8</a>'
               },
               {
                  name: 'www without dot',
                  question: 'wwwanytext',
                  answer: 'wwwanytext'
               }
            ];

         for (var index in tests) {
            if (tests.hasOwnProperty(index)) {
               var
                  test = tests[index];
               it(test.name, function () {
                  var
                     result = LinkWrap.wrapURLs(this.question);
                  assert.strictEqual(result, this.answer);
               }.bind(test));
            }
         }

      });
      describe('.wrapFiles()', function () {
         it('wrap file ', function () {
            var
               input = 'C:\\path_to_file',
               output = '<a class="asLink" title="Открыть файл (папку)" data-open-file="C:\\\\path_to_file">C:\\path_to_file</a>';
            assert.strictEqual(LinkWrap.wrapFiles(input), output);
         });
         it('wrap file inside text', function () {
            var
               input = 'text before C:\\path_to_file <p>text after</p>',
               output = 'text before <a class="asLink" title="Открыть файл (папку)" data-open-file="C:\\\\path_to_file ">C:\\path_to_file </a><p>text after</p>';
            assert.strictEqual(LinkWrap.wrapFiles(input), output);
         });
         it('no wrap file inside link', function () {
            var
               input ='<a class="LinkDecorator__linkWrap" target="_blank" href="https://inside.tensor.ru/"><img  alt="C:\\path_to_file" src=""/></a>';
            assert.strictEqual(LinkWrap.wrapFiles(input), input);
         });
      });
   });
});
