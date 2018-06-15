define('Controls/Container/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Container/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'Controls/Controllers/SourceController',
      'Core/helpers/Object/isEqual',
      'Core/helpers/Object/isEmpty',
      'WS.Data/Chain',
      'Controls/Input/Dropdown/Util'
   ],

   function(Control, template, defaultContentTemplate, SourceController, isEqual, isEmpty, Chain, dropdownUtils) {

      /**
          * Container for dropdown lists
          *
          * @class Controls/Container/Dropdown
          * @extends Core/Control
          * @author Золотова Э.Е.
          * @control
          * @public
          */

      'use strict';

      var _private = {
         loadItems: function(instance, source, selectedKeys, keyProperty) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load().addCallback(function(items) {
               instance._items = items;
               _private.updateSelectedItems(instance, selectedKeys, keyProperty);
               return items;
            });
         },

         updateSelectedItems: function(instance, selectedKeys, keyProperty) {
            Chain(instance._items).each(function(item) {
               if (selectedKeys.indexOf(item.get(keyProperty)) > -1) {
                  instance._selectedItems.push(item);
               }
            });
         },

         onResult: function(result) {
            switch (result.action) {
               case 'itemClick':
                  _private.selectItem.apply(this, result.data);
                  if (!result.data[0].get('@parent')) {
                     this._children.DropdownOpener.close();
                  }
                  break;
               case 'footerClick':
                  this._notify('footerClick', [result.event]);
            }
         },

         selectItem: function(item) {
            this._selectedItems = [item];
            this._notify('selectedItemsChanged', [this._selectedItems]);
         }
      };

      var Dropdown = Control.extend({
         _template: template,

         _beforeMount: function(options, context, receivedState) {
            this._emptyText = dropdownUtils.prepareEmpty(options.emptyText);
            this._selectedItems = [];
            this._onResult = _private.onResult.bind(this);
            if (!options.lazyItemsLoad) {
               if (receivedState) {
                  this._items = receivedState;
                  _private.updateSelectedItems(this, options.selectedKeys, options.keyProperty);
               } else {
                  if (options.source) {
                     return _private.loadItems(this, options.source, options.selectedKeys, options.keyProperty);
                  }
               }
            }
         },

         _afterMount: function() {
            if (!isEmpty(this._selectedItems)) {
               this._notify('selectedItemsChanged', [this._selectedItems]);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys && !isEqual(newOptions.selectedKeys, this._options.selectedKeys)) {
               _private.updateSelectedItems(this, newOptions.selectedKeys);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
               if (newOptions.lazyItemsLoad) {
                  /* source changed, items is not actual now */
                  this._items = null;
               } else {
                  var self = this;
                  return _private.loadItems(this, newOptions.source, newOptions.selectedKeys).addCallback(function() {
                     self._forceUpdate();
                  });
               }
            }
         },

         _open: function() {
            var self = this;

            function open() {
               var config = {
                  templateOptions: {
                     items: self._items,
                     width: self._options.width
                  },
                  target: self._container,
                  corner: self._options.corner
               };
               self._children.DropdownOpener.open(config, self);
            }

            if (this._options.source && !this._items) {
               _private.loadItems(this, this._options.source, this._options.filter).addCallback(function(items) {
                  open();
                  return items;
               });
            } else {
               open();
            }
         }
      });

      Dropdown.getDefaultOptions = function getDefaultOptions() {
         return {
            selectedKeys: []
         };
      };

      Dropdown._private = _private;
      return Dropdown;
   });
