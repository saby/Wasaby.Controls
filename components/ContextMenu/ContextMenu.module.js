/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.ContextMenu', [
   'js!SBIS3.CONTROLS.Menu',
   'js!SBIS3.CONTROLS.PopupMixin'
], function(Menu, PopupMixin) {

   'use strict';

   /**
    * Контрол, отображающий контекстное меню.
    *
    * Стандарт описан <a href='http://axure.tensor.ru/standarts/v7/#p=контекстное_меню__версия_1_'>здесь</a>.
    *
    * @class SBIS3.CONTROLS.ContextMenu
    * @author Крайнов Дмитрий Олегович
    * @extends SBIS3.CONTROLS.Menu
    * @mixes SBIS3.CONTROLS.PopupMixin
    *
    * @demo SBIS3.Demo.ContextMenu.MyContextMenu Пример 1. Данные для меню переданы с помощью метода <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/DSMixin/methods/setDataSource/'>setDataSource()</a>.
    * Для позиционирования использованы опции <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/PopupMixin/options/verticalAlign/'>verticalAlign</a> и <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/PopupMixin/options/horizontalAlign/'>horizontalAlign</a>.
    *
    * @demo SBIS3.Demo.ContextMenu.ContextMenuItem Пример 2. Данные для меню переданы с помощью опции <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ContextMenu/options/items/'>items</a>.
    * Для отображения контекстного меню в <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/'>списках</a>
    * используем опцию <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ListView/options/contextMenu/'>contextMenu</a> - в меню будут отображены элементы <a href='https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ListView/options/itemsActions/'>itemsActions</a>.
    *
    * @control
    * @public
    * @category Button
    */

   var ContextMenu = Menu.extend([PopupMixin], /** @lends SBIS3.CONTROLS.ContextMenu.prototype */ {
      _modifyOptions: function() {
         var cfg = ContextMenu.superclass._modifyOptions.apply(this, arguments);
         cfg.className += ' controls-Menu__Popup';
         return cfg;
      },
      _itemActivatedHandler : function(id, event) {
         var menuItem = this.getItemInstance(id);
         if (!(menuItem.getContainer().hasClass('controls-Menu__hasChild'))) {
            this.hide();

            for (var j in this._subMenus) {
               if (this._subMenus.hasOwnProperty(j)) {
                  this._subMenus[j].hide();
               }
            }
         }
         this._notify('onMenuItemActivate', id, event);
      },
      _onMenuConfig : function(config) {
         return config;
      },
      _drawItemsCallback: function() {
         ContextMenu.superclass._drawItemsCallback.apply(this, arguments);
         this.recalcPosition(true);
      },

      /* Заглушка, ContextMenu не должно вызывать расчёты авторазмеров, т.к. создаётся абсолютом в body */
      _notifyOnSizeChanged: function () {
         
      }
   });

   return ContextMenu;

});