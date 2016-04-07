/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITree', [
], function () {
   'use strict';

   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.ITree', 'Interface has been removed in 3.7.3.150. Use SBIS3.CONTROLS.Data.Projection.Tree instead.');

   /**
    * Интерфейс проекции дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом исходную коллекцию.
    * @mixin SBIS3.CONTROLS.Data.Projection.ITree
    * @public
    * @deprecated интерфейс был удален в 3.7.3.150, используйте SBIS3.CONTROLS.Data.Projection.Tree
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Projection.ITree.prototype */{};
});
