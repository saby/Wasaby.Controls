/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListControl/ListView', [
   'js!WSControls/Lists/ItemsView',
   'tmpl!WSControls/Lists/ListControl/ListView',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'css!WSControls/Lists/ListControl/ListView'
], function (ItemsView, ListViewTpl, ItemsUtil
   ) {
   'use strict';

   var ListView = ItemsView.extend(
      {
         _controlName: 'WSControls/Lists/ListControl/ListView',

         _template: ListViewTpl,
         _selectedItem: null,

         _beforeMount: function(newOptions) {
            ListView.superclass._beforeMount.apply(this, arguments);
            if (newOptions.selectedKey !== undefined) {
               this._selectedItem = ItemsUtil.getItemById(this._items, newOptions.selectedKey, newOptions.idProperty);
            }
         },

         _beforeUpdate: function(newOptions) {
            ListView.superclass._beforeUpdate.apply(this, arguments);
            if (newOptions.selectedKey !== this._options.selectedKey) {
               if (newOptions.selectedKey !== undefined) {
                  this._selectedItem = ItemsUtil.getItemById(this._items, newOptions.selectedKey, newOptions.idProperty);
               }
               else {
                  this._selectedItem = null;
               }
            }
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._selectedItem = ItemsUtil.getItemById(this._items, newKey, this._options.idProperty);
         }

      });



   return ListView;
});