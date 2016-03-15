/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FormatsFactory', [
   'js!SBIS3.CONTROLS.Data.Format.Format',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
], function (Format, FieldsFactory) {
   'use strict';

   /**
    * Фабрика форматов - конструирует формат по декларативному описанию
    * @class SBIS3.CONTROLS.Data.Format.FormatsFactory
    * @public
    * @author Мальцев Алексей
    */

   var FormatsFactory = /** @lends SBIS3.CONTROLS.Data.Format.FormatsFactory.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.FormatsFactory',

      //region Public methods

      /**
       * Конструирует формат полей по декларативному описанию
       * @param {Array.<SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration>} declaration Декларативное описание
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @static
       */
      create: function(declaration) {
         if (!declaration || !(declaration instanceof Array)) {
            throw new TypeError(this._moduleName + '::create(): declaration should be an instance of Array');
         }
         var format = new Format();
         for (var i = 0; i < declaration.length; i++) {
            format.add(FieldsFactory.create(declaration[i]));
         }
         return format;
      }

      //endregion Public methods

   };

   return FormatsFactory;
});
