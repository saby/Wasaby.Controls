/* global define, $ws */
define('js!SBIS3.CONTROLS.CollectionControl.ICollectionView', [], function () {
   'use strict';

   /**
    * Интерфейс представления коллекции
    * @mixin SBIS3.CONTROLS.CollectionControl.ICollectionView
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.CollectionControl.ICollectionView.prototype */{
      /**
       * @event onKeyPressed Cобытие о нажатии клавиши
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Number} code Код клавиши
       */

      $protected: {
         _options: {
            /**
             * @cfg {String|Function} Узел DOM, в котором отображается контрол
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
             * @cfg {String|HTMLElement} Что отображается при отсутствии данных
             */
            emptyHTML: ''
         }
      },

      /**
       * Очищает представление
       */
      clear: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Отрисовывает представление
       * @param {SBIS3.CONTROLS.Data.Projection} items Проекция коллекции
       */
      render: function (items) {
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
       */
      getPagerContainer: function () {
         throw new Error('Method must be implemented');
      }
   };
});
