/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListView', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
    * @class SBIS3.CONTROLS.ListView
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._MultiSelectorMixin
    * @control
    */

   var ListView = Control.Control.extend( /** @lends SBIS3.CONTROLS.ListView.prototype */ {
      $protected: {
         _options: {
            /**
             * Элемент, внутри которого отображается набор
             * @cfg {String|jQuery|HTMLElement}
             */
            itemsContainer: null,
            /**
             * @cfg {Array} Набор действий, над элементами, отображающийся в виде иконок. Можно использовать для массовых операций.
             */
            itemsActions: null,
            /**
             * @cfg {Boolean} Разрешено или нет перемещение элементов Drag-and-Drop
             */
            itemsDragNDrop: false,
            /**
             * @cfg {String|jQuery|HTMLElement} Что отображается когда нет записей
             */
            emptyHTML: null
         }
      },

      $constructor: function() {

      },

      /**
       * Заново отрисовать набор
       */
      redraw: function(){

      },

      /**
       * Установить, что отображается когда нет записей
       * @param html содержимое блока
       */
      setEmptyHTML: function(html){

      }

   });

   return ListView;

});