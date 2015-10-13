define('js!SBIS3.CONTROLS.ListControl.IListView', [], function () {
   'use strict';

   /**
    * Интерфейс представления списка
    * @mixin SBIS3.CONTROLS.ListControl.IListView
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.ListControl.IListView.prototype */{
      /**
       * @event onItemHovered При наведении указателя мыши на контейнер элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Boolean} isHover Указатель наведен или ушел за пределы конейнера элемента
       * @param {Element} item DOM элемент
       */

      /**
       * @event onItemClicked При клике по контейнеру элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Element} item DOM элемент
       */

      /**
       * @event onItemDblClicked При двойном клике по контейнеру элемента
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента
       * @param {Element} item DOM элемент
       */

      $protected: {
         _options: {
            /**
             * @cfg {jQuery} Узел DOM, в котором отображается контрол
             */
            rootNode: '',

            /**
             * @cfg {String|Function} Шаблон отображения контрола
             */
            template: '',

            /**
             * @cfg {String|Function} Шаблон разметки каждого элемента коллекции
             */
            itemTemplate: '',

            /**
             * @cfg {Function} Селектор шаблона разметки для каждого элемента коллекции. Если указан, то {@link itemTemplate} не действует.
             */
            itemTemplateSelector: undefined,

            /**
             * @cfg {SBIS3.CONTROLS.PagerMore#PagerType} Вид контроллера постраничной навигации. По умолчанию - scroll
             */
            pagerType: 'scroll',

            /**
             * @cfg {String|HTMLElement} Что отображается при отсутствии данных
             */
            emptyHTML: ''
         }
      },

      /**
       * Отрисовывает представление
       * @param {SBIS3.CONTROLS.Data.Projection.Collection} items Проекция коллекции
       */
      render: function (items) {
         throw new Error('Method must be implemented');
      },

      /**
       * Очищает представление
       */
      clear: function () {
         throw new Error('Method must be implemented');
      },
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
      },

      /**
       * Проверяет, что в узле не отображается ни один элемент, и отображает соответствующее сообщение
       * @param {jQuery} [parent] Родительский узел
       */
      checkEmpty: function (parent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Отображает индикатор загрузки
       * @param {Number} target Коллекция, содержимое которой загружается
       */
      showLoadingIndicator: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Скрывает индикатор загрузки
       * @param {Number} target Коллекция, содержимое которой загрузилось
       */
      hideLoadingIndicator: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает узел под pager
       * @param {SBIS3.CONTROLS.Data.Projection} items Проекция коллекции
       */
      getPagerContainer: function (items) {
         throw new Error('Method must be implemented');
      }
   };
});
