/**
 * Created by kraynovdo on 18.10.2017.
 */
define('js!WSControls/Lists/ListControl/ListRender', [
   'js!WSControls/Lists/ItemsRender',
   'tmpl!WSControls/Lists/ListControl/ListRender'
], function (ItemsRender, ItemsRenderTpl
   ) {
   'use strict';

   var ListRender = ItemsRender.extend(
      {
         _controlName: 'WSControls/Lists/ListControl/ListRender',

         _template: ItemsRenderTpl,
         _selectedIndex: null,
         _selectedItem: null,

         constructor: function(cfg) {
            ListRender.superclass.constructor.apply(this, arguments);
            this.__initSelectedItem(cfg);
         },

         _beforeUpdate: function(newOptions) {
            ListRender.superclass._beforeUpdate.apply(this, arguments);
            this.__initSelectedItem(newOptions);
         },

         __initSelectedItem: function(cfg) {

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
         },

         _onItemClick: function(e, dispItem) {
            this._notify('onItemClick', dispItem);
         }
      });



   return ListRender;
});