define('Controls-demo/PropertyGrid/StringTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/StringTemplate',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
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
         _suggestSource: function() {
            return new Memory({
               idProperty: 'title',
               data: this._options.source,
               filter: function(record, filter) {
                  if (record.get('title').indexOf(filter.title) !== -1) {
                     return true;
                  }
               }
            });
         }
      });


      return stringTmpl;
   });
