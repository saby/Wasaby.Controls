define('Controls/Explorer/_PathController', [
   'Core/Control',
   'Controls/Utils/tmplNotify',
   'wml!Controls/Explorer/_PathController/_PathController',
   'Controls/crumbs',
   'Controls/List/resources/utils/ItemsUtil'
], function(
   Control,
   tmplNotify,
   template,
   crumbs,
   ItemsUtil
) {
   'use strict';

   var _private = {
      getHeader: function(self, options) {
         var newHeader = options.header;
         if (options.items && options.header && !options.header[0].title && !options.header[0].template) {
            newHeader = options.header.slice();
            newHeader[0] = {
               template: crumbs.HeadingPathBack,
               templateOptions: {
                  backButtonClass: 'controls-BreadCrumbsPath__backButton__wrapper_inHeader',
                  backButtonStyle: options.backButtonStyle,
                  backButtonCaption: ItemsUtil.getPropertyValue(options.items[options.items.length - 1], options.displayProperty),
                  counterCaption: options.items[options.items.length - 1].get('counterCaption')
               },
               width: options.header[0].width
            };
         }
         return newHeader;
      }
   };

   var PathController = Control.extend({
      _template: template,
      _header: null,

      _beforeMount: function(options) {
         this._header = _private.getHeader(this, options);
      },

      _beforeUpdate: function(newOptions) {
         if (this._options.items !== newOptions.items) {
            this._header = _private.getHeader(this, newOptions);
         }
      },

      _notifyHandler: tmplNotify,

      _onBackButtonClick: function(e) {
         this._children.Path._onBackButtonClick(e);
      },

      _shouldDrawPath: function() {
         return this._options.rootVisible || this._header && this._options.items.length > 1 || !this._header && this._options.items.length > 0;
      },

      _onArrowClick: function(e) {
         this._children.Path._onArrowClick(e);
      }
   });

   return PathController;
});
