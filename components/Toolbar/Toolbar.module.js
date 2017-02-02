define('js!SBIS3.CONTROLS.Toolbar', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CONTROLS.ButtonGroupBase",
   "html!SBIS3.CONTROLS.Toolbar",
   "html!SBIS3.CONTROLS.Toolbar/resources/ItemTemplate",
   "Core/core-instance",
   "js!SBIS3.CONTROLS.CommandsButton",
   'css!SBIS3.CONTROLS.Toolbar',
   'css!SBIS3.CONTROLS.MenuButtonMixin'
], function( IoC, ConsoleLogger,ButtonGroupBase, dotTplFn, ItemTemplate, cInstance) {

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
            if (Array.indexOf(arrKeys, key) >= 0) {
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
         buildTplArgs = function(cfg) {
            var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
            tplOptions.getSubItems = getSubItems;
            tplOptions.itemsToSubItems = collectSubItems(cfg.items, cfg.parentProperty);
            tplOptions.showType = showType;
            tplOptions.hierField = cfg.parentProperty;
            tplOptions.parentProperty = cfg.parentProperty;
            tplOptions.items = cfg.items;
            tplOptions.keyField = cfg.idProperty;
            tplOptions.idProperty = cfg.idProperty;

            return tplOptions;
         };
   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS.Toolbar
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @demo SBIS3.CONTROLS.Demo.MyToolbar
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Buttons
    */

   var Toolbar = ButtonGroupBase.extend(/** @lends SBIS3.CONTROLS.Toolbar.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            _canServerRender: true,
            _buildTplArgs: buildTplArgs,
            _defaultItemTemplate: ItemTemplate
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
         this._setMenuItems(this._options.items);
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
         var menuItems = this._getMenuItems(items);
         this._menuIcon.setItems(menuItems);
         this._menuIcon.toggle(!!menuItems.length);
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
               if (cInstance.instanceOfMixin(item, 'SBIS3.CONTROLS.MenuButtonMixin')) {
                  item.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
               }
            }
         }
      },

      /* Переопределяем получение контейнера для элементов */
      _getItemsContainer: function() {
         return this._itemsContainer;
      },

      // формируем список без элементов с showType.TOOLBAR
      _getMenuItems: function(items) {
         //var menuItems = items
         if ( ! items) {
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
      }
   });

   return Toolbar;

});