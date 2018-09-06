define('Controls-demo/PropertyGrid/StringOrFunctionTemplate',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/StringOrFunctionTemplate',
      'Core/tmpl/tmplstr',
      'css!Controls-demo/Input/resources/VdomInputs',
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
         _valueChangedHandler: function(event, tmp) {
            this._value = tmp;
            this._valueChangedNotify();
         },
         _valueChangedNotify: function() {
            if (this.checkBoxFlag === true) {
               this._notify('valueChanged', [tmplstr.getFunction(this._value)]);
            } else {
               this._notify('valueChanged', [this._value]);
            }
         },
         _checkBoxValueChanged: function() {
            this._valueChangedNotify();
         }


      });


      return stringTmpl;
   });
