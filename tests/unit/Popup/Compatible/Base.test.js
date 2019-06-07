define(
   [
      'Controls/compatiblePopup'
   ],
   function(compatiblePopup) {

      'use strict';

      describe('Controls/compatiblePopup:NotificationBase', function() {
         it('_beforeMount', function() {
            var ctrl = new compatiblePopup.NotificationBase({});
            var options = {};
            ctrl._beforeMount({
               contentTemplateOptions: options
            });

            assert.isTrue(options === ctrl._contentTemplateOptions);
            assert.isTrue('onAfterShow' in ctrl._contentTemplateOptions.handlers);
         });
      });
   }
);
