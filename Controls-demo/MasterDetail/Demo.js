define('Controls-demo/MasterDetail/Demo', [
   'Core/Control',
   'tmpl!Controls-demo/MasterDetail/Demo',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'css!Controls-demo/MasterDetail/Demo'
], function(Control, template, cClone, Memory) {
   return Control.extend({
      _template: template,
      _items: [{
         id: 0,
         title: 'Сообщения'
      }, {
         id: 1,
         title: 'Задачи'
      }, {
         id: 2,
         title: 'Заметки'
      }, {
         id: 3,
         title: 'Прочее'
      }],
      _selected: undefined,

      _beforeMount: function() {
         this._viewSource = this._createSource(this._items);
      },

      _itemClick: function(event, model) {
         this._notify('selectedMasterFieldChanged', [{
            title: model.get('title'),
            id: (model.get('id') + 1)
         }]);
      },

      _createSource: function(items) {
         return new Memory({
            idProperty: 'id',
            data: cClone(items)
         });
      }
   });
});
