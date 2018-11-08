define('Controls/Input/Lookup/_Lookup', [
   'Core/Control',
   'wml!Controls/Input/Lookup/_Lookup/_Lookup',
   'Controls/Input/resources/InputRender/BaseViewModel',
   'WS.Data/Chain',
   'Core/core-merge',
   'Controls/Utils/getWidth',
   'Controls/Utils/DOMUtil',
   'Controls/SelectedCollection',
   'wml!Controls/SelectedCollection/SelectedCollection',
   'wml!Controls/Input/Lookup/resources/clearRecordsTemplate',
   'wml!Controls/Input/Lookup/resources/showSelectorTemplate',
   'wml!Controls/Input/resources/input',
   'css!Controls/Input/Lookup/_Lookup/_Lookup'
], function(Control, template, BaseViewModel, Chain, merge, getWidthUtil, DOMUtil, Collection, itemsTemplate, clearRecordsTemplate, showSelectorTemplate) {

   'use strict';

   /**
    * Input for selection from source.
    *
    * @class Controls/Input/Lookup
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IFilter
    * @mixes Controls/Input/interface/ISuggest
    * @mixes Controls/Input/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IValidation
    * @control
    * @public
    * @author Журавлев М.С.
    * @category Input
    */

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
         var inputRenderContainer = self._children.inputRender._container;
         self._wrapperInputRender = inputRenderContainer.getElementsByClassName('controls-InputRender__wrapper')[0];
      },

      notifyValue: function(self, value) {
         self._notify('valueChanged', [value]);
      },

      updateModel: function(self, value) {
         self._simpleViewModel.updateOptions({
            value: value
         });
      },

      getMaxVisibleItems: function(items, itemsSizes, availableWidth) {
         var
            maxVisibleItems = 0,
            visibleItemsWidth = 0,
            itemsCount = items.length,
            collectionWidth = itemsSizes.reduce(function(currentWidth, itemWidth) {
               return currentWidth + itemWidth;
            }, 0);

         if (collectionWidth <= availableWidth) {
            maxVisibleItems = items.length;
         } else {
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

      getAfterFieldWrapperWidth: function(itemsCount, multiline, readOnly) {
         var afterFieldWrapperWidth = 0;

         if (!readOnly) {
            afterFieldWrapperWidth += SHOW_SELECTOR_WIDTH;
         }

         if (!multiline && itemsCount > 1) {
            afterFieldWrapperWidth += CLEAR_RECORDS_WIDTH;
         }

         return afterFieldWrapperWidth;
      },

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth) {
         /* By the standard, the minimum input field width is 33%, but not more than 100 */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 100 * 33;

         return Math.min(minWidthFieldWrapper, 100);
      },

      getItemsSizes: function(self, items, newOptions) {
         var
            collectionItems,
            itemsSizes = [],
            measurer = document.createElement('div'),
            maxVisibleItems = newOptions.multiline ? newOptions.maxVisibleItems : items.length;

         measurer.innerHTML = itemsTemplate({
            _options: _private.getCollectionOptions({
               items: items,
               itemTemplate: newOptions.itemTemplate,
               readOnly: newOptions.readOnly,
               displayProperty: newOptions.displayProperty,
               maxVisibleItems: maxVisibleItems,
               _counterWidth: newOptions._counterWidth
            }),
            _visibleItems: _private.getLastSelectedItems(self, maxVisibleItems)
         });

         if (newOptions.multiline) {
            measurer.style.width = self._wrapperInputRender.offsetWidth + 'px';
         }

         measurer.classList.add('controls-Lookup-collection__measurer');
         document.body.appendChild(measurer);

         collectionItems = measurer.getElementsByClassName('controls-SelectedCollection__collection')[0].children;

         for (var index = collectionItems.length - 1; index >= 0 && collectionItems[index].offsetTop === collectionItems[collectionItems.length - 1].offsetTop; index--) {
            itemsSizes.push(Math.ceil(collectionItems[index].getBoundingClientRect().width));
         }

         document.body.removeChild(measurer);

         return itemsSizes;
      },

      getCollectionOptions: function(config) {
         return merge(config, Collection.getDefaultOptions(), {
            preferSource: true
         });
      },

      getLastSelectedItems: function(self, itemsCount) {
         return Chain(self._options.items).last(itemsCount).value();
      }
   };

   var Lookup = Control.extend({
      _template: template,

      _suggestState: false,
      _simpleViewModel: null,
      _availableWidthCollection: null,

      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,

      _beforeMount: function(options) {
         this._selectCallback = this._selectCallback.bind(this);
         this._onClosePickerBind = this._onClosePicker.bind(this);
         this._simpleViewModel = new BaseViewModel({
            value: options.value
         });
      },

      _afterMount: function() {
         _private.initializeConstants();
         _private.initializeContainers(this);

         if (!this._isEmpty()) {
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         var
            self = this,
            maxVisibleItems = 0,
            afterFieldWrapperWidth = 0,
            inputWidth, collectionWidth,
            itemsSizes, availableWidth, lastSelectedItems;

         _private.updateModel(this, newOptions.value);

         if (newOptions.items.getCount()) {
            lastSelectedItems = _private.getLastSelectedItems(this, MAX_VISIBLE_ITEMS);
            itemsSizes = _private.getItemsSizes(this, lastSelectedItems, newOptions);
            afterFieldWrapperWidth = _private.getAfterFieldWrapperWidth(newOptions.items.getCount(), newOptions.multiline, newOptions.readOnly);
            availableWidth = _private.getAvailableCollectionWidth(this._children.inputRender._container, afterFieldWrapperWidth, newOptions.readOnly, newOptions.multiSelect);

            if (newOptions.multiline) {
               maxVisibleItems = newOptions.maxVisibleItems;
               collectionWidth = itemsSizes.reduce(function(currentWidth, itemWidth) {
                  return currentWidth + itemWidth;
               }, 0);

               if (collectionWidth <= availableWidth) {
                  inputWidth = (self._wrapperInputRender.getBoundingClientRect().width ^ 0) - collectionWidth;
               }
            } else {
               maxVisibleItems = _private.getMaxVisibleItems(lastSelectedItems, itemsSizes, availableWidth);
            }
         }

         this._inputWidth = inputWidth;
         this._maxVisibleItems = maxVisibleItems;
         this._availableWidthCollection = availableWidth;
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

      _onClosePicker: function() {
         this._isPickerVisible = false;
         this._forceUpdate();
      },

      _beforeUnmount: function() {
         this._simpleViewModel = null;
      },

      _getItemsInArray: function() {
         return Chain(this._options.items).value();
      },

      _showSelector: function(templateOptions) {
         var
            self = this,
            multiSelect = this._options.multiSelect,
            selectorOpener = this._children.selectorOpener;

         templateOptions = merge(templateOptions || {}, {
            selectedItems: multiSelect ? this._options.items : null,
            multiSelect: multiSelect,
            handlers: {
               onSelectComplete: function(event, result) {
                  self._selectCallback(result);
                  selectorOpener.close();
               }
            }
         }, {clone: true});

         selectorOpener.open({
            opener: self,
            isCompoundTemplate: this._options.isCompoundTemplate,
            templateOptions: merge(this._options.lookupTemplate.templateOptions || {}, templateOptions, {clone: true})
         });
      },

      _changeValueHandler: function(event, value) {
         _private.notifyValue(this, value);

         //this._togglePicker(null, false);
      },

      _choose: function(event, item) {
         this._notify('addItem', [item]);
         _private.notifyValue(this, '');

         /* move focus to input after select, because focus will be lost after closing popup  */
         this.activate();
      },

      _crossClick: function(event, item) {
         this._notify('removeItem', [item]);

         /* move focus to input after remove, because focus will be lost after removing dom element  */
         this._needSetFocusInInput = true;
      },

      _deactivated: function() {
         this._suggestState = false;

         //this._togglePicker(null, false);
      },

      _suggestStateChanged: function() {
         if (this._isPickerVisible || this._options.readOnly) {
            this._suggestState = false;
         }
      },

      _determineAutoDropDown: function() {
         return this._options.autoDropDown && (this._isEmpty() || this._options.multiSelect);
      },

      _isEmpty: function() {
         return !this._options.items.getCount();
      },

      _onClickShowSelector: function() {
         this._showSelector();
      },

      _onClickClearRecords: function() {
         this._notify('updateItems', [[]]);
      },

      _selectCallback: function(result) {
         this._notify('updateItems', [result]);
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
