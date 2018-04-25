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
            nodeKey = ItemsUtil.getPropertyValue(dispItem.getContents(), self._options.viewConfig.idProperty);
         if (!self._loadedNodes[nodeKey]) {
            filter[self._options.viewConfig.parentProperty] = nodeKey;
            self._children.baseControl.getSourceController().load(filter, self._sorting).addCallback(function(list) {
               listViewModel.appendItems(list);
               self._loadedNodes[nodeKey] = true;
               listViewModel.toggleExpanded(dispItem);
            });
         } else {
            listViewModel.toggleExpanded(dispItem);
         }
      }
   };

   /**
    * Компонент иерархического списка списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
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
      }
   });

   return TreeControl;
});
