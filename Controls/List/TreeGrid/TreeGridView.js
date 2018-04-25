define('Controls/List/TreeGrid/TreeGridView', [
   'Controls/List/Grid/GridView',
   'tmpl!Controls/List/TreeGrid/Item'
], function(GridView, DefaultItemTpl) {

   'use strict';

   var
      _private = {

      },
      TreeGridView = GridView.extend({
         _defaultItemTemplate: DefaultItemTpl,
         _onNodeExpanderClick: function(e, dispItem) {
            this._notify('nodeExpanderClick', [dispItem], {bubbling: true});
         }
      });

   return TreeGridView;
});
