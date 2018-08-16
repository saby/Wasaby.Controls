define('Controls-demo/PropertyGrid/EnumTemplate',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/EnumTemplate',
      'WS.Data/Source/Memory',
      'tmpl!Controls-demo/Input/Suggest/resources/SuggestTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template, Memory) {
      'use strict';

      var stringTmpl = Control.extend({
         _template: template,
         _valueChangedHandler: function(event, tmp) {
            this._notify('valueChanged', [tmp]);
         },
         _comboBoxSource: function() {
            return new Memory({
               idProperty: 'title',
               data: this._options.source
            });
         }
      });


      return stringTmpl;
   });
