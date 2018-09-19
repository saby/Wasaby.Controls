define('Controls-demo/PropertyGrid/StringTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/StringTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template) {
      'use strict';

      var stringTmpl = Control.extend({
         _template: template,
         _valueChangedHandler: function(event, tmp) {
            this._notify('valueChanged', [tmp]);
         }
      });

      return stringTmpl;
   });
