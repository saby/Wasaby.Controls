define('Controls-demo/Input/resources/SuggestTwoLines',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/resources/SuggestTwoLines',
      'WS.Data/Source/Memory',
      'css!Controls-demo/Input/resources/VdomInputs'
   ],
   function(Base, template, Memory) {

      'use strict';

      var SuggestTwoLines = Base.extend({
         _template: template,
         _changeValueHandler: function(event, tmp) {
            if (tmp == null) {
               this._notify('suggestValueChanged', undefined);
            } else {
               this._notify('suggestValueChanged', [tmp]);
            }
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
      return SuggestTwoLines;
   }
);
