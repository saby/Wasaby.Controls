/*global define*/
define('js!SBIS3.CONTROLS.ContextMenuNew', ['js!SBIS3.CONTROLS.MenuNew', 'js!SBIS3.CONTROLS.PopupMixin', 'html!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.ContextMenuView'], function(Menu, PopupMixin, dotTplFn, MenuView) {

   'use strict';

   /**
    * Контрол, отображающий горизонтальное меню.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.ContextMenu
    * @control
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.CollectionMixin
    */

   var ContextMenu = Menu.extend([PopupMixin], /** @lends SBIS3.CONTROLS.ContextMenu.prototype */ {
      _dotTplFn: dotTplFn,
      _moduleName: 'SBIS3.CONTROLS.ContextMenu',
      $protected: {
         _viewConstructor: MenuView
      },
      _itemClickedHandler: function(e,hash) {
         var item = this.getItemsProjection().getByHash(hash);
         if(!item.isNode()){
            this.hide();
         }
         this._notify('onMenuItemActivate',item.getContents());
      }

   });

   return ContextMenu;

});