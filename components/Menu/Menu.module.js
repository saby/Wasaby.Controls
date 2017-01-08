/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', [
   "Core/CommandDispatcher",
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.MenuItem',
   'js!WS.Data/Relation/Hierarchy',
   'js!SBIS3.CONTROLS.CommandsSeparator',
   'Core/helpers/markup-helpers',
   'Core/Sanitize',
   "Core/IoC"

], function(CommandDispatcher, ButtonGroupBase, dot, hierarchyMixin, TreeMixin, FloatArea, MenuItem, Hierarchy, CommandsSeparator, mkpHelpers, Sanitize, IoC) {

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
        * @translatable title
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
        * @see displayProperty
        * @see idProperty
        * @see parentRproperty
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
             * @noShow
             */
            displayProperty : 'title',
            expand: true,
            /**
             * @cfg {String} Поле исходя из которого скрываются дополнительные элементы меню
             */
            additionalProperty: null
         }
      },

      _modifyOptions: function (cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('Menu', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }
         return Menu.superclass._modifyOptions.apply(this, arguments);
      },

      $constructor: function() {
         this._publish('onMenuItemActivate');
         CommandDispatcher.declareCommand(this, 'toggleAdditionalItems', this._toggleAdditionalItems);
      },
      init: function() {
         Menu.superclass.init.apply(this, arguments);
         // Предотвращаем всплытие focus и mousedown с контейнера меню, т.к. это приводит к потере фокуса
         this._container.on('mousedown focus', this._blockFocusEvents);
      },

      _toggleAdditionalItems: function() {
         this.getContainer().toggleClass('controls-Menu-showAdditionalItems');
         this._notifyOnSizeChanged(this, this);
      },

      _blockFocusEvents: function(event) {
         event.preventDefault();
         event.stopPropagation();
      },
      _getItemTemplate: function(item) {
         var
             isEnabled = item.get('enabled'),
             visible = item.get('visible'),
             caption = Sanitize(item.get(this._options.displayProperty), {validNodes: {component: true}}),
             options = {
               className: item.get('className'),
               activableByClick: false,
               command: item.get('command'),
               commandArgs: item.get('commandArgs'),
               enabled: isEnabled === undefined ? true : isEnabled,
               visible: visible === undefined ? true : visible,
               icon: item.get('icon'),
               tooltip: item.get('tooltip'),
               allowChangeEnable: item.get('allowChangeEnable') !== undefined ? item.get('allowChangeEnable') : this._options.allowChangeEnable
            };
         if(this._options.additionalProperty && item.get(this._options.additionalProperty)){
            options.className = (options.className ? options.className : '') + ' controls-MenuItem-additional';
         }
         return '<component data-component="SBIS3.CONTROLS.MenuItem" config="' + mkpHelpers.encodeCfgAttr(options) + '">' +
               '<option name="caption" type="string">' + caption + '</option>' +
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
         if (!this._options.parentProperty) {
            return this._getItemsContainer();
         }
         else {
            var parId = item.get(this._options.parentProperty);
            if (parId === null || parId === undefined) {
               return this._getItemsContainer();
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

      _getItemsContainer: function () {
         return $('.controls-Menu__itemsContainer', this._container);
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
         var parentProperty = this._options.parentProperty,
            nodeProperty = this._options.nodeProperty,
            hierarchy = new Hierarchy({
               idProperty: this._items.getIdProperty(),
               parentProperty: parentProperty,
               nodeProperty: nodeProperty
            }),
            parents = {},
            children,
            child,
            pid,
            i,
            icon;

         this._items.each(function(item) {
            icon = item.get('icon');
            if (icon) {
               pid = item.get(parentProperty);
               if (!parents.hasOwnProperty(pid)) {
                  parents[pid] = [pid, icon.indexOf('icon-16') === -1 ? 'sprite:icon-24' : 'sprite:icon-16'];
               }
            }
         });

         for (var key in parents) {
            if (parents.hasOwnProperty(key)) {
               children = hierarchy.getChildren(parents[key][0], this._items);
               for (i = 0; i < children.length; i++) {
                  child = children[i];
                  if (!child.get('icon')) {
                     child.set('icon', parents[key][1]);
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
                     item = self._items.getRecordById(id),
                     parId = null,
                     parent;
                  if (self._options.parentProperty) {
                     parId = item.get(self._options.parentProperty);
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
                        // Предотвращаем всплытие focus и mousedown с контейнера меню, т.к. это приводит к потере фокуса
                        self._subMenus[id]._container.on('mousedown focus', self._blockFocusEvents);
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
            allowOverlapTarget: true,
            handlers: {
               'onShow': function(){
                  this._notify('onNodeExpand', this._options.item.getId());
               },
               'onClose': function(){
                  this._notify('onNodeCollapse', this._options.item.getId());
               }
            },
            closeByExternalOver: true,
            targetPart : true,
            item: item
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

      /* Само меню не должно вызывать перерасчёта у соседних элементов,
         т.к. создаётся абсолютом в body, однако, в меню могу лежать контролы,
         которым требуется расчитывать ширину, поэтому запускаем расчёты только для дочерних */
      _setVisibility: function(show) {
         Menu.superclass._setVisibility.apply(this, arguments);
         if(show) {
            this._resizeChilds();
         }
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
