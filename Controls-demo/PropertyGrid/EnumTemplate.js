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
      var k = 0;
      var stringTmpl = Control.extend({
         _template: template,
         _source: null,
         _beforeMount: function(opt) {
            this._source = [];
            for (var i in opt.enum) {
               this._source.push({ id: k, title: i, comment: opt.enum[i] });
               k++;
            }
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
