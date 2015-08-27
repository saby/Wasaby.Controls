/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'js!SBIS3.CONTROLS.MenuItem'

], function(ButtonGroupBase, dot, hierarchyMixin, TreeMixin, FloatArea, ControlHierarchyManager) {

   'use strict';

   /**
    * Контрол, отображающий меню, всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @public
    * @author Крайнов Дмитрий Олегович
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   var Menu = ButtonGroupBase.extend([hierarchyMixin, TreeMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
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
            icon = item.get('icon'),
            className = item.get('className');

         return '<component data-component="SBIS3.CONTROLS.MenuItem"'+className+'>' +
            '<option name="caption">'+caption+'</option>'+
            '<option name="icon">'+icon+'</option>'+
            '<option name="className">'+className+'</option>'+
            '</component>';
      },

      _itemActivatedHandler : function(menuItem) {
         if (!(menuItem.getContainer().hasClass('controls-Menu__hasChild'))) {
            for (var j in this._subMenus) {
               if (this._subMenus.hasOwnProperty(j)) {
                  this._subMenus[j].hide();
               }
            }
         }


      },

      _getTargetContainer : function(item) {
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
      },
      _drawItems : function() {
         this.destroySubObjects();
         Menu.superclass._drawItems.apply(this, arguments);
      },
      _drawItemsCallback : function() {
         var
            menuItems = this.getItemsInstances(),
            self = this;
         for (var i in menuItems) {
            if (menuItems.hasOwnProperty(i)){
               menuItems[i].subscribe('onActivated', function () {
                  self._notify('onMenuItemActivate', this.getContainer().attr('data-id'));
               });
            }
         }
         for (i in this._subContainers) {
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
                     parId = self.getParentKey(self._dataSet, item),
                     parent;
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
                        self._subContainers[id].appendTo('body');
                        self._subMenus[id] = self._createSubMenu(this, parent, isFirstLevel, item);
                        self._subMenus[id].getContainer().append(self._subContainers[id]);
                     }
                     mySubmenu = self._subMenus[id];
                     mySubmenu.show();
                  }
               })
            }
         }

      },
      _createSubMenu : function(target, parent, isFirstLevel, item) {
         target = $(target);
         var config = this._getSubMenuConfig(isFirstLevel, item);

         config.element = $('<div class="controls-Menu__Popup controls-Menu__SubMenuPopup"></div>');
         if (this._container.hasClass('controls-Menu__32px')) {
            config.element.addClass('controls-Menu__32px');
         }
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
         if (item.direction) {
            direction = item.direction;
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
      },
      /*TODO Методы для Зуева, посмотреть в будущем нужны ли они*/
       /**
        * Метод добавления подменю.
        * @param {Array} pointsArr Описание подменю.
        * @param {String} id Идентификатор пункта меню.
        * @example
        * <pre>
        *    menu.addSubMenu(id, [
        *       {
        *          title: 'save',
        *          icon: "sprite:icon-16 icon-Save icon-primary",
        *          id: "save",
        *          parent: 1
        *       },
        *       {
        *          title: 'print',
        *          icon: "sprite:icon-16 icon-Print icon-primary",
        *          id: "print",
        *          parent: 1
        *       }
        *    ]);
        * </pre>
        * @see items
        * @see hierField
        * @see keyField
        * @see destroySubMenu
        * @see hasSubMenu
        */
      addSubMenu : function(pointsArr, id) {
         for (var i = 0; i < pointsArr.length; i++) {
            pointsArr[i][this._options.hierField] = id;
            this._items.addItem(pointsArr[i]);
         }
         this._drawItems();
      },
       /**
        * Метод разрушению подменю по идентификатору.
        * @param {String|Number} id
        */
      destroySubMenu : function(id) {
         var childItems = this._items.getChildItems(id);
         for (var i = 0; i < childItems.length; i++) {
            this._items.destroyItem(this._items.getKey(childItems[i]));
         }
         this._drawItems();
      },
       /**
        * Метод получения признака существования подменю
        * @param id
        * @returns {*}
        */
      hasSubMenu : function(id) {
         return this._items.hasChild(id)
      },
       /**
        * Метод замены текста пункта меню
        * @param {String|Number} id Идентификатор пункта меню.
        * @param {String} title Новый текст пункта меню.
        * @see items
        */
      setItemTitle : function(id, title) {
         var item = this._items.getItem(id);
         item.title = title;
         this._drawItems();
      }
   });

   return Menu;

});