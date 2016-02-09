/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeChildrenByParentIdStrategy', [
   'js!SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (ITreeChildrenStrategy, Utils) {
   'use strict';

   /**
    * Стратегия получения дочерних элементов по идентификатору родителя
    * @class SBIS3.CONTROLS.Data.Projection.TreeChildrenByParentIdStrategy
    * @mixes SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy
    */
   return $ws.core.extend({}, [ITreeChildrenStrategy], /** @lends SBIS3.CONTROLS.Data.Projection.TreeChildrenByParentIdStrategy.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeChildrenByParentIdStrategy',
      getChildren: function(parent) {
         return $ws.helpers.map(this._options.source.getIndiciesByValue(
            this._options.settings.parentProperty,
            Utils.getItemPropertyValue(
               parent.getContents(),
               this._options.settings.idProperty
            )
         ), (function(index) {
            return this._options.source.at(index);
         }).bind(this));
      },
      getItemConverter: function() {
         var source = this._options.source;
         return function(item) {
            //FIXME: getIndex не оптимально, оптимизировать
            return this.at(source.getIndex(item));
         };
      }
   });
});
