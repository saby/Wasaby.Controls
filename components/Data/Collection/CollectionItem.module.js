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
         _options: {

            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.List} Владелец
             */
            owner: undefined
         },
         _hashPrefix: 'collection-item-'
      },

      getOwner: function () {
         return this._options.owner;
      },

      setOwner: function (owner) {
         this._options.owner = owner;
      },

      //region SBIS3.CONTROLS.Data.Collection.ICollectionItem

      getContents: function () {
         return this._options.contents;
      },

      setContents: function (contents) {
         if (this._options.contents === contents) {
            return;
         }
         this._options.contents = contents;
         this._notifyToOwner('contents');
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
         this._notifyToOwner('selected');
      },

      //endregion SBIS3.CONTROLS.Data.Collection.ICollectionItem

      /**
       * Генерирует событие у владельца об изменении элемента
       * @param {String} property Измененное свойство
       * @private
       */
      _notifyToOwner: function(property) {
         if (!this._options.owner) {
            return;
         }
         this._options.owner.notifyItemChange(this, property);
      }
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Collection.CollectionItem', function(config) {
      return new CollectionItem(config);
   });

   return CollectionItem;
});
