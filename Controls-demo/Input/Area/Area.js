define('Controls-demo/Input/Area/Area', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Area/Area',
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
      _minLines: 1,
      _maxLines: 1,
      _readOnly: false,
      _hide: false,

      valueChangedHandler: function () {
         if (this._validationErrorsValue){
            this._validationErrors = ['Some error'];
         } else{
            this._validationErrors = null;
         }
      },

      _eventHandler: function(e, value) {
         this._eventResult = e.type + ': ' + value;
      }
   });

   return VdomDemoArea;
});
