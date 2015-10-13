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

      $constructor: function () {
         this._publish('onSelectedChange');
      },

      //region SBIS3.CONTROLS.Data.Collection.ICollectionItem

      getContents: function () {
         return this._options.contents;
      },

      setContents: function (contents) {
         this._options.contents = contents;
      },

      /**
       * Возвращает признак, что элемент выбран
       * @returns {*}
       */
      isSelected: function () {
         return this._options.selected;
      },

      /**
       * Устанавливает признак, что элемент выбран
       * @param {Boolean} selected Элемент выбран
       */
      setSelected: function (selected) {
         if (this._options.selected === selected) {
            return;
         }
         this._options.selected = selected;
         this._notify('onSelectedChange', selected);
      }

      //endregion SBIS3.CONTROLS.Data.Collection.ICollectionItem
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.CollectionItem', function(config) {
      return new CollectionItem(config);
   });

   return CollectionItem;
});
