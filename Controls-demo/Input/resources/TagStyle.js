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
         {title: 'attention'},
         {title: 'done'},
         {title: 'error'},
         {title: 'primary'},
         {title: 'info'}
      ],
      _createMemory: function() {
         return new Memory({
            idProperty: 'title',
            data: this._items
         });
      },
      _changeStyleHandler: function(event, tmp) {
         if (tmp == null) {
            this._notify('tagStyleValueChanged', undefined);
         } else {
            this._notify('tagStyleValueChanged', [tmp]);
         }
      }
   });
   return TagStyle;
}
);
