/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Enum', [
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Di'
], function (CollectionProjection, Di) {
   'use strict';

   /**
    * Проекция коллекции Перечисляемого.
    * @class SBIS3.CONTROLS.Data.Projection.Enum
    * @extends SBIS3.CONTROLS.Data.Projection.Collection
    * @public
    * @author Ганшнин Ярослав
    */

   var EnumProjection = CollectionProjection.extend([], /** @lends SBIS3.CONTROLS.Data.Projection.Enum.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Enum',

      _convertItem: function(item) {
         if (!$ws.helpers.instanceOfModule(item, this._itemModule)) {
            item = Di.resolve(this._itemModule, {
               owner: this,
               contents: item
            });
         }
         return item;

      },

      getByHash: function(hash) {
         var enumerator = this.getEnumerator(false),
            item;
         while ((item = enumerator.getNext())) {
            if (item.getHash() === hash) {
               return item;
            }
         }
      },

      _notifyCurrentChange: function(newCurrent, oldCurrent, newPosition, oldPosition) {
         this._$collection.set(newPosition);
         EnumProjection.superclass._notifyCurrentChange.apply(this,arguments);
      }

   });

   Di.register('projection.enum', EnumProjection);

   return EnumProjection;
});
