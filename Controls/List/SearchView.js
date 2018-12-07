define('Controls/List/SearchView', [
   'Controls/List/Grid/GridView',
   'wml!Controls/List/SearchView/Item',
   'css!theme?Controls/List/SearchView/SearchView',
   'Controls/BreadCrumbs'
], function(GridView, DefaultItemTpl) {

   'use strict';

   var
      SearchView = GridView.extend({
         _defaultItemTemplate: DefaultItemTpl,
         _onSearchItemClick: function(e) {
            e.stopPropagation();
         },
         _onSearchPathClick: function(e, item) {
            this._notify('itemClick', [item, e], {bubbling: true});
         },
         getDefaultOptions: function() {
            return {
               leftPadding: 'S'
            };
         }
      });

   return SearchView;
});
