/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS._PopupMixin', 'html!SBIS3.CONTROLS.Menu', 'js!SBIS3.CONTROLS._TreeMixin'], function(ButtonGroupBase, _PopupMixin, dot, _TreeMixin) {

   'use strict';

   /**
    * Контрол, отображающий меню всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._PopupMixin
    */

   var Menu = ButtonGroupBase.extend([_PopupMixin, _TreeMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
      _dotTplFn : dot,
      $protected: {
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
         var id = menuItem.getContainer().attr('data-id');
         if (!this._subMenus[id]) {
            var container = $('<div class="controls-Menu__submenu" data-menuId="' + this.getId() + '_' + id + '"></div>').appendTo('body');
            this._subMenus[id] = new Menu({
               parent : this,
               element: container,
               visible: false,
               target : menuItem.getContainer(),
               corner : 'tr',
               items : this._items,
               verticalAlign : {
                  side : 'top'
               },
               horizontalAlign : {
                  side : 'left'
               },
               closeByExternalClick: true
            })
         }
         this._subMenus[id].show();
      },

      _getTargetContainer : function(item, key, parItem, lvl) {
         if (!parItem) {
            return this._container;
         }
      }
   });

   return Menu;

});