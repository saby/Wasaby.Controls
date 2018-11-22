define(
   [
      'Core/IoC',
      'tests/resources/ProxyCall',
      'tests/resources/TemplateUtil',
      'Controls/Decorator/Highlight',
      'wml!tests/Decorator/Highlight/Template1'
   ],
   function(IoC, ProxyCall, TemplateUtil, Highlight, template1) {
      'use strict';

      describe('Controls.Decorator.Highlight', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Highlight();
         });

         it('getDefault', function() {
            Highlight.getOptionTypes();
            Highlight.getDefaultOptions();
         });

         it('Template', function() {
            var tplOptions = {
               _options: {
                  class: 'controls-Highlight_highlight'
               },
               _parsedText: [
                  {
                     type: 'highlight',
                     value: 'test'
                  },
                  {
                     type: 'text',
                     value: '1'
                  },
                  {
                     type: 'text',
                     value: '1'
                  },
                  {
                     type: 'highlight',
                     value: 'test'
                  }
               ]
            };

            assert.equal(ctrl._template(tplOptions), template1());
         });

         describe('The recalculation of the state depending on the values of options.', function() {
            var options;

            beforeEach(function() {
               ctrl._options.text = 'text1';
               ctrl._options.searchMode = 'word';
               ctrl._options.highlight = 'highlight1';
               ctrl = ProxyCall.set(ctrl, ['_parsedText'], calls, true);
            });

            it('The text option has changed.', function() {
               options = {
                  text: 'text2',
                  highlight: 'highlight1',
                  searchMode: 'word'
               };

               ctrl._beforeUpdate(options);

               assert.equal(calls.length, 1);
            });
            it('The highlight option has changed.', function() {
               options = {
                  text: 'text1',
                  highlight: 'highlight2',
                  searchMode: 'word'
               };

               ctrl._beforeUpdate(options);

               assert.equal(calls.length, 1);
            });
            it('The searchMode option has changed.', function() {
               options = {
                  text: 'text1',
                  highlight: 'highlight1',
                  searchMode: 'substring'
               };

               ctrl._beforeUpdate(options);

               assert.equal(calls.length, 1);
            });
            it('Options has not changed.', function() {
               options = {
                  text: 'text1',
                  highlight: 'highlight1',
                  searchMode: 'word'
               };

               ctrl._beforeUpdate(options);

               assert.equal(calls.length, 0);
            });
         });

         describe('Parsed of the text.', function() {
            describe('Word search.', function() {
               it('The search word is not in the text.', function() {
                  ctrl._beforeMount({
                     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                     highlight: 'ipsu',
                     searchMode: 'word'
                  });

                  assert.deepEqual(ctrl._parsedText, [{
                     type: 'text',
                     value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                  }]);
               });
               it('The search word is in the text.', function() {
                  ctrl._beforeMount({
                     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                     highlight: 'ipsum',
                     searchMode: 'word'
                  });

                  assert.deepEqual(ctrl._parsedText, [
                     {
                        type: 'text',
                        value: 'Lorem '
                     },
                     {
                        type: 'highlight',
                        value: 'ipsum'
                     },
                     {
                        type: 'text',
                        value: ' dolor sit amet, consectetur adipiscing elit.'
                     }
                  ]);
               });
            });
            describe('Substring search.', function() {
               it('The search substring is not in the text.', function() {
                  ctrl._beforeMount({
                     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                     highlight: 'ipsumus',
                     searchMode: 'substring'
                  });

                  assert.deepEqual(ctrl._parsedText, [{
                     type: 'text',
                     value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                  }]);
               });
               it('The search substring is in the text.', function() {
                  ctrl._beforeMount({
                     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                     highlight: 'psu',
                     searchMode: 'substring'
                  });

                  assert.deepEqual(ctrl._parsedText, [
                     {
                        type: 'text',
                        value: 'Lorem i'
                     },
                     {
                        type: 'highlight',
                        value: 'psu'
                     },
                     {
                        type: 'text',
                        value: 'm dolor sit amet, consectetur adipiscing elit.'
                     }
                  ]);
               });
            });
         });
      });
   }
);
