define('Controls-demo/PropertyGrid/FunctionTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/FunctionTemplate',
      'Core/tmpl/tmplstr',
      'css!Controls-demo/Input/resources/VdomInputs'
   ],
   function(Control, template, tmplstr) {
      'use strict';

      var stringTmpl = Control.extend({
         _template: template,
         _value: '',
         checkBoxFlag: undefined,
         _beforeMount: function(opts) {
            this.checkBoxFlag = opts.flag;
            this._value = opts.value;
         },

         _checkBoxValueChanged: function() {
            if (this.checkBoxFlag === true) {
               this._notify('valueChanged', [tmplstr.getFunction(this._value)]);
            } else {
               this._notify('valueChanged', [undefined]);
            }
         }
      });


      return stringTmpl;
   });
