define('Controls-demo/Input/Phone/Phone',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Phone/Phone'
   ],
   function(Control, template) {

      'use strict';

      var Phone = Control.extend({
         _template: template,
         _placeholder: 'Input phone number',
         _readOnly: false,
         _tagStyle: 'info',
         phoneValue: '',
         _tagStyleHandler: function() {
            this._children.infoBoxPhone.open({
               target: this._children.textPhone._container,
               message: 'Hover'
            });
         },
         _validationChangedHandler: function() {
            if (this._validationErrorsValue) {
               this._validationErrors = ['Some error'];
            } else {
               this._validationErrors = null;
            }
         },
         _tagStyleClickHandler: function() {
            this._children.infoBoxPhone.open({
               target: this._children.textPhone._container,
               message: 'Click'
            });
         }
      });
      return Phone;
   }
);
