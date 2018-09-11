define('Controls-demo/Input/Password/Password',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Password/Password',
      'css!Controls-demo/Input/resources/VdomInputs'
   ],
   function(Control, template) {
      'use strict';

      var Password = Control.extend({
         _template: template,
         _readOnly: false,
         _tooltip: 'Password',
         passwordValue: '',
         _tagStyle: 'attention',
         _placeholder: 'Password',
         _tagStyleHandler: function() {
            this._children.infoBoxPassword.open({
               target: this._children.textPassword._container,
               message: 'Hover'
            });
         },
         _tagStyleClickHandler: function() {
            this._children.infoBoxPassword.open({
               target: this._children.textPassword._container,
               message: 'Click'
            });
         },
         _validationChangedHandler: function() {
            if (this._validationErrorsValue) {
               this._validationErrors = ['Some error'];
            } else {
               this._validationErrors = null;
            }
         }
      });

      return Password;
   });
