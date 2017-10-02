/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListView', [
   'js!WSControls/Lists/ItemsView',
   'tmpl!WSControls/Lists/ListView'
], function (ItemsView, ListViewTpl
   ) {
   'use strict';

   var ItemsRender = ItemsView.extend(
      {
         _controlName: 'WSControls/Lists/ListView',

         _template: ItemsRenderTpl,
         _selectedIndex: null,
         _selectedItem: null,

         _displayChangeCallback: function(cfg) {
            ItemsRender.superclass._displayChangeCallback.apply(this, arguments);
            if(!cfg.selectedItem) {
               if (!this._selectedIndex) {
                  this._selectedIndex = 0;//переводим на первый элемент
               }
               else {
                  this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
               }
               this._selectedItem = this._display.at(this._selectedIndex);
            }
            else {
               this._selectedItem = cfg.selectedItem;
            }
         }
      });



   return ItemsRender;
});