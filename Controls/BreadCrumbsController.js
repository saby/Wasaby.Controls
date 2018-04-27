define('Controls/BreadCrumbsController', [
   'Core/Control',
   'Controls/Utils/BreadCrumbsUtil',
   'Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/BreadCrumbsController/BreadCrumbsController'
], function(
   Control,
   BreadCrumbsUtil,
   ItemsUtil,
   template
) {
   'use strict';

   var BreadCrumbsController = Control.extend({
      _template: template,
      _visibleItems: [],
      _oldWidth: 0,

      _afterMount: function() {
         //TODO: нужно приделать костыли для браузеров без preload, но сейчас это сделать не получится, т.к. демки в IE не взлетают
         if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this,  this._options.items, this._oldWidth);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth)) {
            this._oldWidth = this._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this,  newOptions.items, this._container.clientWidth);
         }
      },

      _onItemClick: function(e, item) {
         this._notify('itemClick', [item]);
      },

      _onResize: function() {
         //Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
      }
   });

   return BreadCrumbsController;
});
