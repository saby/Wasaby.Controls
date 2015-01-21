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
    * Контрол, отображающий меню всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   var Menu = ButtonGroupBase.extend([TreeMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
      _dotTplFn : dot,
      $protected: {
         _subContainers : {},
         _subMenus : {},
         _options: {
            /**
             * @cfg {Number} Задержка перед открытием
             */
            showDelay: null,
            /**
             * @cfg {Number} Задержка перед закрытием
             */
            hideDelay: null,
            /**
             * @typedef {Object} firstLevelDirection
             * @variant right
             * @variant down
             */
            /**
             * @cfg {firstLevelDirection} Задержка перед закрытием
             */
            firstLevelDirection: 'down'
         }
      },

      $constructor: function() {
         if (this._items.getItemsCount()) {
            this._drawItems();
         }
      },

      _getItemClass : function() {
         return 'js!SBIS3.CONTROLS.MenuItem';
      },

      _getAddOptions : function(item) {
         return {
            caption : item.title,
            icon : item.icon,
            handlers : {
               onActivated : item.handler || function(){}
            }
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
         var self = this;
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
                        self._subMenus[id] = self._createSubMenu(this, parent, isFirstLevel);
                        self._subMenus[id].getContainer().append(self._subContainers[id]);
                     }
                     mySubmenu = self._subMenus[id];
                     self._subMenus[id].show();
                  }
               })
            }
         }
      },
      _createSubMenu : function(target, parent, isFirstLevel) {
         target = $(target);
         var config = this._getSubMenuConfig(isFirstLevel);

         config.element = $('<div class="controls-Menu__Popup"></div>');
         config.parent = parent;
         config.target = target;
         return new FloatArea(config)
      },

      _getSubMenuConfig : function(isFirstLevel) {
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
         config = this._onMenuConfig(config, isFirstLevel);
         return config;
      },

      _onMenuConfig : function(config, isFirstLevel) {
         if (isFirstLevel && this._options.firstLevelDirection == 'down') {
            config.corner = 'bl';
            return config;
         }
         else {
            return config;
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