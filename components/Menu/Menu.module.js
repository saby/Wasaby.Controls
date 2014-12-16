/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS._PopupMixin', 'html!SBIS3.CONTROLS.Menu'], function(ButtonGroupBase, _PopupMixin, dot) {

   'use strict';

   /**
    * Контрол, отображающий меню всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._PopupMixin
    */

   var Menu = ButtonGroupBase.extend([_PopupMixin], /** @lends SBIS3.CONTROLS.Menu.prototype */ {
      _dotTplFn : dot,
      $protected: {
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

      _itemActivatedHandler : function() {
         this.hide();
      }
   });

   return Menu;

});