/* global define */
define('js!WS.Data/Format/UniversalField', [
], function () {
   'use strict';

   /**
    * Универсальное поле.
    * @class WS.Data/Format/UniversalField
    * @author Мальцев Алексей
    */

   var UniversalField = function() {};

   /**
    * @member {String} Название модуля
    */
   UniversalField.prototype._moduleName = 'WS.Data/Format/UniversalField';

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
