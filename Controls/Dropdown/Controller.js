define('Controls/Dropdown/Controller',
   [
      'Core/Control',
      'wml!Controls/Dropdown/Controller',
      'Controls/Controllers/SourceController',
      'Types/chain',
      'Controls/History/dropdownHistoryUtils',
      'Controls/Dropdown/Util'
   ],

   function(Control, template, SourceController, chain, historyUtils, dropdownUtils) {
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
       * @mixes Controls/interface/IGrouped
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
         loadItems: function(self, options) {
            self._filter = historyUtils.getSourceFilter(options.filter, options.source);
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
            if ((!selectedKeys.length || selectedKeys[0] === null) && emptyText) {
               self._selectedItems.push(null);
            } else {
               chain.factory(self._items).each(function(item) {
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
                  var res = _private.selectItem.call(this, result.data);

                  if (historyUtils.isHistorySource(this._options.source)) {
                     this._options.source.update(result.data[0], historyUtils.getMetaHistory());
                  }

                  // FIXME тут необходимо перевести на кэширующий источник,
                  // Чтобы при клике историческое меню обновляло источник => а контейнер обновил item'ы
                  // Но т.к. кэширующий сорс есть только в 400, выписываю задачу на переход.
                  // https://online.sbis.ru/opendoc.html?guid=eedde59b-d906-47c4-b2cf-4f6d3d3cc2c7
                  if (this._options.source.getItems) {
                     this._items = this._options.source.getItems();
                  }

                  // dropDown must close by default, but user can cancel closing, if returns false from event
                  // res !== undefined - will deleted after https://online.sbis.ru/opendoc.html?guid=c7977290-b0d6-45b4-b83b-10108db89761
                  if (res === true || !(result.data[0].get(this._options.nodeProperty) || res === false)) {
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
            return this._notify('selectedItemsChanged', [this._selectedItems]);
         },

         // TODO: Пока не поддержан множественный выбор: https://online.sbis.ru/opendoc.html?guid=b770077d-f93e-4a67-8198-405f4c1c52be
         closeHandler: function() {
            if (this._options.close) {
               this._options.close();
            }
            this._notify('_close', []);
         }
      };

      var Dropdown = Control.extend({
         _template: template,
         _items: null,

         _beforeMount: function(options, context, receivedState) {
            this._selectedItems = [];
            this._onResult = _private.onResult.bind(this);
            this._onClose = _private.closeHandler.bind(this);
            if (!options.lazyItemsLoad) {
               // forceReloadItems удаляем в 300
               if (receivedState && !options.forceReloadItems) {
                  this._items = receivedState;
                  _private.updateSelectedItems(this, options.emptyText, options.selectedKeys, options.keyProperty, options.dataLoadCallback);
               } else if (options.source) {
                  return _private.loadItems(this, options);
               }
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys !== this._options.selectedKeys && this._items) {
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

         _afterUpdate: function(options) {
            // TODO: Пока не поддержан множественный выбор: https://online.sbis.ru/opendoc.html?guid=b770077d-f93e-4a67-8198-405f4c1c52be
            if (options.selectedKeys !== this._options.selectedKeys && this._items && this._children.DropdownOpener.isOpened()) {
               this._open();
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
                  opener: self,

                  // TODO: https://online.sbis.ru/opendoc.html?guid=b2116aaf-e4f5-46f9-881d-587384a4ec5d
                  revertPositionStyle: self._options.revertPositionStyle
               };
               self._children.DropdownOpener.open(config, self);
            }
            function itemsLoadCallback(items) {
               if (items.getCount() === 1) {
                  _private.selectItem.call(self, [items.at(0)]);
               } else if (items.getCount() > 1) {
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
               var self = this;
               require(this._options.additionalDependencies, function() {
                  self._open();
               });
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
