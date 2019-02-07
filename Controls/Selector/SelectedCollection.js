define('Controls/Selector/SelectedCollection',
   [
      'Core/Control',
      'wml!Controls/Selector/SelectedCollection/SelectedCollection',
      'wml!Controls/Selector/SelectedCollection/ItemTemplate',
      'Types/chain',
      'Controls/Utils/tmplNotify',
      'Controls/Selector/SelectedCollection/Utils',
      'Types/util',
      'css!theme?Controls/Selector/SelectedCollection/SelectedCollection'
   ],

   function(Control, template, ItemTemplate, chain, tmplNotify, selectedCollectionUtils, utils) {
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
            return chain.factory(items).value();
         },

         getVisibleItems: function(items, maxVisibleItems) {
            return maxVisibleItems ? items.slice(Math.max(items.length - maxVisibleItems, 0)) : items;
         },

         getTemplateOptions: function(self, options) {
            var
               templateOptions = self._templateOptions || {},
               itemsIsChanged = self._options.items !== options.items;

            if (options.items && (!templateOptions.items || itemsIsChanged)) {
               templateOptions.items = utils.object.clone(options.items);
            }

            templateOptions.readOnly = options.readOnly;
            templateOptions.displayProperty = options.displayProperty;
            templateOptions.itemTemplate = options.itemTemplate;
            templateOptions.width = self._container && self._container.offsetWidth;
            templateOptions.clickCallback = self._onResult.bind(this);
            
            return templateOptions;
         },

         getCounterWidth: function(itemsCount, readOnly, itemsLayout) {
            // if counter fixed
            if (readOnly && itemsLayout === 'oneRow') {
               return 0;
            }

            return selectedCollectionUtils.getCounterWidth(itemsCount);
         }
      };

      var Collection = Control.extend({
         _template: template,
         _templateOptions: null,
         _items: null,
         _notifyHandler: tmplNotify,
         _counterWidth: 0,

         _beforeMount: function(options) {
            this._onResult = _private.onResult.bind(this);
            this._items = _private.getItemsInArray(options.items);
            this._visibleItems = _private.getVisibleItems(this._items, options.maxVisibleItems);
            this._counterWidth = options._counterWidth || 0;
         },

         _beforeUpdate: function(newOptions) {
            this._items = _private.getItemsInArray(newOptions.items);
            this._visibleItems = _private.getVisibleItems(this._items, newOptions.maxVisibleItems);
            this._templateOptions = _private.getTemplateOptions(this, newOptions);
            this._counterWidth = newOptions._counterWidth || _private.getCounterWidth(this._items.length, newOptions.readOnly, newOptions.itemsLayout);
         },

         _afterUpdate: function() {
            if (this._templateOptions.width !== this._container.offsetWidth) {
               this._templateOptions.width = this._container.offsetWidth;
            }
         },

         _afterMount: function() {
            this._counterWidth = this._counterWidth || _private.getCounterWidth(this._items.length, this._options.readOnly, this._options.itemsLayout);
            this._templateOptions = _private.getTemplateOptions(this, this._options);
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

      Collection._private = _private;
      return Collection;
   });
