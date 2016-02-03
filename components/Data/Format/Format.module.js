/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Format', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Serializer'
], function (List, Serializer) {
   'use strict';

   /**
    * Формат полей
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
         //Format.superclass.clear.call(this);
         throw new Error('Under construction');
      },

      add: function (item, at) {
         //Format.superclass.add.apply(this, arguments);
         throw new Error('Under construction');
      },

      remove: function (item) {
         //return Format.superclass.remove.apply(this, arguments);
         throw new Error('Under construction');
      },

      removeAt: function (index) {
         //Format.superclass.removeAt.apply(this, arguments);
         throw new Error('Under construction');
      },

      replace: function (item, at) {
         //Format.superclass.replace.apply(this, arguments);
         throw new Error('Under construction');
      },

      assign: function (items) {
         //Format.superclass.assign.call(this, items);
         throw new Error('Under construction');
      },

      append: function (items) {
         //Format.superclass.append.call(this, items);
         throw new Error('Under construction');
      },

      prepend: function (items) {
         //Format.superclass.prepend.call(this, items);
         throw new Error('Under construction');
      },

      //endregion SBIS3.CONTROLS.Data.Collection.List

      // region SBIS3.CONTROLS.Data.SerializableMixin
      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region Public methods

      /**
       * Добавляет поле в формат.
       * Если поле с таким именем уже есть, генерирует исключение.
       * @param {String} name Имя поля
       * @param {SBIS3.CONTROLS.Data.Format.FieldType} type Тип поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       */
      addField: function (name, type) {
         throw new Error('Under construction');
      },

      /**
       * Удаляет поле из формата по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       */
      removeField: function (name) {
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
      },

      /**
       * Клонирует формат
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       */
      clone: function() {
         var serializer = new Serializer();
         return JSON.parse(
            JSON.stringify(this, serializer.serialize),
            serializer.deserialize
         );
      }

      //endregion Public methods

   });

   /**
    * Конструирует формат полей по декларативному описанию
    * @param {Object} declaration Декларативное описание
    * @returns {SBIS3.CONTROLS.Data.Format.Format}
    * @static
    */
   Format.fromDeclaration = function(declaration) {
      throw new Error('Under construction');
   };

   return Format;
});
