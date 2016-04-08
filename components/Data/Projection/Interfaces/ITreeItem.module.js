/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITreeItem', [
], function () {
   'use strict';

   $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Projection.ITreeItem', 'Interface has been removed in 3.7.3.150. Use SBIS3.CONTROLS.Data.Projection.TreeItem instead.');

   /**
    * Интерфейс элемента дерева
    * @mixin SBIS3.CONTROLS.Data.Projection.ITreeItem
    * @implements SBIS3.CONTROLS.Data.Projection.ICollectionItem
    * @public
    * @deprecated интерфейс был удален в 3.7.3.150, используйте SBIS3.CONTROLS.Data.Projection.TreeItem
    * @author Мальцев Алексей
    */
   return /** @lends SBIS3.CONTROLS.Data.Projection.ITreeItem.prototype */{};
});
