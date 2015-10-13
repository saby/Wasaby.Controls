/* global define, $ws, $ */
/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.MenuNew', [
   'js!SBIS3.CONTROLS.MenuNewView',
   'js!SBIS3.CONTROLS.ButtonGroupBaseDSNew',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.TreeControlMixin',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.Data.Utils',
   'html!SBIS3.CONTROLS.MenuNew'
], function(MenuView, ButtonGroupBase, ListControlMixin, HierarchyControlMixin, TreeControlMixin, FloatArea, Utils, MenuViewTemplate) {

   'use strict';

   /**
    * Контрол, отображающий меню, всплывающее в определенном месте страницы
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.MenuNew
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS.HierarchyControlMixin
    * @mixes SBIS3.CONTROLS.TreeControlMixin
    */

   var Menu = ButtonGroupBase.extend([ListControlMixin, HierarchyControlMixin, TreeControlMixin], /** @lends SBIS3.CONTROLS.MenuNew.prototype */ {
      /**
       * @event onMenuItemActivate При активации пункта меню
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор нажатого пункта.
       * @example
       * При выборе пункта меню данный ключ ставится в значение комбобокса
       * <pre>
       *     menu.subscribe('onMenuItemActivate', function (event, id) {
       *        comboBox.setSelectedItem(id);
       *     });
       * </pre>
       */

      /**
       * @typedef {Object} ItemsMenu
       * @property {String} id Идентификатор.
       * @property {String} title Текст пункта меню.
       * @property {String} icon Иконка пункта меню.
       * @property {String} parent Идентификатор родительского пункта меню. Опция задаётся для подменю.
       * @editor icon ImageEditor
       */
      /**
       * @cfg {ItemsMenu[]} Набор исходных данных, по которому строится отображение
       * @name SBIS3.CONTROLS.Menu#items
       * @description Набор исходных данных, по которому строится отображение
       * @example
       * <pre>
       *     <options name="items" type="array">
       *        <options>
       *            <option name="id">1</option>
       *            <option name="title">Пункт1</option>
       *         </options>
       *         <options>
       *            <option name="id">2</option>
       *            <option name="title">Пункт2</option>
       *         </options>
       *         <options>
       *            <option name="id">3</option>
       *            <option name="title">ПунктПодменю</option>
       *            <option name="parent">2</option>
       *            <option name="icon">sprite:icon-16 icon-Birthday icon-primary</option>
       *         </options>
       *      </options>
       * </pre>
       * @see displayField
       * @see keyField
       * @see hierField
       * @see onMenuItemActivate
       */

      _moduleName: 'SBIS3.CONTROLS.MenuNew',
      $protected: {
         _options: {
            /**
             * @cfg {Number} Задержка перед открытием
             * @noShow
             */
            showDelay: null,
            /**
             * @cfg {Number} Задержка перед закрытием
             * @noShow
             */
            allowEnterToFolder: false,
            hideDelay: null,
            displayField : 'title',
            expand: true
         },
         _viewConstructor: MenuView
      },

      $constructor: function() {
         this._publish('onMenuItemActivate');
      },



      _initView: function(){
         Menu.superclass._initView.call(this);
         var self = this;
         this._view.subscribe('onItemHovered',this._itemHoverHadler.bind(this));
         this._view.subscribe('onItemClicked',this._itemClickedHandler.bind(this));
      },

      reviveComponents: function() {
         var pdef =  new $ws.proto.ParallelDeferred();
         pdef.push(Menu.superclass.reviveComponents.call(this));
         $ws.helpers.forEach(this._getView().getSubMenus(),function(subMenu){
            pdef.push(subMenu.reviveComponents());
         });
         return pdef.done().getResult();
      },
      //endregion public methods
      //region Protected methods
      _getItemTemplate: function() {
         return (function(item) {
            var itemData = item.item;
            if ($ws.helpers.instanceOfMixin(itemData, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
               itemData = itemData.getContents();
            }

            var
               caption = Utils.getItemPropertyValue(itemData, this._options.displayField),
               icon = Utils.getItemPropertyValue(itemData, 'icon'),
               className = Utils.getItemPropertyValue(itemData, 'className')||'',
               containerClass = item.containerClass;

            return '<component class="'+containerClass+'" data-hash="'+item.hash+'" data-component="SBIS3.CONTROLS.MenuItem">' +
               '<option name="caption">' + caption + '</option>' +
               (icon ? '<option name="icon">' + icon + '</option>' : '') +
               (className ? '<option name="className">' + className + '</option>' : '') +
               '</component>';
         }).bind(this);
      },
      _itemHoverHadler:function(e,hash,expand){
         this.getItems().getChildByHash(hash, true).setExpanded(expand);
      },
      _itemClickedHandler: function(e,hash) {
         var item = this.getItems().getChildByHash(hash, true);
         if(!item.isNode()){
            this._getView().hideSubMenus();
         }
         this._notify('onMenuItemActivate',item.getContents());
      },

      _getViewTemplate: function() {
         return MenuViewTemplate;
      }
      //endregion Protected methods
   });

   return Menu;

});