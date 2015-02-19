/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', [
   'js!SBIS3.CONTROLS.ButtonGroupBase',
   'html!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'css!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.MenuItem'

], function(ButtonGroupBase, dot, TreeMixin, FloatArea, ControlHierarchyManager) {

   'use strict';

   /**
    * Контрол, отображающий меню, всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   var Menu = ButtonGroupBase.extend([TreeMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
      /**
       * @event onMenuItemActivate
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      _dotTplFn : dot,
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
            hideDelay: null
         }
      },

      $constructor: function() {
         if (this._items.getItemsCount()) {
            this._drawItems();
         }
         this._publish('onMenuItemActivate');
      },

      _getItemClass : function() {
         return 'js!SBIS3.CONTROLS.MenuItem';
      },

      _getAddOptions : function(item) {
         return {
            caption : item.title,
            icon : item.icon
         }
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

      _getTargetContainer : function(item, key, parItem, lvl) {
         if (!parItem) {
            return this._container;
         }
         else {
            var parId = this._items.getKey(parItem);
            if (!this._subContainers[parId]) {
               this._subContainers[parId] = $('<div class="controls-Menu__submenu" data-parId="' + parId + '"></div>');
               this._subContainers[parId].parentCtrl = this;
            }

            return this._subContainers[parId];
         }
      },
      _drawItems : function() {
         this.destroySubObjects();
         Menu.superclass._drawItems.call(this);
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
                     item = self._items.getItem(id),
                     parId = self._items.getParent(item),
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

         config.element = $('<div class="controls-Menu__Popup"></div>');
         config.parent = parent;
         config.target = target;
         return new FloatArea(config)
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
      addSubMenu : function(pointsArr, id) {
         for (var i = 0; i < pointsArr.length; i++) {
            pointsArr[i][this._options.hierField] = id;
            this._items.addItem(pointsArr[i]);
         }
         this._drawItems();
      },
      destroySubMenu : function(id) {
         var childItems = this._items.getChildItems(id);
         for (var i = 0; i < childItems.length; i++) {
            this._items.destroyItem(this._items.getKey(childItems[i]));
         }
         this._drawItems();
      },

      hasSubMenu : function(id) {
         return this._items.hasChild(id)
      },

      setItemTitle : function(id, title) {
         var item = this._items.getItem(id);
         item.title = title;
         this._drawItems();
      }
   });

   return Menu;

});