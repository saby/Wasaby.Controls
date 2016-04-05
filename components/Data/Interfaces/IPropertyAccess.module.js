/* global define */
define('js!SBIS3.CONTROLS.Data.IPropertyAccess', [
   'js!SBIS3.CONTROLS.Data.IObject'
], function (IObject) {
   'use strict';

   /**
    * Интерфейс доступа к свойствам объекта
    * @mixin SBIS3.CONTROLS.Data.IPropertyAccess
    * @public
    * @deprecated интерфейс будет удален в 3.7.4, используйте SBIS3.CONTROLS.Data.IObject
    * @author Мальцев Алексей
    */

   $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.IPropertyAccess', 'Interface is deprecated and will be removed in 3.7.4. Use SBIS3.CONTROLS.Data.IObject instead.');

   return IObject;
});
