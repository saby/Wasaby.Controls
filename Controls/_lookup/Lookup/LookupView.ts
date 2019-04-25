import BaseLookupView = require('Controls/_lookup/BaseLookupView');
import chain = require('Types/chain');
import merge = require('Core/core-merge');
import getWidthUtil = require('Controls/Utils/getWidth');
import Collection = require('Controls/_lookup/SelectedCollection');
import itemsTemplate = require('wml!Controls/_lookup/SelectedCollection/SelectedCollection');
import selectedCollectionUtils = require('Controls/_lookup/SelectedCollection/Utils');
import Env = require('Env/Env');
import inputWml = require('wml!Controls/Input/resources/input');
import ContentTemplate = require('wml!Controls/_lookup/SelectedCollection/_ContentTemplate');
import CrossTemplate = require('wml!Controls/_lookup/SelectedCollection/_CrossTemplate');
import CounterTemplate = require('wml!Controls/_lookup/SelectedCollection/CounterTemplate');


   var
      MAX_VISIBLE_ITEMS = 20,
      SHOW_SELECTOR_WIDTH = 0,
      CLEAR_RECORDS_WIDTH = 0,
      LIST_OF_DEPENDENT_OPTIONS = ['multiSelect', 'multiLine', 'items', 'displayProperty', 'maxVisibleItems', 'readOnly'];

   var _private = {
      initializeConstants: function(self) {
         if (!SHOW_SELECTOR_WIDTH) {
            SHOW_SELECTOR_WIDTH = getWidthUtil.getWidth(self._showSelectorTemplate());
            CLEAR_RECORDS_WIDTH = getWidthUtil.getWidth(self._clearRecordsTemplate());
         }
      },

      getCounterWidth: function(itemsCount) {
         return selectedCollectionUtils.getCounterWidth(itemsCount);
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

      getAvailableCollectionWidth: function(fieldWrapper, fieldWrapperWidth, afterFieldWrapperWidth, readOnly, multiSelect) {
         var additionalWidth = afterFieldWrapperWidth;

         if (!readOnly && multiSelect) {
            additionalWidth += _private.getInputMinWidth(fieldWrapper.offsetWidth, afterFieldWrapperWidth);
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

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth) {
         /* By the standard, the minimum input field width is 33%, but not more than 100 */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 100 * 33;

         return Math.min(minWidthFieldWrapper, 100);
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
      }
   };

   var LookupView = BaseLookupView.extend({
      _availableWidthCollection: null,
      _fieldWrapperWidth: null,
      _maxVisibleItems: null,

      _beforeMount: function() {
         LookupView.superclass._beforeMount.apply(this, arguments);
         this._listOfDependentOptions = LIST_OF_DEPENDENT_OPTIONS;
      },

      _afterMount: function() {
         _private.initializeConstants(this);
         LookupView.superclass._afterMount.apply(this, arguments);
      },

      _isNeedUpdate: function() {
         var options = this._options;

         return options.multiSelect &&
            (options.multiLine || !options.readOnly || options.items.getCount() > this._maxVisibleItems);
      },

      _isNeedCalculatingSizes: function(options) {
         // not calculating sizes in a single choice or with records no more than 1 in read mode, because calculations will be on css styles
         return !this._isEmpty(options) && options.multiSelect && (!options.readOnly || options.items.getCount() > 1);
      },

      _calculatingSizes: function(newOptions) {
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

         if (this._isNeedCalculatingSizes(newOptions)) {
            // in mode read only and single line, counter does not affect the collection
            if (isShowCounter && (!newOptions.readOnly || newOptions.multiLine)) {
               counterWidth = _private.getCounterWidth(itemsCount);
            }

            fieldWrapperWidth = this._getFieldWrapperWidth();
            lastSelectedItems = _private.getLastSelectedItems(newOptions.items, MAX_VISIBLE_ITEMS);
            itemsSizesLastRow = _private.getItemsSizesLastRow(fieldWrapperWidth, lastSelectedItems, newOptions, counterWidth);
            allItemsInOneRow = !newOptions.multiLine || itemsSizesLastRow.length === Math.min(lastSelectedItems.length, maxVisibleItems);
            afterFieldWrapperWidth = _private.getAfterFieldWrapperWidth(itemsCount, !allItemsInOneRow, newOptions.readOnly);
            availableWidth = _private.getAvailableCollectionWidth(this._fieldWrapper, fieldWrapperWidth, afterFieldWrapperWidth, newOptions.readOnly, newOptions.multiSelect);

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

         this._multiLineState = multiLineState;
         this._inputWidth = inputWidth;
         this._maxVisibleItems = maxVisibleItems;
         this._availableWidthCollection = availableWidth;
         this._counterWidth = counterWidth;
      },

      _isInputVisible: function(options) {
         return !options.readOnly && (this._isEmpty(options) || options.multiSelect);
      }
   });

   LookupView.getDefaultOptions = function() {
      return {
         value: '',
         displayProperty: 'title',
         multiSelect: false,
         maxVisibleItems: 7
      };
   };

   LookupView._private = _private;
   export = LookupView;
