define('Controls-demo/PropertyGrid/ArrayTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/ArrayTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template) {
      'use strict';

      var arrayTmpl = Control.extend({
         _template: template,
         _source: null,
         _param: null,

         _valueChangedHandler: function(event, tmp) {
            // this._notify('valueChanged', [tmp]);
            this._param = tmp.split('\n'); // массив исключений
            this._notify('valueChanged', [tmp]);
         }
      });

      return arrayTmpl;
   });
