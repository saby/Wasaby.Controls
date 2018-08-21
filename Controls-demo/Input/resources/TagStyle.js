define('Controls-demo/Input/resources/TagStyle', [
   'Core/Control',
   'tmpl!Controls-demo/Input/resources/TagStyle',
   'WS.Data/Source/Memory'
],
function(
   Base, template, Memory
) {
   'use strict';
   var TagStyle = Base.extend({
      _template: template,
      _empty: 'none',
      _placeholder: 'select',
      _items: [
         { id: '1', title: 'attention' },
         { id: '2', title: 'done' },
         { id: '3', title: 'error' },
         { id: '4', title: 'primary' },
         { id: '5', title: 'info' }
      ],
      _createMemory: function() {
         return new Memory({
            idProperty: 'id',
            data: this._items
         });
      },
      _tagStyleChangedHandler: function(event, tmp) {
         if (!tmp) {
            this._notify('tagStyleValueChanged', undefined);
         } else {
            this._notify('tagStyleValueChanged', [tmp]);
         }
      }
   });
   return TagStyle;
});
