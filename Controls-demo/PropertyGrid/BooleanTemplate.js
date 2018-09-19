define('Controls-demo/PropertyGrid/BooleanTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/BooleanTemplate',
      'css!Controls-demo/Input/resources/VdomInputs'
   ],
   function(Control, template) {
      'use strict';

      var boolTmpl = Control.extend({
         _template: template,
         _valueChangedHandler: function(event, tmp) {
            this._notify('valueChanged', [tmp]);
         },
      });
      return boolTmpl;
   });
