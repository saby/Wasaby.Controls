define('js!SBIS3.CONTROLS.Toolbar', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Toolbar',
   'js!SBIS3.CONTROLS.MenuIcon'
], function(ButtonGroupBaseDS, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS.Toolbar
    * @extends SBIS3.CONTROLS.ControlsListBase
    * @author Крайнов Дмитрий Олегович
    */

   var Toolbar = ButtonGroupBaseDS.extend( /** @lends SBIS3.CONTROLS.Toolbar.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         },
         /* индекс текущего элемента */
         _currentItemNum: -1,
         _itemsMap: null
      },

      $constructor: function() {
         this._itemsContainer   = this.getContainer().find('.controls-ToolBar__itemsContainer');
         //this._garbageContainer = this.getContainer().find('.controls-ToolBar__garbageContainer');

      },

      init: function() {
         Toolbar.superclass.init.call(this);
         this._menuIcon = this.getChildControlByName('controls-ToolBar__menuIcon');
         this._setMenuItems(this._options.items);
      },

      setItems: function(items) {
         //TODO подготовка списка меню
         console.log('Toolbar.setItems');
         this._setMenuItems(items);
         //this._setMenuItems(this.getItemsInstances());
         Toolbar.superclass.setItems.apply(this, arguments);
      },

      _setMenuItems: function(items) {
         this._menuIcon.setItems(items);
      },

      /* $0.wsControl.setItems([{id:1, name:'B1', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'новый текст'}, {id:2, name:'B2', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'текст2'}])
         $0.wsControl.setItems([{id:1, name:'B1', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'новый текст', isMainAction: true}, {id:2, name:'B2', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'текст2'}])
       */

      /* Создаем карту элементов, которые нужно отобразить */
      /*_createItemsMap: function() {
         var currentItemNum = 0;
         this._itemsMap = {};
         for (var i = 0, count = this._items.getCount(); i < count; i++) {
            this._itemsMap[this.items[i]] = (currentItemNum < 2);
         }
      },*/
      /* Переопределяем получение контейнера для элементов */
      _getTargetContainer: function(item) {
         /*if ( ! this._itemsMap) {
            this._createItemsMap();
         }*/
         //return item.get('align') === 'left' ? this._leftContainer : this._rightContainer;
         //this._currentItemNum ++;
         //console.log(this._currentItemNum);
         //return (this._itemsMap && this._itemsMap[item]) ? this._itemsContainer : this._garbageContainer;
         return this._itemsContainer;
         //return !!item.get('isMainAction') ? this._itemsContainer : null;
      },

      _getItemTemplate: function(item) {
         var icon        = item.get('icon')        ? '<option name="icon">' + item.get('icon') + '</option>' : '',
             className   = item.get('className')   ? item.get('className') : '',
             options = item.get('options') || {},
             caption = item.get('caption') ? '<opt name="caption">' + item.get('caption') + '</opt>' : '',
             //visible = item.get('isMainAction')
             command = item.get('command') ? '<opt name="command">' + item.get('command') + '</opt>' : '';
             //handlers = item.get('handlers') ? '<options name="handlers">' + item.get('handlers') + '</options>' : '';
         return '<component data-component="' + item.get('componentType').substr(3) + '" config="' + $ws.helpers.encodeCfgAttr(options) + '" class="controls-ToolBar__item ' + className + '">' +
                  '<opt name="visible" type="boolean">' + !!item.get('isMainAction') + '</opt>' +
                  //'<opt name="caption">' + item.get('caption') + '</opt>' +
                  caption + icon + command +
                '</component>';
      }

   });

   return Toolbar;

});