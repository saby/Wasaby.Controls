/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'html!SBIS3.CONTROLS.Menu', 'js!SBIS3.CONTROLS._TreeMixin', 'js!SBIS3.CONTROLS.FloatArea', 'css!SBIS3.CONTROLS.Menu'], function(ButtonGroupBase, dot, _TreeMixin, FloatArea) {

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
         var
            id = menuItem.getContainer().attr('data-id'),
            item = this._items.getItem(id),
            parId = this._items.getParent(item),
            parent = this;
         if (parId) {
            parent = this._subMenus[parId];
         }
         if (this._subContainers[id]) {
            if (!this._subMenus[id]) {
               this._subMenus[id] = new FloatArea({
                  element: $('<div class="controls-Menu__Popup"></div>'),
                  parent : parent,
                  target : menuItem.getContainer(),
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
               });
               this._subMenus[id].getContainer().append(this._subContainers[id]);
            }
            this._subMenus[id].show();
         }
         console.log(id);
      },

      _getTargetContainer : function(item, key, parItem, lvl) {
         if (!parItem) {
            return this._container;
         }
         else {
            var
               parId = this._items.getKey(parItem),
               targetBtnContainer = $('.controls-ListView__item[data-id="'+parId+'"]', this._container);
            if (!this._subContainers[parId]) {
               this._subContainers[parId] = $('<div class="controls-Menu__submenu" data-menuId="' + this.getId() + '_' + parId + '"></div>').appendTo('body');
            }

            return this._subContainers[parId];
         }
      }
   });

   return Menu;

});