define('Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template, Memory) {
      'use strict';

      var sugTmpl = Control.extend({
         _template: template,

         _getSuggestSource: function() {
            return new Memory({
               idProperty: 'title',
               data: this._options.items,
               filter: function(record, filter) {
                  if (record.get('title').indexOf(filter.title) !== -1) {
                     return true;
                  }
               }
            });
         },

         _valueChangedHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         }
      });

      return sugTmpl;
   });
