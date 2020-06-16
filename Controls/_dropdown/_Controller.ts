// @ts-ignore
import Control = require('Core/Control');
// @ts-ignore
import {Sticky as StickyOpener, Stack as StackOpener} from 'Controls/popup';
import IDropdownController, {IDropdownControllerOptions} from 'Controls/_dropdown/interface/IDropdownController';
import chain = require('Types/chain');
import historyUtils = require('Controls/_dropdown/dropdownHistoryUtils');
import dropdownUtils = require('Controls/_dropdown/Util');
import Env = require('Env/Env');
import {Controller as SourceController} from 'Controls/source';
import {isEqual} from 'Types/object';
import * as mStubs from 'Core/moduleStubs';
import {descriptor, Model} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import * as cInstance from 'Core/core-instance';
import {PrefetchProxy} from 'Types/source';
import * as Merge from 'Core/core-merge';
import {RegisterUtil, UnregisterUtil} from 'Controls/event';

const PRELOAD_DEPENDENCIES_HOVER_DELAY = 80;
/**
 * Контроллер для выпадающих списков.
 *
 * @class Controls/_dropdown/_Controller
 * @extends Core/Control
 * @mixes Controls/_dropdown/interface/IDropdownController
 * @author Красильников А.С.
 * @control
 * @private
 */

/*
 * Controller for dropdown lists
 *
 * @class Controls/_dropdown/_Controller
 * @extends Core/Control
 * @mixes Controls/_dropdown/interface/IDropdownController
 * @author Красильников А.С.
 * @control
 * @private
 */

/**
 * @event Controls/_dropdown/_Controller#selectedItemsChanged Происходит при изменении набора выбранных элементов.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/collection:RecordSet} items Выбранные элементы.
 */

class _Controller extends Control<IDropdownControllerOptions> implements IDropdownController {
   protected _items: RecordSet = null;
   protected _loadItemsTempPromise: Promise<any> = null;
   protected _options: IDropdownControllerOptions = null;

   constructor(options: IDropdownControllerOptions) {
      super(options);
      this._options = options;
      this._onResult = this._onResult.bind(this);
      this._setHandlers(options);
   }

   loadItems(): Promise<object> {
      return new Promise((resolve) => {
         this._loadItems(this._options).addCallback((items) => {
            const beforeMountResult = {};

            if (historyUtils.isHistorySource(this._source)) {
               beforeMountResult.history = this._source.getHistory();
               beforeMountResult.items = this._source.getItems(false);
            } else {
               beforeMountResult.items = items;
            }

            resolve(beforeMountResult);
         });
      });
   }

   setItems(recievedState) {
      return this._getSourceController(this._options).addCallback((sourceController) => {
         this._setItems(recievedState.items);
         sourceController.calculateState(this._items);

         if (recievedState.history) {
            this._source.setHistory(recievedState.history);
            this._setItems(this._source.prepareItems(this._items));
         }

         this._updateSelectedItems(this._options.emptyText, this._options.selectedKeys, this._options.keyProperty, this._options.selectedItemsChangedCallback);
         if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback(this._items);
         }

         return sourceController;
      });
   }

   registerScrollEvent(opener): void {
      this.opener = opener;
      RegisterUtil(opener, 'scroll', this.handleScroll.bind(this));
   }

   update(newOptions: IDropdownControllerOptions) {
      const oldOptions = {...this._options};
      this._options = newOptions;
      if (newOptions.readOnly && newOptions.readOnly !== oldOptions.readOnly) {
         this._closeDropdownList();
      }

      if (this._templateOptionsChanged(newOptions, oldOptions)) {
         this._loadMenuTempPromise = null;
         if (this._isOpened) {
            this._open();
         }
      }
      if ((newOptions.source && (newOptions.source !== oldOptions.source || !this._sourceController)) ||
          !isEqual(newOptions.navigation, oldOptions.navigation) ||
          !isEqual(newOptions.filter, oldOptions.filter)) {
         if (this._sourceController && !this._sourceController.isLoading()) {
            this._source = null;
            this._sourceController = null;
         }

         if (newOptions.source !== oldOptions.source) {
            this._resetLoadPromises();
         }
         if (newOptions.lazyItemsLoading && !this._isOpened) {
            /* source changed, items is not actual now */
            this._setItems(null);
         } else {
            return this._loadItems(newOptions).addCallback((items) => {
               if (items && this._isOpened) {
                  this._open();
               }
            });
         }
      } else if (newOptions.selectedKeys !== oldOptions.selectedKeys && this._items) {
         this._updateSelectedItems(newOptions.emptyText, newOptions.selectedKeys,
                                   newOptions.keyProperty, newOptions.selectedItemsChangedCallback);
      }
   }

   handleKeyDown(event) {
      if (event.nativeEvent.keyCode === Env.constants.key.esc && this._popupId) {
         this._closeDropdownList();
         event.stopPropagation();
      }
   }

   _getloadItemsPromise() {
      if (this._items) {
         // Обновляем данные в источнике, нужно для работы истории
         this._setItems(this._items);
         this._loadItemsPromise = Promise.resolve();
      } else if (!this._loadItemsPromise || this._loadItemsPromise.resolved && !this._items) {
         if (this._options.source && !this._items) {
            this._loadItemsPromise = this._loadItems(this._options);
         }
      }
      return this._loadItemsPromise;
   }

   loadDependencies(): Promise<unknown> {
      const deps = [this._loadMenuTemplates(this._options)];

      if (!this._items) {
         deps.push(this._getloadItemsPromise().then(() => this._loadItemsTemplates(this._options)));
      } else {
         deps.push(this._loadItemsTemplates(this._options));
      }

      return Promise.all(deps);
   }

   _open(popupOptions?: object): Promise<any> {
      if (this._options.readOnly) {
         return;
      }
      const openPopup = () => {
         StickyOpener.openPopup(this._getPopupOptions(popupOptions)).then((popupId) => {
            this._popupId = popupId;
         });
      };

      return this.loadDependencies().then(
          () => {
             const count = this._items.getCount();
             if (count > 1 || count === 1 && (this._options.emptyText || this._options.footerTemplate)) {
                this._createMenuSource(this._items);
                this._isOpened = true;
                openPopup();
             } else if (count === 1) {
                this._options.notifySelectedItemsChanged(this._items.at(0));
             }
          },
          () => {
             if (this._menuSource) {
                openPopup();
             }
          }
       );
   }

   _onSelectorTemplateResult(event, selectedItems): void {
      let result = this._options.notifyEvent('selectorCallback', this._initSelectorItems, selectedItems) || selectedItems;
      this._onResult('selectorResult', result);
   }

   handleScroll(): void {
      if (this._popupId) {
         this._closeDropdownList();
      }
   }

   handleMouseDownOnMenuPopupTarget(target): void {
      if (!this.target) {
         this.target = target;
      }
      if (this._popupId) {
         this._closeDropdownList();
      } else {
         this._open();
      }
   }

   handleMouseEnterOnMenuPopupTarget(): void {
      this._loadDependenciesTimer = setTimeout(this.loadDependencies.bind(this), PRELOAD_DEPENDENCIES_HOVER_DELAY);
   }

   handleMouseLeaveMenuPopupTarget(): void {
      clearTimeout(this._loadDependenciesTimer);
   }

   destroy() {
      if (this._sourceController) {
         this._sourceController.cancelLoading();
         this._sourceController = null;
      }
      this._setItems(null);
      this._closeDropdownList();
      UnregisterUtil(this.opener, 'scroll');
   }

   _getEmptyText() {
      return dropdownUtils.prepareEmpty(this._options.emptyText);
   }

   _setItems(items: RecordSet|null): void {
      if (items) {
         this._createMenuSource(items);
      } else {
         this._loadItemsPromise = null;
      }
      this._items = items;
   }

   _createMenuSource(items: RecordSet|Error): void {
      this._menuSource = new PrefetchProxy({
         target: this._source,
         data: {
            query: items
         }
      });
   }
   _deactivated(): void {
      this.closeMenu();
   }

   openMenu(popupOptions?: object): void {
      return this._open(popupOptions);
   }

   closeMenu(): void {
      this._closeDropdownList();
   }

   private _createSourceController(options) {
      if (!this._sourceController) {
         this._sourceController = new SourceController({
            source: this._source,
            navigation: options.navigation
         });
      }
      return this._sourceController;
   }

   private _hasHistory(options): boolean {
      return options.historyId || historyUtils.isHistorySource(options.source);
   }

   private _isLocalSource(source): boolean {
      return cInstance.instanceOfModule(source, 'Types/source:Local');
   }

   private _loadError(error: Error): void {
      if (this._options.dataLoadErrback) {
         this._options.dataLoadErrback(error);
      }
      this._loadItemsPromise = null;
      this._createMenuSource(error);
   }

   private _prepareFilterForQuery(options): object {
      let filter = options.filter;

      if (this._hasHistory(options)) {
         if (this._isLocalSource(options.source) || !options.historyNew) {
            filter = historyUtils.getSourceFilter(options.filter, this._source);
         } else {
            filter.historyIds = [options.historyId];
         }
      }

      return filter;
   }

   private _pinClick(item): void {
      const preparedItem = this._prepareItem(item, this._options.keyProperty, this._source);
      this._options.source.update(item.clone(), {
         $_pinned: !item.get('pinned')
      });
      this._setItems(null);
      this._open();
   }

   private _getSourceController(options): Promise<SourceController> {
      let sourcePromise;

      if (this._hasHistory(options) && this._isLocalSource(options.source) && !options.historyNew) {
         sourcePromise = historyUtils.getSource(options.source, options.historyId);
      } else {
         sourcePromise = Promise.resolve(options.source);
      }
      return sourcePromise.then((source) => {
         this._source = source;
         return this._createSourceController(options);
      });
   }

   private _loadItems(options) {
      return this._getSourceController(options).then(
          (sourceController) => {
             this._filter = this._prepareFilterForQuery(options);

             return sourceController.load(this._filter).addCallback((items) => {
                if (options.dataLoadCallback) {
                   options.dataLoadCallback(items);
                }
                this._setItems(items);
                this._updateSelectedItems(
                    options.emptyText,
                    options.selectedKeys,
                    options.keyProperty,
                    options.selectedItemsChangedCallback);
                return items;
             }).addErrback((error) => {
                this._loadError(error);
                return error;
             });
          });
   }

   private _resetLoadPromises() {
      this._loadMenuTempPromise = null;
      this._loadItemsPromise = null;
      this._loadItemsTempPromise = null;
   }

   private _getItemByKey(items: RecordSet, key: string, keyProperty: string): void|Model {
      let item;

      if (items) {
         item = items.at(items.getIndexByValue(keyProperty, key));
      }

      return item;
   }

   private _updateSelectedItems(emptyText, selectedKeys, keyProperty, selectedItemsChangedCallback) {
      const selectedItems = [];

      const addToSelected = (key: string) => {
         const selectedItem = this._getItemByKey(this._items, key, keyProperty);

         if (selectedItem) {
            selectedItems.push(selectedItem);
         }
      };

      if (!selectedKeys || !selectedKeys.length || selectedKeys[0] === null) {
         if (emptyText) {
            selectedItems.push(null);
         } else {
            addToSelected(null);
         }
      } else {
         chain.factory(selectedKeys).each( (key) => {
            // fill the array of selected items from the array of selected keys
            addToSelected(key);
         });
      }
      if (selectedItemsChangedCallback) {
         selectedItemsChangedCallback(selectedItems);
      }
   }

   private _getNewItems(items: RecordSet, selectedItems: RecordSet, keyProperty: string): Model[] {
      const newItems = [];

      chain.factory(selectedItems).each((item) => {
         if (!this._getItemByKey(items, item.get(keyProperty), keyProperty)) {
            newItems.push(item);
         }
      });
      return newItems;
   }

   private _onSelectorResult(selectedItems) {
      var newItems = this._getNewItems(this._items, selectedItems, this._options.keyProperty);

      // From selector dialog records may return not yet been loaded, so we save items in the history and then load data.
      if (historyUtils.isHistorySource(this._source)) {
         if (newItems.length) {
            this._sourceController = null;
         }
         this._updateHistory(chain.factory(selectedItems).toArray());
      } else {
         this._items.prepend(newItems);
         this._setItems(this._items);
      }
   }

   private _prepareItem(item, keyProperty, source) {
      if (historyUtils.isHistorySource(source)) {
         return source.resetHistoryFields(item, keyProperty);
      } else {
         return item;
      }
   }

   private _updateHistory(items) {
      if (historyUtils.isHistorySource(this._source)) {
         this._source.update(items, historyUtils.getMetaHistory());

         if (this._sourceController && this._source.getItems) {
            this._setItems(this._source.getItems());
         }
      }
   }

   private _onResult(action, data, nativeEvent) {
      switch (action) {
         case 'pinClick':
            this._pinClick(data);
            break;
         case 'applyClick':
            this._options.notifySelectedItemsChanged(data, nativeEvent);
            this._updateHistory(data);
            this._closeDropdownList();
            break;
         case 'itemClick':
            data = this._prepareItem(data, this._options.keyProperty, this._source);

            var res = this._options.notifySelectedItemsChanged([data], nativeEvent);

            // dropDown must close by default, but user can cancel closing, if returns false from event
            if (res !== false) {
               this._updateHistory(data);
               this._closeDropdownList();
            }
            break;
         case 'selectorResult':
            this._onSelectorResult(data);
            this._options.notifySelectedItemsChanged(data, nativeEvent);
            break;
         case 'selectorDialogOpened':
            this._initSelectorItems = data;
            this._closeDropdownList();
            break;
         case 'footerClick':
            this._options.notifyEvent('footerClick', data);
            if (!this.opener._$active) {
               this._closeDropdownList();
            }
      }
   }

   private _closeDropdownList() {
      StickyOpener.closePopup(this._popupId);
      this._isOpened = false;
   }

   private _setHandlers(options) {
      this._onOpen = function (event, args) {
         this._options.notifyEvent('dropDownOpen');
         if (typeof (options.open) === 'function') {
            options.open(args);
         }
      };
      this._onClose = function(event, args) {
         this._isOpened = false;
         this._menuSource = null;
         this._options.notifyEvent('dropDownClose');
         if (typeof (options.close) === 'function') {
            options.close(args);
         }
      };
   }

   private _templateOptionsChanged(newOptions, options) {
      const isTemplateChanged = (tplOption) => {
         return typeof newOptions[tplOption] === 'string' && newOptions[tplOption] !== options[tplOption];
      };

      if (isTemplateChanged('headTemplate') ||
          isTemplateChanged('itemTemplate') ||
          isTemplateChanged('footerTemplate')) {
         return true;
      }
   }

   private _loadItemsTemplates(options) {
      if (!this._loadItemsTempPromise) {
         const templatesToLoad = this._getItemsTemplates(options);
         this._loadItemsTempPromise = mStubs.require(templatesToLoad);
      }
      return this._loadItemsTempPromise;
   }

   private _loadMenuTemplates(options: object) {
      if (!this._loadMenuTempPromise) {
         let templatesToLoad = ['Controls/menu'];
         let templates = ['headTemplate', 'itemTemplate', 'footerTemplate'];
         templates.forEach((template) => {
            if (typeof options[template] === 'string') {
               templatesToLoad.push(options[template]);
            }
         });
         this._loadMenuTempPromise = mStubs.require(templatesToLoad).then((loadedDeps) => {
            return loadedDeps[0].Control.loadCSS(options.theme);
         });
      }
      return this._loadMenuTempPromise;
   }

   private _getItemsTemplates(options) {
      let
          templates = {},
          itemTemplateProperty = options.itemTemplateProperty;

      if (itemTemplateProperty) {
         this._items.each(function(item) {
            let itemTemplate = item.get(itemTemplateProperty);

            if (typeof itemTemplate === 'string') {
               templates[itemTemplate] = true;
            }
         });
      }

      return Object.keys(templates);
   }

   private _getPopupOptions(popupOptions?): object {
      let baseConfig = {...this._options};
      const ignoreOptions = [
         'iWantBeWS3',
         '_$createdFromCode',
         '_logicParent',
         'theme',
         'vdomCORE',
         'name',
         'esc'
      ];

      for (let i = 0; i < ignoreOptions.length; i++) {
         const option = ignoreOptions[i];
         if (this._options[option] !== undefined) {
            delete baseConfig[option];
         }
      }
      let templateOptions = {
         closeButtonVisibility: false,
         emptyText: this._getEmptyText(),
         allowPin: this._options.allowPin && this._hasHistory(this._options),
         headerTemplate: this._options.headTemplate || this._options.headerTemplate,
         footerContentTemplate: this._options.footerContentTemplate || this._options.footerTemplate,
         items: this._items,
         source: this._menuSource,
         filter: this._filter,
         // FIXME this._container[0] delete after
         // https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
         width: this._options.width !== undefined ?
             (this.target[0] || this.target).offsetWidth :
             undefined,
         hasMoreButton: this._sourceController.hasMoreData('down'),
         selectorOpener: StackOpener,
         selectorDialogResult: this._onSelectorTemplateResult.bind(this)
      };
      const config = {
         id: this._popupId,
         templateOptions: Object.assign(baseConfig, templateOptions),
         className: this._options.popupClassName,
         template: 'Controls/menu:Popup',
         actionOnScroll: 'close',
         target: this.target,
         targetPoint: this._options.targetPoint,
         opener: this.opener,
         fittingMode: {
            vertical: 'adaptive',
            horizontal: 'overflow'
         },
         eventHandlers: {
            onOpen: this._onOpen.bind(this),
            onClose: () => {
               this._popupId = null;
               this._onClose();
            },
            onResult: this._onResult.bind(this)
         },
         autofocus: false,
         closeOnOutsideClick: true
      };
      const popupConfig = popupOptions || this._options.menuPopupOptions;
      return Merge(config, popupConfig || {});
   }
}

_Controller.getDefaultOptions = function getDefaultOptions() {
   return {
      filter: {},
      selectedKeys: [],
      allowPin: true
   };
};

_Controller.getOptionTypes = function getOptionTypes() {
   return {
      selectedKeys: descriptor(Array)
   };
};
export = _Controller;
