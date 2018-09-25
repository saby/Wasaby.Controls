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
   'wml!Controls/Input/Lookup/CollectionItem',
   'Controls/Utils/getWidth',
   'Controls/Utils/DOMUtil',
   'wml!Controls/Input/resources/input',
   'css!Controls/Input/Lookup/Lookup'
], function(Control, template, BaseViewModel, SourceController, List, isEqual, clone, Deferred, merge, collectionItem, getWidthUtil, DOMUtil) {
   
   'use strict';

   /**
    * Input for selection from source (single choice).
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

   var _private = {
      loadItems: function(self, filter, keyProperty, selectedKeys, source) {
         var filter = clone(filter || {});
         var resultDef = new Deferred();

         filter[keyProperty] = selectedKeys;

         if (!self.sourceController) {
            self.sourceController = new SourceController({
               source: source
            });
         }
         self.sourceController.load(filter)
            .addCallback(function(result) {
               resultDef.callback(self._items = result);
               return result;
            })
            .addErrback(function(result) {
               resultDef.callback(null);
               return result;
            });

         return resultDef;
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
         var key = item.get(self._options.keyProperty);

         if (self._selectedKeys.indexOf(key) === -1) {
            if (self._options.multiSelect) {
               self._selectedKeys.push(key);
               _private.keysChanged(self);
               _private.getItems(self).append([item]);
            } else {
               _private.setSelectedKeys(self, [key]);
               _private.getItems(self).assign([item]);
            }

            _private.notifySelectedKeys(self, self._selectedKeys);
         }
      },

      removeItem: function(self, item) {
         var
            key = item.get(self._options.keyProperty),
            indexItem = self._selectedKeys.indexOf(key);

         if (indexItem !== -1) {
            self._selectedKeys.splice(indexItem, 1);
            _private.keysChanged(self);
            _private.getItems(self).remove(item);
            _private.notifySelectedKeys(self, self._selectedKeys);
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

      keysChanged: function(self) {
         self._collectionIsReady = false;
         self._isEmpty = !self._selectedKeys.length;

         /* keys changed - need to hide suggest */
         if (!self._isEmpty) {
            self._suggestState = false;
         }
      },

      getCollectionSlice: function(self, startIndex) {
         var newCollection = _private.getItems(self).clone();

         for (; startIndex; startIndex--) {
            newCollection.removeAt(0);
         }

         return newCollection;
      },

      getItemWidth: function(self, indexItem) {
         return getWidthUtil.getWidth(collectionItem({
            _options: self._children.collection._options,
            item: self._items.at(indexItem),
            index: indexItem,
            itemsCount: self._items.getCount()
         }));
      },

      getInputMinWidth: function(fieldWrapperWidth, afterFieldWrapperWidth) {
         /* По стандарту минимальная ширина поля ввода - 33%, но не более 100 */
         var minWidthFieldWrapper = (fieldWrapperWidth - afterFieldWrapperWidth) / 100 * 33;

         return Math.min(minWidthFieldWrapper, 100);
      },

      alignSelectedCollection: function(self) {
         var
            itemsWidth = 0,
            displayItems = 0,
            itemsCount = _private.getItems(self).getCount(),
            additionalWidth = 0, availableWidth, itemWidth,
            fieldWrapper, afterFieldWrapper;

         if (self._selectedKeys.length) {
            if (!self._options.readOnly) {
               fieldWrapper = self._children.inputRender._container;
               afterFieldWrapper = self._children.showSelector;
               additionalWidth = _private.getInputMinWidth(fieldWrapper.offsetWidth, afterFieldWrapper.offsetWidth) +
                  self._children.showSelector.offsetWidth;
            }

            availableWidth =  DOMUtil.width(self._children.inputRender._container) - additionalWidth;

            if (itemsCount === 1) {
               displayItems = itemsCount;
            } else {
               /* Учтем ширину кнопки, показывающей все записи */
               availableWidth -= self._children.showAllLinks.offsetWidth;

               /* Считаем, сколько элементов может отобразиться */
               for (var i = itemsCount - 1; i >= 0; i--) {
                  itemWidth = _private.getItemWidth(self, i);

                  if ((itemsWidth + itemWidth) > availableWidth) {
                     /* Если ни один элемент не влезает, то отобразим только последний выбранный */
                     if (!itemsWidth) {
                        displayItems++;
                     }
                     break;
                  }
                  displayItems++;
                  itemsWidth += itemWidth;
               }
            }
         }

         self._collectionIsReady = true;
         self._availableWidthCollection = availableWidth;
         self._isAllRecordsDisplay = displayItems >= itemsCount;
         self._displayItemsIndex =  itemsCount - displayItems;
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
      _collectionIsReady: false,
      _displayItemsIndex: null,

      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,

      _beforeMount: function(options) {
         this._onClosePickerBind = this._onClosePicker.bind(this);
         this._simpleViewModel = new BaseViewModel({
            value: options.value
         });
         this._selectedKeys = options.selectedKeys.slice();
         this._selectCallback = this._selectCallback.bind(this);
         
         if (this._selectedKeys.length) {
            _private.keysChanged(this);
            return _private.loadItems(this, options.filter, options.keyProperty, options.selectedKeys, options.source);
         }
      },

      _afterMount: function() {
         if (this._selectedKeys.length) {
            _private.alignSelectedCollection(this);
            this._forceUpdate();
         }
      },

      _beforeUpdate: function(newOptions) {
         var keysChanged = false,
            self = this;

         _private.updateModel(this, newOptions.value);

         if (!isEqual(newOptions.selectedKeys, this._selectedKeys)) {
            keysChanged = true;
            this._selectedKeys = newOptions.selectedKeys.slice();
            _private.keysChanged(this);
         }

         if (!this._collectionIsReady && !this._isPickerVisible) {
            _private.alignSelectedCollection(this);
         }

         if (newOptions.source !== this._options.source || keysChanged && this._selectedKeys.length) {
            _private.loadItems(this, newOptions.filter, newOptions.keyProperty, newOptions.selectedKeys, newOptions.source).addCallback(function(result) {
               self._forceUpdate();
               return result;
            });
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

      _togglePicker: function(event, state) {
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
         _private.notifySelectedKeys(this, this._selectedKeys);
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
   
      _showSelector: function() {
         var multiSelect = this._options.multiSelect;

         var templateOptions = {
            selectedItems: multiSelect ? _private.getItems(this) : null,
            isCompoundTemplate: this._options.isCompoundTemplate,
            multiSelect: multiSelect
         };
         
         this._children.selectorOpener.open({
            templateOptions: merge(this._options.lookupTemplate.templateOptions || {}, templateOptions)
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
         selectedKeys: []
      };
   };

   Lookup._private = _private;
   return Lookup;
});
