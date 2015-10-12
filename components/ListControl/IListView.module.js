/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControl.IListView', [], function () {
   'use strict';

   /**
    * Интерфейс представления списка
    * @mixin SBIS3.CONTROLS.ListControl.IListView
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.ListControl.IListView.prototype */{
      /**
       * @event onItemHovered Cобытие о наведении указателя мыши на контейнер элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Boolean} isHover Указатель наведен или ушел за пределы конейнера элемента
       * @param {Element} item DOM элемент
       */

      /**
       * @event onItemClicked Cобытие о клике по контейнеру элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Element} item DOM элемент
       */

      /**
       * @event onItemDblClicked Cобытие двойном клике по контейнеру элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Element} item DOM элемент
       */

      /**
       * Добавляет элемент в представление
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @param {Number} at Позиция, в которую добавляется элемент
       */
      addItem: function (item, at) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обновляет элемент в представлении
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       */
      updateItem: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет элемент
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       */
      removeItem: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Перемещает элемент
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @param {Number} to Позиция, на которую переместить
       */
      moveItem: function (item, to) {
         throw new Error('Method must be implemented');
      },

      /**
       * Отображает элемент в выделенном состоянии
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       */
      selectItem: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Отображает элемент в состоянии "под указателем"
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       */
      hoverItem: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Прокручивает список к элементу
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       */
      scrollToItem: function (item) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает признак, что список ориентирован горизонтально
       * @returns {Boolean}
       */
      isHorizontal: function () {
         throw new Error('Method must be implemented');
      }
   };
});
