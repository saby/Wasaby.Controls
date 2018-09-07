define('Controls/Input/Lookup', [
   'Core/Control',
   'wml!Controls/Input/Lookup/Lookup',
   'Controls/Input/resources/InputRender/BaseViewModel',
   'Controls/Controllers/SourceController',
   'WS.Data/Collection/List',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'Core/Deferred',
   'wml!Controls/Input/resources/input',
   'css!Controls/Input/Lookup/Lookup'
], function(Control, template, BaseViewModel, SourceController, List, isEqual, clone, Deferred) {
   
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
    * @author Зайцев А.С.
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
            _private.setSelectedKeys(self, [key]);
            _private.getItems(self).assign([item]);
            _private.notifySelectedKeys(self, self._selectedKeys);
         }
      },
      
      removeItem: function(self, item) {
         var key = item.get(self._options.keyProperty);
   
         if (self._selectedKeys.indexOf(key) !== -1) {
            _private.setSelectedKeys(self, []);
            _private.getItems(self).clear();
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
         self._isEmpty = !self._selectedKeys.length;
   
         /* keys changed - need to hide suggest */
         if (!self._isEmpty) {
            self._suggestState = false;
         }
      }
   };
   
   var Lookup = Control.extend({
      _template: template,
      
      _suggestState: false,
      _selectedKeys: null,
      _simpleViewModel: null,
      _isEmpty: true,

      /* needed, because input will be created only after VDOM synchronisation,
         and we can set focus only in afterUpdate */
      _needSetFocusInInput: false,
      
      _beforeMount: function(options) {
         this._simpleViewModel = new BaseViewModel({
            value: options.value
         });
         this._selectedKeys = options.selectedKeys.slice();
         
         if (this._selectedKeys.length) {
            _private.keysChanged(this);
            return _private.loadItems(this, options.filter, options.keyProperty, options.selectedKeys, options.source);
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
      
      _beforeUnmount: function() {
         this._simpleViewModel = null;
         this._selectedKeys = null;
      },
   
      _changeValueHandler: function(event, value) {
         _private.notifyValue(this, value);
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
      },
   
      _deactivated: function() {
         this._suggestState = false;
      },
   
      _itemClick: function(event, item) {
         this._notify('itemClick', [item]);
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
