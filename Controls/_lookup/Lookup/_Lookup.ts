import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Lookup/_Lookup');
import chain = require('Types/chain');
import merge = require('Core/core-merge');
import getWidthUtil = require('Controls/Utils/getWidth');
import DOMUtil = require('Controls/Utils/DOMUtil');
import Collection = require('Controls/_lookup/SelectedCollection');
import itemsTemplate = require('wml!Controls/_lookup/SelectedCollection/SelectedCollection');
import clearRecordsTemplate = require('wml!Controls/_lookup/Lookup/resources/clearRecordsTemplate');
import showSelectorTemplate = require('wml!Controls/_lookup/Lookup/resources/showSelectorTemplate');
import tmplNotify = require('Controls/Utils/tmplNotify');
import isEqual = require('Core/helpers/Object/isEqual');
import selectedCollectionUtils = require('Controls/_lookup/SelectedCollection/Utils');
import Env = require('Env/Env');
import inputWml = require('wml!Controls/Input/resources/input');
import ContentTemplate = require('wml!Controls/_lookup/SelectedCollection/_ContentTemplate');
import CrossTemplate = require('wml!Controls/_lookup/SelectedCollection/_CrossTemplate');
import CounterTemplate = require('wml!Controls/_lookup/SelectedCollection/CounterTemplate');

import 'css!theme?Controls/lookup';


   var
      MAX_VISIBLE_ITEMS = 20,
      SHOW_SELECTOR_WIDTH = 0,
      CLEAR_RECORDS_WIDTH = 0,
      KEY_KODE_F2 = 113;

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
      },

      notifyValue: function(self, value) {
         self._notify('valueChanged', [value]);
      },

      getFieldWrapperWidth: function(self, recount) {
         if (self._fieldWrapperWidth === null || recount) {

            // we cache width, since used in several places in the calculations and need to compare when resize
            self._fieldWrapperWidth = DOMUtil.width(self._fieldWrapper);
         }

         return self._fieldWrapperWidth;
      },

      getFieldWrapperMinHeight: function(self) {
         var fieldWrapperStyles;

         if (self._fieldWrapperMinHeight === null) {
            fieldWrapperStyles = getComputedStyle(self._fieldWrapper);
            self._fieldWrapperMinHeight = parseInt(fieldWrapperStyles['min-height'], 10) || parseInt(fieldWrapperStyles['height'], 10);
         }

         return self._fieldWrapperMinHeight;
      },

      isNeedCalculatingSizes: function(options) {
         var itemsCount = options.items.getCount();

         // not calculating sizes in a single choice or with records no more than 1 in read mode, because calculations will be on css styles
         return itemsCount > 0 && options.multiSelect && (!options.readOnly || itemsCount > 1);
      },

      getCounterWidth: function(itemsCount) {
         return selectedCollectionUtils.getCounterWidth(itemsCount);
      },

      calculatingSizes: function(self, newOptions) {
         var
            counterWidth,
            fieldWrapperWidth,
            allItemsInOneRow = false,
            maxVisibleItems = newOptions.maxVisibleItems,
            afterFieldWrapperWidth = 0,
            inputWidth, lastRowCollectionWidth,
            itemsSizesLastRow, availableWidth, lastSelectedItems,
            itemsCount = newOptions.items.getCount(),
            multiLineState = newOptions.multiLine && itemsCount,
            isShowCounter = _private.isShowCounter(multiLineState, itemsCount, maxVisibleItems);

         if (_private.isNeedCalculatingSizes(newOptions)) {
            // in mode read only and single line, counter does not affect the collection
            if (isShowCounter && (!newOptions.readOnly || newOptions.multiLine)) {
               counterWidth = _private.getCounterWidth(itemsCount);
            }

            fieldWrapperWidth = _private.getFieldWrapperWidth(self);
            lastSelectedItems = _private.getLastSelectedItems(newOptions.items, MAX_VISIBLE_ITEMS);
            itemsSizesLastRow = _private.getItemsSizesLastRow(fieldWrapperWidth, lastSelectedItems, newOptions, counterWidth);
            allItemsInOneRow = !newOptions.multiLine || itemsSizesLastRow.length === Math.min(lastSelectedItems.length, maxVisibleItems);
            afterFieldWrapperWidth = _private.getAfterFieldWrapperWidth(itemsCount, !allItemsInOneRow, newOptions.readOnly);
            availableWidth = _private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, newOptions.readOnly, newOptions.multiSelect);

            //For multi line define - inputWidth, for single line - maxVisibleItems
            if (newOptions.multiLine) {
               lastRowCollectionWidth = _private.getLastRowCollectionWidth(itemsSizesLastRow, isShowCounter, allItemsInOneRow, counterWidth);
               inputWidth = _private.getInputWidth(fieldWrapperWidth, lastRowCollectionWidth, availableWidth);
               multiLineState = _private.getMultiLineState(lastRowCollectionWidth, availableWidth, allItemsInOneRow);
            } else {
               maxVisibleItems = _private.getMaxVisibleItems(lastSelectedItems, itemsSizesLastRow, availableWidth, counterWidth);
            }
         } else {
            multiLineState = false;
            maxVisibleItems = itemsCount;
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

      getAvailableCollectionWidth: function(self, afterFieldWrapperWidth, readOnly, multiSelect) {
         var
            additionalWidth = afterFieldWrapperWidth,

            // we get the height of a single-line Lookup control, which would then calculate the minimum width of the input
            fieldWrapperMinHeight = _private.getFieldWrapperMinHeight(self),
            fieldWrapperWidth = _private.getFieldWrapperWidth(self);

         if (!readOnly && multiSelect) {
            additionalWidth += _private.getInputMinWidth(self._fieldWrapper.offsetWidth, afterFieldWrapperWidth, fieldWrapperMinHeight);
         }

         return fieldWrapperWidth - additionalWidth;
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

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth, fieldWrapperMinHeight) {
         /* By the standard, the minimum input field width is 33%, but not more than 4 field wrapper min height */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 3;

         return Math.min(minWidthFieldWrapper, 4 * fieldWrapperMinHeight);
      },

      getItemsSizesLastRow: function(fieldWrapperWidth, items, newOptions, counterWidth) {
         var
            itemsCount,
            collectionItems,
            itemsSizes = [],
            measurer = document.createElement('div'),
            maxVisibleItems = newOptions.multiLine ? newOptions.maxVisibleItems : items.length,
            visibleItems = _private.getLastSelectedItems(newOptions.items, maxVisibleItems);

         measurer.innerHTML = itemsTemplate({
            _options: _private.getCollectionOptions({
               itemTemplate: newOptions.itemTemplate,
               readOnly: newOptions.readOnly,
               displayProperty: newOptions.displayProperty,
               maxVisibleItems: maxVisibleItems,
               _counterWidth: counterWidth
            }),
            _items: items,
            _visibleItems: visibleItems,
            _getItemMaxWidth: selectedCollectionUtils.getItemMaxWidth,
            _contentTemplate: ContentTemplate,
            _crossTemplate: CrossTemplate,
            _counterTemplate: CounterTemplate
         });

         if (newOptions.multiLine) {
            measurer.style.width = fieldWrapperWidth - SHOW_SELECTOR_WIDTH + 'px';
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

      getLastSelectedItems: function(items, itemsCount) {
         return chain.factory(items).last(itemsCount).value();
      },

      isShowCounter: function(multiLine, itemsCount, maxVisibleItems) {
         return multiLine && itemsCount > maxVisibleItems || !multiLine && itemsCount > 1;
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
      },

      isNeedUpdate: function(multiSelect, itemsCount, multiLine, readOnly, maxVisibleItems) {
         return multiSelect && (multiLine || !readOnly || itemsCount > maxVisibleItems);
      }
   };

   var Lookup = Control.extend({
      _template: template,
      _notifyHandler: tmplNotify,
      _inputValue: '',
      _suggestState: false,
      _availableWidthCollection: null,
      _infoboxOpened: false,
      _fieldWrapperWidth: null,
      _fieldWrapperMinHeight: null,
      _maxVisibleItems: null,
      _clearRecordsTemplate: clearRecordsTemplate,
      _showSelectorTemplate: showSelectorTemplate,
      _contentTemplate: ContentTemplate,
      _crossTemplate: CrossTemplate,
      _counterTemplate: CounterTemplate,
      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,

      _beforeMount: function(options) {
         this._inputValue = options.value;

         // To draw entries you need to calculate the size, but in readOnly or multiSelect: false can be drawn without calculating the size
         if (!options.multiSelect) {
            this._maxVisibleItems = 1;
         } else if (options.readOnly) {
            if (options.multiLine) {
               this._maxVisibleItems = options.maxVisibleItems;
            } else {
               this._maxVisibleItems = options.items.getCount();
            }
         }
      },

      _afterMount: function() {
         var itemsCount = this._options.items.getCount();

         _private.initializeConstants();
         _private.initializeContainers(this);

         if (itemsCount) {
            _private.calculatingSizes(this, this._options);

            if (_private.isNeedUpdate(this._options.multiSelect, itemsCount, this._options.multiLine, this._options.readOnly, this._maxVisibleItems)) {
               this._forceUpdate();
            }
         }
      },

      _beforeUpdate: function(newOptions) {
         var
            currentOptions = this._options,
            isNeedUpdate = !isEqual(newOptions.selectedKeys, this._options.selectedKeys),
            listOfDependentOptions = ['multiSelect', 'multiLine', 'items', 'displayProperty', 'maxVisibleItems', 'readOnly'];

         if (newOptions.value !== this._options.value) {
            this._inputValue = newOptions.value;
         }

         if (!isNeedUpdate) {
            listOfDependentOptions.forEach(function(optName) {
               if (newOptions[optName] !== currentOptions[optName]) {
                  isNeedUpdate = true;
               }
            });
         }


         if (isNeedUpdate) {
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

         if (!this._isInputVisible()) {
            this._suggestState = false;
         }
      },

      _changeValueHandler: function(event, value) {
         this._inputValue = value;
         _private.notifyValue(this, value);
      },

      _choose: function(event, item) {
         /* move focus to input after select, because focus will be lost after closing popup,
         * only in multi-select mode, in single-select mode input is not displayed after selecting a item.
         * !!! activate must called before changing the collection of selected items,
         * because user can change focus in itemsChanged event. */
         if (this._options.multiSelect) {
            this.activate();
         }

         this._notify('addItem', [item]);

         if (this._inputValue !== '') {
            this._inputValue = '';
            _private.notifyValue(this, '');
         }
      },

      _crossClick: function(event, item) {
         this._notify('removeItem', [item]);

         /* move focus to input after remove, because focus will be lost after removing dom element */
         this._needSetFocusInInput = true;
      },

      _resize: function() {
         var
            oldFieldWrapperWidth = _private.getFieldWrapperWidth(this),
            newFieldWrapperWidth = _private.getFieldWrapperWidth(this, true);

         if (_private.isNeedCalculatingSizes(this._options) && newFieldWrapperWidth !== oldFieldWrapperWidth) {
            _private.calculatingSizes(this, this._options);
            this._forceUpdate();
         }
      },

      _deactivated: function() {
         this._suggestState = false;
      },

      _suggestStateChanged: function() {
         if (this._infoboxOpened || !this._isInputVisible()) {
            this._suggestState = false;
         }
      },

      _determineAutoDropDown: function() {
         return this._options.autoDropDown && this._isInputVisible();
      },

      _isEmpty: function() {
         return !this._options.items.getCount();
      },

      _isInputVisible: function() {
         return !this._options.readOnly && (this._isEmpty() || this._options.multiSelect);
      },

      _openInfoBox: function(event, config) {
         config.maxWidth = this._container.offsetWidth;
         this._suggestState = false;
         this._infoboxOpened = true;
      },

      _closeInfoBox: function() {
         this._infoboxOpened = false;
      },

      _onClickShowSelector: function() {
         this._suggestState = false;
         this._notify('showSelector');
      },

      _onClickClearRecords: function() {
         this._notify('updateItems', [[]]);

         // When click on the button, it disappears from the layout and the focus is lost, we return the focus to the input field.
         this.activate();
      },

      _itemClick: function(event, item) {
         this._notify('itemClick', [item]);
      },

      _keyDown: function(event, keyboardEvent) {
         var
            items = this._options.items,
            keyCodeEvent = keyboardEvent.nativeEvent.keyCode;

         if (keyCodeEvent === KEY_KODE_F2) {
            this._notify('showSelector');
         } else if (keyCodeEvent === Env.constants.key.backspace &&
            !this._inputValue && !this._isEmpty()) {

            //If press backspace, the input field is empty and there are selected entries -  remove last item
            this._notify('removeItem', [items.at(items.getCount() - 1)]);
         }
      }
   });

   Lookup.getDefaultOptions = function() {
      return {
         value: '',
         displayProperty: 'title',
         multiSelect: false,
         maxVisibleItems: 7
      };
   };

   Lookup._private = _private;
   export = Lookup;

