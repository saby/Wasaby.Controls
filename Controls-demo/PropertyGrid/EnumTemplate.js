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
      var k = 0;
      var stringTmpl = Control.extend({
         _template: template,
         _source: null,
         _beforeMount: function(opt) {
            this._source = [];
            for (var i in opt.enum) {
               this._source.push({ id: k, title: (i.hasOwnProperty('title') ? i.title : i), comment: opt.enum[i] });
               k++;
            }
         },
         _selectedItemHandler: function(event, tmp) {
            if (this._source[tmp]) {
               this._notify('valueChanged', [this._source[tmp].comment]);
            } else {
               this._notify('valueChanged', undefined);
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
