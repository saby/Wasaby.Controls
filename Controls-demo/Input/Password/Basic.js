define('Controls-demo/Input/Password/Basic',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Password/Basic/Basic',

      'Controls/Input/Password',
      'Controls-demo/Input/Password/Basic/validator',
      'css!Controls-demo/Input/Password/Basic/Basic'
   ],
   function(Control, template) {

      'use strict';

      var confirmationCfg = {
         type: 'ok',
         style: 'error',
         message: 'The password contains non-valid characters.'
      };

      function getMessage(tagStyle) {
         var message;

         switch (tagStyle) {
            case 'done':
               message = 'The password consists of letters and numbers';
               break;
            case 'error':
               message = 'The password must consist only of letters and numbers';
               break;
         }

         return message;
      }

      return Control.extend({
         _template: template,

         _tagStyle: 'done',

         _beforeMount: function() {
            var _this = this;

            this._validationHandler = function(result) {
               if (result) {
                  _this._tagStyle = 'error';
                  _this._children.confirmation.open(confirmationCfg);
               } else {
                  _this._tagStyle = 'done';
               }
            };   
         },

         _tagClickHandler: function(event) {
            var infoBox = this._children.infoBox;

            if (infoBox.isOpened()) {
               infoBox.close();
            } else {
               infoBox.open({
                  target: event.target,
                  message: getMessage(this._tagStyle)
               });
            }
         },

         _inputCompletedHandler: function() {
            return this._children.validateController
               .validate()
               .addCallback(this._validationHandler);
         }
      });
   }
);
