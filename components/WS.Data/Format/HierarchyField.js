/* global define */
define('js!WS.Data/Format/HierarchyField', [
   'js!WS.Data/Format/Field',
   'js!WS.Data/Format/IdentityField',
   'js!WS.Data/Utils'
], function (
   Field,
   IdentityField,
   Utils
) {
   'use strict';

   /**
    * Формат поля иерархии
    *
    * @class WS.Data/Format/HierarchyField
    * @extends WS.Data/Format/Field
    * @public
    * @deprecated Модуль удален в 3.7.5, используйте {@link WS.Data/Format/IdentityField}
    * @author Мальцев Алексей
    */

   var HierarchyField = Field.extend(/** @lends WS.Data/Format/HierarchyField.prototype */{
      _moduleName: 'WS.Data/Format/HierarchyField',

      /**
       * @cfg {String} Тип элементов
       * @name WS.Data/Format/HierarchyField#kind
       * @see getKind
       */
      _$kind: '',

      //region Public methods

      /**
       * Возвращает тип элементов
       * @return {String}
       * @see dictionary
       */
      getKind: function () {
         return this._$kind;
      },

      getDefaultValue: function() {
         if (this._$kind && this._$kind === 'Identity') {
            return [null];
         }
         return null;
      }

      //endregion Public methods

   });

   Utils.logger.error('WS.Data/Format/HierarchyField', 'Module has been removed in 3.7.5. Use WS.Data/Format/IdentityField instead.');
   return HierarchyField;
});
