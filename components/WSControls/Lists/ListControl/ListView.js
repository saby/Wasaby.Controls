/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!WSControls/Lists/ListControl/ListView', [
   'js!WSControls/Lists/ItemsView',
   'tmpl!WSControls/Lists/ListControl/ListView'
], function (ItemsViewRender, ItemsRenderTpl
   ) {
   'use strict';

   var ItemsRender = ItemsViewRender.extend(
      {
         _controlName: 'WSControls/Lists/ListView/ItemsRender',

         _template: ItemsRenderTpl,
         _selectedIndex: null,
         _selectedItem: null,

         _displayChangeCallback: function(display, cfg) {
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

            //TODO обработать virt scroll
         }
      });



   return ItemsRender;
});