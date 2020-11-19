define(
   [
      'Controls/input'
   ],
   function(inputMod) {
      'use strict';

      describe('Controls/_input/TimeInterval', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new inputMod.TimeInterval();
            var beforeMount = ctrl._beforeMount;

            ctrl._beforeMount = function() {
               beforeMount.apply(this, arguments);

               ctrl._children[this._fieldName] = {
                  focus: function() {
                  },
                  setSelectionRange: function(start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };
         });
         describe('_focusInHandler', function() {
            it('by tab', function() {
               ctrl._beforeMount({
                  mask: 'HH:MM'
               });
               ctrl._viewModel.selection = 10;
               ctrl._focusByMouseDown = false;
               ctrl._focusInHandler({
                  target: {}
               });
               assert.equal(ctrl._viewModel.selection.start, 0);
               assert.equal(ctrl._viewModel.selection.end, 0);
            });
            it('by mouse', function() {
               ctrl._beforeMount({
                  mask: 'HH:MM'
               });
               ctrl._viewModel.selection = 10;
               ctrl._focusByMouseDown = true;
               ctrl._focusInHandler({
                  target: {}
               });
               assert.equal(ctrl._viewModel.selection.start, 10);
               assert.equal(ctrl._viewModel.selection.end, 10);
            });
         });
      });
   }
);
