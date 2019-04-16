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
         _currentValue: undefined,
         _deactivatedHandler: function() {
            if (!this._options.readOnly) {
               this._shouldValidate = true;
               this._forceUpdate();
            }
         },
         _valueChangedHandler: function(event, value, displayValue) {
            if (this._currentValue !== value) {
               this._currentValue = value;
               this._notify('valueChanged', [value]);
               this._cleanValid();
            }
         },
         _inputCompletedHandler: function(event, value) {
            this._notify('inputCompleted', [value]);
         },
         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
   });
