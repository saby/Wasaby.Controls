/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ContextMenu', ['js!SBIS3.CONTROLS.Menu', 'js!SBIS3.CONTROLS.PopupMixin', 'html!SBIS3.CONTROLS.ContextMenu'], function(Menu, PopupMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий горизонтальное меню.
    * @class SBIS3.CONTROLS.ContextMenu
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.CollectionMixin
    */

   var ContextMenu = Menu.extend([PopupMixin], /** @lends SBIS3.CONTROLS.ContextMenu.prototype */ {
      _dotTplFn : dotTplFn,
      _itemActivatedHandler : function(menuItem) {
         if (!(menuItem.getContainer().hasClass('controls-Menu__hasChild'))) {
            this.hide();

            for (var j in this._subMenus) {
               if (this._subMenus.hasOwnProperty(j)) {
                  this._subMenus[j].hide();
               }
            }
         }


      },
      _onMenuConfig : function(config) {
         return config;
      },
      _drawItemsCallback: function() {
         ContextMenu.superclass._drawItemsCallback.apply(this, arguments);
         this.recalcPosition(true);
      }
   });

   return ContextMenu;

});