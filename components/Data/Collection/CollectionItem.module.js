/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.CollectionItem', [
   'js!SBIS3.CONTROLS.Data.Collection.ICollectionItem',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin'
], function (ICollectionItem, IHashable, HashableMixin) {
   'use strict';

   /**
    * Элемент дерева
    * @class SBIS3.CONTROLS.Data.Collection.CollectionItem
    * @mixes SBIS3.CONTROLS.Data.Collection.ICollectionItem
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */
   var CollectionItem = $ws.proto.Abstract.extend([ICollectionItem, IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Collection.CollectionItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.CollectionItem',
      $protected: {
         _hashPrefix: 'collection-item-'
      },

      //region SBIS3.CONTROLS.Data.Collection.ICollectionItem

      getContents: function () {
         return this._options.contents;
      },

      setContents: function (contents) {
         this._options.contents = contents;
      }

      //endregion SBIS3.CONTROLS.Data.Collection.ICollectionItem
   });

   return CollectionItem;
});
