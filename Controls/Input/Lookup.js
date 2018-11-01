define('Controls/Input/Lookup', [
   'Core/Control',
   'wml!Controls/Input/Lookup/Lookup',
   'Controls/Input/resources/InputRender/BaseViewModel',
   'Controls/Controllers/SourceController',
   'WS.Data/Collection/List',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'Core/Deferred',
   'Core/core-merge',
   'WS.Data/Chain',
   'Controls/Utils/getWidth',
   'Controls/Utils/DOMUtil',
   'Controls/Input/Lookup/_Collection',
   'wml!Controls/Input/Lookup/Collection/_Collection',
   'wml!Controls/Input/Lookup/resources/showAllLinksTemplate',
   'wml!Controls/Input/Lookup/resources/showSelectorTemplate',
   'wml!Controls/Input/resources/input',
   'css!Controls/Input/Lookup/Lookup'
], function(Control, template, BaseViewModel, SourceController, List, isEqual, clone, Deferred, merge, Chain, getWidthUtil, DOMUtil, Collection, itemsTemplate, showAllLinksTemplate, showSelectorTemplate) {

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
      SHOW_ALL_LINKS_WIDTH = 0,
      SHOW_SELECTOR_WIDTH = 0;

   var _private = {
      initializeConstants: function() {
         if (!SHOW_ALL_LINKS_WIDTH) {
            SHOW_ALL_LINKS_WIDTH = getWidthUtil.getWidth(showAllLinksTemplate());
            SHOW_SELECTOR_WIDTH = getWidthUtil.getWidth(showSelectorTemplate());
         }
      },

      loadItems: function(self, filter, keyProperty, selectedKeys, source, sourceIsChanged) {
         var filter = clone(filter || {});
         var resultDef = new Deferred();

         filter[keyProperty] = selectedKeys;

         if (sourceIsChanged || !self.sourceController) {
            self.sourceController = new SourceController({
               source: source
            });
         }
         self.sourceController.load(filter)
            .addCallback(function(result) {
               resultDef.callback(self._items = result);
               _private.notifyItemsChanged(self, result);
               return result;
            })
            .addErrback(function(result) {
               resultDef.callback(null);
               return result;
            });

         return resultDef;
      },

      notifyChanges: function(self, selectedKeys) {
         _private.notifySelectedKeys(self, selectedKeys);
         _private.notifyItemsChanged(self, _private.getItems(self));
      },

      notifyItemsChanged: function(self, items) {
         self._notify('itemsChanged', [items]);
      },

      notifySelectedKeys: function(self, selectedKeys) {
         self._notify('selectedKeysChanged', [selectedKeys]);
      },

      notifyValue: function(self, value) {
         self._notify('valueChanged', [value]);
      },

      getItems: function(self) {
         if (!self._items) {
            self._items = new List();
         }
         return self._items;
      },

      addItem: function(self, item) {
         var
            selectedKeys = self._selectedKeys,
            key = item.get(self._options.keyProperty);

         if (self._selectedKeys.indexOf(key) === -1) {
            if (self._options.multiSelect) {
               selectedKeys.push(key);
               _private.setSelectedKeys(self, selectedKeys);
               _private.getItems(self).append([item]);
            } else {
               _private.setSelectedKeys(self, [key]);
               _private.getItems(self).assign([item]);
            }

            _private.notifyChanges(self, self._selectedKeys);
         }
      },

      removeItem: function(self, item) {
         var
            selectedKeys = self._selectedKeys.slice(),
            key = item.get(self._options.keyProperty),
            indexItem = self._selectedKeys.indexOf(key);

         if (indexItem !== -1) {
            selectedKeys.splice(indexItem, 1);
            _private.setSelectedKeys(self, selectedKeys);
            _private.getItems(self).remove(item);
            _private.notifyChanges(self, self._selectedKeys);
         }
      },

      setSelectedKeys: function(self, keys) {
         self._selectedKeys = keys;
         _private.keysChanged(self);
      },

      updateModel: function(self, value) {
         self._simpleViewModel.updateOptions({
            value: value
         });
      },

      setStateOnKeysChanged: function(self) {
         self._isEmpty = !self._selectedKeys.length;

         /* keys changed - need to hide suggest */
         if (!self._isEmpty) {
            self._suggestState = false;
         }
      },

      keysChanged: function(self) {
         _private.setStateOnKeysChanged(self);
         self._forceUpdate();
      },

      getVisibleItems: function(items, itemsSizes, availableWidth) {
         var
            visibleItems = [],
            visibleItemsWidth = 0,
            itemsCount = items.length,
            collectionWidth = itemsSizes.reduce(function(currentWidth, itemWidth) {
               return currentWidth + itemWidth;
            }, 0);

         if (collectionWidth <= availableWidth) {
            visibleItems = items;
         } else {
            /* Consider the width of the button that shows all the records */
            visibleItemsWidth = SHOW_ALL_LINKS_WIDTH;

            for (var currentIndex = itemsCount - 1; currentIndex >= 0; currentIndex--) {
               if ((visibleItemsWidth + itemsSizes[currentIndex]) > availableWidth) {
                  /* If no element is inserted, then only the last selected */
                  if (!visibleItems.length) {
                     visibleItems.push(items[currentIndex]);
                  }
                  break;
               }

               visibleItems.unshift(items[currentIndex]);
               visibleItemsWidth += itemsSizes[currentIndex];
            }
         }

         return visibleItems;
      },

      getAvailableCollectionWidth: function(fieldWrapper, readOnly, multiSelect) {
         return DOMUtil.width(fieldWrapper) - _private.getAdditionalCollectionWidth(fieldWrapper, readOnly, multiSelect);
      },

      getAdditionalCollectionWidth: function(fieldWrapper, readOnly, multiSelect) {
         var additionalWidth = 0;

         if (!readOnly) {
            additionalWidth = SHOW_SELECTOR_WIDTH;

            if (multiSelect) {
               additionalWidth += _private.getInputMinWidth(fieldWrapper.offsetWidth, SHOW_SELECTOR_WIDTH);
            }
         }

         return additionalWidth;
      },

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth) {
         /* By the standard, the minimum input field width is 33%, but not more than 100 */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 100 * 33;

         return Math.min(minWidthFieldWrapper, 100);
      },

      getItemsSizes: function(self, items, itemTemplate, readOnly) {
         var
            itemsSizes = [],
            measurer = document.createElement('div');

         measurer.innerHTML = itemsTemplate({
            _options: _private.getCollectionOptions(items, itemTemplate, readOnly)
         });

         measurer.classList.add('controls-Lookup-collection__measurer');
         document.body.appendChild(measurer);
         [].forEach.call(measurer.getElementsByClassName('controls-Lookup__item'), function(item) {
            itemsSizes.push(item.clientWidth);
         });
         document.body.removeChild(measurer);

         return itemsSizes;
      },

      getCollectionOptions: function(items, itemTemplate, readOnly) {
         return merge({
            items: items,
            itemTemplate: itemTemplate,
            readOnly: readOnly
         }, Collection.getDefaultOptions(), {
            preferSource: true
         });
      },

      getLastSelectedItems: function(self, itemsCount) {
         var
            lastSelectedItems = Chain(_private.getItems(self)).toArray(),
            selectedItemsCount = lastSelectedItems.length;

         if (selectedItemsCount > itemsCount) {
            lastSelectedItems = lastSelectedItems.slice(selectedItemsCount - itemsCount);
         }

         return lastSelectedItems;
      }
   };

   var Lookup = Control.extend({
      _template: template,

      _suggestState: false,
      _selectedKeys: null,
      _simpleViewModel: null,
      _isEmpty: true,
      _availableWidthCollection: null,
      _isAllRecordsDisplay: true,
      _autoDropDown: false,

      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,

      _beforeMount: function(options, context, receivedState) {
         this._onClosePickerBind = this._onClosePicker.bind(this);
         this._simpleViewModel = new BaseViewModel({
            value: options.value
         });
         this._selectedKeys = options.selectedKeys.slice();
         this._selectCallback = this._selectCallback.bind(this);

         if (this._selectedKeys.length) {
            _private.setStateOnKeysChanged(this);

            if (receivedState) {
               this._items = receivedState;
            } else {
               return _private.loadItems(this, options.filter, options.keyProperty, options.selectedKeys, options.source);
            }
         }
      },

      _afterMount: function() {
         _private.initializeConstants();
         if (this._selectedKeys.length) {
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         var
            self = this,
            newSelectedKeys,
            visibleItems = [],
            isAllRecordsDisplay = true,
            itemsSizes, availableWidth, lastSelectedItems,
            keysChanged = !isEqual(newOptions.selectedKeys, this._options.selectedKeys) &&
               !isEqual(newOptions.selectedKeys, this._selectedKeys),
            sourceIsChanged = newOptions.source !== this._options.source;

         if (keysChanged) {
            newSelectedKeys = newOptions.selectedKeys.slice();
         } else if (sourceIsChanged) {
            newSelectedKeys = [];
         } else if (newOptions.keyProperty !== this._options.keyProperty) {
            newSelectedKeys = [];
            _private.getItems(this).each(function(item) {
               newSelectedKeys.push(item.get(newOptions.keyProperty));
            });
         }

         _private.updateModel(this, newOptions.value);
         newSelectedKeys && _private.setSelectedKeys(this, newSelectedKeys);

         if (sourceIsChanged || keysChanged && this._selectedKeys.length) {
            return _private.loadItems(this, newOptions.filter, newOptions.keyProperty, this._selectedKeys, newOptions.source, sourceIsChanged).addCallback(function(result) {
               self._forceUpdate();
               return result;
            });
         }

         if (this._selectedKeys.length) {
            lastSelectedItems = _private.getLastSelectedItems(this, MAX_VISIBLE_ITEMS);
            itemsSizes = _private.getItemsSizes(this, lastSelectedItems, newOptions.itemTemplate, newOptions.readOnly);
            availableWidth = _private.getAvailableCollectionWidth(this._children.inputRender._container, newOptions.readOnly, newOptions.multiSelect);
            visibleItems = _private.getVisibleItems(lastSelectedItems, itemsSizes, availableWidth);
            isAllRecordsDisplay = _private.getItems(this).getCount() === visibleItems.length;

            if (!isAllRecordsDisplay) {
               availableWidth -= SHOW_ALL_LINKS_WIDTH;
            }
         }

         this._visibleItems = visibleItems;
         this._availableWidthCollection = availableWidth;
         this._isAllRecordsDisplay = isAllRecordsDisplay;
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

      _togglePicker: function(event, state) {
         state = state === undefined ? !this._isPickerVisible : state;
         if (state) {
            this._isPickerVisible = true;
            this._suggestState = false;
            this._children.sticky.open({
               target: this._container,
               opener: this._children.layout,
               templateOptions: {
                  collectionWidth: this._container.offsetWidth
               }
            });
         } else {
            this._children.sticky.close();
         }
      },

      _onClosePicker: function() {
         this._isPickerVisible = false;
         this._forceUpdate();
      },

      _beforeUnmount: function() {
         this._simpleViewModel = null;
         this._selectedKeys = null;
      },

      _changeValueHandler: function(event, value) {
         _private.notifyValue(this, value);
         this._togglePicker(null, false);
      },

      _choose: function(event, item) {
         _private.addItem(this, item);
         _private.notifyValue(this, '');

         /* move focus to input after select, because focus will be lost after closing popup  */
         this.activate();
         this._notify('choose', [item]);
      },

      _crossClick: function(event, item) {
         _private.removeItem(this, item);

         /* move focus to input after remove, because focus will be lost after removing dom element  */
         this._needSetFocusInInput = true;

         if (!this._selectedKeys.length) {
            this._togglePicker(null, false);
         }
      },

      _setItems: function(items) {
         var
            selectedKeys = [],
            keyProperty = this._options.keyProperty;

         if (items) {
            items.each(function(item) {
               selectedKeys.push(item.get(keyProperty));
            });
         }

         _private.setSelectedKeys(this, selectedKeys);
         _private.getItems(this).assign(items);
         _private.notifyChanges(this, this._selectedKeys);
      },

      _deactivated: function() {
         this._suggestState = false;
         this._togglePicker(null, false);
      },

      _suggestStateChanged: function() {
         if (this._isPickerVisible || this._options.readOnly) {
            this._suggestState = false;
         }
      },

      _determineAutoDropDown: function() {
         return this._options.autoDropDown && (!this._selectedKeys.length || this._options.multiSelect);
      },

      _onClickShowSelector: function() {
         this.showSelector();
      },

      showSelector: function(templateOptions) {
         var
            self = this,
            multiSelect = this._options.multiSelect,
            selectorOpener = this._children.selectorOpener;

         templateOptions = merge(templateOptions || {}, {
            selectedItems: multiSelect ? _private.getItems(this) : null,
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

      _itemClick: function(event, item) {
         this._notify('itemClick', [item]);
      },

      _selectCallback: function(result) {
         this._setItems(result);
      }
   });

   Lookup.getDefaultOptions = function() {
      return {
         displayProperty: 'title',
         multiSelect: false,
         selectedKeys: []
      };
   };

   Lookup._private = _private;
   return Lookup;
});
