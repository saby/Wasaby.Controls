define('Controls/Dropdown/Controller',
   [
      'Core/Control',
      'tmpl!Controls/Dropdown/Controller',
      'Controls/Controllers/SourceController',
      'Core/helpers/Object/isEqual',
      'WS.Data/Chain',
      'Controls/Dropdown/Util'
   ],

   function(Control, template, SourceController, isEqual, Chain, dropdownUtils) {

      'use strict';

      /**
       * Container for dropdown lists
       *
       * @class Controls/Dropdown/Controller
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IItemTemplate
       * @mixes Controls/interface/IDropdown
       * @mixes Controls/Input/interface/IDropdownEmptyText
       * @mixes Controls/interface/ICaption
       * @mixes Controls/Button/interface/IIcon
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

      var _private = {
         loadItems: function(instance, source, selectedKeys, keyProperty, dataLoadCallback, filter) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load(filter).addCallback(function(items) {
               instance._items = items;
               _private.updateSelectedItems(instance, selectedKeys, keyProperty, dataLoadCallback);
               return items;
            });
         },

         updateSelectedItems: function(instance, selectedKeys, keyProperty, dataLoadCallback) {
            if (selectedKeys[0] === null && instance._options.emptyText) {
               instance._selectedItems.push(null);
            } else {
               Chain(instance._items).each(function(item) {
                  //fill the array of selected items from the array of selected keys
                  if (selectedKeys.indexOf(item.get(keyProperty)) > -1) {
                     instance._selectedItems.push(item);
                  }
               });
            }
            if (dataLoadCallback) {
               dataLoadCallback(instance._selectedItems);
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
                  
                  //FIXME тут необходимо перевести на кэширующий источник,
                  //Чтобы при клике историческое меню обновляло источник => а контейнер обновил item'ы
                  //Но т.к. кэширующий сорс есть только в 400, выписываю задачу на переход.
                  //https://online.sbis.ru/opendoc.html?guid=eedde59b-d906-47c4-b2cf-4f6d3d3cc2c7
                  if (this._options.source.getItems) {
                     this._items = this._options.source.getItems();
                  }
                  if (!result.data[0].get('@parent')) {
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

         _beforeMount: function(options, context, receivedState) {
            this._selectedItems = [];
            this._onResult = _private.onResult.bind(this);
            if (!options.lazyItemsLoad) {
               if (receivedState) {
                  this._items = receivedState;
                  _private.updateSelectedItems(this, options.selectedKeys, options.keyProperty, options.dataLoadCallback);
               } else {
                  if (options.source) {
                     return _private.loadItems(this, options.source, options.selectedKeys, options.keyProperty, options.dataLoadCallback);
                  }
               }
            }
         },

         _beforeUpdate: function(newOptions) {
            if (!isEqual(newOptions.selectedKeys, this._options.selectedKeys)) {
               this._selectedItems = [];
               _private.updateSelectedItems(this, newOptions.selectedKeys, newOptions.keyProperty, newOptions.dataLoadCallback);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
               if (newOptions.lazyItemsLoad) {
                  /* source changed, items is not actual now */
                  this._items = null;
               } else {
                  var self = this;
                  return _private.loadItems(this, newOptions.source, newOptions.selectedKeys, newOptions.keyProperty).addCallback(function() {
                     self._forceUpdate();
                  });
               }
            }
         },

         _open: function() {
            if (this._options.readOnly) {
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
                  horizontalAlign: self._options.horizontalAlign,
                  verticalAlign: self._options.verticalAlign
               };
               self._children.DropdownOpener.open(config, self);
            }

            if (this._options.source && !this._items) {
               _private.loadItems(this, this._options.source, this._options.selectedKeys, this._options.keyProperty, this._options.dataLoadCallBack, this._options.filter).addCallback(function(items) {
                  open();
                  return items;
               });
            } else {
               open();
            }
         },

         _getEmptyText: function() {
            return dropdownUtils.prepareEmpty(this._options.emptyText);
         }
      });

      Dropdown.getDefaultOptions = function getDefaultOptions() {
         return {
            filter: {},
            selectedKeys: []
         };
      };

      Dropdown._private = _private;
      return Dropdown;
   });
