define('Controls/BreadCrumbs', [
   'Core/Control',
   'tmpl!Controls/BreadCrumbs/BreadCrumbs',
   'tmpl!Controls/BreadCrumbs/resources/itemTemplate',
   'tmpl!Controls/BreadCrumbs/resources/itemsTemplate',
   'Controls/BreadCrumbs/ItemsViewModel',
   'css!Controls/BreadCrumbs/BreadCrumbs'
], function(Control,
   template,
   itemTemplate,
   itemsTemplate,
   ItemsViewModel
) {
   'use strict';

   var _private = {
         recalcCrumbs: function(self) {
            var homeWidth = self._container.getElementsByClassName('controls-BreadCrumbsV__home')[0].clientWidth;
            self._itemsViewModel.recalcCrumbs(self._container.clientWidth - homeWidth);
         }
      };


   /**
    * Компонент - хлебные крошки
    * @class Controls/BreadCrumbs
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IHighlighter
    * @control
    * @public
    * @category List
    */

   var BreadCrumbs = Control.extend({
      _template: template,
      _itemTemplate: itemTemplate,
      _itemsTemplate: itemsTemplate,

      _beforeMount: function(newOptions) {
         if (newOptions.itemsViewModel) {
            this._itemsViewModel = newOptions.itemsViewModel;
         } else {
            this._itemsViewModel = new ItemsViewModel();
            if (newOptions.items) {
               this._itemsViewModel.setItems(newOptions.items);
            }
         }
      },

      _afterMount: function() {
         _private.recalcCrumbs(this);
         this._forceUpdate();
      },

      _beforeUpdate: function(newOptions) {
         //TODO: вроде будет зацикливаться, т.к. после ресайза я тоже сюда попаду
         // this._itemsViewModel.setItems(newOptions.items); //TODO: под if
         // _private.recalcCrumbs(this);
      },

      _onResize: function() {
         _private.recalcCrumbs(this);
      },

      _onItemClick: function(e, itemData) {
         if (itemData.isDots) {
            console.log('точки');
         } else {
            console.log('обычный item');
         }
      },

      _onHomeClick: function() {
         console.log('домик');
      }
   });
   return BreadCrumbs;
});
