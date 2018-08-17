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
               result = parseText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.', 'ip');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem '
                  },
                  {
                     type: 'found',
                     value: 'ip'
                  },
                  {
                     type: 'text',
                     value: 'sum dolor sit amet, consectetur ad'
                  },
                  {
                     type: 'found',
                     value: 'ip'
                  },
                  {
                     type: 'text',
                     value: 'iscing elit. Nunc consectetur.'
                  }
               ]);
            });
            it('Does not highlight unmatched', function() {
               result = parseText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.', 'sits');
               assert.deepEqual(result, [{
                  type: 'text',
                  value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.'
               }]);
            });
            it('The highlight text contains special regular expression characters.', function() {
               result = parseText('Lorem ipsum dolor sit amet, consectetur\\ adipiscing elit. Nunc consectetur.', 'consectetur\\');
               assert.deepEqual(result, [
                  {
                     type: 'text',
                     value: 'Lorem ipsum dolor sit amet, '
                  },
                  {
                     type: 'found',
                     value: 'consectetur\\'
                  },
                  {
                     type: 'text',
                     value: ' adipiscing elit. Nunc consectetur.'
                  }
               ]);
            });
         });
      });
   }
);
