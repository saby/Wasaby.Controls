import Control = require('Core/Control');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_explorer/PathController/PathController');
import crumbs = require('Controls/breadcrumbs');
import list = require('Controls/list');


   var _private = {
      getHeader: function(self, options) {
         var newHeader;
         if (options.items && options.header && !options.header[0].title && !options.header[0].template) {
            newHeader = options.header.slice();
            newHeader[0] = {
               template: crumbs.HeadingPathBack,
               templateOptions: {
                  backButtonClass: 'controls-BreadCrumbsPath__backButton__wrapper_inHeader',
                  backButtonStyle: options.backButtonStyle,
                  backButtonCaption: list.ItemsUtil.getPropertyValue(options.items[options.items.length - 1], options.displayProperty),
                  counterCaption: options.items[options.items.length - 1].get('counterCaption')
               },
               width: options.header[0].width,

               // TODO: удалить эту опцию после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
               isBreadCrumbs: true
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
         crumbs.HeadingPathCommon.onBackButtonClick.call(this, e);
      },

      _onArrowClick: function(e) {
         crumbs.HeadingPathCommon.onArrowClick.call(this, e);
      }
   });

   export = PathController;

