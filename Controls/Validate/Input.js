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
            this._shouldValidate = true;
            this._forceUpdate();
            this._notify('focusOut');
         },
         _hoverHandler: function() {
            this._notify('hover');
            this._shouldValidate = true;
            this._forceUpdate();
         },
         _focusInHandler: function() {
            this._notify('focusIn');
         },
         _cleanValid: function() {
            this.setValidationResult(null);
         },
         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
   });
