define('Controls-demo/Input/resources/TagStyle', [
   'Core/Control',
   'tmpl!Controls-demo/Input/resources/TagStyle',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet' //TODO: https://online.sbis.ru/opendoc.html?guid=6989b29a-8e1d-4c3b-bb7d-23b09736ef2c
],
function(
   Base, template, Memory
) {
   'use strict';
   var TagStyle = Base.extend({
      _template: template,
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
