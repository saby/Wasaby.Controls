define('Controls/Selector/SelectedCollection',
   [
      'Core/Control',
      'wml!Controls/Selector/SelectedCollection/SelectedCollection',
      'wml!Controls/Selector/SelectedCollection/ItemTemplate',
      'WS.Data/Chain',
      'Controls/Utils/tmplNotify',
      'css!theme?Controls/Selector/SelectedCollection/SelectedCollection'
   ],

   function(Control, template, ItemTemplate, Chain, tmplNotify) {
      'use strict';

      /**
       * Control, that display collection of items.
       *
       * @class Controls/Selector/SelectedCollection
       * @extends Core/Control
       * @mixes Controls/Selector/SelectedCollection/SelectedCollectionStyles
       * @control
       * @public
       * @author Капустин И.А.
       */

      var _private = {
         onResult: function(eventType, item) {
            if (eventType === 'crossClick') {
               this._notify('crossClick', [item]);
            } else if (eventType === 'itemClick') {
               this._notify('itemClick', [item]);
            }
         },

         getItemsInArray: function(items) {
            return Chain(items).value();
         },

         getVisibleItems: function(items, maxVisibleItems) {
            return maxVisibleItems ? items.slice(Math.max(items.length - maxVisibleItems, 0)) : items;
         },

         setTemplateOptions: function(self, options) {
            var templateOptions = self._templateOptions || {};

            templateOptions.items = options.items;
            templateOptions.readOnly = options.readOnly;
            templateOptions.displayProperty = options.displayProperty;
            templateOptions.itemTemplate = options.itemTemplate;
            templateOptions.width = self._container && self._container.offsetWidth;
            templateOptions.clickCallback = self._onResult.bind(this);

            self._templateOptions = templateOptions;
         }
      };

      var Collection = Control.extend({
         _template: template,
         _templateOptions: null,
         _items: [],
         _notifyHandler: tmplNotify,

         _beforeMount: function(options) {
            this._onResult = _private.onResult.bind(this);
            this._items = _private.getItemsInArray(options.items);
            this._visibleItems = _private.getVisibleItems(this._items, options.maxVisibleItems);
         },

         _beforeUpdate: function(newOptions) {
            this._items = _private.getItemsInArray(newOptions.items);
            this._visibleItems = _private.getVisibleItems(this._items, newOptions.maxVisibleItems);
            _private.setTemplateOptions(this, newOptions);
         },

         _afterUpdate: function() {
            if (this._templateOptions.width !== this._container.offsetWidth) {
               this._templateOptions.width = this._container.offsetWidth;
            }
         },

         _afterMount: function() {
            _private.setTemplateOptions(this, this._options);
            this._forceUpdate();
         },

         _onResult: function(event, item) {
            if (event === 'itemClick') {
               this._itemClick(event, item);
            } else if (event === 'crossClick') {
               this._crossClick(event, item);
            }
         },

         _itemClick: function(event, item) {
            this._notify('itemClick', [item]);
         },

         _crossClick: function(event, index) {
            this._notify('crossClick', [this._visibleItems[index]]);
         }
      });

      Collection.getDefaultOptions = function() {
         return {
            itemTemplate: ItemTemplate,
            itemsLayout: 'default'
         };
      };

      return Collection;
   });
