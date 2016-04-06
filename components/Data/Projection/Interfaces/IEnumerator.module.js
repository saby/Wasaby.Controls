/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.IEnumerator', [
], function () {
   'use strict';

   /**
    * Интерфейс энумератора проекции
    * @mixin SBIS3.CONTROLS.Data.Projection.IEnumerator
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @deprecated интерфейс был удален в 3.7.3.150, используйте SBIS3.CONTROLS.Data.Projection.CollectionEnumerator
    * @author Мальцев Алексей
    */

   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.IEnumerator', 'Interface has been removed in 3.7.3.150. Use SBIS3.CONTROLS.Data.Projection.CollectionEnumerator instead.');

   return /** @lends SBIS3.CONTROLS.Data.Projection.IEnumerator.prototype */{};
});
