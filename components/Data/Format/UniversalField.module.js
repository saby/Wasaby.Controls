/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.UniversalField', [
], function () {
   'use strict';

   /**
    * Универсальное поле записи
    * @class SBIS3.CONTROLS.Data.Format.UniversalField
    * @author Мальцев Алексей
    */

   var UniversalField = function() {};

   /**
    * @member {String} Название модуля
    */
   UniversalField.prototype._moduleName = 'SBIS3.CONTROLS.Data.Format.UniversalField';

   /**
    * @member {String} Имя поля
    */
   UniversalField.prototype.name = '';

   /**
    * @member {*} Значение поля по умолчанию
    */
   UniversalField.prototype.defaultValue = null;

   /**
    * @member {Boolean} Значение может быть null
    */
   UniversalField.prototype.nullable = false;

   /**
    * @member {Object} Мета-данные поля
    */
   UniversalField.prototype.meta = null;

   return UniversalField;
});
