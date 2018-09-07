define('Controls-demo/PropertyGrid/ArrayTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/ArrayTemplate',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template, Memory) {
      'use strict';
      var arrayTmpl = Control.extend({
         _template: template,
         _source: null,
         _param: null,

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
         },

         _valueChangedHandler: function(event, tmp) {
            // this._notify('valueChanged', [tmp]);
            this._param = tmp.split('\n'); // массив исключений
            this._notify('valueChanged', [tmp]);
         },

         _suggestChooseHandler: function(event, item) {
            this._notify('valueChanged', [item.get('title')]);
         }
      });

      return arrayTmpl;
   });
