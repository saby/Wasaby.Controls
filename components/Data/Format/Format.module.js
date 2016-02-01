/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Format', [
   'js!SBIS3.CONTROLS.Data.Collection.List'
], function (List) {
   'use strict';

   /**
    * Формат полей записи
    * @class SBIS3.CONTROLS.Data.Format.Format
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @public
    * @author Мальцев Алексей
    */

   var Format = List.extend(/** @lends SBIS3.CONTROLS.Data.Format.Format.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.Format',
      $protected: {
         _options: {
            /**
             * @cfg {Array.<SBIS3.CONTROLS.Data.Format.Field>} Элементы списка
             * @name SBIS3.CONTROLS.Data.Format.Format#items
             */
         },

         /**
          * @member {Array.<SBIS3.CONTROLS.Data.Format.Field>} Элементы списка
          */
         _items: []
      },


      //region SBIS3.CONTROLS.Data.Collection.List

      clear: function () {
         throw new Error('Under construction');
         Format.superclass.clear.call(this);
      },

      add: function (item, at) {
         throw new Error('Under construction');
         Format.superclass.add.apply(this, arguments);
      },

      remove: function (item) {
         throw new Error('Under construction');
         return Format.superclass.remove.apply(this, arguments);
      },

      removeAt: function (index) {
         throw new Error('Under construction');
         Format.superclass.removeAt.apply(this, arguments);
      },

      replace: function (item, at) {
         throw new Error('Under construction');
         Format.superclass.replace.apply(this, arguments);
      },

      assign: function (items) {
         throw new Error('Under construction');
         Format.superclass.assign.call(this, items);
      },

      append: function (items) {
         throw new Error('Under construction');
         Format.superclass.append.call(this, items);
      },

      prepend: function (items) {
         throw new Error('Under construction');
         Format.superclass.prepend.call(this, items);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.List

      //region Public methods

      /**
       * Добавляет поле в формат записи.
       * @param {String} name Имя поля
       * @param {SBIS3.CONTROLS.Data.Format.FieldType} type Тип поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       */
      addField: function (name, type) {
         throw new Error('Under construction');
      },

      /**
       * Возвращает индекс поля по его имени.
       * Если поля с таким именем нет, возвращает -1.
       * @param {String} name Имя поля
       * @returns {Number}
       */
      getFieldndex: function (name) {
         throw new Error('Under construction');
      },

      /**
       * Возвращает имя поля по его индексу.
       * Если индекс выходит за допустимый диапазон, генерирует исключение.
       * @param {Number} at Имя поля
       * @returns {String}
       */
      getFieldName: function (at) {
         throw new Error('Under construction');
      }

      //endregion Public methods

   });

   return Format;
});
