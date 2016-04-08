/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ICollection', [
], function () {
   'use strict';

   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.ICollection', 'Interface has been removed in 3.7.3.150. Use SBIS3.CONTROLS.Data.Projection.Collection instead.');

   /**
    * Интерфейс проекции коллекции - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @mixin SBIS3.CONTROLS.Data.Projection.ICollection
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @implements SBIS3.CONTROLS.Data.Bind.ICollection
    * @deprecated интерфейс будет удален в 3.7.3.150, используйте SBIS3.CONTROLS.Data.Projection.Collection
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.ICollection.prototype */{};
});
