define('js!SBIS3.CONTROLS.Toolbar', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Toolbar',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   //'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.MenuIcon'
], function(ButtonGroupBaseDS, dotTplFn, TreeMixinDS) {

   'use strict';

   /**
    * Контрол, отображающий панель с иконками.
    * @class SBIS3.CONTROLS.Toolbar
    * @extends SBIS3.CONTROLS.ControlsListBase
    * @author Крайнов Дмитрий Олегович
    */

   var Toolbar = ButtonGroupBaseDS.extend(/*[TreeMixinDS],*/ /** @lends SBIS3.CONTROLS.Toolbar.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         },
         /* индекс текущего элемента */
         _currentItemNum: -1,
         _itemsMap: null
      },

      $constructor: function() {
         this._publish('onToolbarItemActivate');

         this._itemsContainer   = this.getContainer().find('.controls-ToolBar__itemsContainer');
         //this._garbageContainer = this.getContainer().find('.controls-ToolBar__garbageContainer');

      },

      init: function() {
         Toolbar.superclass.init.call(this);
         this._menuIcon = this.getChildControlByName('controls-ToolBar__menuIcon');
         this._menuIcon.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
         /*if (! $ws.helpers.instanceOfModule(this._options.items, 'SBIS3.CONTROLS.Data.Collection.List')) {
            this._options.items = new List({items: this._options.items});
            console.log('Toolbar init.конвертнули в List');
         }*/
         this._setMenuItems(this._options.items);
      },

      setItems: function(items) {
         //TODO подготовка списка меню
         console.log('Toolbar.setItems');
         /*if (! $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Collection.List')) {
            items = new List({items: items});
            console.log('Toolbar.конвертнули в List');
         }*/
         /*var list = new List();
         list.assign(items);
         items = list;*/

         //this._setMenuItems(this.getItemsInstances());
         Toolbar.superclass.setItems.apply(this, arguments);
         this._setMenuItems(items);

      },

      _setMenuItems: function(items) {
         if ( ! this._menuIcon) {
            return;
         }
         this._menuIcon.setItems(items);
      },

      //обработчик для меню
      _onMenuItemActivate: function(event, id) {
         //console.log('_onMenuItemActivate ' + id);
         this._notifyItemActivate(id, 'menu');
      },

      //обработчик для кнопок в тулбаре
      _itemActivatedHandler: function(id, event) {
         this._notifyItemActivate(id, 'toolbar');
      },

      _notifyItemActivate: function(id, type) {
         this._notify('onToolbarItemActivate', id, type);
      },

      /* $0.wsControl.setItems([{id:1, name:'B1', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'новый текст'}, {id:2, name:'B2', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'текст2'}])
         $0.wsControl.setItems([{id:1, name:'B1', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'новый текст', isMainAction: true}, {id:2, name:'B2', componentType: 'js!SBIS3.CONTROLS.Button', caption: 'текст2'}])
       */

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


      /*_itemsReadyCallback: function() {
         console.log('_itemsReadyCallback');
         //this._setMenuItems(this._options.items);
      },*/
      /*_buildTplArgs: function(item) {
         item._options.rawData.caption = item._options.rawData.caption + 'qwe';
         var tplOptions = Toolbar.superclass._buildTplArgs.apply(this, arguments);
         return tplOptions;
      },*/

      _getItemTemplate: function(item) {
         var icon        = item.get('icon')        ? '<option name="icon">' + item.get('icon') + '</option>' : '',
             className   = item.get('className')   ? item.get('className') : '',
             options = item.get('options') || {},
            //+ Math.floor(Math.random()*1000).toString()
             caption = item.get('caption') ? '<opt name="caption">' + item.get('caption') + '</opt>' : '',
             //visible = item.get('isMainAction')
             command = item.get('command') ? '<opt name="command">' + item.get('command') + '</opt>' : '';
             //handlers = item.get('handlers') ? '<options name="handlers">' + item.get('handlers') + '</options>' : '';
         return '<component data-component="' + item.get('componentType').substr(3) + '" config="' + $ws.helpers.encodeCfgAttr(options) + '" class="controls-ToolBar__item ' + className + '">' +
                  '<opt name="visible" type="boolean">' + !!item.get('isMainAction') + '</opt>' +
                  caption + icon + command +
                  //для MenuIcon, MenuLink и т.д.
                  '<opt name="keyField">id</opt>'+
                '</component>';
      }

   });

   return Toolbar;

});