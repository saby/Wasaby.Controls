define('Controls/List/TreeGridView/TreeGridView', [
   'Controls/List/Grid/GridView',
   'tmpl!Controls/List/TreeGridView/Item',
   'css!theme?Controls/List/TreeGridView/TreeGridView'
], function(GridView, DefaultItemTpl) {

   'use strict';

   var
      TreeGridView = GridView.extend({
         _defaultItemTemplate: DefaultItemTpl,
         _onNodeExpanderClick: function(e, dispItem) {
            this._notify('nodeExpanderClick', [dispItem], {bubbling: true});
            e.stopImmediatePropagation();
         }
      });

   return TreeGridView;
});
