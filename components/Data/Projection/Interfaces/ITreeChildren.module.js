/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITreeChildren', [
], function () {
   'use strict';

   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.ITreeChildren', 'Interface has been removed in 3.7.3.150. Use SBIS3.CONTROLS.Data.Projection.TreeChildren instead.');

   /**
    * Интерфейс дочерних элементов узла дерева
    * @mixin SBIS3.CONTROLS.Data.Projection.ITreeChildren
    * @implements SBIS3.CONTROLS.Data.Collection.IList
    * @public
    * @deprecated интерфейс был удален в 3.7.3.150, используйте SBIS3.CONTROLS.Data.Projection.TreeChildren
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Projection.ITreeChildren.prototype */{};
});
