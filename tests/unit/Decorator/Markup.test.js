/**
 * Created by rn.kondakov on 24.10.2018.
 */
define([
   'Controls/Decorator/Markup/Converter',
   'Controls/Decorator/Markup/resolvers/linkDecorate'
], function(Converter,
   linkDecorateResolver) {
   'use strict';

   // TODO: More tests.

   describe('Controls.Decorator.Markup.Converter', function() {
      var emptyNode = [],
         simpleNode = ['span', 'text'],
         deepNode = ['span',
            { 'style': 'text-decoration: line-through;' },
            'text',
            ['strong',
               'text',
               ['em',
                  'text',
                  ['span',
                     { 'style': 'text-decoration: underline;' },
                     'text'
                  ],
                  'text'
               ],
               'text'],
            'text'
         ],
         attributedNode = ['span', { 'class': 'someClass' }, 'text'],
         linkNode = ['a',
            { href: 'https://ya.ru' },
            'https://ya.ru'
         ],
         deepHtml = '<span style="text-decoration: line-through;">text<strong>text<em>text<span style="text-decoration: underline;">text</span>text</em>text</strong>text</span>',
         linkHtml = '<a href="https://ya.ru">https://ya.ru</a>',
         decoratedLinkHtml = '<span class="LinkDecorator__wrap"><a href="https://ya.ru" class="LinkDecorator__linkWrap"><img class="LinkDecorator__image" alt="https://ya.ru" src="TODO" /></a></span>';

      describe('deepCopyJson', function() {
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var newJson = Converter.deepCopyJson(json);
            assert.notEqual(newJson, json);
            assert.deepEqual(newJson, json);
         });
      });

      describe('htmlToJson', function() {
         it('one big', function() {
            var html = '<p>text</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p>';
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            assert.deepEqual(Converter.htmlToJson(html), json);
         });
      });

      describe('jsonToHtml', function() {
         it('empty', function() {
            assert.equal(Converter.jsonToHtml(emptyNode), '<span></span>');
         });
         it('one big', function() {
            var json = [['p', 'text'], ['p', deepNode], ['p', attributedNode], ['p', linkNode], ['p', simpleNode]];
            var html = '<span><p>text</p><p>' + deepHtml + '</p><p><span class="someClass">text</span></p><p>' + linkHtml + '</p><p><span>text</span></p></span>';
            assert.equal(Converter.jsonToHtml(json), html);
         });
         it('with linkDecorate resolver', function() {
            var json = [
               ['p', linkNode],
               ['p', linkNode, '   '],
               ['p', linkNode, Converter.deepCopyJson(linkNode)],
               ['p', linkNode, 'text '],
               ['p', ['strong', linkNode], 'text'],
               ['p', ['a', { href: 'https://ya.ru' }, 'text']]
            ];
            var html = '<span>' +
               '<p>' + decoratedLinkHtml + '</p>' +
               '<p>' + decoratedLinkHtml + '   </p>' +
               '<p>' + linkHtml + decoratedLinkHtml + '</p>' +
               '<p>' + linkHtml + 'text </p>' +
               '<p><strong>' + linkHtml + '</strong>text</p>' +
               '<p><a href="https://ya.ru">text</a></p>' +
            '</span>';
            assert.equal(Converter.jsonToHtml(json, linkDecorateResolver), html);
         });
      });
   });
});
