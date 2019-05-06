import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/SelectedCollection/Controller');
import clone = require('Core/core-clone');
import Deferred = require('Core/Deferred');
import {Controller as SourceController} from 'Controls/source';
import isEqual = require('Core/helpers/Object/isEqual');
import collection = require('Types/collection');
import merge = require('Core/core-merge');
import tmplNotify = require('Controls/Utils/tmplNotify');
import ToSourceModel = require('Controls/Utils/ToSourceModel');
import LoadService = require('Controls/History/LoadService');



   var _private = {
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
               if (self._options.dataLoadCallback) {
                  self._options.dataLoadCallback(result);
               }

               resultDef.callback(self._items = result);
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
         _private.notifyTextValueChanged(self, _private.getTextValue(self));
      },

      notifyItemsChanged: function(self, items) {
         self._notify('itemsChanged', [items]);
      },

      notifySelectedKeys: function(self, selectedKeys) {
         self._notify('selectedKeysChanged', [selectedKeys]);
      },

      notifyTextValueChanged: function(self, textValue) {
         self._notify('textValueChanged', [textValue]);
      },

      prepareItems: function(self) {
         ToSourceModel(_private.getItems(self), self._options.source, self._options.keyProperty);
      },

      addItem: function(self, item) {
         var
            selectedKeys = self._selectedKeys.slice(),
            key = item.get(self._options.keyProperty),

            //That would not change on the link, and it was possible to track changes in child controls
            selectedItems = _private.getItems(self).clone(true);

         if (selectedKeys.indexOf(key) === -1) {
            if (self._options.multiSelect) {
               selectedKeys.push(key);
               selectedItems.append([item]);
            } else {
               selectedKeys = [key];
               selectedItems.assign([item]);
            }

            _private.setItems(self, selectedItems);
            _private.prepareItems(self);
            _private.notifyChanges(self, selectedKeys);
            _private.setSelectedKeys(self, selectedKeys);
         }
      },

      removeItem: function(self, item) {
         var
            selectedKeys = self._selectedKeys.slice(),
            keyProperty = self._options.keyProperty,
            key = item.get(keyProperty),
            indexKey = selectedKeys.indexOf(key),
            selectedItems = _private.getItems(self).clone(true),
            indexItem = selectedItems.getIndexByValue(keyProperty, key);

         if (indexKey !== -1) {
            selectedKeys.splice(indexKey, 1);
            selectedItems.removeAt(indexItem);
            _private.setItems(self, selectedItems);
            _private.notifyChanges(self, selectedKeys);
            _private.setSelectedKeys(self, selectedKeys);
         }
      },

      setSelectedKeys: function(self, keys) {
         self._selectedKeys = keys;
         self._forceUpdate();
      },

      getTextValue: function(self) {
         var titleItems = [];

         _private.getItems(self).each(function(item) {
            titleItems.push(item.get(self._options.displayProperty));
         });

         return titleItems.join(', ');
      },

      getItems: function(self) {
         if (!self._items) {
            self._items = new collection.List();
         }
         return self._items;
      },

      setItems: function(self, items) {
         self._items = items;
      },

      getHistoryService: function(self) {
         if (!self._historyServiceLoad) {
            self._historyServiceLoad = LoadService({
               historyId: self._options.historyId
            });
         }

         return self._historyServiceLoad;
      }
   };

   /**
    * SelectedCollection Controller
    * @class Controls/_lookup/SelectedCollection/Controller
    * @extends Core/Control
    * @control
    * @private
    * @author Kraynov D.
    */

   var CollectionController = Control.extend({
      _template: template,
      _notifyHandler: tmplNotify,
      _selectedKeys: null,
      _items: null,
      _historyServiceLoad: null,

      _beforeMount: function(options, context, receivedState) {
         this._selectCallback = this._selectCallback.bind(this);
         this._selectedKeys = options.selectedKeys.slice();

         if (this._selectedKeys.length) {
            if (receivedState) {
               this._items = receivedState;
            } else {
               return _private.loadItems(this, options.filter, options.keyProperty, options.selectedKeys, options.source);
            }
         }
      },

      _beforeUpdate: function(newOptions) {
         var
            self = this,
            keysChanged = newOptions.selectedKeys !== this._options.selectedKeys &&
               !isEqual(newOptions.selectedKeys, this._selectedKeys),
            sourceIsChanged = newOptions.source !== this._options.source;

         if (keysChanged || sourceIsChanged) {
            this._selectedKeys = newOptions.selectedKeys.slice();
         } else if (newOptions.keyProperty !== this._options.keyProperty) {
            this._selectedKeys = [];
            _private.getItems(this).each(function(item) {
               self._selectedKeys.push(item.get(newOptions.keyProperty));
            });
         }

         if (!newOptions.multiSelect && this._selectedKeys.length > 1) {
            this._setItems([]);
         } else if (sourceIsChanged || keysChanged) {
            if (this._selectedKeys.length) {
               return _private.loadItems(this, newOptions.filter, newOptions.keyProperty, this._selectedKeys, newOptions.source, sourceIsChanged).addCallback(function(result) {
                  _private.notifyItemsChanged(self, result);
                  _private.notifyTextValueChanged(self, _private.getTextValue(self));
                  self._forceUpdate();

                  return result;
               });
            } else if (keysChanged) {
               this._setItems([]);
            }
         }
      },

      _getItems: function() {
         return _private.getItems(this);
      },

      _setItems: function(items) {
         var
            selectedKeys = [],
            keyProperty = this._options.keyProperty,
            selectedItems = _private.getItems(this).clone(true);

         if (items && items.each) {
            items.each(function(item) {
               selectedKeys.push(item.get(keyProperty));
            });
         }

         selectedItems.assign(items);
         _private.setItems(this, selectedItems);
         _private.prepareItems(this);
         _private.notifyChanges(this, selectedKeys);
         _private.setSelectedKeys(this, selectedKeys);
      },

      showSelector: function(templateOptions) {
         var
            self = this,
            multiSelect = this._options.multiSelect,
            selectorOpener = this._children.selectorOpener,
            selectorTemplate = this._options.selectorTemplate;

         if (selectorTemplate) {
            templateOptions = merge(templateOptions || {}, {
               selectedItems: _private.getItems(this).clone(),
               multiSelect: multiSelect,
               handlers: {
                  onSelectComplete: function(event, result) {
                     self._selectCallback(null, result);
                     selectorOpener.close();
                  }
               }
            }, {clone: true});

            selectorOpener.open({
               opener: self,
               isCompoundTemplate: this._options.isCompoundTemplate,
               templateOptions: merge(selectorTemplate.templateOptions || {}, templateOptions, {clone: true})
            });
         }
      },

      _selectCallback: function(event, result) {
         var prepareItems;

         this._setItems(result);
         prepareItems = _private.getItems(this);

         // give the record in the correct format
         if (prepareItems && prepareItems.getCount() && this._options.historyId) {
            _private.getHistoryService(this).addCallback(function(historyService) {
               historyService.update(prepareItems.at(0), {$_history: true});
               return historyService;
            });
         }
      },

      _onShowSelectorHandler: function(event, templateOptions) {
         this.showSelector(templateOptions);
      },

      _onAddItemHandler: function(event, item) {
         this._notify('choose', [item]);
         _private.addItem(this, item);
      },

      _onRemoveItemHandler: function(event, item) {
         _private.removeItem(this, item);
      },

      _onUpdateItemsHandler: function(event, items) {
         this._setItems(items);
      }
   });

   CollectionController._private = _private;
   CollectionController.getDefaultOptions = function() {
      return {
         selectedKeys: []
      };
   };

   export = CollectionController;

