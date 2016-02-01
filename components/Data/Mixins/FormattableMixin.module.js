/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
], function () {
   'use strict';

   /**
    * Миксин, позволяющий производить операции с форматом полей объекта
    * @mixin SBIS3.CONTROLS.Data.FormattableMixin
    * @public
    * @author Мальцев Алексей
    */

   var FormattableMixin = /**@lends SBIS3.CONTROLS.Data.FormattableMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Format.Format|Object} Формат полей записи
             * @see getFormat
             * @example
             * <pre>
             *    var user = new Record({
             *       format: new UserFormat
             *    });
             * </pre>
             * @example
             * <pre>
             *    var users = new RecordSet({
             *       format: [{
             *          name: 'id'
             *          type: 'integer'
             *       }, {
             *          name: 'login'
             *          type: 'string'
             *       }]
             *    });
             * </pre>
             */
            format: null
         }
      },

      //region Public methods

      /**
       * Возвращает формат полей записи (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @see format
       */
      getFormat: function () {
         return this._options.format;
      },

      /**
       * Добавляет поле в формат записи.
       * Если позиция не указана (или указана как -1), поле добавляется в конец формата.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * Если запись принадлежит рекордсету, генерирует исключение.
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля
       * @param {Number} [at] Позиция поля
       * @param {*} [value] Значение поля
       * @see format
       * @see removeField
       */
      addField: function(format, at, value) {
         //this._getOwnedFormat().add(format, at);
         throw new Error('Under construction');
      },

      /**
       * Удаляет поле из формата записи по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * Если запись принадлежит рекордсету, генерирует исключение.
       * @param {String} name Имя поля
       * @see format
       * @see addField
       * @see removeFieldAt
       */
      removeField: function(name) {
         throw new Error('Under construction');
      },

      /**
       * Удаляет поле из формата записи по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * Если запись принадлежит рекордсету, генерирует исключение.
       * @param {Number} at Позиция поля
       * @see format
       * @see addField
       * @see removeField
       */
      removeFieldAt: function(at) {
         //this._getOwnedFormat().removeAt(at);
         throw new Error('Under construction');
      }

      //endregion Public methods

      //region Protected methods
      //endregion Protected methods
   };

   return FormattableMixin;
});
