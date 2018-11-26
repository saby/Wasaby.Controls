define('Controls/Validate/Input',
   [
      'Controls/Validate/Controller',
      'wml!Controls/Validate/Input'
   ],
   function(
      Controller,
      template
   ) {
      'use strict';

      return Controller.extend({
         _template: template,
         _deactivatedHandler: function() {
            this._shouldValidate = true;
            this._forceUpdate();
         },
         _cleanValid: function() {
            if (this._validationResult) {
               this.setValidationResult(null);
            }
         },
         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
   });
