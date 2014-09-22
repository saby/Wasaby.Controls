/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListView',
      ['js!SBIS3.CORE.Control',
       'js!SBIS3.CONTROLS._CollectionMixin',
       'js!SBIS3.CONTROLS._MultiSelectorMixin'],
      function(Control, CollectionMixin, MultiSelectorMixin) {

   'use strict';

   /**
    * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
    * @class SBIS3.CONTROLS.ListView
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._MultiSelectorMixin
    * @control
    */

   var ListView = Control.Control.extend( [CollectionMixin, MultiSelectorMixin],/** @lends SBIS3.CONTROLS.ListView.prototype */ {
      $protected: {
         _dotItemTpl: null,
         _$itemsContainer: null,
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
         var self = this;
         this._dotItemTpl = doT.template(self._options.itemTemplate);
         this._$itemsContainer = $(this._options.itemsContainer);
         this._container.html(this._$itemsContainer).css('display','inline-block');
         this.redraw();
      },

      /**
       * Заново отрисовать набор
       */
      redraw: function(){
         var self = this;
         this._items.iterate(function (item, key) {
            self._$itemsContainer.append(self._dotItemTpl({key: key, title: item.title}));
         });
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