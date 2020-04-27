define('Controls-demo/PropertyGrid/ObjectTemplate',
   [
      'Core/Control',
      'Core/core-clone',
      'wml!Controls-demo/PropertyGrid/ObjectTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, cClone, template) {
      'use strict';

      var arrayTmpl = Control.extend({
         _template: template,
         _param: null,
         _config: {},
         _beforeMount: function(opt){
           this._config = cClone(opt.baseObject);
         },
         _valueChangedHandler: function(event, key, value) {
            this._config[key] = value;
            this._notify('objChanged', [cClone(this._config)]);
         },

      });

      return arrayTmpl;
   });
