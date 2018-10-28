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
            this._notify('focusOutController', [this], { bubbling: true });
         },
         _hoverInfoboxHandler: function() {
            clearTimeout(this._closeId);
         },
         _hoverHandler: function() {
            clearTimeout(this._closeId);
            if (!this._isOpened) {
               this.openInfoBox();
            }
         },
         _mouseLeaveHandler: function() {
            if (this.isValid()) {
               var self = this;
               this._closeId = setTimeout(function() {
                  self.closeInfoBox();
               }, 300);
            }
         },
         _mouseInfoboxHandler: function(event) {
            if (event.type === 'mouseenter') {
               this._hoverInfoboxHandler(this);
            } else {
               this._mouseLeaveHandler(this);
            }
         },
         _focusInHandler: function() {
            if (!this._isOpened) {
               this.openInfoBox();
            }
            this._notify('focusInController', [this], { bubbling: true });
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
