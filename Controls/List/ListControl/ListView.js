/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ListControl/ListView', [
   'js!Controls/List/ItemsView',
   'tmpl!Controls/List/ListControl/ListView',
   'js!Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/List/ListControl/ItemTemplate',
   'css!Controls/List/ListControl/ListView'
], function (ItemsView,
             ListViewTpl,
             ItemsUtil,
             defaultItemTemplate
   ) {
   'use strict';

   var ListView = ItemsView.extend(
      {
         _controlName: 'Controls/List/ListControl/ListView',

         _template: ListViewTpl,
         _selectedItem: null,
         _selectedIndex: -1,

         _beforeMount: function(newOptions) {
            ListView.superclass._beforeMount.apply(this, arguments);
            this._itemTemplate = newOptions.itemTemplate || defaultItemTemplate;
            this.__calcSelectedItem(newOptions);
         },

         _beforeUpdate: function(newOptions) {
            ListView.superclass._beforeUpdate.apply(this, arguments);
            this._itemTemplate = newOptions.itemTemplate || defaultItemTemplate;
            this.__calcSelectedItem(newOptions);
         },

         __calcSelectedItem: function(newOptions) {
            if (newOptions.selectedKey !== undefined) {
               this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newOptions.selectedKey, newOptions.idProperty);
            }
            else {
               this._selectedItem = null;
            }


            //TODO надо вычислить индекс
            /*if(!this._selectedItem) {
               if (!this._selectedIndex) {
                  this._selectedIndex = 0;//переводим на первый элемент
               }
               else {
                  this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
               }
               this._selectedItem = this._display.at(this._selectedIndex);
            }*/
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newKey, this._options.idProperty);
         },

         _onCollectionChange: function() {
            //т.к. при действиях с рекордсетом рекорд может потерять владельца, надо обновить ссылку на актуальный рекорд из текущего набора
            this._selectedItem = ItemsUtil.getDisplayItemById(this._display, this._options.selectedKey, this._options.idProperty);
            ListView.superclass._onCollectionChange.apply(this, arguments);
         }

      });



   return ListView;
});