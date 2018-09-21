define('Controls-demo/PropertyGrid/EnumTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/EnumTemplate',
      'WS.Data/Source/Memory',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template, Memory) {
      'use strict';
      var stringTmpl = Control.extend({
         _template: template,
         _source: null,
         _beforeMount: function(opt) {
            this._source = Object.keys(opt.enum).map(function(key, index) {
               return {
                  id: index,
                  title: key,
                  comment: opt.enum[key]
               };
            });
         },
         _valueChangedHandler: function(event, tmp) {
            if (!tmp) {
               this._notify('valueChanged', undefined);
            } else {
               this._notify('valueChanged', [tmp]);
            }
         },
         _comboBoxSource: function() {
            return new Memory({
               idProperty: 'id',
               data: this._source
            });
         }
      });


      return stringTmpl;
   });
