/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
   'js!SBIS3.CONTROLS.Data.Format.Format'
], function (Format) {
   'use strict';

   /**
    * Миксин, предоставляющий поведение владения форматом полей
    * @mixin SBIS3.CONTROLS.Data.FormattableMixin
    * @public
    * @author Мальцев Алексей
    */

   var FormattableMixin = /**@lends SBIS3.CONTROLS.Data.FormattableMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Format.Format|Object} Формат полей
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
             *          type: 'Integer'
             *       }, {
             *          name: 'login'
             *          type: 'String'
             *       }]
             *    });
             * </pre>
             */
            format: null
         }
      },

      //region Public methods

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @see format
       */
      getFormat: function () {
         return this._getFormat.clone();
      },

      /**
       * Добавляет поле в формат.
       * Если позиция не указана (или указана как -1), поле добавляется в конец формата.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля
       * @param {Number} [at] Позиция поля
       * @see format
       * @see removeField
       */
      addField: function(format, at) {
         this._getFormat().add(format, at);
      },

      /**
       * Удаляет поле из формата по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       * @see format
       * @see addField
       * @see removeFieldAt
       */
      removeField: function(name) {
         this.removeFieldAt(
            this._getFormat().getFieldndex(name)
         );
      },

      /**
       * Удаляет поле из формата по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {Number} at Позиция поля
       * @see format
       * @see addField
       * @see removeField
       */
      removeFieldAt: function(at) {
         this._getFormat().removeAt(at);
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _getFormat: function () {
         this._buildFormat();
         return this._options.format;
      },

      /**
       * Строит формат (если еще не был построен)
       * @protected
       */
      _buildFormat: function() {
         if (!this.options.format) {
            this.options.format = new Format();
         }
         if (Object.getPrototypeOf(this.options.format) === Object.prototype) {
            this.options.format = Format.fromDeclaration(this.options.format);
         }
         if (!$ws.helpers.instanceOfModule(this.options.format, 'SBIS3.CONTROLS.Data.Format.Format')) {
            throw new TypeError('Format should be instance of SBIS3.CONTROLS.Data.Format.Format');
         }
      }

      //endregion Protected methods
   };

   return FormattableMixin;
});
