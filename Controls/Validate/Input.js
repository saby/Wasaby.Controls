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
         _focusOutHandler: function() {
            this._notify('focusOutController', [this], { bubbling: true });
            this._shouldValidate = true;
            this._forceUpdate();
         },
         _focusInHandler: function() {
            if (!this._isOpened) {
               this.openInfoBox();
            }
            this._notify('focusInController', [this], { bubbling: true });
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
