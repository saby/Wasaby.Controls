define('Controls/Validate/Selection',
   [
      'Controls/Validate/Controller',
      'wml!Controls/Validate/Selection'
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
         _selectedKeysChangedHandler: function(event, value) {
            this._notify('selectedKeysChanged', [value]);
            this._cleanValid();
         },

         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
   });
