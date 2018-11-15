define(
   [
      'Controls/Decorator/Highlight'
   ],
   function(Highlight) {
      'use strict';

      describe('Controls.Decorator.Highlight', function() {
         var result;

         describe('parseText', function() {
            var parseText = Highlight._private.parseText.bind(Highlight._private);

            it('Highlights text', function() {
               result = parseText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.', 'ip', 'substring');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem '
                  },
                  {
                     type: 'highlight',
                     value: 'ip'
                  },
                  {
                     type: 'text',
                     value: 'sum dolor sit amet, consectetur ad'
                  },
                  {
                     type: 'highlight',
                     value: 'ip'
                  },
                  {
                     type: 'text',
                     value: 'iscing elit. Nunc consectetur.'
                  }
               ]);
            });
            it('Does not highlight unmatched', function() {
               result = parseText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.', 'sits', 'substring');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.'
               }]);
            });
            it('The highlight text contains special regular expression characters.', function() {
               result = parseText('Lorem ipsum dolor sit amet, consectetur\\ adipiscing elit. Nunc consectetur.', 'consectetur\\', 'substring');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem ipsum dolor sit amet, '
                  },
                  {
                     type: 'highlight',
                     value: 'consectetur\\'
                  },
                  {
                     type: 'text',
                     value: ' adipiscing elit. Nunc consectetur.'
                  }
               ]);
            });
            it('Word search.', function() {
               result = parseText('Lorem ipsum dolor ip sit amet, consectetur adipiscing elit. Nunc consectetur.', 'ip', 'word');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem ipsum dolor'
                  },
                  {
                     type: 'highlight',
                     value: ' ip '
                  },
                  {
                     type: 'text',
                     value: 'sit amet, consectetur adipiscing elit. Nunc consectetur.'
                  }
               ]);
            });
            it.skip('A few words to highlight.', function() {
               result = parseText('Lorem ipsum dolor sit amet.Hello ipsum child dolor.', 'ipsum dolor', 'setSubstring');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem '
                  },
                  {
                     type: 'highlight',
                     value: 'ipsum dolor'
                  },
                  {
                     type: 'text',
                     value: ' sit amet.Hello '
                  },
                  {
                     type: 'highlight',
                     value: 'ipsum'
                  },
                  {
                     type: 'text',
                     value: ' child '
                  },
                  {
                     type: 'highlight',
                     value: 'dolor'
                  },
                  {
                     type: 'text',
                     value: '.'
                  }
               ]);
            });
         });
      });
   }
);
