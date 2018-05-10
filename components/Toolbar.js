define('SBIS3.CONTROLS/Toolbar', [
   "Core/IoC",
   "Core/core-clone",
   "SBIS3.CONTROLS/Button/ButtonGroup/ButtonGroupBase",
   "tmpl!SBIS3.CONTROLS/Toolbar/Toolbar",
   "tmpl!SBIS3.CONTROLS/Toolbar/resources/ItemTemplate",
   "Core/core-instance",
   "SBIS3.CONTROLS/Button/IconButton",
   "SBIS3.CONTROLS/Commands/CommandsButton",
   'css!SBIS3.CONTROLS/Toolbar/Toolbar'
], function( IoC, coreClone, ButtonGroupBase, dotTplFn, ItemTemplate, cInstance) {

   'use strict';
    var
         showType = {
            //отображать только в меню, соответствует isMainAction = false
            MENU: 0,
            //отображать в меню и тулбаре, соответствует isMainAction = true
            MENU_TOOLBAR: 1,
            //отображать только в списке, не в меню
            TOOLBAR: 2
         },
         getSubItems = function(key, itemsCollection, idProperty, parentProperty, itemsToSubItems, arrKeys) {
            if (!key) {
               return [];
            }
            arrKeys = arrKeys || [];
            if (arrKeys.indexOf(key) >= 0) {
               IoC.resolve('ILogger').error('Toolbar', 'getSubItems. Зацикливание в дереве.');
               return [];
            }
            arrKeys.push(key);

            var items = [],
               subItems = [],
               curItems;
            if (itemsToSubItems.hasOwnProperty(key)) {
               items = itemsToSubItems[key];
               for (var i = 0; i < items.length; i++) {
                  curItems = getSubItems(items[i][idProperty], itemsCollection, idProperty, parentProperty, itemsToSubItems, arrKeys);
                  subItems.push.apply(subItems, curItems);
               }
               //добавляем к элементам полученные подпункты
               items.push.apply(items, subItems);
            }
            return items;
         },
         collectSubItems = function(items, parentProperty) {
            var
               subItems,
               result = {},
               rawData = getArrayItems(items);
            for (var i = 0; i < rawData.length; i++) {
               var curItem = rawData[i];
               var parentKey = curItem[parentProperty] ;
               if (!parentKey) {
                  continue;
               }
               //находим или создаем записи для этого родителя
               subItems = (result.hasOwnProperty(parentKey)) ? result[parentKey] : [];
               subItems.push(curItem);
               result[parentKey] = subItems;
            }
            return result;
         },
         getArrayItems = function(items) {
            var rawData = null;
            if (items instanceof Array) {
               rawData = items;
            }
            if (!rawData && cInstance.instanceOfModule(items,'WS.Data/Collection/RecordSet')) {
               rawData = items.getRawData();
            }
            if (!rawData) {
               IoC.resolve('ILogger').log('Toolbar:_getArrayItems. Неизвестный тип items');
               return [];
            }
            return rawData;
         },
         prepareOptionsForItem = function(item, items, idProperty, parentProperty, displayProperty, itemsToSubItems) {
            var
               subItems,
               optionValue,
               itemKey = item.get(idProperty),
               options = item.get('options') || {},
               isToolbarItem = item.get('showType') === showType.MENU_TOOLBAR || item.get('showType') === showType.TOOLBAR;
            if (isToolbarItem) {
               subItems = getSubItems(itemKey, items, idProperty, parentProperty, itemsToSubItems);
               subItems = coreClone(subItems);
               for (var i = 0; i < subItems.length; i++) {
                  if (subItems[i].parent == itemKey ) {
                     delete subItems[i].parent;
                  }
                  if (subItems.length) {
                     options.items = subItems;
                     options.parentProperty = parentProperty;
                     options.displayProperty = displayProperty;
                  }
               }
            }
            options['visible'] = isToolbarItem && (item.get('visible') !== false);
            if (!options.idProperty) {
               options['idProperty'] = idProperty;
            }
            ['commandArgs', 'className', 'icon', 'name', 'caption', 'command', 'enabled', 'tooltip'].forEach(function(optName) {
               optionValue = item.get(optName);
               if (optionValue !== undefined) {
                  options[optName] = optionValue;
               }
            });

            return options;
         },
         // формируем список без элементов с showType.TOOLBAR
         getMenuItems = function(items) {
            //var menuItems = items
            if (!items) {
               return [];
            }
            var rawData = getArrayItems(items),//null,
               menuItems = [];
            //производный массив
            for (var i = 0; i < rawData.length; i++) {
               if (rawData[i].showType != showType.TOOLBAR) {
                  menuItems.push(rawData[i]);
               }
            }
            return menuItems;
         },
         hasVisibleItems = function(items) {
            var hasVisibleItems = false;
            for (var i = 0; i < items.length; i++) {
               hasVisibleItems = hasVisibleItems || items[i].visible !== false
            }
            return hasVisibleItems;
         },
         buildTplArgs = function(cfg) {
            var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
            tplOptions.prepareOptionsForItem = prepareOptionsForItem;
            tplOptions.itemsToSubItems = collectSubItems(cfg.items, cfg.parentProperty);
            tplOptions.showType = showType;
            tplOptions.hierField = cfg.parentProperty;
            tplOptions.parentProperty = cfg.parentProperty;
            tplOptions.items = cfg.items;
            tplOptions.keyField = cfg.idProperty;
            tplOptions.idProperty = cfg.idProperty;

            return tplOptions;
         },
         getRecordsForRedraw = function(projection) {
            var
               model,
               records = [];
            if (projection) {
               projection.each(function (item) {
                  model = item.getContents();
                  /*Нужно отрисовывать кнопки в утлбаре, если:
                  1) Указан верный showType
                  2) Элемент является видимым
                  3) У элемента указан componentType, по которому он будет строиться
                  */
                  if ((model.get('showType') === showType.MENU_TOOLBAR || model.get('showType') === showType.TOOLBAR) &&
                     model.get('visible') !== false &&
                     model.get('componentType')) {
                     records.push(item);
                  }
               });
            }
            return records;
         };
   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS/Toolbar
    * @extends SBIS3.CONTROLS/Button/ButtonGroup/ButtonGroupBase
    * @demo Examples/Toolbar/MyToolbar/MyToolbar
    * @author Сухоручкин А.С.
    *
    * @control
    * @public
    * @category Button
    */

   var Toolbar = ButtonGroupBase.extend(/** @lends SBIS3.CONTROLS/Toolbar.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            _canServerRender: true,
            _buildTplArgs: buildTplArgs,
            _defaultItemTemplate: ItemTemplate,
            _getRecordsForRedraw: getRecordsForRedraw
         }
      },

      _modifyOptions: function (cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('Toolbar', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }
         cfg.menuItems = getMenuItems(cfg.items);
         cfg.menuIsVisible = cfg.menuItems.length && hasVisibleItems(cfg.menuItems);
         return Toolbar.superclass._modifyOptions.apply(this, arguments);
      },

      $constructor: function() {
         this._publish('onToolbarItemActivate');
         this._itemsContainer = this.getContainer().find('.controls-ToolBar__itemsContainer');
      },

      init: function() {
         Toolbar.superclass.init.call(this);
         this._menuIcon = this.getChildControlByName('controls-ToolBar__menuIcon');
         this._menuIcon.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
      },

      setItems: function(items) {
         Toolbar.superclass.setItems.apply(this, arguments);
         this._setMenuItems(items);
      },

      _setMenuItems: function(items) {
         if ( ! this._menuIcon) {
            return;
         }
         //отправляем в меню обработанные элементы, в которых убраны с showType.TOOLBAR
         var menuItems = getMenuItems(items);
         this._menuIcon.setItems(menuItems);
         this._menuIcon.toggle(!!menuItems.length && hasVisibleItems(menuItems));
      },

      //обработчик для меню
      _onMenuItemActivate: function(event, id) {
         this._notifyItemActivate(id, 'menu');
      },

      //обработчик для кнопок в тулбаре
      _itemActivatedHandler: function(hash, event) {
         var projItem = this._getItemsProjection().getByHash(hash),
             item = projItem.getContents();
         //Нотифицируем о нажатие на кнопку, только если она лежит в toolbar(не в меню), т.к. за нотификацию
         //элементов меню отвечает обработчик _onMenuItemActivate.
         if (item.get('showType') !== 0) {
            this._notifyItemActivate(item.getId(), 'toolbar');
         }
      },

      _notifyItemActivate: function(id, type) {
         this._notify('onToolbarItemActivate', id, type);
      },

      _drawItemsCallback: function () {
         Toolbar.superclass._drawItemsCallback.apply(this, arguments);

         //TODO находим элементы, которые могут быть меню, чтобы подписаться на них
         var itemsInstances = this.getItemsInstances();
         for (var i in itemsInstances) {
            if (itemsInstances.hasOwnProperty(i)) {
               var item = itemsInstances[i];
               if (cInstance.instanceOfModule(item, 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton')) {
                  item.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
               }
            }
         }
      },

      /* Переопределяем получение контейнера для элементов */
      _getItemsContainer: function() {
         return this._itemsContainer;
      }
   });

   return Toolbar;

});
