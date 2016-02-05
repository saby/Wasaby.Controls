/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeChildrenByItemPropertyStrategy', [
   'js!SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (ITreeChildrenStrategy, Utils) {
   'use strict';

   /**
    * Стратегия получения дочерних элементов, находящихся в свойстве родительского
    * @class SBIS3.CONTROLS.Data.Projection.TreeChildrenByItemPropertyStrategy
    * @mixes SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy
    */
   return $ws.core.extend({}, [ITreeChildrenStrategy], /** @lends SBIS3.CONTROLS.Data.Projection.TreeChildrenByItemPropertyStrategy.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeChildrenByItemPropertyStrategy',
      getChildren: function(parent) {
         return parent.isRoot() ?
            this._options.source.toArray() :
            Utils.getItemPropertyValue(
               parent.getContents(),
               this._options.settings.childrenProperty
            );
      },
      getItemConverter: function(parent) {
         return function(item) {
            return $ws.single.ioc.resolve(this._itemModule, {
               contents: item,
               owner: this,
               parent: parent,
               node: !!Utils.getItemPropertyValue(item, this._options.nodeProperty)
            });
         };
      }
   });
});
