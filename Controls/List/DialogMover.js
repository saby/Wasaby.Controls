define('Controls/List/DialogMover', [
   'Core/Control',
   'WS.Data/Source/ISource',
   'wml!Controls/List/DialogMover/DialogMover',
   'Controls/Container/Data/ContextOptions'
], function(Control, ISource, template, dataOptions) {

   /**
    * A class that describes the action of moving list items with dialog.
    * @class Controls/List/DialogMover
    * @extends Core/Control
    * @mixes Controls/interface/IMovable
    * @control
    * @author Авраменко А.С.
    * @public
    * @category List
    */

   var _private = {
      updateDataOptions: function(self, options, dataOptions) {
         if (dataOptions) {
            self._items = dataOptions.items;
            self._source = options.source || dataOptions.source;
            self._keyProperty = options.keyProperty || dataOptions.keyProperty;
         }
      }
   };

   var DialogMover = Control.extend({
      _template: template,

      _beforeMount: function(options, context) {
         this._onDialogResult = this._onDialogResult.bind(this);
         _private.updateDataOptions(this, options, context.dataOptions);
      },

      _beforeUpdate: function(options, context) {
         _private.updateDataOptions(this, options, context.dataOptions);
      },

      moveItemUp: function(item) {
         this._children.mover.moveItemUp(item);
      },

      moveItemDown: function(item) {
         this._children.mover.moveItemDown(item);
      },

      _onDialogResult: function(target, items) {
         this._children.mover.moveItems(items, target, ISource.MOVE_POSITION.on);
      },

      moveItems: function(items, target, position) {
         this._children.mover.moveItems(items, target, position);
      },

      _beforeItemsMove: function(event, items, target, position) {
         return this._notify('beforeItemsMove', [items, target, position]);
      },

      _afterItemsMove: function(event, items, target, position, result) {
         return this._notify('afterItemsMove', [items, target, position, result]);
      },

      moveItemsWithDialog: function(items) {
         this._children.moveDialogOpener.open({
            templateOptions: {
               movedItems: items
            }
         });
      }
   });

   DialogMover.contextTypes = function() {
      return {
         dataOptions: dataOptions
      };
   };

   return DialogMover;
});
