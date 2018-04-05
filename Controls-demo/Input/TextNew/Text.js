//TODO переименовать папку после отказа от старых демок https://online.sbis.ru/opendoc.html?guid=a78c50e0-eca2-4ef0-ae2d-3905a7a2159c
define('Controls-demo/Input/TextNew/Text', [
   'Core/Control',
   'tmpl!Controls-demo/Input/TextNew/Text',
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
      _maxLength: '',
      _selectOnClick: false,

      valueChangedHandler: function () {
         if (this._validationErrorsValue){
            this._validationErrors = ['Some error'];
         } else{
            this._validationErrors = null;
         }
      }
   });

   return VdomDemoText;
});
