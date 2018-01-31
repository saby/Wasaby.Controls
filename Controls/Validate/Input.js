define('Controls/Validate/Input',
   [
      'Controls/Validate/Controller',
      'tmpl!Controls/Validate/Input'
   ],
   function(
      Controller,
      template
   ){
      'use strict';

      var
         Validate,
         _private;

      _private = {
         focusOut: function(self) {
            self._shouldValidate = true;
            self._forceUpdate();
         }
      };

      Validate = Controller.extend({
         _template: template,
         _focusOutHandler: function () {
            if (!this._options.hasComponentFocusOut) {
               _private.focusOut(this);
            }
         },
         _componentFocusOutHandler: function () {
            _private.focusOut(this);
         },
         _cleanValid: function () {
            this.setValidationResult(null);
         },
         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
      return Validate;
   }
);