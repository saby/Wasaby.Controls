import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/SelectedCollection/SelectedCollection');
import ItemTemplate = require('wml!Controls/_lookup/SelectedCollection/ItemTemplate');
import chain = require('Types/chain');
import tmplNotify = require('Controls/Utils/tmplNotify');
import selectedCollectionUtils = require('Controls/_lookup/SelectedCollection/Utils');
import utils = require('Types/util');
import 'css!theme?Controls/_lookup/SelectedCollection/SelectedCollection';
import 'wml!Controls/_lookup/SelectedCollection/_ContentTemplate';
import 'wml!Controls/_lookup/SelectedCollection/_CrossTemplate';


/**
 * Control, that display collection of items.
 *
 * @class Controls/_lookup/SelectedCollection
 * @extends Core/Control
 * @mixes Controls/_lookup/SelectedCollection/SelectedCollectionStyles
 * @control
 * @public
 * @author Капустин И.А.
 */


var
   JS_CLASS_CAPTION_ITEM = '.js-controls-SelectedCollection__item__caption',
   JS_CLASS_CROSS_ITEM = '.js-controls-SelectedCollection__item__cross';

var _private = {
   clickCallbackPopup: function (eventType, item) {
      if (eventType === 'crossClick') {
         this._notify('crossClick', [item]);
      } else if (eventType === 'itemClick') {
         this._notify('itemClick', [item]);
      }
   },

   getItemsInArray: function (items) {
      return chain.factory(items).value();
   },

   getVisibleItems: function (items, maxVisibleItems) {
      return maxVisibleItems ? items.slice(Math.max(items.length - maxVisibleItems, 0)) : items;
   },

   getTemplateOptions: function (self, options) {
      var
         templateOptions = self._templateOptions || {},
         itemsIsChanged = self._options.items !== options.items;

      if (options.items && (!templateOptions.items || itemsIsChanged)) {
         templateOptions.items = utils.object.clone(options.items);
      }

      templateOptions.readOnly = options.readOnly;
      templateOptions.displayProperty = options.displayProperty;
      templateOptions.itemTemplate = options.itemTemplate;
      templateOptions.clickCallback = self._clickCallbackPopup;

      return templateOptions;
   },

   getCounterWidth: function (itemsCount, readOnly, itemsLayout) {
      // in mode read only and single line, counter does not affect the collection
      if (readOnly && itemsLayout === 'oneRow') {
         return 0;
      }

      return selectedCollectionUtils.getCounterWidth(itemsCount);
   },

   isShowCounter: function (itemsLength, maxVisibleItems) {
      return itemsLength > maxVisibleItems;
   }
};

var Collection = Control.extend({
   _template: template,
   _templateOptions: null,
   _items: null,
   _notifyHandler: tmplNotify,
   _counterWidth: 0,

   _beforeMount: function (options) {
      this._getItemMaxWidth = selectedCollectionUtils.getItemMaxWidth;
      this._clickCallbackPopup = _private.clickCallbackPopup.bind(this);
      this._items = _private.getItemsInArray(options.items);
      this._visibleItems = _private.getVisibleItems(this._items, options.maxVisibleItems);
      this._templateOptions = _private.getTemplateOptions(this, options);
      this._counterWidth = options._counterWidth || 0;
   },

   _beforeUpdate: function (newOptions) {
      this._items = _private.getItemsInArray(newOptions.items);
      this._visibleItems = _private.getVisibleItems(this._items, newOptions.maxVisibleItems);
      this._templateOptions = _private.getTemplateOptions(this, newOptions);

      if (_private.isShowCounter(this._items.length, newOptions.maxVisibleItems)) {
         this._counterWidth = newOptions._counterWidth || _private.getCounterWidth(this._items.length, newOptions.readOnly, newOptions.itemsLayout);
      }
   },

   _afterMount: function () {
      if (_private.isShowCounter(this._items.length, this._options.maxVisibleItems) && !this._counterWidth) {
         this._counterWidth = this._counterWidth || _private.getCounterWidth(this._items.length, this._options.readOnly, this._options.itemsLayout);

         if (this._counterWidth) {
            this._forceUpdate();
         }
      }
   },

   _itemClick: function (event, item) {
      if (event.target.closest(JS_CLASS_CAPTION_ITEM)) {
         this._notify('itemClick', [item]);
      } else if (event.target.closest(JS_CLASS_CROSS_ITEM)) {
         this._notify('crossClick', [item]);
      }
   },

   _openInfoBox: function (event, config) {
      config.maxWidth = this._container.offsetWidth;
      this._notify('openInfoBox', [config]);
   }
});

Collection.getDefaultOptions = function () {
   return {
      itemTemplate: ItemTemplate,
      itemsLayout: 'default'
   };
};

Collection._private = _private;
export = Collection;

