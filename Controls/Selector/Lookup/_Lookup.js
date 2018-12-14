define('Controls/Selector/Lookup/_Lookup', [
   'Core/Control',
   'wml!Controls/Selector/Lookup/_Lookup',
   'Controls/Input/resources/InputRender/BaseViewModel',
   'WS.Data/Chain',
   'Core/core-merge',
   'Controls/Utils/getWidth',
   'Controls/Utils/DOMUtil',
   'Controls/Selector/SelectedCollection',
   'wml!Controls/Selector/SelectedCollection/SelectedCollection',
   'wml!Controls/Selector/Lookup/resources/clearRecordsTemplate',
   'wml!Controls/Selector/Lookup/resources/showSelectorTemplate',
   'Controls/Utils/tmplNotify',
   'Core/helpers/Object/isEqual',
   'Controls/Selector/SelectedCollection/Utils',
   'wml!Controls/Input/resources/input',
   'css!theme?Controls/Selector/Lookup/Lookup'
], function(Control, template, BaseViewModel, Chain, merge, getWidthUtil, DOMUtil, Collection, itemsTemplate, clearRecordsTemplate, showSelectorTemplate, tmplNotify, isEqual, selectedCollectionUtils) {
   'use strict';

   var
      MAX_VISIBLE_ITEMS = 20,
      SHOW_SELECTOR_WIDTH = 0,
      CLEAR_RECORDS_WIDTH = 0;

   var _private = {
      initializeConstants: function() {
         if (!SHOW_SELECTOR_WIDTH) {
            SHOW_SELECTOR_WIDTH = getWidthUtil.getWidth(showSelectorTemplate());
            CLEAR_RECORDS_WIDTH = getWidthUtil.getWidth(clearRecordsTemplate());
         }
      },

      initializeContainers: function(self) {
         self._fieldWrapper = self._children.inputRender._container;

         // toDO Проверка на jQuery до исправления этой ошибки https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
         if (window.jQuery && self._fieldWrapper instanceof window.jQuery) {
            self._fieldWrapper = self._fieldWrapper[0];
         }

         self._wrapperInputRender = self._fieldWrapper.getElementsByClassName('controls-InputRender__wrapper')[0];
      },

      notifyValue: function(self, value) {
         self._notify('valueChanged', [value]);
      },

      updateModel: function(self, value) {
         self._simpleViewModel.updateOptions({
            value: value
         });
      },

      calculatingSizes: function(self, newOptions) {
         var
            isShowCounter = false,
            allItemsInOneRow = false,
            maxVisibleItems = newOptions.maxVisibleItems,
            afterFieldWrapperWidth = 0,
            inputWidth, lastRowCollectionWidth,
            itemsSizesLastRow, availableWidth, lastSelectedItems,
            itemsCount = newOptions.items.getCount(),
            multiLineState = newOptions.multiLine && itemsCount,
            counterWidth = selectedCollectionUtils.getCounterWidth(itemsCount);

         if (itemsCount) {
            lastSelectedItems = _private.getLastSelectedItems(self, MAX_VISIBLE_ITEMS);
            itemsSizesLastRow = _private.getItemsSizesLastRow(self, lastSelectedItems, newOptions, counterWidth);
            allItemsInOneRow = !newOptions.multiLine || itemsSizesLastRow.length === Math.min(lastSelectedItems.length, maxVisibleItems);
            afterFieldWrapperWidth = _private.getAfterFieldWrapperWidth(itemsCount, !allItemsInOneRow, newOptions.readOnly);
            availableWidth = _private.getAvailableCollectionWidth(self._fieldWrapper, afterFieldWrapperWidth, newOptions.readOnly, newOptions.multiSelect);

            //For multi line define - inputWidth, for single line - maxVisibleItems
            if (newOptions.multiLine) {
               isShowCounter = _private.isShowCounter(itemsCount, maxVisibleItems);
               lastRowCollectionWidth = _private.getLastRowCollectionWidth(itemsSizesLastRow, isShowCounter, allItemsInOneRow, counterWidth);
               inputWidth = _private.getInputWidth(DOMUtil.width(self._fieldWrapper), lastRowCollectionWidth, availableWidth);
               multiLineState = _private.getMultiLineState(lastRowCollectionWidth, availableWidth, allItemsInOneRow);

               if (multiLineState) {
                  afterFieldWrapperWidth = _private.getAfterFieldWrapperWidth(itemsCount, true, newOptions.readOnly);
                  availableWidth = _private.getAvailableCollectionWidth(self._fieldWrapper, afterFieldWrapperWidth, newOptions.readOnly, newOptions.multiSelect);
               }
            } else {
               maxVisibleItems = _private.getMaxVisibleItems(lastSelectedItems, itemsSizesLastRow, availableWidth, counterWidth);
            }
         }

         self._multiLineState = multiLineState;
         self._inputWidth = inputWidth;
         self._maxVisibleItems = maxVisibleItems;
         self._availableWidthCollection = availableWidth;
         self._counterWidth = counterWidth;
      },

      getMaxVisibleItems: function(items, itemsSizes, availableWidth, counterWidth) {
         var
            maxVisibleItems = 0,
            visibleItemsWidth = 0,
            itemsCount = items.length,
            collectionWidth = _private.getCollectionWidth(itemsSizes);

         if (collectionWidth <= availableWidth) {
            maxVisibleItems = items.length;
         } else {
            availableWidth -= counterWidth || 0;
            for (var currentIndex = itemsCount - 1; currentIndex >= 0; currentIndex--) {
               if ((visibleItemsWidth + itemsSizes[currentIndex]) > availableWidth) {
                  /* If no element is inserted, then only the last selected */
                  if (!maxVisibleItems) {
                     maxVisibleItems++;
                  }
                  break;
               }

               maxVisibleItems++;
               visibleItemsWidth += itemsSizes[currentIndex];
            }
         }

         return maxVisibleItems;
      },

      getAvailableCollectionWidth: function(fieldWrapper, afterFieldWrapperWidth, readOnly, multiSelect) {
         return DOMUtil.width(fieldWrapper) - _private.getAdditionalCollectionWidth(fieldWrapper, afterFieldWrapperWidth, readOnly, multiSelect);
      },

      getAdditionalCollectionWidth: function(fieldWrapper, afterFieldWrapperWidth, readOnly, multiSelect) {
         var additionalWidth = afterFieldWrapperWidth;

         if (!readOnly && multiSelect) {
            additionalWidth += _private.getInputMinWidth(fieldWrapper.offsetWidth, afterFieldWrapperWidth);
         }

         return additionalWidth;
      },

      getAfterFieldWrapperWidth: function(itemsCount, multiLine, readOnly) {
         var afterFieldWrapperWidth = 0;

         if (!readOnly) {
            afterFieldWrapperWidth += SHOW_SELECTOR_WIDTH;
         }

         if (!multiLine && itemsCount > 1) {
            afterFieldWrapperWidth += CLEAR_RECORDS_WIDTH;
         }

         return afterFieldWrapperWidth;
      },

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth) {
         /* By the standard, the minimum input field width is 33%, but not more than 100 */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 100 * 33;

         return Math.min(minWidthFieldWrapper, 100);
      },

      getItemsSizesLastRow: function(self, items, newOptions, counterWidth) {
         var
            itemsCount,
            collectionItems,
            itemsSizes = [],
            measurer = document.createElement('div'),
            maxVisibleItems = newOptions.multiLine ? newOptions.maxVisibleItems : items.length,
            visibleItems = _private.getLastSelectedItems(self, maxVisibleItems);

         measurer.innerHTML = itemsTemplate({
            _options: _private.getCollectionOptions({
               itemTemplate: newOptions.itemTemplate,
               readOnly: newOptions.readOnly,
               displayProperty: newOptions.displayProperty,
               maxVisibleItems: maxVisibleItems,
               _counterWidth: counterWidth
            }),
            _items: items,
            _visibleItems: visibleItems
         });

         if (newOptions.multiLine) {
            measurer.style.width = DOMUtil.width(self._fieldWrapper) - SHOW_SELECTOR_WIDTH + 'px';
         }

         measurer.classList.add('controls-Lookup-collection__measurer');
         document.body.appendChild(measurer);
         collectionItems = measurer.getElementsByClassName('controls-SelectedCollection__item');
         itemsCount = collectionItems.length;

         // items only from the last line
         for (var index = itemsCount - 1; index >= 0 &&
            collectionItems[index].offsetTop === collectionItems[itemsCount - 1].offsetTop; index--) {

            itemsSizes.unshift(Math.ceil(collectionItems[index].getBoundingClientRect().width));
         }

         document.body.removeChild(measurer);

         return itemsSizes;
      },

      getCollectionWidth: function(itemsSizes) {
         return itemsSizes.reduce(function(currentWidth, itemWidth) {
            return currentWidth + itemWidth;
         }, 0);
      },

      getCollectionOptions: function(config) {
         return merge(config, Collection.getDefaultOptions(), {
            preferSource: true
         });
      },

      getLastSelectedItems: function(self, itemsCount) {
         return Chain(self._options.items).last(itemsCount).value();
      },

      isShowCounter: function(itemsCount, maxVisibleItems) {
         return itemsCount > maxVisibleItems;
      },

      getLastRowCollectionWidth: function(itemsSizesLastRow, isShowCounter, allItemsInOneRow, counterWidth) {
         var lastRowCollectionWidth = _private.getCollectionWidth(itemsSizesLastRow);

         if (isShowCounter && allItemsInOneRow) {
            lastRowCollectionWidth += counterWidth;
         }

         return lastRowCollectionWidth;
      },

      getInputWidth: function(fieldWrapperWidth, lastRowCollectionWidth, availableWidth) {
         if (lastRowCollectionWidth <= availableWidth) {
            return fieldWrapperWidth - lastRowCollectionWidth - SHOW_SELECTOR_WIDTH;
         }
      },

      getMultiLineState: function(lastRowCollectionWidth, availableWidth, allItemsInOneRow) {
         return lastRowCollectionWidth > availableWidth || !allItemsInOneRow;
      }
   };

   var Lookup = Control.extend({
      _template: template,
      _notifyHandler: tmplNotify,
      _suggestState: false,
      _simpleViewModel: null,
      _availableWidthCollection: null,
      _infoboxOpened: false,

      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,

      _beforeMount: function(options) {
         this._simpleViewModel = new BaseViewModel({
            value: options.value
         });
      },

      _afterMount: function() {
         _private.initializeConstants();
         _private.initializeContainers(this);

         if (this._options.items.getCount()) {
            _private.calculatingSizes(this, this._options);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         var
            currentOptions = this._options,
            isNeedCalculatingSizes = !isEqual(newOptions.selectedKeys, this._options.selectedKeys),
            listOfDependentOptions = ['multiSelect', 'multiLine', 'source', 'displayProperty', 'maxVisibleItems'];

         _private.updateModel(this, newOptions.value);

         if (!isNeedCalculatingSizes) {
            listOfDependentOptions.forEach(function(optName) {
               if (newOptions[optName] !== currentOptions[optName]) {
                  isNeedCalculatingSizes = true;
               }
            });
         }

         if (isNeedCalculatingSizes) {
            _private.calculatingSizes(this, newOptions);
         }
      },

      _afterUpdate: function() {
         if (this._needSetFocusInInput) {
            this._needSetFocusInInput = false;

            /* focus can be moved in choose event */
            if (this._active) {
               this.activate();
            }
         }
      },

      _beforeUnmount: function() {
         this._simpleViewModel = null;
      },

      _changeValueHandler: function(event, value) {
         _private.notifyValue(this, value);
      },

      _choose: function(event, item) {
         this._notify('addItem', [item]);

         if (this._simpleViewModel.getValue() !== '') {
            _private.notifyValue(this, '');
         }

         /* move focus to input after select, because focus will be lost after closing popup,
          * only in multi-select mode, in single-select mode input is not displayed after selecting a item */
         this._options.multiSelect && this.activate();
      },

      _crossClick: function(event, item) {
         this._notify('removeItem', [item]);

         /* move focus to input after remove, because focus will be lost after removing dom element */
         this._needSetFocusInInput = true;
      },

      _deactivated: function() {
         this._suggestState = false;
      },

      _suggestStateChanged: function() {
         if (this._options.readOnly || this._infoboxOpened) {
            this._suggestState = false;
         }
      },

      _determineAutoDropDown: function() {
         return this._options.autoDropDown && (this._isEmpty() || this._options.multiSelect);
      },

      _isEmpty: function() {
         return !this._options.items.getCount();
      },
      
      _openInfoBox: function() {
         this._suggestState = false;
         this._infoboxOpened = true;
      },
   
      _closeInfoBox: function() {
         this._infoboxOpened = false;
      },

      _onClickShowSelector: function() {
         this._notify('showSelector');
      },

      _onClickClearRecords: function() {
         this._notify('updateItems', [[]]);
      },

      _itemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });

   Lookup.getDefaultOptions = function() {
      return {
         displayProperty: 'title',
         multiSelect: false,
         maxVisibleItems: 7
      };
   };

   Lookup._private = _private;
   return Lookup;
});
