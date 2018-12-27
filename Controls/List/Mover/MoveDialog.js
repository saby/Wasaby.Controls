define('Controls/List/Mover/MoveDialog', [
   'Core/Control',
   'wml!Controls/List/Mover/MoveDialog/MoveDialog',
   'css!theme?Controls/List/Mover/MoveDialog/MoveDialog'
], function(Control, template) {
   'use strict';

   /**
    * A standard dialog template for selecting a target item for moving items.
    * <a href="/materials/demo/demo-ws4-operations-panel">Demo examples.</a>.
    * @class Controls/List/Mover/MoveDialog
    * @extends Core/Control
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/ISource
    *
    * @mixes Controls/List/Mover/MoveDialogStyles
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   /**
    * @name Controls/List/Mover/MoveDialog#root
    * @cfg {String} Identifier of the root node.
    * @default null
    */

   /**
    * @name Controls/Input/interface/ISearch#searchParam
    * @cfg {String} Name of the field that search should operate on. Search value will insert in filter by this parameter.
    */

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
