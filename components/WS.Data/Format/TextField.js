/* global define */
define('js!WS.Data/Format/TextField', [
   'js!WS.Data/Format/StringField',
   'js!WS.Data/Utils'
], function (
   StringField,
   Utils
) {
   'use strict';

   /**
    * Формат поля для строк.
    * @class WS.Data/Format/TextField
    * @extends WS.Data/Format/StringField
    * @public
    * @deprecated Модуль удален в 3.7.5, используйте {@link WS.Data/Format/StringField}
    * @author Мальцев Алексей
    */

   Utils.logger.error('WS.Data/Format/TextField', 'Module has been removed in 3.7.5. Use WS.Data/Format/StringField instead.');
   return StringField;
});
