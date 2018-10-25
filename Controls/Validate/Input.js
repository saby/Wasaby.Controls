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
         _focusOutHandler: function(){
            this._shouldValidate = true;
            this._forceUpdate();
            this._notify('focusOutValidate', [this], { bubbling: true });
         },
         _hoverHandler: function() {
            this._notify('hoverValidate', [this], { bubbling: true });
         },
         _mouseLeaveHandler: function() {
            if (this.isValid()) {
               this._notify('mouseLeaveValidate', [this], { bubbling: true });
            }
         },
         _focusInHandler: function() {
            this._notify('focusInValidate', [this], { bubbling: true });
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
