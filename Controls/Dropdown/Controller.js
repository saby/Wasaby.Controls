define('Controls/Dropdown/Controller',
   [
      'Core/Control',
      'wml!Controls/Dropdown/Controller',
      'Controls/Controllers/SourceController',
      'Core/helpers/Object/isEqual',
      'WS.Data/Chain',
      'Core/core-merge',
      'Controls/History/Source',
      'Controls/Dropdown/Util'
   ],

   function(Control, template, SourceController, isEqual, Chain, Merge, historySource, dropdownUtils) {
      'use strict';

      /**
       * Container for dropdown lists
       *
       * @class Controls/Dropdown/Controller
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/List/interface/IHierarchy
       * @mixes Controls/interface/INavigation
       * @mixes Controls/interface/IMultiSelectable
       * @mixes Controls/interface/IDropdown
       * @mixes Controls/interface/IMenu
       * @mixes Controls/Input/interface/IDropdownEmptyText
       * @mixes Controls/interface/ICaption
       * @mixes Controls/Button/interface/IIcon
       * @mixes Controls/Button/interface/IIconStyle
       * @mixes Controls/interface/IGroupedView
       * @author Красильников А.С.
       * @control
       * @public
       */

      /**
       * @event Controls/Dropdown/Controller#selectedItemsChanged Occurs when the selected items change.
       */

      /**
       * @name Controls/Dropdown/Controller#typeShadow
       * @cfg {String} Specifies the type of shadow around the popup.
       * @variant default Default shadow.
       * @variant suggestionsContainer Shadow on the right, left, bottom.
       */

      /**
       * @name Controls/Dropdown/Controller#marker
       * @cfg {Boolean} Determines whether the marker is displayed around the selected item.
       */

      /**
       * @name Controls/Dropdown/Controller#showClose
       * @cfg {Boolean} Determines whether the cross is displayed.
       */

      // TODO: удалить после исправления https://online.sbis.ru/opendoc.html?guid=1ff4a7fb-87b9-4f50-989a-72af1dd5ae18
      var
         defaultFilter = {},
         defaultSelectedKeys = [];

      var _private = {
         getMetaHistory: function() {
            return {
               $_history: true
            };
         },

         isHistorySource: function(source) {
            return source instanceof historySource;
         },

         getFilter: function(filter, source) {
            // TODO: Избавиться от проверки, когда будет готово решение задачи https://online.sbis.ru/opendoc.html?guid=e6a1ab89-4b83-41b1-aa5e-87a92e6ff5e7
            if (_private.isHistorySource(source)) {
               return Merge(_private.getMetaHistory(), filter);
            }
            return filter;
         },

         loadItems: function(self, options) {
            self._filter = _private.getFilter(options.filter, options.source);
            self._sourceController = new SourceController({
               source: options.source,
               navigation: options.navigation
            });
            return self._sourceController.load(self._filter).addCallback(function(items) {
               self._items = items;
               _private.updateSelectedItems(self, options.emptyText, options.selectedKeys, options.keyProperty, options.dataLoadCallback);
               return items;
            });
         },

         updateSelectedItems: function(self, emptyText, selectedKeys, keyProperty, dataLoadCallback) {
            if (selectedKeys[0] === null && emptyText) {
               self._selectedItems.push(null);
            } else {
               Chain(self._items).each(function(item) {
                  // fill the array of selected items from the array of selected keys
                  if (selectedKeys.indexOf(item.get(keyProperty)) > -1) {
                     self._selectedItems.push(item);
                  }
               });
            }
            if (dataLoadCallback) {
               dataLoadCallback(self._selectedItems);
            }
         },

         onResult: function(result) {
            switch (result.action) {
               case 'pinClicked':
                  this._notify('pinClicked', [result.data]);
                  this._items = this._options.source.getItems();
                  this._open();
                  break;
               case 'itemClick':
                  _private.selectItem.call(this, result.data);

                  if (_private.isHistorySource(this._options.source)) {
                     this._options.source.update(result.data[0], _private.getMetaHistory());
                  }

                  // FIXME тут необходимо перевести на кэширующий источник,
                  // Чтобы при клике историческое меню обновляло источник => а контейнер обновил item'ы
                  // Но т.к. кэширующий сорс есть только в 400, выписываю задачу на переход.
                  // https://online.sbis.ru/opendoc.html?guid=eedde59b-d906-47c4-b2cf-4f6d3d3cc2c7
                  if (this._options.source.getItems) {
                     this._items = this._options.source.getItems();
                  }
                  if (!result.data[0].get(this._options.nodeProperty)) {
                     this._children.DropdownOpener.close();
                  }
                  break;
               case 'footerClick':
                  this._notify('footerClick', [result.event]);
                  this._children.DropdownOpener.close();
            }
         },

         selectItem: function(item) {
            this._selectedItems = item;
            this._notify('selectedItemsChanged', [this._selectedItems]);
         }
      };

      var Dropdown = Control.extend({
         _template: template,
         _items: null,

         _beforeMount: function(options, context, receivedState) {
            this._selectedItems = [];
            this._onResult = _private.onResult.bind(this);
            if (!options.lazyItemsLoad) {
               if (receivedState) {
                  this._items = receivedState;
                  _private.updateSelectedItems(this, options.emptyText, options.selectedKeys, options.keyProperty, options.dataLoadCallback);
               } else if (options.source) {
                  return _private.loadItems(this, options);
               }
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys !== this._options.selectedKeys) {
               this._selectedItems = [];
               _private.updateSelectedItems(this, newOptions.emptyText, newOptions.selectedKeys, newOptions.keyProperty, newOptions.dataLoadCallback);
            }
            if ((newOptions.source && newOptions.source !== this._options.source) ||
               newOptions.navigation !== this._options.navigation ||
               newOptions.filter !== this._options.filter) {
               if (newOptions.lazyItemsLoad) {
                  /* source changed, items is not actual now */
                  this._items = null;
               } else {
                  this._selectedItems = [];
                  var self = this;
                  return _private.loadItems(this, newOptions).addCallback(function() {
                     self._forceUpdate();
                  });
               }
            }
         },

         _open: function(event) {
            // Проверям что нажата левая кнопка мыши
            if (this._options.readOnly || event && event.nativeEvent.button !== 0) {
               return;
            }
            var self = this;

            function open() {
               var config = {
                  templateOptions: {
                     items: self._items,
                     width: self._options.width
                  },
                  target: self._container,
                  corner: self._options.corner,
                  opener: self
               };
               self._children.DropdownOpener.open(config, self);
            }
            function itemsLoadCallback(items) {
               if (items.getCount() === 1) {
                  _private.selectItem.call(self, [items.at(0)]);
               } else {
                  open();
               }
            }

            if (this._options.source && !this._items) {
               _private.loadItems(this, this._options).addCallback(function(items) {
                  itemsLoadCallback(items);
                  return items;
               });
            } else {
               itemsLoadCallback(this._items);
            }
         },
   
         _mousedown: function() {
            var opener = this._children.DropdownOpener;
            if (opener.isOpened()) {
               opener.close();
            } else {
               this._open();
            }
         },

         _getEmptyText: function() {
            return dropdownUtils.prepareEmpty(this._options.emptyText);
         }
      });

      Dropdown.getDefaultOptions = function getDefaultOptions() {
         return {
            filter: defaultFilter,
            selectedKeys: defaultSelectedKeys
         };
      };

      Dropdown._private = _private;
      return Dropdown;
   });
