import {Control} from 'UI/Base';
import {EventUtils} from 'UI/Events';
import template = require('wml!Controls/_explorer/PathController/PathController');
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';
import HeadingPathBack = require('Controls/_explorer/HeadingPathBack');

   var _private = {
      needShadow: function(header, headerCfg) {

         //если есть заголовок, то тень будет под ним, и нам не нужно рисовать ее под хлебными крошками
         return !(header || headerCfg);
      }
   };

   var PathController = Control.extend({
      _template: template,
      _header: null,
      _needShadow: false,
      _lastCrumbId: null,
      _itemsAndHeaderPromiseResolver: null,

      _beforeMount: function(options) {
         this._prepareHeader({}, options);
         options.itemsPromise.then((items) => {
            this._needShadow = _private.needShadow(this._header, options.header);
            this._resolveItemsAndHeaderPromise(items);
         });
      },

      _beforeUpdate: function(newOptions) {
         this._prepareHeader(this._options, newOptions);
         this._resolveItemsAndHeaderPromise(newOptions.items);
         this._needShadow = _private.needShadow(this._header, newOptions.header);
      },

      _notifyHandler: EventUtils.tmplNotify,

      _onBackButtonClick: function(e) {
         const self = this;
         require(['Controls/breadcrumbs'], function (breadcrumbs) {
            breadcrumbs.HeadingPathCommon.onBackButtonClick.call(self, e);
         });
      },

      _prepareHeader: function(oldOptions, newOptions) {
         const isEqualItems = (oldItems, newItems) => {
            if ((!oldItems && newItems) || (oldItems && !newItems)) { return false }
            if (!oldItems && !newItems) { return true }

            return oldItems.length === newItems.length && oldItems.reduce((acc, prev, index) => acc && prev.isEqual(newItems[index]), true);
         };

         if (
             oldOptions.rootVisible !== newOptions.rootVisible ||
             !isEqualItems(oldOptions.items, newOptions.items) ||
             !GridIsEqualUtil.isEqualWithSkip(oldOptions.header, newOptions.header, {template: true})
         ) {
            this._itemsAndHeaderPromise = new Promise((resolve) => {
               this._itemsAndHeaderPromiseResolver = resolve;
            });

            this._header = null;
         }

         if (!this._header) {
            let newHeader;

            if (newOptions.header && newOptions.header.length && !(newOptions.header[0].title || newOptions.header[0].caption) && !newOptions.header[0].template) {
               newHeader = newOptions.header.slice();
               newHeader[0] = {
                  ...newOptions.header[0],
                  template: HeadingPathBack,
                  templateOptions: {
                     itemsAndHeaderPromise: this._itemsAndHeaderPromise,
                     showActionButton: !!newOptions.showActionButton,
                     showArrowOutsideOfBackButton: !!newOptions.showActionButton,
                     backButtonStyle: newOptions.backButtonStyle,
                     backButtonIconStyle: newOptions.backButtonIconStyle,
                     backButtonFontColorStyle: newOptions.backButtonFontColorStyle,
                     displayProperty: newOptions.displayProperty,
                     items: newOptions.items
                  },

                  // TODO: удалить эту опцию после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
                  isBreadCrumbs: true
               };
            } else {
               newHeader = newOptions.header;
            }

            this._header = newHeader;
         }
      },

      _resolveItemsAndHeaderPromise: function(items) {
         if (this._itemsAndHeaderPromiseResolver) {
            this._itemsAndHeaderPromiseResolver({
               items: items,
               header: this._header
            });
            this._itemsAndHeaderPromiseResolver = null;
         }
      }

   });
   PathController._private = _private;
   export = PathController;
