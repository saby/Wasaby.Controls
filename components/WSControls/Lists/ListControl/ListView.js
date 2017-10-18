/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListControl/ListView', [
   'js!WSControls/Lists/ItemsView',
   'tmpl!WSControls/Lists/ListControl/ListView',
   'js!WSControls/Lists/resources/utils/ItemsUtil'
], function (ItemsView, ListViewTpl, ItemsUtil
   ) {
   'use strict';

   var ListView = ItemsView.extend(
      {
         _controlName: 'WSControls/Lists/ListControl/ListView',

         _template: ListViewTpl,
         _selectedIndex: null,
         _selectedItem: null,

         _beforeMount: function(newOptions) {
            if (newOptions.selectedKey !== undefined) {
               this._selectedItem = ItemsUtil.getItemById(this._items, newOptions.selectedKey, newOptions.idProperty);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKey !== this._options.selectedKey) {
               if (newOptions.selectedKey !== undefined) {
                  this._selectedItem = ItemsUtil.getItemById(this._items, newOptions.selectedKey, newOptions.idProperty);
               }
               else {
                  this._selectedItem = null;
               }
            }
         }

      });



   return ListView;
});