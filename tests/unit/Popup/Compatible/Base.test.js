define(
   [
      'Controls/Popup/Compatible/Notification/Base'
   ],
   function(Base) {

      'use strict';

      describe('Controls.Popup.Compatible.Notification.Base', function() {
         it('_beforeMount', function() {
            var ctrl = new Base({});
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
