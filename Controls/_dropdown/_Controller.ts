import Control = require('Core/Control');
import template = require('wml!Controls/_dropdown/_Controller');
import {Controller as SourceController} from 'Controls/source';
import chain = require('Types/chain');
import {isEqual} from 'Types/object';
import historyUtils = require('Controls/_dropdown/dropdownHistoryUtils');
import dropdownUtils = require('Controls/_dropdown/Util');
import * as mStubs from 'Core/moduleStubs';

// TODO: удалить после исправления https://online.sbis.ru/opendoc.html?guid=1ff4a7fb-87b9-4f50-989a-72af1dd5ae18
var
   defaultFilter = {},
   defaultSelectedKeys = [];

var _private = {
   createSourceController: function(self, options) {
      if (!self._sourceController) {
         self._sourceController = new SourceController({
            source: self._source,
            navigation: options.navigation
         });
      }
      return self._sourceController;
   },

   getSourceController: function (self, options) {
        return historyUtils.getSource(options.source, options.historyId).addCallback((source) => {
            self._source = source;
            return _private.createSourceController(self, options);
        });
   },

   loadItems: function (self, options) {
      return _private.getSourceController(self, options).addCallback((sourceController) => {
          self._filter = historyUtils.getSourceFilter(options.filter, self._source);
          return sourceController.load(self._filter).addCallback((items) => {
              self._items = items;
              if (options.dataLoadCallback) {
                  options.dataLoadCallback(items);
              }
              _private.updateSelectedItems(self, options.emptyText, options.selectedKeys, options.keyProperty, options.selectedItemsChangedCallback);
              return items;
          });
       });
   },

   updateSelectedItems: function (self, emptyText, selectedKeys, keyProperty, selectedItemsChangedCallback) {
      var selectedItems = [];
      if (!selectedKeys.length || selectedKeys[0] === null) {
        if (emptyText) {
           selectedItems.push(null);
        } else if (self._items.getRecordById(null)) {
           selectedItems.push(self._items.getRecordById(null));
         }
      } else {
         chain.factory(self._items).each(function (item) {
            // fill the array of selected items from the array of selected keys
            if (selectedKeys.indexOf(item.get(keyProperty)) > -1) {
               selectedItems.push(item);
            }
         });
      }
      if (selectedItemsChangedCallback) {
         selectedItemsChangedCallback(selectedItems);
      }
   },

   getNewItems: function (items, selectedItems, keyProperty) {
      var newItems = [];

      chain.factory(selectedItems).each(function (item) {
         if (!items.getRecordById(item.get(keyProperty))) {
            newItems.push(item);
         }
      });
      return newItems;
   },

   onSelectorResult: function (self, selectedItems) {
      var newItems = _private.getNewItems(self._items, selectedItems, self._options.keyProperty);

      // From selector dialog records may return not yet been loaded, so we save items in the history and then load data.
      if (historyUtils.isHistorySource(self._source)) {
         if (newItems.length) {
            self._sourceController = null;
         }
         _private.updateHistory(self, chain.factory(selectedItems).toArray());
      } else {
         self._items.prepend(newItems);
      }
   },

   prepareItem: function(item, keyProperty, source) {
      if (historyUtils.isHistorySource(source)) {
         return source.resetHistoryFields(item, keyProperty);
      } else {
         return item;
      }
   },

   updateHistory: function (self, items) {
      if (historyUtils.isHistorySource(self._source)) {
         self._source.update(items, historyUtils.getMetaHistory());

         if (self._sourceController && self._source.getItems) {
            self._items = self._source.getItems();
         }
      }
   },

   onResult: function (event, result) {
      switch (result.action) {
         case 'pinClick':
            result.data[0] = _private.prepareItem(result.data[0], this._options.keyProperty, this._source);
            this._notify('pinClick', [result.data]);
            this._items = this._source.getItems();
            this._open();
            break;
         case 'applyClick':
            this._notify('selectedItemsChanged', [result.data]);
            _private.updateHistory(this, result.data);
            this._children.DropdownOpener.close();
            break;
         case 'itemClick':
            result.data[0] = _private.prepareItem(result.data[0], this._options.keyProperty, this._source);
            var res = this._notify('selectedItemsChanged', [result.data]);

            // dropDown must close by default, but user can cancel closing, if returns false from event
            if (res !== false) {
               _private.updateHistory(this, result.data[0]);
               this._children.DropdownOpener.close();
            }
            break;
         case 'selectorResult':
            _private.onSelectorResult(this, result.data);
            this._notify('selectedItemsChanged', [result.data]);
            this._children.DropdownOpener.close();
            break;
         case 'footerClick':
            this._notify('footerClick', [result.event]);
            this._children.DropdownOpener.close();
      }
   },

   setHandlers: function (self, options) {
      self._onOpen = function (event, args) {
         self._notify('dropDownOpen');
         if (typeof (options.open) === 'function') {
            options.open(args);
         }
      };
      self._onClose = function(event, args) {
         self._notify('dropDownClose');
         if (typeof (options.close) === 'function') {
            options.close(args);
         }
      };
   },

   templateOptionsChanged: function(newOptions, options) {
      if (newOptions.headTemplate !== options.headTemplate ||
          newOptions.itemTemplate !== options.itemTemplate ||
          newOptions.footerTemplate !== options.footerTemplate) {
         return true;
      }
   },

   requireTemplates: function(self, options) {
      if (!self._depsDeferred) {
         let templatesToLoad = [];
         let templates = ['headTemplate', 'itemTemplate', 'footerTemplate'];

         templates.forEach((template) => {
            if (typeof options[template] === 'string') {
               templatesToLoad.push(options[template]);
            }
         });
         self._depsDeferred = mStubs.require(templatesToLoad);
      }
      return self._depsDeferred;
   }
};

/**
 * Container for dropdown lists
 *
 * @class Controls/_dropdown/_Controller
 * @extends Core/Control
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/IHierarchy
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IMultiSelectable
 * @mixes Controls/interface/IDropdown
 * @mixes Controls/interface/IDropdownEmptyText
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/_interface/IIcon
 * @mixes Controls/_interface/IIconStyle
 * @mixes Controls/interface/IGrouped
 * @author Красильников А.С.
 * @control
 * @public
 */

/**
 * @event Controls/_dropdown/_Controller#selectedItemsChanged Occurs when the selected items change.
 */

/**
 * @name Controls/_dropdown/_Controller#typeShadow
 * @cfg {String} Specifies the type of shadow around the popup.
 * @variant default Default shadow.
 * @variant suggestionsContainer Shadow on the right, left, bottom.
 */

/**
 * @name Controls/_dropdown/_Controller#marker
 * @cfg {Boolean} Determines whether the marker is displayed around the selected item.
 */

/**
 * @name Controls/_dropdown/_Controller#showClose
 * @cfg {Boolean} Determines whether the cross is displayed.
 */

var _Controller = Control.extend({
   _template: template,
   _items: null,
   _depsDeferred: null,

   _beforeMount: function (options, context, receivedState) {
      this._onResult = _private.onResult.bind(this);
      _private.setHandlers(this, options);
      if (!options.lazyItemsLoad) {
         if (receivedState) {
            let self = this;
            this._items = receivedState;
            _private.getSourceController(this, options).addCallback((sourceController) => {
                sourceController.calculateState(self._items);
            });
            _private.updateSelectedItems(this, options.emptyText, options.selectedKeys, options.keyProperty, options.selectedItemsChangedCallback);
         } else if (options.source) {
            return _private.loadItems(this, options);
         }
      }
   },

   _beforeUpdate: function (newOptions) {
      if (_private.templateOptionsChanged(newOptions, this._options)) {
         this._depsDeferred = null;
         if (this._children.DropdownOpener.isOpened()) {
            this._open();
         }
      }
      if (newOptions.selectedKeys !== this._options.selectedKeys && this._items) {
         _private.updateSelectedItems(this, newOptions.emptyText, newOptions.selectedKeys, newOptions.keyProperty, newOptions.selectedItemsChangedCallback);
      }
      if ((newOptions.source && (newOptions.source !== this._options.source || !this._sourceController)) ||
         !isEqual(newOptions.navigation, this._options.navigation) ||
         !isEqual(newOptions.filter, this._options.filter)) {
         this._source = null;
         this._sourceController = null;
         if (newOptions.lazyItemsLoad && !this._children.DropdownOpener.isOpened()) {
            /* source changed, items is not actual now */
            this._items = null;
         } else {
            var self = this;
            return _private.loadItems(this, newOptions).addCallback(function(items) {
               if (items && self._children.DropdownOpener.isOpened()) {
                  self._open();
               }
            });
         }
      }
   },

   _open: function (event) {
      // Проверям что нажата левая кнопка мыши
      if (this._options.readOnly || event && event.nativeEvent.button !== 0) {
         return;
      }
      var self = this;

      function open() {
         var config = {
            templateOptions: {
               items: self._items,
               //FIXME self._container[0] delete after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
               width: self._options.width !== undefined ? (self._container[0] || self._container).offsetWidth : undefined,
               hasMoreButton: self._sourceController.hasMoreData('down'),
               selectorOpener: self._children.selectorOpener,
               selectorDialogResult: self._onSelectorTemplateResult.bind(self)
            },
            target: self._container,
            corner: self._options.corner,
            opener: self,
            autofocus: false,
            closeOnOutsideClick: true
         };
         _private.requireTemplates(self, self._options).addCallback(() => {
            self._children.DropdownOpener.open(config, self);
         });
      }

      function itemsLoadCallback(items) {
         if (items.getCount() === 1) {
            self._notify('selectedItemsChanged', [
               [items.at(0)]
            ]);
         } else if (items.getCount() > 1) {
            open();
         }
      }

      if (this._options.source && !this._items) {
         _private.loadItems(this, this._options).addCallback(function (items) {
            itemsLoadCallback(items);
            return items;
         });
      } else if (this._items) {
         itemsLoadCallback(this._items);
      }
   },

   _onSelectorTemplateResult: function(event, items) {
      this._onResult(event, {action: 'selectorResult', data: items});
   },

   _clickHandler: function(event) {
      // stop bubbling event, so the list does not handle click event.
      event.stopPropagation();
      var opener = this._children.DropdownOpener;
      if (opener.isOpened()) {
         opener.close();
      } else {
         this._open();
      }
   },

   _beforeUnmount: function() {
      if (this._sourceController) {
         this._sourceController.cancelLoading();
         this._sourceController = null;
      }
   },

   _getEmptyText: function () {
      return dropdownUtils.prepareEmpty(this._options.emptyText);
   }
});

_Controller.getDefaultOptions = function getDefaultOptions() {
   return {
      filter: defaultFilter,
      selectedKeys: defaultSelectedKeys
   };
};

_Controller._private = _private;
export = _Controller;
