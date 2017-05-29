/* global define */
define('js!WS.Data/Format/FormatsFactory', [
   'js!WS.Data/Format/Format',
   'js!WS.Data/Format/FieldsFactory'
], function (
   Format,
   FieldsFactory
) {
   'use strict';

   /**
    * Фабрика форматов - конструирует формат по декларативному описанию
    * @class WS.Data/Format/FormatsFactory
    * @public
    * @author Мальцев Алексей
    */

   var FormatsFactory = /** @lends WS.Data/Format/FormatsFactory.prototype */{
      _moduleName: 'WS.Data/Format/FormatsFactory',

      //region Public methods

      /**
       * Конструирует формат полей по декларативному описанию
       * @param {Array.<WS.Data/Format/FieldsFactory/FieldDeclaration.typedef>} declaration Декларативное описание
       * @return {WS.Data/Format/Format}
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
