/**
 * Created by rn.kondakov on 24.10.2018.
 */
define([
   'Controls/Decorator/Markup/Converter',
   'Controls/Decorator/Markup/resolvers/linkDecorate'
], function(Converter,
   linkDecorateResolver) {
   'use strict';

   describe('Controls.Decorator.Markup.Converter', function() {
      var emptyNode = [],
         simpleNode = ['span', 'text'],
         deepNode = ['span',
            {
               'style': 'text-decoration: line-through;',
               'data-mce-style': 'text-decoration: line-through;'
            },
            'text',
            ['strong',
               'text',
               ['em',
                  'text',
                  ['span',
                     {
                        'style': 'text-decoration: underline;',
                        'data-mce-style': 'text-decoration: underline;'
                     },
                     'text'
                  ],
                  'text'
               ],
               'text'],
            'text'
         ],
         attributedNode = ['span', { 'class': 'someClass' }, 'text'],
         linkNode = ['a',
            {
               rel: 'noreferrer',
               href: 'https://ya.ru',
               target: '_blank'
            },
            'https://ya.ru'
         ],
         httpLinkNode = ['a',
            {
               rel: 'noreferrer',
               href: 'http://ya.ru',
               target: '_blank'
            },
            'http://ya.ru'
         ],
         wwwLinkNode = ['a',
            {
               rel: 'noreferrer',
               href: 'http://www.ya.ru',
               target: '_blank'
            },
            'www.ya.ru'
         ],
         deepHtml = '<span style="text-decoration: line-through;" data-mce-style="text-decoration: line-through;">text<strong>text<em>text<span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">text</span>text</em>text</strong>text</span>',
         linkHtml = '<a rel="noreferrer" href="https://ya.ru" target="_blank">https://ya.ru</a>',
         decoratedLinkHtml = '<span class="LinkDecorator__wrap"><a rel="noreferrer" href="https://ya.ru" target="_blank" class="LinkDecorator__linkWrap"><img class="LinkDecorator__image" alt="https://ya.ru" src="TODO" /></a></span>';

      describe('deepCopyJson', function() {
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var newJson = Converter.deepCopyJson(json);
            assert.notEqual(newJson, json);
            assert.deepEqual(newJson, json);
         });
      });

      describe('htmlToJson', function() {
         it('basic', function() {
            var html = '<p>text&amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>';
            var json = [['p', 'text&'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(Converter.htmlToJson(html), json);
         });

         // Возможно, тут лучше разбить на кучу тестов, причём добавив примеры из WrapURLs.test.js
         it('Wrapping url', function() {
            var html =
               '<p>' + linkHtml + '</p>' +
               '<p>https://ya.ru</p>' +
               '<p>  https://ya.ru  </p>' +
               '<p><strong>https://ya.ru</strong></p>' +
               '<p>https://ya.ru: text</p>' +
               '<p>http://ya.ru</p>' +
               '<p>http://ya.ru, text</p>' +
               '<p>www.ya.ru</p>' +
               '<p>www.ya.ru. Text</p>' +
               '<p><a> https://ya.ru </a></p>' +
               '<p>e@mail.ru</p>' +
               '<p><a>e@mail.ru</a></p>' +
               '<p><a>e@mail.ru.</a>https://ya.ru</p>' +
               '<p>http://update*.sbis.ru/tx_stat</p>';
            var json = [
               ['p', linkNode],
               ['p', linkNode],
               ['p', '  ', linkNode, '  '],
               ['p', ['strong', linkNode]],
               ['p', linkNode, ': text'],
               ['p', httpLinkNode],
               ['p', httpLinkNode, ', text'],
               ['p', wwwLinkNode],
               ['p', wwwLinkNode, '. Text'],
               ['p', ['a', ' https://ya.ru ']],
               ['p', ['a', { href: 'mailto:e@mail.ru' }, 'e@mail.ru']],
               ['p', ['a', 'e@mail.ru']],
               ['p', ['a', 'e@mail.ru.'], linkNode],
               ['p',
                  ['a',
                     {
                        rel: 'noreferrer',
                        href: 'http://update*.sbis.ru/tx_stat',
                        target: '_blank'
                     },
                     'http://update*.sbis.ru/tx_stat'
                  ]
               ]
            ];
            assert.deepEqual(Converter.htmlToJson(html), json);
         });
      });

      describe('jsonToHtml', function() {
         it('empty', function() {
            assert.equal(Converter.jsonToHtml(emptyNode), '<span></span>');
         });
         it('escape', function() {
            assert.equal(Converter.jsonToHtml(['p', '&gt;&lt;><']), '<p>&amp;gt;&amp;lt;&gt;&lt;</p>');
         });
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<div><p>text</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p></div>';
            assert.equal(Converter.jsonToHtml(json), html);
         });
         it('with linkDecorate resolver', function() {
            var json = [
               ['p', linkNode],
               ['p', linkNode, '   '],
               ['p', linkNode, '   ', Converter.deepCopyJson(linkNode)],
               ['p', linkNode, 'text '],
               ['p', ['strong', linkNode], 'text'],
               ['p', ['a', { href: 'https://ya.ru' }, 'text']]
            ];
            var html = '<div>' +
               '<p>' + decoratedLinkHtml + '</p>' +
               '<p>' + decoratedLinkHtml + '   </p>' +
               '<p>' + linkHtml + '   ' + decoratedLinkHtml + '</p>' +
               '<p>' + linkHtml + 'text </p>' +
               '<p><strong>' + linkHtml + '</strong>text</p>' +
               '<p><a href="https://ya.ru">text</a></p>' +
            '</div>';
            assert.equal(Converter.jsonToHtml(json, linkDecorateResolver), html);
         });
      });
   });
});
