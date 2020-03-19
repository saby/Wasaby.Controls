import Control = require('Core/Control');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_explorer/PathController/PathWrapper');
import GridIsEqualUtil = require('Controls/_grid/utils/GridIsEqualUtil');

var _private = {
   needCrumbs: function(header, items, rootVisible) {
      return !!items && ((!header && items.length > 0) || items.length > 1) || !!rootVisible;
   }
};

var PathWrapper = Control.extend({
   _template: template,
   _needCrumbs: false,
   _items: null,

   _beforeMount: function(options) {
      return options.itemsAndHeaderPromise.then((params) => {
         this._items = params.items;
         this._needCrumbs = _private.needCrumbs(params.header, params.items, options.rootVisible);
         this._header = params.header;
      });
   },

   _beforeUpdate: function(newOptions) {
      if (this._items !== newOptions.items ||
          this._options.rootVisible !== newOptions.rootVisible ||
          !GridIsEqualUtil.isEqualWithSkip(this._options.header, newOptions.header, { template: true })) {
         this._items = newOptions.items;
         this._needCrumbs = _private.needCrumbs(newOptions.header,  this._items, newOptions.rootVisible);
      }
      if (this._header !== newOptions.header) {
         this._header = newOptions.header;
      }
   },

   _notifyHandler: tmplNotify

});
PathWrapper._private = _private;
export = PathWrapper;
