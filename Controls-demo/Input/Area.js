define('Controls-demo/Input/Area', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Area',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoArea = Control.extend({
      _template: template,
      _text1: '',
      _placeholder: '',
      _constraint: '',
      _validationErrors: '',
      _validationErrorsValue: false,
      _trim: false,
      _maxLength: '',
      _minLines: '',
      _maxLines: '',
      _enabled: true,
      _multiline: false,

      valueChangedHandler: function () {
         if (this._validationErrorsValue){
            this._validationErrors = ['Some error'];
         } else{
            this._validationErrors = null;
         }
      }
   });

   return VdomDemoArea;
});
