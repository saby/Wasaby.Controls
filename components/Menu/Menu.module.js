/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.MenuItem'

], function(ButtonGroupBase, dot, hierarchyMixin, TreeMixinDS, FloatArea) {

   'use strict';

   /**
    * Контрол, отображающий меню, всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @public
    * @author Крайнов Дмитрий Олегович
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS.hierarchyMixin
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    */

   var Menu = ButtonGroupBase.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
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
      _dotTplFn : dot,
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

      $protected: {
         _subContainers : {},
         _subMenus : {},
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
            hideDelay: null,
            /**
             * @cfg {String} Поле отображается как название
             * @translatable
             * @noShow
             */
            displayField : 'title',
            expand: true
         }
      },

      $constructor: function() {
         this._publish('onMenuItemActivate');
      },

      _getItemTemplate: function(item) {
         var
            caption = item.get(this._options.displayField),
            icon = item.get('icon') ? '<option name="icon">' + item.get('icon') + '</option>' : '',
            className = item.get('className') ? '<option name="className">' + item.get('className') + '</option>' : '',
            tooltip = item.get('tooltip') ? '<option name="tooltip">' + item.get('tooltip') + '</option>' : '',
            enabled = item.get('enabled') !== undefined ? '<option name="enabled">' + item.get('enabled') + '</option>' : '';

         return '<component data-component="SBIS3.CONTROLS.MenuItem">' +
            '<option name="caption">' + caption + '</option>' +
            '<option name="allowChangeEnable">' + this._options.allowChangeEnable + '</option>' + icon + className + tooltip + enabled +
            '</component>';
      },

      _itemActivatedHandler : function(id, event){
         var menuItem = this.getItemInstance(id);
         if (!(menuItem.getContainer().hasClass('controls-Menu__hasChild'))) {
            for (var j in this._subMenus) {
               if (this._subMenus.hasOwnProperty(j)) {
                  this._subMenus[j].hide();
               }
            }
         }
         this._notify('onMenuItemActivate', id, event);
      },

      _getTargetContainer : function(item) {
         if (!this._options.hierField) {
            return this._container;
         }
         else {
            var parId = this.getParentKey(this._dataSet, item);
            if (parId === null || parId === undefined) {
               return this._container;
            }
            else {
               if (!this._subContainers[parId]) {
                  this._subContainers[parId] = $('<div class="controls-Menu__submenu" data-parId="' + parId + '"></div>').hide();
                  this._subContainers[parId].parentCtrl = this;
                  this._subContainers[parId].appendTo(this._container);
               }

               return this._subContainers[parId];
            }
         }
      },
      _drawItems : function() {
         this.destroySubObjects();
         this._checkIcons();
         Menu.superclass._drawItems.apply(this, arguments);
      },
      //TODO: Придрот для выпуска 3.7.3
      //Обходим все дерево для пунктов и проверяем наличие иконки у хотя бы одного в каждом меню
      //При наличии таковой делаем всем пунктам в этом меню фэйковую иконку для их сдвига.
      //По нормальному можно было бы сделать через css, но имеются три различных отступа слева у пунктов
      //для разных меню и совершенно не ясно как это делать.
      _checkIcons: function() {
         var tree = this._dataSet.getTreeIndex(this._options.hierField);
         for (var i in tree) {
            if (tree.hasOwnProperty(i)) {
               var hasIcon = false,
                  icon = '',
                  childs = tree[i];
               for (var j = 0; j < childs.length; j++) {
                  icon = this._dataSet.getRecordByKey(childs[j]).get('icon');
                  if (icon) {
                     if (icon.indexOf('icon-16') !== -1) { icon = 'sprite:icon-16'; } else { icon = 'sprite:icon-24'; }
                     hasIcon = true;
                     break;
                  }
               }
               if (hasIcon) {
                  for (var j = 0; j < childs.length; j++) {
                     if (!this._dataSet.getRecordByKey(childs[j]).get('icon')) {
                        this._dataSet.getRecordByKey(childs[j]).set('icon', icon);
                     }
                  }
               }
            }
         }
      },
      _drawItemsCallback : function() {
         var
            menuItems = this.getItemsInstances(),
            self = this;
         for (var i in this._subContainers) {
            if (this._subContainers.hasOwnProperty(i)) {

               var
                  ctrl = this._subContainers[i].parentCtrl,
                  butId = this._subContainers[i].attr('data-parId'),
                  button = ctrl.getItemInstance(butId);
               button.getContainer().addClass('controls-Menu__hasChild');

            }
         }

         var instances = this.getItemsInstances();

         for (i in instances) {
            if (instances.hasOwnProperty(i)) {
               instances[i].getContainer().hover(function(e){
                  var
                     isFirstLevel = false,
                     id = $(this).attr('data-id'),
                     item = self._dataSet.getRecordByKey(id),
                     parId = null,
                     parent;
                  if (self._options.hierField) {
                     parId = self.getParentKey(self._dataSet, item);
                  }
                  if (parId) {
                     parent = self._subMenus[parId];
                  }
                  else {
                     parent = self;
                     isFirstLevel = true;
                  }

                  //получаем саб меню для текущей кнопки и показываем его
                  var mySubmenu;
                  if (self._subContainers[id]) {
                     if (!self._subMenus[id]) {
                        self._subMenus[id] = self._createSubMenu(this, parent, isFirstLevel, item);
                        self._subContainers[id].show();
                        self._subMenus[id].getContainer().append(self._subContainers[id]);
                     }
                     mySubmenu = self._subMenus[id];
                     mySubmenu.show();
                  }
               })
            }
         }
         Menu.superclass._drawItemsCallback.apply(this, arguments);
      },
      _createSubMenu : function(target, parent, isFirstLevel, item) {
         target = $(target);
         var config = this._getSubMenuConfig(isFirstLevel, item);

         config.element = $('<div class="controls-Menu__Popup controls-Menu__SubMenuPopup"></div>');
         config.parent = parent;
         config.opener = typeof parent.getOpener == 'function' ? parent.getOpener() : parent;
         config.target = target;
         return new FloatArea(config);
      },

      _getSubMenuConfig : function(isFirstLevel, item) {
         var config =  {
            corner : 'tr',
            verticalAlign : {
               side : 'top'
            },
            horizontalAlign : {
               side : 'left'
            },
            closeByExternalOver: true,
            targetPart : true
         };
         config = this._onMenuConfig(config, isFirstLevel, item);
         return config;
      },

      _onMenuConfig : function(config, isFirstLevel, item) {
         var direction;
         if (isFirstLevel) {
            direction = 'down';
         }
         if (item.get('direction')) {
            direction = item.get('direction');
         }
         if (direction) {
            switch (direction) {
               case 'down' : {
                  config.corner = 'bl';
                  break;
               }
               case 'up' : {
                  config.corner = 'tl';
                  config.verticalAlign.side = 'bottom';
                  break;
               }
               case 'right' : {
                  config.corner = 'tl';
                  config.horizontalAlign.side = 'right';
                  break;
               }
            }
         }
         return config;
      },

      destroy : function(){
         Menu.superclass.destroy.call(this);
         this.destroySubObjects();
      },

      destroySubObjects : function() {
         this._subMenus = {};
         this._subContainers = {};
         for (var j in this._subMenus) {
            if (this._subMenus.hasOwnProperty(j)) {
               this._subMenus[j].destroy();
            }
         }
      }
   });

   return Menu;

});
