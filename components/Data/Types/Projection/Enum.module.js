/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Enum', [
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'js!SBIS3.CONTROLS.Data.Collection.CollectionItem'
], function (Projection) {
   'use strict';

   /**
    * Проекция коллекции Перечисляемого.
    * @class SBIS3.CONTROLS.Data.Projection.Enum
    * @extends SBIS3.CONTROLS.Data.Projection.Collection
    * @public
    * @author Ганшнин Ярослав
    */

   var EnumProjection = Projection.extend([], /** @lends SBIS3.CONTROLS.Data.Projection.Collection.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Enum',
      $protected: {
         _itemModule: 'SBIS3.CONTROLS.Data.Collection.CollectionItem'
      },

      $constructor: function (cfg) {
         //console.log(cfg);

      },
      _reBuild: function() {
         this._sourceMap.length = 0;
         this._filterMap.length = 0;
         this._sortMap.length = 0;

         var enumerator = this._options.collection.getEnumerator(false),
            item;
         while ((item = enumerator.getNext())) {
            item = this._convertItem(item);
            this._sourceMap.push(item);
            this._filterMap.push(true);
         }
         this._enumerator.reIndex();
         var currentIndex = this._options.collection.get();
         this.setCurrent(this.at(currentIndex));
      },
      _convertItem: function(item) {
         if(! $ws.helpers.instanceOfModule(item, this._itemModule)){
            item = $ws.single.ioc.resolve(this._itemModule, {
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
            if(item.getHash() === hash){
               return item;
            }
         }
      },
      _notifyCurrentChange: function(newCurrent, oldCurrent, newPosition, oldPosition) {
         this._options.collection.set(newPosition);
         EnumProjection.superclass._notifyCurrentChange.apply(this,arguments);
      }

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.Enum', function(config) {
      return new EnumProjection(config);
   });

   return EnumProjection;
});
