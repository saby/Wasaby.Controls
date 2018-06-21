define('Controls/List/TreeControl', [
   'Core/Control',
   'tmpl!Controls/List/TreeControl/TreeControl',
   'Controls/List/resources/utils/ItemsUtil',
   'Core/core-clone',
   'Controls/List/BaseControl'
], function(Control, TreeControlTpl, ItemsUtil, cClone) {
   'use strict';

   var _private = {
      toggleExpanded: function(self, dispItem) {
         var
            filter = cClone(self._filter || {}),
            listViewModel = self._children.baseControl.getViewModel(),
            nodeKey = ItemsUtil.getPropertyValue(dispItem.getContents(), self._options.viewConfig.keyProperty);
         if (!self._loadedNodes[nodeKey]) {
            filter[self._options.viewConfig.parentProperty] = nodeKey;
            self._children.baseControl.getSourceController().load(filter, self._sorting).addCallback(function(list) {
               if (self._options.uniqueKeys) {
                  listViewModel.mergeItems(list);
               } else {
                  listViewModel.appendItems(list);
               }
               self._loadedNodes[nodeKey] = true;
               listViewModel.toggleExpanded(dispItem);
            });
         } else {
            listViewModel.toggleExpanded(dispItem);
         }
      }
   };

   /**
    * Hierarchical list control with custom item template. Can load data from data source.
    *
    * @class Controls/List/TreeControl
    * @extends Controls/List/ListControl
    * @control
    * @public
    * @category List
    */

   var TreeControl = Control.extend({
      _template: TreeControlTpl,
      _loadedNodes: null,
      constructor: function() {
         this._loadedNodes = {};
         return TreeControl.superclass.constructor.apply(this, arguments);
      },
      _onNodeExpanderClick: function(e, dispItem) {
         _private.toggleExpanded(this, dispItem);
      },
      removeItems: function(items) {
         this._children.baseControl.removeItems(items);
      },
      moveItemUp: function(item) {
         this._children.baseControl.moveItemUp(item);
      },
      moveItemDown: function(item) {
         this._children.baseControl.moveItemDown(item);
      },
      moveItems: function(items, target, position) {
         this._children.baseControl.moveItems(items, target, position);
      },
      reload: function() {
         this._children.baseControl.reload();
      },
      editItem: function(options) {
         this._children.baseControl.editItem(options);
      },
      addItem: function(options) {
         this._children.baseControl.addItem(options);
      }
   });

   TreeControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true
      };
   };

   return TreeControl;
});
