define('Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate',
      'Types/source',
      'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Input/Suggest/Suggest'
   ],
   function(Control, template, source) {
      'use strict';

      var sugTmpl = Control.extend({
         _template: template,
         _viewValue: '',
         _source: null,

         _beforeMount: function(options) {
            this._viewValue = options.value;
            this._source = new source.Memory({
               idProperty: 'title',
               data: options.items,
               filter: function(record, filter) {
                  if (record.get('title').indexOf(filter.title) !== -1) {
                     return true;
                  }
               }
            });
         },
         _valueChangedHandler: function(event, value) {
            this._notify('valueChanged', [value]);
            this._viewValue = value;
         },
         _chooseHandler: function(event, value) {
            this._notify('choose', [value]);
            this._viewValue = value.get('title');
         }
      });

      return sugTmpl;
   });
