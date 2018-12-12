define('Controls/BreadCrumbs', [
   'Core/Control',
   'Controls/BreadCrumbs/Utils',
   'Controls/Utils/FontLoadUtil',
   'Controls/Utils/tmplNotify',
   'wml!Controls/BreadCrumbs/BreadCrumbs'
], function(
   Control,
   BreadCrumbsUtil,
   FontLoadUtil,
   tmplNotify,
   template
) {
   'use strict';

   /**
    * Breadcrumbs.
    *
    * @class Controls/BreadCrumbs
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @control
    * @public
    * @author Зайцев А.С.
    * @demo Controls-demo/BreadCrumbs/BreadCrumbs
    */

   var BreadCrumbs = Control.extend({
      _template: template,
      _visibleItems: [],
      _oldWidth: 0,

      _afterMount: function() {
         if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function() {
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

      _notifyHandler: tmplNotify,

      _onResize: function() {
         //Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
      }
   });

   return BreadCrumbs;
});
