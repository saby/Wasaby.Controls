/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionItem', [
   'js!SBIS3.CONTROLS.Data.Projection.ICollectionItem',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin'
], function (ICollectionItem, IHashable, HashableMixin) {
   'use strict';

   /**
    * Элемент коллекции
    * @class SBIS3.CONTROLS.Data.Projection.CollectionItem
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.Projection.ICollectionItem
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */
   var CollectionItem = $ws.core.extend({}, [IHashable, ICollectionItem, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Projection.CollectionItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.CollectionItem',
      $protected: {
         _hashPrefix: 'collection-item-'
      },

      //region SBIS3.CONTROLS.Data.Projection.ICollectionItem

      getOwner: function () {
         return this._options.owner;
      },

      setOwner: function (owner) {
         this._options.owner = owner;
      },

      getContents: function () {
         return this._options.contents;
      },

      setContents: function (contents) {
         if (this._options.contents === contents) {
            return;
         }
         this._options.contents = contents;
         this._notifyItemChangeToOwner('contents');
      },

      isSelected: function () {
         return this._options.selected;
      },

      setSelected: function (selected) {
         if (this._options.selected === selected) {
            return;
         }
         this._options.selected = selected;
         this._notifyItemChangeToOwner('selected');
      },

      //endregion SBIS3.CONTROLS.Data.Projection.ICollectionItem

      /**
       * Возвращает исходную коллекцию проекции
       * @returns {SBIS3.CONTROLS.Data.Collection.IEnumerable}
       * @private
       */
      _getSourceCollection: function() {
         return this.getOwner().getCollection();
      },

      /**
       * Генерирует событие у владельца об изменении свойства элемента
       * @param {String} property Измененное свойство
       * @private
       */
      _notifyItemChangeToOwner: function(property) {
         if (this._options.owner) {
            this._options.owner.notifyItemChange(
               this,
               property
            );
         }
      }
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection.CollectionItem', function(config) {
      return new CollectionItem(config);
   });

   return CollectionItem;
});
