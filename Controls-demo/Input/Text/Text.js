define('Controls-demo/Input/Text/Text', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Text/Text',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoText = Control.extend({
      _template: template,
      _text1: '',
      _placeholder: '',
      _constraint: '',
      _validationErrors: '',
      _validationErrorsValue: false,
      _trim: false,
      _maxLength: 100,
      _selectOnClick: false,
      _readOnly: false,
      _tooltip: '',

      valueChangedHandler: function() {
         if (this._validationErrorsValue) {
            this._validationErrors = ['Some error'];
         } else {
            this._validationErrors = null;
         }
      },

      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      }
   });

   return VdomDemoText;
});
