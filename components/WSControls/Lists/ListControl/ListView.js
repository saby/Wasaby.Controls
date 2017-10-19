/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListControl/ListView', [
   'js!WSControls/Lists/ItemsView',
   'tmpl!WSControls/Lists/ListControl/ListView',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'tmpl!WSControls/Lists/ListControl/ItemTemplate',
   'css!WSControls/Lists/ListControl/ListView'
], function (ItemsView,
             ListViewTpl,
             ItemsUtil,
             defaultItemTemplate
   ) {
   'use strict';

   var ListView = ItemsView.extend(
      {
         _controlName: 'WSControls/Lists/ListControl/ListView',

         _template: ListViewTpl,
         _selectedItem: null,

         _beforeMount: function(newOptions) {
            ListView.superclass._beforeMount.apply(this, arguments);
            this._itemTemplate = newOptions.itemTemplate || defaultItemTemplate;
            if (newOptions.selectedKey !== undefined) {
               this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newOptions.selectedKey, newOptions.idProperty);
            }
         },

         _beforeUpdate: function(newOptions) {
            ListView.superclass._beforeUpdate.apply(this, arguments);
            this._itemTemplate = newOptions.itemTemplate || defaultItemTemplate;
            if (newOptions.selectedKey !== undefined) {
               this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newOptions.selectedKey, newOptions.idProperty);
            }
            else {
               this._selectedItem = null;
            }
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newKey, this._options.idProperty);
         },

         _onCollectionChange: function() {
            //т.к. при дейтсвиях с рекордсетом рекорд может потерять владельца, надо обновить ссылку на актуальный рекорд из текущего набора
            this._selectedItem = ItemsUtil.getDisplayItemById(this._display, this._options.selectedKey, this._options.idProperty);
            this._forceUpdate();
         }

      });



   return ListView;
});