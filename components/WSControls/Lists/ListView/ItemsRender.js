/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListView/ItemsRender', [
   'js!WSControls/Lists/ItemsRender',
   'tmpl!WSControls/Lists/ListView/ItemsRender'
], function (ItemsViewRender, ItemsRenderTpl
   ) {
   'use strict';

   var ItemsRender = ItemsViewRender.extend(
      {
         _controlName: 'WSControls/Lists/ListView/ItemsRender',

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