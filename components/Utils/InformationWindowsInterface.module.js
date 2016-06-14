define('js!SBIS3.CONTROLS.Utils.InformationWindowsInterface',
   [
      'js!SBIS3.CONTROLS.SubmitPopup',
      'js!SBIS3.CONTROLS.NotificationPopup',
      'js!SBIS3.CONTROLS.Utils.NotificationManager'
   ],
   function(SubmitPopup, NotificationPopup, NotificationManager){
      'use strict';

      var showSubmitDialog = function(config, positiveHandler, negativeHandler, cancelHandler){
         var popup = new SubmitPopup($ws.core.merge(config, {
            element: $('<div></div>'),
            isModal: true
         }));

         popup.subscribeOnceTo(popup, 'onChoose', function(e, res){
            var handler;
            switch(res){
               case true: handler = positiveHandler; break;
               case false: handler = negativeHandler; break;
               default: handler = cancelHandler; break;
            }

            if(handler && typeof handler === 'function'){
               handler();
            }
         });

         popup.show();
      };

      return {
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'default'
            }), positiveHandler, negativeHandler, cancelHandler)
         },

         showAlertDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'error'
            }), positiveHandler, negativeHandler, cancelHandler)
         },

         showSuccessDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'success'
            }), positiveHandler, negativeHandler, cancelHandler)
         },

         showWarningDialog: function(config, positiveHandler, negativeHandler, cancelHandler){
            showSubmitDialog($ws.core.merge(config, {
               state: 'warning'
            }), positiveHandler, negativeHandler, cancelHandler)
         },

         showNotification: function(config){
            var popup = new NotificationPopup($ws.core.merge({
               element: $('<div></div>')
            }, config));

            NotificationManager.showNotification(popup);
         },

         showSuccessNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'success'
            }));
         },

         showErrorNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'error'
            }));
         },

         showWarningNotification: function(config){
            this.showNotification($ws.core.merge(config, {
               state: 'warning'
            }));
         }
      };
   }
);