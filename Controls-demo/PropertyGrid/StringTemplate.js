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
         _valueChangedHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },

         _suggestValueChanged: function(event, value) {
            if (this._options.items) {
               var item = this._options.items.find(function(item) {
                  return item.title === value;
               });
               this._valueChangedHandler(event, item ? item.value : value);
            } else {
               this._valueChangedHandler(event, value);
            }
         },

         _chooseChangedHandler: function(event, item) {
            this._notify('valueChanged', [item.get('value')]);
         }
      });

      return stringTmpl;
   });
