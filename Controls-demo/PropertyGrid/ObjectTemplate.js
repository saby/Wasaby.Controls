define('Controls-demo/PropertyGrid/ObjectTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/ObjectTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template) {
      'use strict';

      var arrayTmpl = Control.extend({
         _template: template,
         _param: null,
         _chooseSuggestHandler: function(event, item) {
            this._notify('valueChanged', [item.get('items')]);
         }
      });

      return arrayTmpl;
   });
