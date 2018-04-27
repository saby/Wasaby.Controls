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

      _beforeMount: function() {
         //Эта функция передаётся по ссылке в Opener, так что нужно биндить this, чтобы не потерять его
         this._onResult = this._onResult.bind(this);
      },

      _afterMount: function() {
         BreadCrumbsUtil.calculateConstants();

         //TODO: нужно приделать костыли для браузеров без preload, но сейчас это сделать не получится, т.к. демки в IE не взлетают
         if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth - BreadCrumbsUtil.HOME_WIDTH;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this,  this._options.items, BreadCrumbsUtil.getItemsSizes(this._options.items), this._oldWidth);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth - BreadCrumbsUtil.HOME_WIDTH)) {
            this._oldWidth = this._container.clientWidth - BreadCrumbsUtil.HOME_WIDTH;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this,  newOptions.items, BreadCrumbsUtil.getItemsSizes(newOptions.items), this._container.clientWidth - BreadCrumbsUtil.HOME_WIDTH);
         }
      },

      _onResult: function(args) {
         BreadCrumbsUtil.onResult(this, args);
      },

      _onItemClick: function(e, originalEvent, item, isDots) {
         BreadCrumbsUtil.onItemClick(this, originalEvent, item, isDots);
      },

      _onResize: function() {
         //Здесь только скрываю меню, т.к. перерасчет крошек запустится в beforeUpdate
         this._children.menuOpener.close();
      }
   });

   return BreadCrumbsController;
});
