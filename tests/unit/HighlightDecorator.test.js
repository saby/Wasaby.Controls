/* global define, describe, it, assert */
define(['js!SBIS3.CONTROLS.Utils.HtmlDecorators.HighlightDecorator', 'WS.Data/Type/Enum'], function (HighlightDecorator, Enum) {
   'use strict';

   describe('SBIS3.CONTROLS.Utils.HtmlDecorators.HighlightDecorator', function () {

      function runHighlight(text, highlightText) {
         var hd = new HighlightDecorator({});
         return hd.getHighlighted(text, highlightText, 'controls-HtmlDecorators-highlight');
      }

      it('highlights text', function () {
         var
            text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.',
            highlight = 'ip',
            expected = 'Lorem <span class="controls-HtmlDecorators-highlight">ip</span>sum dolor sit amet, consectetur ad<span class="controls-HtmlDecorators-highlight">ip</span>iscing elit. Nunc consectetur.';

         assert.equal(runHighlight(text, highlight), expected);
      });

      it('does not highlight unmatched', function () {
         var
            text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.',
            highlight = 'sits',
            expected = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.';

         assert.equal(runHighlight(text, highlight), expected);
      });

      it('does not highlight without query', function () {
         var
            text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.',
            highlight = '',
            expected = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur.';

         assert.equal(runHighlight(text, highlight), expected);
      });

      it('highlights with special characters', function () {
         var
            text = 'Welcome to te^s0r.r\\\\u! -- te^s0r.r\\\\u website',
            highlight = '^s0r.r\\\\u',
            expected = 'Welcome to te<span class="controls-HtmlDecorators-highlight">^s0r.r\\\\u</span>! -- te<span class="controls-HtmlDecorators-highlight">^s0r.r\\\\u</span> website';

         assert.equal(runHighlight(text, highlight), expected);
      });

      it('works with valid angle brackets', function () {
         var
            text = 'aaa < test > bbb',
            highlight = 'est',
            expected = 'aaa < t<span class="controls-HtmlDecorators-highlight">est</span> > bbb';

         assert.equal(runHighlight(text, highlight), expected);
      });

      it('highlights enum type', function () {
         var
            text = new Enum({
               dictionary: ['10%', '15%', '20%'],
               index: 1
            }),
            highlight = '5',
            expected = '1<span class="controls-HtmlDecorators-highlight">5</span>%';

         assert.equal(runHighlight(text, highlight), expected);

         text.setByValue('20%');
         assert.equal(runHighlight(text, highlight), '20%');
      });

   });
});