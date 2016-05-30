define('js!SBIS3.CONTROLS.Toolbar', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Toolbar',
   'js!SBIS3.CONTROLS.CommandsButton'
], function(ButtonGroupBaseDS, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS.Toolbar
    * @extends SBIS3.CONTROLS.ButtonGroupBaseDS
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyToolbar
    * @author Крайнов Дмитрий Олегович
    */

   var Toolbar = ButtonGroupBaseDS.extend(/** @lends SBIS3.CONTROLS.Toolbar.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         },
         showType: {
            //отображать только в меню, соответствует isMainAction = false
            MENU: 0,
            //отображать в меню и тулбаре, соответствует isMainAction = true
            MENU_TOOLBAR: 1,
            //отображать только в списке, не в меню
            TOOLBAR: 2
         },
         //список дочерних элементов
         _itemsToSubItems: null
      },

      $constructor: function() {
         this._publish('onToolbarItemActivate');
         this._itemsContainer   = this.getContainer().find('.controls-ToolBar__itemsContainer');
      },

      init: function() {
         Toolbar.superclass.init.call(this);
         this._menuIcon = this.getChildControlByName('controls-ToolBar__menuIcon');
         this._menuIcon.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
         this._setMenuItems(this._options.items);
      },

      setItems: function(items) {
         //очищаем список найденных элементов
         this._itemsToSubItems = null;
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
      _itemActivatedHandler: function(id, event) {
         this._notifyItemActivate(id, 'toolbar');
      },

      _notifyItemActivate: function(id, type) {
         this._notify('onToolbarItemActivate', id, type);
      },

      /* Переопределяем получение контейнера для элементов */
      _getTargetContainer: function(item) {
         return this._itemsContainer;
         //return !!item.get('isMainAction') ? this._itemsContainer : null;
      },

      _drawItemsCallback: function () {
         Toolbar.superclass._drawItemsCallback.apply(this, arguments);

         //TODO находим элементы, которые могут быть меню, чтобы подписаться на них
         var itemsInstances = this.getItemsInstances();
         for (var i in itemsInstances) {
            if (itemsInstances.hasOwnProperty(i)) {
               var item = itemsInstances[i];
               if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.MenuButtonMixin')) {
                  item.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
               }
            }
         }
      },

      // формируем список без элементов с showType.TOOLBAR
      _getMenuItems: function(items) {
         //var menuItems = items
         if ( ! items) {
            return [];
         }
         var rawData = this._getArrayItems(items),//null,
             menuItems = [];
         //производный массив
         for (var i = 0; i < rawData.length; i++) {
            if (rawData[i].showType != this.showType.TOOLBAR) {
               menuItems.push(rawData[i]);
            }
         }
         return menuItems;
      },

      _getArrayItems: function(items) {
         var rawData = null;
         if (items instanceof Array) {
            rawData = items;
         }
         if ( ! rawData && $ws.helpers.instanceOfModule(items,'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            rawData = items.getRawData();
         }
         if ( ! rawData) {
            $ws.single.ioc.resolve('ILogger').log('Toolbar:_getArrayItems. Неизвестный тип items');
            return [];
         }
         return rawData;
      },

      /*
       * Собираем все дочерние элементы для каждого item-а
       * TODO возможно стоит пределать на методы из TreeMixinDS, hierarchyMixin
       */
      _collectSubItems: function() {
         this._itemsToSubItems = {};

         var rawData = this._getArrayItems(this._items),
             subItems;
         for (var i = 0; i < rawData.length; i++) {
            var curItem = rawData[i];
            var parentKey = curItem[this._options.hierField] ;
            if ( ! parentKey) {
               continue;
            }
            //находим или создаем записи для этого родителя
            subItems = (this._itemsToSubItems.hasOwnProperty(parentKey)) ? this._itemsToSubItems[parentKey] : [];
            subItems.push(curItem);
            this._itemsToSubItems[parentKey] = subItems;
         }
      },

      _getSubItems: function(key, arrKeys) {
         //var childs = this._items.getChildItems(key, true, 'parent');/*this._options.hierField*/
         if ( ! key) {
            return [];
         }
         arrKeys = arrKeys || [];
         if (Array.indexOf(arrKeys, key) >= 0) {
            $ws.single.ioc.resolve('ILogger').error('Toolbar','_getSubItems. Зацикливание в дереве.');
            return [];
         }
         arrKeys.push(key);
         if (this._itemsToSubItems === null) {
            this._collectSubItems();
         }
         var items = [],
             subItems = [],
             curItems;
         if (this._itemsToSubItems.hasOwnProperty(key)) {
            items = this._itemsToSubItems[key];
            for (var i = 0; i < items.length; i++) {
               curItems = this._getSubItems(items[i][this._options.keyField], arrKeys);
               subItems.push.apply(subItems, curItems);
            }
            //добавляем к элементам полученные подпункты
            items.push.apply(items, subItems);
         }
         return items;
      },

      _getItemTemplate: function(item) {
         var icon       = item.get('icon')      ? '<option name="icon">' + item.get('icon') + '</option>' : '',
             className  = item.get('className') ? item.get('className') : '',
             options    = item.get('options') || {},
             caption    = item.get('caption')   ? '<opt name="caption">' + item.get('caption') + '</opt>' : '',
             visible    = !!(item.get('showType') == this.showType.MENU_TOOLBAR || item.get('showType') == this.showType.TOOLBAR ),
             command    = item.get('command') ? '<opt name="command">' + item.get('command') + '</opt>' : '',
             itemKey    = item.get(this._options.keyField),
             subItems;

         //ищем подэлементы, только если элемент отображается в тулбаре
         if (visible) {
            subItems = this._getSubItems(itemKey);
            //клонируем, чтобы не влиять на основное меню в тулбаре
            subItems = $ws.core.clone(subItems);
            //удаляем parent, чтобы элементы попали в список. Задание root не дает отображение элементов с несуществующими parent
            for (var i = 0; i < subItems.length; i++) {
               if (subItems[i].parent == itemKey ) {
                  delete subItems[i].parent;
               }
            }
            //для MenuIcon, MenuLink и т.д.
            if (subItems.length) {
               options.items = subItems;
               //options.root = itemKey;
               options.keyField = this._options.keyField;
               options.hierField = this._options.hierField;
               options.displayField = this._options.displayField;
            }
         }
         return '<component data-component="' + item.get('componentType').substr(3) + '" config="' + $ws.helpers.encodeCfgAttr(options) + '" class="controls-ToolBar__item ' + className + '">' +
                  '<opt name="visible" type="boolean">' + visible + '</opt>' +
                  caption + icon + command +
                '</component>';
      }

   });

   return Toolbar;

});