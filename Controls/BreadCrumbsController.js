define('Controls/BreadCrumbsController', [
   'Core/Control',
   'Controls/Utils/BreadCrumbsUtil',
   'Controls/Utils/FontLoadUtil',
   'tmpl!Controls/BreadCrumbsController/BreadCrumbsController'
], function(
   Control,
   BreadCrumbsUtil,
   FontLoadUtil,
   template
) {
   'use strict';

   /**
    * Breadcrumbs.
    *
    * @class Controls/BreadCrumbsController
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @control
    * @public
    *
    * @demo Controls-demo/BreadCrumbs/BreadCrumbs
    */

   var BreadCrumbsController = Control.extend({
      _template: template,
      _visibleItems: [],
      _oldWidth: 0,

      _afterMount: function() {
         if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsV__crumbMeasurer').addCallback(function() {
               BreadCrumbsUtil.calculateBreadCrumbsToDraw(this,  this._options.items, this._oldWidth);
               this._forceUpdate();
            }.bind(this));
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
