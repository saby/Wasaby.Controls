/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', [
   'js!SBIS3.CONTROLS.ButtonGroupBase',
   'html!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS._TreeMixin',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'css!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.MenuItem'

], function(ButtonGroupBase, dot, _TreeMixin, FloatArea, ControlHierarchyManager) {

   'use strict';

   /**
    * Контрол, отображающий меню всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @mixes SBIS3.CONTROLS._TreeMixin
    */

   var Menu = ButtonGroupBase.extend([_TreeMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
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
            hideDelay: null
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
                     id = $(this).attr('data-id'),
                     item = self._items.getItem(id),
                     parId = self._items.getParent(item),
                     parent;
                  if (parId) {
                     parent = self._subMenus[parId];
                  }
                  else {
                     parent = self
                  }

                  //получаем саб меню для текущей кнопки и показываем его
                  var mySubmenu;
                  if (self._subContainers[id]) {
                     if (!self._subMenus[id]) {
                        self._subContainers[id].appendTo('body');
                        self._subMenus[id] = self._createSubMenu(this, parent);
                        self._subMenus[id].getContainer().append(self._subContainers[id]);
                     }
                     mySubmenu = self._subMenus[id];
                     self._subMenus[id].show();
                  }

                  //перебираем все остальные и скрываем их по принципу вложенности
                  for (var j in self._subMenus) {
                     if ((self._subMenus.hasOwnProperty(j)) && (self._subMenus[j] !== mySubmenu)) {
                        var flag = true;
                        if (self._subMenus.hasOwnProperty(j)) {
                           flag = ControlHierarchyManager.checkInclusion(self._subMenus[j], e.target);
                        }
                        if (flag) self._subMenus[j].show(); else self._subMenus[j].hide();
                     }
                  }


               })
            }
         }
      },
      _createSubMenu : function(target, parent) {
         target = $(target);
         return new FloatArea({
            element: $('<div class="controls-Menu__Popup"></div>'),
            parent : parent,
            target : target,
            corner : 'tr',
            hierField : 'par',
            verticalAlign : {
               side : 'top'
            },
            horizontalAlign : {
               side : 'left',
               offset: 0
            },
            closeByExternalClick: true
         })
      }
   });

   return Menu;

});