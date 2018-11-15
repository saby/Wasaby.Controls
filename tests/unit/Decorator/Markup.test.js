/**
 * Created by rn.kondakov on 24.10.2018.
 */
define([
   'Controls/Decorator/Markup/Converter',
   'Controls/Decorator/Markup/resolvers/highlight',
   'Controls/Decorator/Markup/resolvers/linkDecorate'
], function(Converter,
   highlightResolver,
   linkDecorateResolver) {
   'use strict';

   describe('Controls.Decorator.Markup.Converter', function() {
      var simpleNode = ['span', 'text'],
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
         decoratedLinkHtml = '<span class="LinkDecorator__wrap"><a rel="noreferrer" href="https://ya.ru" target="_blank" class="LinkDecorator__linkWrap"><img class="LinkDecorator__image" alt="https://ya.ru" src="?method=LinkDecorator.DecorateAsSvg&amp;params=eyJTb3VyY2VMaW5rIjoiaHR0cHM6Ly95YS5ydSJ9&amp;id=0&amp;srv=1" /></a></span>';

      describe('deepCopyJson', function() {
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var newJson = Converter.deepCopyJson(json);
            assert.notEqual(newJson, json);
            assert.deepEqual(newJson, json);
         });
      });

      describe('htmlToJson', function() {
         beforeEach(function() {
            if (typeof document === 'undefined') {
               this.skip();
            }
         });
         it('basic', function() {
            var html = '<p>text&amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>';
            var json = [['p', 'text&'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(Converter.htmlToJson(html), json);
         });

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
            assert.equal(Converter.jsonToHtml([]), '<span></span>');
         });
         it('escape', function() {
            assert.equal(Converter.jsonToHtml(['p', { title: '"&<>' }, '&gt;&lt;><']), '<div><p title="&quot;&amp;&lt;&gt;">&amp;gt;&amp;lt;&gt;&lt;</p></div>');
         });
         it('one big', function() {
            var json = [['p', 'text&amp;'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<div><p>text&amp;amp;</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p></div>';
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
         it('with highlight resolver', function() {
            var json = [
               ['p', ['strong', 'BaBare;gjwergo'], 'aBaweruigerhw', ['em', 'aBa']],
               ['p', 'aba, abA, aBa, aBA, Aba, AbA, ABa, ABA'],
               ['p', 'abababababa']
            ];
            var html = '<div>' +
               '<p><strong>B<span class="controls-Highlight_found">aBa</span>re;gjwergo</strong><span class="controls-Highlight_found">aBa</span>weruigerhw<em><span class="controls-Highlight_found">aBa</span></em></p>' +
               '<p><span class="controls-Highlight_found">aba</span>, <span class="controls-Highlight_found">abA</span>, <span class="controls-Highlight_found">aBa</span>, <span class="controls-Highlight_found">aBA</span>, <span class="controls-Highlight_found">Aba</span>, <span class="controls-Highlight_found">AbA</span>, <span class="controls-Highlight_found">ABa</span>, <span class="controls-Highlight_found">ABA</span></p>' +
               '<p><span class="controls-Highlight_found">aba</span>b<span class="controls-Highlight_found">aba</span>b<span class="controls-Highlight_found">aba</span></p>' +
               '</div>';
            assert.equal(Converter.jsonToHtml(json, highlightResolver, { textToHighlight: 'aBa' }), html);
         });
      });
   });
});
