/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.CollectionItem', [
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Di'
], function (IHashable, HashableMixin, Di) {
   'use strict';

   /**
    * Элемент коллекции
    * @class SBIS3.CONTROLS.Data.Projection.CollectionItem
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */
   var CollectionItem = $ws.core.extend({}, [IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Projection.CollectionItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.CollectionItem',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Коллекция, которой принадлежит элемент
             */
            owner: undefined,

            /**
             * @cfg {*} Содержимое элемента коллекции
             */
            contents: undefined,

            /**
             * @cfg {*} Элемент выбран
             */
            selected: false
         },

         _hashPrefix: 'collection-item-'
      },

      //region Public methods

      /**
       * Возвращает коллекцию, которой принадлежит элемент
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getOwner: function () {
         return this._options.owner;
      },

      /**
       * Устанавливает коллекцию, которой принадлежит элемент
       * @param {SBIS3.CONTROLS.Data.Collection.IList} owner Коллекция, которой принадлежит элемент
       */
      setOwner: function (owner) {
         this._options.owner = owner;
      },

      /**
       * Возвращает содержимое элемента коллекции
       * @returns {*}
       */
      getContents: function () {
         return this._options.contents;
      },

      /**
       * Устанавливает содержимое элемента коллекции
       * @param {*} contents Новое содержимое
       */
      setContents: function (contents, silent) {
         if (this._options.contents === contents) {
            return;
         }
         this._options.contents = contents;
         if (!silent) {
            this._notifyItemChangeToOwner('contents');
         }
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
         this._notifyItemChangeToOwner('selected');
      },

      //endregion Public methods

      //region Protected methods

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

      //endregion Protected methods
   });

   Di.register('projection.collection-item', CollectionItem);

   return CollectionItem;
});
