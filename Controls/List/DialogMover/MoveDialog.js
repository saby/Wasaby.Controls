define('Controls/List/DialogMover/MoveDialog', [
   'Core/Control',
   'wml!Controls/List/DialogMover/MoveDialog/MoveDialog',
   'css!theme?Controls/List/DialogMover/MoveDialog/MoveDialog'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template,
      _itemActions: undefined,

      _beforeMount: function() {
         this._itemActions = [{
            id: 1,
            title: rk('Выбрать'),
            showType: 2
         }];
         this._itemsFilterMethod = this._itemsFilterMethod.bind(this);
      },

      _itemsFilterMethod: function(item) {
         return this._options.movedItems.indexOf(item.get(this._options.keyProperty)) === -1;
      },

      _onItemActionsClick: function(event, action, item) {
         this._notify('sendResult', [item, this._options.movedItems], {bubbling: true});
         this._notify('close', [], {bubbling: true});
      }
   });
});
