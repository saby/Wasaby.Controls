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
      var html = '<p>123</p><p style="text-align: center;">any text</p><p><em>emtext<strong>strongemtext</strong>emtext</em></p><p>TODO links</p>',
         oneBigJson = [
            ['p',
               '123'
            ],
            ['p',
               { 'style': 'text-align: center;' },
               'any text'
            ],
            ['p',
               ['em',
                  'emtext',
                  ['strong', 'strongemtext'],
                  'emtext'
               ]
            ],
            ['p',
               'TODO links'
            ]
         ];

      describe('htmlToJson', function() {
         it('one big', function() {
            assert.deepEqual(Converter.htmlToJson(html), oneBigJson);
         });
      });

      describe('jsonToHtml', function() {
         it('one big', function() {
            assert.equal(Converter.jsonToHtml(oneBigJson), html);
         });
         it('one big with resolver', function() {
            // TODO
            assert.equal(Converter.jsonToHtml(oneBigJson, linkDecorateResolver), html);
         });
      });

      describe('deepCopyJson', function() {
         var newJson = Converter.deepCopyJson(oneBigJson);
         assert.notEqual(newJson, oneBigJson);
         assert.deepEqual(newJson, oneBigJson);
      });
   });
});
