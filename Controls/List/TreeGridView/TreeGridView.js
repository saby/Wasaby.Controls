define('Controls/List/TreeGridView/TreeGridView', [
   'Controls/List/Grid/GridView',
   'wml!Controls/List/TreeGridView/Item',
   'wml!Controls/List/TreeGridView/ItemOutputWrapper',
   'wml!Controls/List/TreeGridView/NodeFooter',
   'css!theme?Controls/List/TreeGridView/TreeGridView'
], function(GridView, DefaultItemTpl, ItemOutputWrapper) {

   'use strict';

   var
      TreeGridView = GridView.extend({
         _itemOutputWrapper: ItemOutputWrapper,
         _defaultItemTemplate: DefaultItemTpl,
         _onNodeExpanderClick: function(e, dispItem) {
            this._notify('nodeExpanderClick', [dispItem], {bubbling: true});
            e.stopImmediatePropagation();
         },
         _onLoadMoreClick: function(e, dispItem) {
            this._notify('loadMoreClick', [dispItem]);
         }
      });

   return TreeGridView;
});
